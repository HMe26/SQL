/* ============================================================
   DATABASE MAPPING VIEW (high-level module architecture map)
   ============================================================ */
let mapSvgEl = document.getElementById("mapSvg");
let mapViewportEl = document.getElementById("mapViewport");
const mappingWrap = document.getElementById("mappingWrap");
let mapCardNodes = {};
let mapEdgeList = [];

function computeModuleGraph(){
  // parents[mod] = modules that mod depends on (mod owns an FK pointing there)
  const parents = {}, children = {};
  const edgeCounts = {};
  SCHEMA.modules.forEach(m => { parents[m] = new Set(); children[m] = new Set(); });
  SCHEMA.order.forEach(name => {
    const t = SCHEMA.tables[name];
    t.fks.forEach(fk => {
      const ref = SCHEMA.tables[fk.ref_table];
      if (!ref) return;
      const child = t.module, parent = ref.module;
      if (child === parent) return;
      parents[child].add(parent);
      children[parent].add(child);
      const key = parent + "\u2192" + child;
      edgeCounts[key] = (edgeCounts[key] || 0) + 1;
    });
  });
  const edges = Object.keys(edgeCounts).map(key => {
    const [parent, child] = key.split("\u2192");
    return { parent, child, count: edgeCounts[key] };
  });
  return { parents, children, edges };
}

function computeMapLayout(){
  const graph = computeModuleGraph();
  const layer = {};
  SCHEMA.modules.forEach(m => layer[m] = 0);
  // longest-path layering via bounded relaxation (tolerates cycles — it just
  // won't converge to a perfect DAG order for modules involved in one)
  for (let iter = 0; iter < SCHEMA.modules.length + 2; iter++){
    let changed = false;
    SCHEMA.modules.forEach(m => {
      graph.parents[m].forEach(p => {
        if (layer[m] < layer[p] + 1){ layer[m] = layer[p] + 1; changed = true; }
      });
    });
    if (!changed) break;
  }
  const byLayer = {};
  SCHEMA.modules.forEach(m => { (byLayer[layer[m]] = byLayer[layer[m]] || []).push(m); });
  const layers = Object.keys(byLayer).map(Number).sort((a,b) => a-b);

  const NODE_W = 180, NODE_H = 96, GAP_X = 60, GAP_Y = 100;
  const maxCount = Math.max(1, ...layers.map(l => byLayer[l].length));
  const rowWidth = maxCount * NODE_W + (maxCount - 1) * GAP_X;

  state.mapPositions = {};
  layers.forEach(l => {
    const mods = byLayer[l].slice().sort();
    const w = mods.length * NODE_W + (mods.length - 1) * GAP_X;
    const startX = (rowWidth - w) / 2;
    mods.forEach((m, i) => {
      state.mapPositions[m] = {
        x: startX + i * (NODE_W + GAP_X),
        y: l * (NODE_H + GAP_Y),
        w: NODE_W, h: NODE_H
      };
    });
  });
  return graph;
}

function mapAnchor(mod, side){
  const p = state.mapPositions[mod];
  return side === "bottom" ? { x: p.x + p.w/2, y: p.y + p.h } : { x: p.x + p.w/2, y: p.y };
}
function mapEdgePathData(parent, child){
  const p1 = mapAnchor(parent, "bottom");
  const p2 = mapAnchor(child, "top");
  const dy = Math.max(30, (p2.y - p1.y) * 0.5);
  const d = `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y+dy}, ${p2.x} ${p2.y-dy}, ${p2.x} ${p2.y}`;
  return { d, mid: { x: (p1.x+p2.x)/2, y: (p1.y+p2.y)/2 } };
}
function updateMapEdgePath(e){
  const { d, mid } = mapEdgePathData(e.parent, e.child);
  e.path.setAttribute("d", d);
  e.flow.setAttribute("d", d);
  e.glow.setAttribute("d", d);
  const label = e.labelText.textContent;
  const w = label.length * 6.2 + 12;
  e.labelBg.setAttribute("x", mid.x - w/2);
  e.labelBg.setAttribute("y", mid.y - 9);
  e.labelBg.setAttribute("width", w);
  e.labelBg.setAttribute("height", 16);
  e.labelText.setAttribute("x", mid.x);
  e.labelText.setAttribute("y", mid.y + 4);
}
function updateAllMapEdgePaths(){ mapEdgeList.forEach(updateMapEdgePath); }

function renderMapView(opts){
  opts = opts || {};
  let graph;
  if (opts.keepLayout && state.mapGraph && Object.keys(state.mapPositions).length){
    graph = state.mapGraph;
  } else {
    graph = computeMapLayout();
    state.mapGraph = graph;
  }

  mapSvgEl.innerHTML = "";
  mapCardNodes = {}; mapEdgeList = [];

  const defs = el("defs", {}, mapSvgEl);
  const filter = el("filter", { id: "mapGlow", x: "-60%", y: "-60%", width: "220%", height: "220%" }, defs);
  el("feGaussianBlur", { stdDeviation: 3, result: "blur" }, filter);
  const marker = el("marker", { id: "mapArrow", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, defs);
  el("path", { d: "M0 0 L10 5 L0 10 Z", fill: "currentColor" }, marker);

  const layerEdges = el("g", {}, mapSvgEl);
  const layerNodes = el("g", {}, mapSvgEl);

  graph.edges.forEach(edgeData => {
    const color = modColor(edgeData.parent);
    const glow  = el("path", { class: "map-edge-glow", stroke: color, filter: "url(#mapGlow)" }, layerEdges);
    const path  = el("path", { class: "map-edge", stroke: color, "marker-end": "url(#mapArrow)", style: `color:${color}` }, layerEdges);
    const flow  = el("path", { class: "map-edge-flow", stroke: color }, layerEdges);
    const labelBg = el("rect", { class: "map-edge-label-bg", rx: 5 }, layerEdges);
    const labelText = el("text", { class: "map-edge-label", fill: color, "text-anchor": "middle" }, layerEdges);
    labelText.textContent = edgeData.count + (edgeData.count === 1 ? " FK" : " FKs");
    const e = { parent: edgeData.parent, child: edgeData.child, count: edgeData.count, glow, path, flow, labelBg, labelText };
    mapEdgeList.push(e);
    [path, flow].forEach(p => {
      p.addEventListener("mouseenter", () => highlightMapEdges(null, false, e));
      p.addEventListener("mouseleave", () => clearMapEdgeHighlight());
    });
  });

  SCHEMA.modules.forEach(mod => {
    const p = state.mapPositions[mod];
    const fo = el("foreignObject", { x: p.x, y: p.y, width: p.w, height: p.h }, layerNodes);
    const wrapper = document.createElement("div");
    wrapper.style.width = "100%"; wrapper.style.height = "100%";
    const tableCount = SCHEMA.order.filter(n => SCHEMA.tables[n].module === mod).length;
    wrapper.innerHTML = `<div class="map-node" style="--mod-color:${modColor(mod)};--mod-color-soft:${modColorSoft(mod)}">
      <div class="mn-icon">${svgIcon("layers", 17)}</div>
      <div class="mn-name">${mod}</div>
      <div class="mn-sub">${tableCount} table${tableCount === 1 ? "" : "s"}</div>
    </div>`;
    fo.appendChild(wrapper);
    mapCardNodes[mod] = { fo };
    attachMapNodeEvents(mod, fo);
  });

  const bounds = mapContentBounds();
  mapSvgEl.setAttribute("width", bounds.w);
  mapSvgEl.setAttribute("height", bounds.h);

  updateAllMapEdgePaths();
  renderMapMinimap();
}

function highlightMapEdges(mod, on, singleEdge){
  if (singleEdge){
    singleEdge.path.classList.add("hover-active");
    singleEdge.flow.classList.add("hover-active");
    singleEdge.glow.classList.add("hover-active");
    return;
  }
  mapEdgeList.forEach(e => {
    const relevant = e.parent === mod || e.child === mod;
    e.path.classList.toggle("hover-active", relevant && on);
    e.flow.classList.toggle("hover-active", relevant && on);
    e.glow.classList.toggle("hover-active", relevant && on);
  });
}
function clearMapEdgeHighlight(){
  mapEdgeList.forEach(e => {
    e.path.classList.remove("hover-active");
    e.flow.classList.remove("hover-active");
    e.glow.classList.remove("hover-active");
  });
}

function attachMapNodeEvents(mod, fo){
  let dragState = null;
  const cardEl = () => fo.querySelector(".map-node");
  fo.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const p = state.mapPositions[mod];
    dragState = { startX: e.clientX, startY: e.clientY, origX: p.x, origY: p.y, moved: false };
    cardEl() && cardEl().classList.add("dragging");
    const onMove = (ev) => {
      const dx = (ev.clientX - dragState.startX) / state.mapZoom;
      const dy = (ev.clientY - dragState.startY) / state.mapZoom;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragState.moved = true;
      p.x = dragState.origX + dx; p.y = dragState.origY + dy;
      fo.setAttribute("x", p.x); fo.setAttribute("y", p.y);
      updateAllMapEdgePaths();
    };
    const onUp = () => {
      cardEl() && cardEl().classList.remove("dragging");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      renderMapMinimap();
      if (!dragState.moved){ switchView("erd"); navigateToModule(mod); }
      dragState = null;
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });
  fo.addEventListener("mouseenter", () => highlightMapEdges(mod, true));
  fo.addEventListener("mouseleave", () => highlightMapEdges(mod, false));
}

/* ---- mapping pan / zoom ---- */
function applyMapTransform(){
  mapViewportEl.style.transform = `translate(${state.mapPanX}px, ${state.mapPanY}px) scale(${state.mapZoom})`;
  document.getElementById("mapZoomLevel").textContent = Math.round(state.mapZoom * 100) + "%";
  const mapMmBadge = document.getElementById("mapMinimapZoomBadge");
  if (mapMmBadge) mapMmBadge.textContent = Math.round(state.mapZoom * 100) + "%";
  renderMapMinimapViewport();
}
let mapIsPanning = false, mapPanStart = null;
mappingWrap.addEventListener("mousedown", (e) => {
  if (e.target.closest(".map-node")) return;
  mapIsPanning = true;
  mappingWrap.classList.add("panning");
  mapPanStart = { x: e.clientX - state.mapPanX, y: e.clientY - state.mapPanY };
});
window.addEventListener("mousemove", (e) => {
  if (!mapIsPanning) return;
  state.mapPanX = e.clientX - mapPanStart.x;
  state.mapPanY = e.clientY - mapPanStart.y;
  applyMapTransform();
});
window.addEventListener("mouseup", () => { mapIsPanning = false; mappingWrap.classList.remove("panning"); });
mappingWrap.addEventListener("wheel", (e) => {
  e.preventDefault();
  const rect = mappingWrap.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  const worldX = (mx - state.mapPanX) / state.mapZoom;
  const worldY = (my - state.mapPanY) / state.mapZoom;
  const delta = -e.deltaY * 0.0016;
  const newZoom = Math.min(2.4, Math.max(0.25, state.mapZoom * (1 + delta)));
  state.mapPanX = mx - worldX * newZoom;
  state.mapPanY = my - worldY * newZoom;
  state.mapZoom = newZoom;
  applyMapTransform();
}, { passive: false });

let mapTouchState = null;
let lastMapTapTime = 0, lastMapTapPos = null;
mappingWrap.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1){
    const touch = e.touches[0];
    mapTouchState = { mode: "pan", x: touch.clientX - state.mapPanX, y: touch.clientY - state.mapPanY };

    // double-tap: zoom in/out centered on the tap point
    const now = Date.now();
    if (lastMapTapPos && now - lastMapTapTime < 320 && Math.hypot(touch.clientX - lastMapTapPos.x, touch.clientY - lastMapTapPos.y) < 34){
      const rect = mappingWrap.getBoundingClientRect();
      const mx = touch.clientX - rect.left, my = touch.clientY - rect.top;
      const worldX = (mx - state.mapPanX) / state.mapZoom, worldY = (my - state.mapPanY) / state.mapZoom;
      const newZoom = state.mapZoom < 1.05 ? Math.min(2.4, state.mapZoom * 1.9) : 0.6;
      state.mapPanX = mx - worldX * newZoom;
      state.mapPanY = my - worldY * newZoom;
      state.mapZoom = newZoom;
      applyMapTransform();
      lastMapTapTime = 0; lastMapTapPos = null;
    } else {
      lastMapTapTime = now; lastMapTapPos = { x: touch.clientX, y: touch.clientY };
    }
  } else if (e.touches.length === 2){
    const [a,b] = e.touches;
    const dist = Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY);
    mapTouchState = { mode: "pinch", dist, zoom: state.mapZoom };
  }
}, { passive: true });
mappingWrap.addEventListener("touchmove", (e) => {
  if (!mapTouchState) return;
  if (mapTouchState.mode === "pan" && e.touches.length === 1){
    state.mapPanX = e.touches[0].clientX - mapTouchState.x;
    state.mapPanY = e.touches[0].clientY - mapTouchState.y;
    applyMapTransform();
  } else if (mapTouchState.mode === "pinch" && e.touches.length === 2){
    const [a,b] = e.touches;
    const dist = Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY);
    state.mapZoom = Math.min(2.4, Math.max(0.25, mapTouchState.zoom * (dist / mapTouchState.dist)));
    applyMapTransform();
  }
}, { passive: true });
mappingWrap.addEventListener("touchend", () => { mapTouchState = null; });

document.getElementById("mapZoomIn").onclick = () => { state.mapZoom = Math.min(2.4, state.mapZoom * 1.2); applyMapTransform(); };
document.getElementById("mapZoomOut").onclick = () => { state.mapZoom = Math.max(0.25, state.mapZoom / 1.2); applyMapTransform(); };

function mapContentBounds(){
  let maxX = 0, maxY = 0;
  Object.values(state.mapPositions).forEach(b => { maxX = Math.max(maxX, b.x + b.w); maxY = Math.max(maxY, b.y + b.h); });
  return { w: maxX + 100, h: maxY + 100 };
}
function fitMapView(){
  const bounds = mapContentBounds();
  const rect = mappingWrap.getBoundingClientRect();
  const zx = rect.width / bounds.w, zy = rect.height / bounds.h;
  state.mapZoom = Math.min(1.1, Math.min(zx, zy) * 0.9);
  state.mapPanX = (rect.width - bounds.w * state.mapZoom) / 2;
  state.mapPanY = 50;
  applyMapTransform();
}

/* ---- mapping minimap ---- */
function renderMapMinimap(){
  const svg = document.getElementById("mapMinimapSvg");
  svg.innerHTML = "";
  const bounds = mapContentBounds();
  const pad = 6, vw = 220, vh = 150;
  const scale = Math.min((vw - pad*2) / bounds.w, (vh - pad*2) / bounds.h);
  const g = el("g", { transform: `translate(${pad},${pad}) scale(${scale})` }, svg);
  SCHEMA.modules.forEach(mod => {
    const p = state.mapPositions[mod];
    if (!p) return;
    el("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: 8, class: "mm-node", fill: modColor(mod) }, g);
  });
  el("rect", { id: "mapMmViewport", class: "mm-viewport", rx: 3 }, g);
  svg.dataset.scale = scale; svg.dataset.pad = pad;
  renderMapMinimapViewport();
  svg.onclick = (e) => {
    const rect = svg.getBoundingClientRect();
    const mx = (e.clientX - rect.left - pad) / scale;
    const my = (e.clientY - rect.top - pad) / scale;
    const wrapRect = mappingWrap.getBoundingClientRect();
    state.mapPanX = wrapRect.width/2 - mx * state.mapZoom;
    state.mapPanY = wrapRect.height/2 - my * state.mapZoom;
    applyMapTransform();
  };
}
function renderMapMinimapViewport(){
  const svg = document.getElementById("mapMinimapSvg");
  const vp = svg.querySelector("#mapMmViewport");
  if (!vp) return;
  const scale = parseFloat(svg.dataset.scale || "1");
  const wrapRect = mappingWrap.getBoundingClientRect();
  const worldX = -state.mapPanX / state.mapZoom, worldY = -state.mapPanY / state.mapZoom;
  const worldW = wrapRect.width / state.mapZoom, worldH = wrapRect.height / state.mapZoom;
  vp.setAttribute("x", worldX); vp.setAttribute("y", worldY);
  vp.setAttribute("width", worldW); vp.setAttribute("height", worldH);
  vp.setAttribute("stroke-width", 2/scale);
}

/* ---- view switching (ERD <-> Mapping) ---- */
function switchView(view){
  if (state.view === view) return;
  state.view = view;
  document.getElementById("canvasWrap").style.display = view === "erd" ? "" : "none";
  mappingWrap.style.display = view === "mapping" ? "" : "none";
  document.getElementById("tabViewErd").classList.toggle("active", view === "erd");
  document.getElementById("tabViewMapping").classList.toggle("active", view === "mapping");
  document.querySelector(".search-wrap").style.visibility = view === "erd" ? "" : "hidden";
  document.getElementById("btnFocusMode").style.visibility = view === "erd" ? "" : "hidden";

  if (view === "mapping"){
    if (!state.mapInitialized){
      state.mapInitialized = true;
      renderMapView();
      requestAnimationFrame(fitMapView);
    } else {
      applyMapTransform();
    }
  } else {
    applyTransform();
  }
  renderBreadcrumbs();
}
document.getElementById("tabViewErd").onclick = () => switchView("erd");
document.getElementById("tabViewMapping").onclick = () => switchView("mapping");

