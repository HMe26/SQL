/* ============================================================
   DEPENDENCY GRAPH VIEW
   Focused ancestor/descendant chain for a single table:
   left = tables it depends on (outgoing FKs, recursively),
   center = the selected table,
   right = tables that depend on it (incoming FKs, recursively).
   ============================================================ */
const depsWrap = document.getElementById("depsWrap");
const depsViewportEl = document.getElementById("depsViewport");
const depsSvgEl = document.getElementById("depsSvg");
let depsNodePositions = {};
let depsGraphCache = null;

/* ---- graph traversal ---- */
function computeDependencyGraph(root, maxDepth){
  maxDepth = maxDepth || state.depsMaxDepth || 3;
  const nodeLevel = { [root]: 0 };
  const nodes = new Set([root]);
  const rawEdges = [];

  // ancestors: outgoing FKs from root, walking further back each hop (levels < 0)
  let frontier = [root];
  for (let d = 1; d <= maxDepth && frontier.length; d++){
    const next = [];
    frontier.forEach(n => {
      SCHEMA.tables[n].fks.forEach(fk => {
        const target = fk.ref_table;
        if (!SCHEMA.tables[target]) return;
        rawEdges.push({ from: n, to: target, fromCol: fk.column, toCol: fk.ref_column, onDelete: fk.on_delete, onUpdate: fk.on_update, type: relType(n, fk) });
        if (!(target in nodeLevel)){
          nodeLevel[target] = -d;
          nodes.add(target);
          next.push(target);
        }
      });
    });
    frontier = next;
  }

  // descendants: tables that reference root (incoming FKs), walking further out (levels > 0)
  frontier = [root];
  for (let d = 1; d <= maxDepth && frontier.length; d++){
    const next = [];
    frontier.forEach(n => {
      incomingRefs[n].forEach(r => {
        const source = r.from;
        const fk = SCHEMA.tables[source].fks.find(f => f.column === r.col && f.ref_table === n);
        rawEdges.push({ from: source, to: n, fromCol: r.col, toCol: r.refCol, onDelete: fk ? fk.on_delete : "—", onUpdate: fk ? fk.on_update : "—", type: fk ? relType(source, fk) : "N:1" });
        if (!(source in nodeLevel)){
          nodeLevel[source] = d;
          nodes.add(source);
          next.push(source);
        }
      });
    });
    frontier = next;
  }

  // keep only edges fully inside the explored neighborhood, de-duplicated
  const seen = new Set();
  const edges = rawEdges.filter(e => {
    if (!(e.from in nodeLevel) || !(e.to in nodeLevel)) return false;
    const key = `${e.from}\u2192${e.to}\u2192${e.fromCol}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { root, nodeLevel, nodes: Array.from(nodes), edges, truncated: maxDepth < 99 };
}

/* ---- layout: one column per level, stacked vertically & centered ---- */
const DEPS_NODE_W = 208, DEPS_NODE_H = 78, DEPS_GAP_X = 110, DEPS_GAP_Y = 30;
function computeDepsLayout(graph){
  const byLevel = {};
  graph.nodes.forEach(n => (byLevel[graph.nodeLevel[n]] = byLevel[graph.nodeLevel[n]] || []).push(n));
  const levels = Object.keys(byLevel).map(Number).sort((a,b) => a - b);
  const maxCount = Math.max(1, ...levels.map(l => byLevel[l].length));
  const colHeight = maxCount * DEPS_NODE_H + (maxCount - 1) * DEPS_GAP_Y;

  const positions = {};
  levels.forEach(l => {
    const arr = byLevel[l].slice().sort((a,b) => a.localeCompare(b));
    const h = arr.length * DEPS_NODE_H + (arr.length - 1) * DEPS_GAP_Y;
    const startY = (colHeight - h) / 2;
    arr.forEach((n, i) => {
      positions[n] = { x: l * (DEPS_NODE_W + DEPS_GAP_X), y: startY + i * (DEPS_NODE_H + DEPS_GAP_Y), w: DEPS_NODE_W, h: DEPS_NODE_H, level: l };
    });
  });
  const minX = Math.min(...Object.values(positions).map(p => p.x));
  Object.values(positions).forEach(p => p.x -= minX);
  return positions;
}

function depsRoleLabel(level){
  if (level === 0) return "Root";
  if (level < 0) return `Depends on \u00b7 ${-level} hop${-level === 1 ? "" : "s"} away`;
  return `References root \u00b7 ${level} hop${level === 1 ? "" : "s"} away`;
}

function depsAnchor(name, side){
  const p = depsNodePositions[name];
  return side === "right" ? { x: p.x + p.w, y: p.y + p.h/2 } : { x: p.x, y: p.y + p.h/2 };
}
function depsEdgePathData(fromName, toName){
  const goingRight = depsNodePositions[toName].x >= depsNodePositions[fromName].x;
  const p1 = depsAnchor(fromName, goingRight ? "right" : "left");
  const p2 = depsAnchor(toName, goingRight ? "left" : "right");
  const dx = Math.max(40, Math.abs(p2.x - p1.x) * 0.5) * (goingRight ? 1 : -1);
  return `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
}

function setDepsRoot(name, opts){
  opts = opts || {};
  if (!SCHEMA.tables[name]) return;
  state.depsRoot = name;
  document.getElementById("depsEmpty").style.display = "none";
  document.getElementById("depsHeader").style.display = "";
  document.getElementById("depsHeaderTable").textContent = name;
  document.getElementById("depsHeaderTable").style.color = modColor(SCHEMA.tables[name].module);
  renderDepsView();
  if (!opts.keepView) requestAnimationFrame(fitDepsView);
}

function renderDepsView(){
  if (!state.depsRoot) return;
  const graph = computeDependencyGraph(state.depsRoot);
  depsGraphCache = graph;
  depsNodePositions = computeDepsLayout(graph);

  depsSvgEl.innerHTML = "";
  const defs = el("defs", {}, depsSvgEl);
  const glowFilter = el("filter", { id: "depsGlow", x: "-60%", y: "-60%", width: "220%", height: "220%" }, defs);
  el("feGaussianBlur", { stdDeviation: 3, result: "blur" }, glowFilter);

  const edgeLayer = el("g", {}, depsSvgEl);
  const nodeLayer = el("g", {}, depsSvgEl);

  graph.edges.forEach(e => {
    const color = relColor(e.type);
    const d = depsEdgePathData(e.from, e.to);
    el("path", { class: "deps-edge-glow", d, stroke: color, filter: "url(#depsGlow)" }, edgeLayer);
    const path = el("path", { class: "deps-edge", d, stroke: color, "marker-end": "url(#depsArrow)", style: `color:${color}` }, edgeLayer);
    path.addEventListener("mouseenter", () => showEdgeTooltip2(e));
    path.addEventListener("mousemove", moveTooltip);
    path.addEventListener("mouseleave", hideEdgeTooltip);
  });
  const marker = el("marker", { id: "depsArrow", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 6.5, markerHeight: 6.5, orient: "auto-start-reverse" }, defs);
  el("path", { d: "M0 0 L10 5 L0 10 Z", fill: "currentColor" }, marker);

  graph.nodes.forEach(name => {
    const p = depsNodePositions[name];
    const t = SCHEMA.tables[name];
    const level = graph.nodeLevel[name];
    const isRoot = name === state.depsRoot;
    const fo = el("foreignObject", { x: p.x, y: p.y, width: p.w, height: p.h }, nodeLayer);
    const wrapper = document.createElement("div");
    wrapper.style.width = "100%"; wrapper.style.height = "100%";
    wrapper.innerHTML = `<div class="deps-node${isRoot ? " root" : ""}" style="--mod-color:${modColor(t.module)};--mod-color-soft:${modColorSoft(t.module)}">
      <div class="dn-top">
        <span class="dn-dot"></span>
        <span class="dn-name">${name}</span>
      </div>
      <div class="dn-role">${depsRoleLabel(level)}</div>
      <div class="dn-mod">${t.module}</div>
    </div>`;
    fo.appendChild(wrapper);
    const nodeEl = wrapper.querySelector(".deps-node");
    nodeEl.addEventListener("click", () => { if (!isRoot) setDepsRoot(name); else { switchView("erd"); openDetails(name); centerOnTable(name); } });
    nodeEl.title = isRoot ? "Currently focused table — click a neighbor to re-center" : "Click to re-center the graph on this table";
  });

  const bounds = depsContentBounds();
  depsSvgEl.setAttribute("width", bounds.w);
  depsSvgEl.setAttribute("height", bounds.h);
}

function showEdgeTooltip2(e){
  tooltipEl.innerHTML = `
    <div class="rt-title">${e.from} \u2192 ${e.to}</div>
    <div><b>FK column:</b> ${e.fromCol}</div>
    <div><b>References:</b> ${e.to}.${e.toCol}</div>
    <div><b>Delete rule:</b> ${e.onDelete}</div>
    <div><b>Update rule:</b> ${e.onUpdate}</div>
    <div><b>Multiplicity:</b> ${e.type}</div>`;
  tooltipEl.classList.add("show");
}

function depsContentBounds(){
  let maxX = 0, maxY = 0;
  Object.values(depsNodePositions).forEach(p => { maxX = Math.max(maxX, p.x + p.w); maxY = Math.max(maxY, p.y + p.h); });
  return { w: maxX + 80, h: maxY + 60 };
}

/* ---- pan / zoom (mirrors the ERD/mapping canvases) ---- */
function applyDepsTransform(){
  depsViewportEl.style.transform = `translate(${state.depsPanX}px, ${state.depsPanY}px) scale(${state.depsZoom})`;
  document.getElementById("depsZoomLevel").textContent = Math.round(state.depsZoom * 100) + "%";
}
function fitDepsView(){
  const bounds = depsContentBounds();
  const rect = depsWrap.getBoundingClientRect();
  if (!bounds.w || !rect.width) return;
  const zx = rect.width / bounds.w, zy = rect.height / bounds.h;
  state.depsZoom = Math.min(1.1, Math.min(zx, zy) * 0.9);
  state.depsPanX = (rect.width - bounds.w * state.depsZoom) / 2;
  state.depsPanY = (rect.height - bounds.h * state.depsZoom) / 2;
  applyDepsTransform();
}
let depsIsPanning = false, depsPanStart = null;
depsWrap.addEventListener("mousedown", (e) => {
  if (e.target.closest(".deps-node")) return;
  depsIsPanning = true;
  depsWrap.classList.add("panning");
  depsPanStart = { x: e.clientX - state.depsPanX, y: e.clientY - state.depsPanY };
});
window.addEventListener("mousemove", (e) => {
  if (!depsIsPanning) return;
  state.depsPanX = e.clientX - depsPanStart.x;
  state.depsPanY = e.clientY - depsPanStart.y;
  applyDepsTransform();
});
window.addEventListener("mouseup", () => { depsIsPanning = false; depsWrap.classList.remove("panning"); });
depsWrap.addEventListener("wheel", (e) => {
  if (depsWrap.style.display === "none") return;
  e.preventDefault();
  const rect = depsWrap.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  const worldX = (mx - state.depsPanX) / state.depsZoom, worldY = (my - state.depsPanY) / state.depsZoom;
  const delta = -e.deltaY * 0.0016;
  const newZoom = Math.min(2.4, Math.max(0.25, state.depsZoom * (1 + delta)));
  state.depsPanX = mx - worldX * newZoom;
  state.depsPanY = my - worldY * newZoom;
  state.depsZoom = newZoom;
  applyDepsTransform();
}, { passive: false });
document.getElementById("depsZoomIn").onclick = () => { state.depsZoom = Math.min(2.4, state.depsZoom * 1.2); applyDepsTransform(); };
document.getElementById("depsZoomOut").onclick = () => { state.depsZoom = Math.max(0.25, state.depsZoom / 1.2); applyDepsTransform(); };

/* ---- root picker (shown when no table is focused yet) ---- */
function renderDepsPicker(query){
  const q = (query || "").trim().toLowerCase();
  const results = document.getElementById("depsPickerResults");
  if (!q){ results.innerHTML = ""; return; }
  const matches = SCHEMA.order.filter(n => n.toLowerCase().includes(q)).slice(0, 12);
  if (!matches.length){ results.innerHTML = `<div class="deps-picker-empty">No tables match "${q}"</div>`; return; }
  results.innerHTML = matches.map(n => `<div class="deps-picker-item" data-table="${n}"><span class="dot" style="background:${modColor(SCHEMA.tables[n].module)}"></span>${n}</div>`).join("");
  results.querySelectorAll(".deps-picker-item").forEach(item => {
    item.onclick = () => { setDepsRoot(item.dataset.table); document.getElementById("depsPickerInput").value = ""; results.innerHTML = ""; };
  });
}
document.getElementById("depsPickerInput").addEventListener("input", (e) => renderDepsPicker(e.target.value));
document.getElementById("depsOpenErd").onclick = () => { if (state.depsRoot){ switchView("erd"); openDetails(state.depsRoot); centerOnTable(state.depsRoot); } };
document.getElementById("depsChangeRoot").onclick = () => {
  state.depsRoot = null;
  document.getElementById("depsHeader").style.display = "none";
  document.getElementById("depsEmpty").style.display = "";
  document.getElementById("depsPickerInput").value = "";
  document.getElementById("depsPickerInput").focus();
};

/* ---- entry point used by details panel / context menu ---- */
function openDependencyGraph(name){
  switchView("deps");
  setDepsRoot(name);
}
