/* ============================================================
   RENDER: cards / groups / edges
   ============================================================ */
const svgNS = "http://www.w3.org/2000/svg";
let svgEl, viewportEl;

function el(tag, attrs, parent){
  const e = document.createElementNS(svgNS, tag);
  if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}

function buildCardHTML(name){
  const t = SCHEMA.tables[name];
  const mod = t.module;
  const isExpanded = !!state.expanded[name];
  const visCols = isExpanded ? t.columns : t.columns.slice(0, MAX_VISIBLE_COLS);
  const hiddenCount = t.columns.length - Math.min(t.columns.length, MAX_VISIBLE_COLS);

  const rowsHtml = visCols.map(c => {
    const isPk = t.pk.includes(c.name);
    const fk = t.fks.find(f => f.column === c.name);
    let icoHtml, cls = "tc-col";
    if (isPk){ icoHtml = `<span class="ico" style="color:var(--pk-color)">${svgIcon("key",11)}</span>`; cls += " is-pk"; }
    else if (fk){ icoHtml = `<span class="ico" style="color:var(--fk-color)">${svgIcon("link",11)}</span>`; cls += " is-fk"; }
    else { icoHtml = `<span class="ico" style="color:var(--text-2)">${svgIcon("circle-dashed",10)}</span>`; }
    if (c.nullable && !isPk) cls += " nullable";
    return `<div class="${cls}">${icoHtml}<span class="cname">${c.name}</span><span class="ctype">${c.type}</span>${c.nullable && !isPk ? '<span class="badge-null">NULL</span>' : ''}</div>`;
  }).join("");

  return `
    <div class="table-card" data-table="${name}" tabindex="0" role="button" aria-label="Table ${name}, ${t.columns.length} columns, module ${mod}" style="--mod-color: ${modColor(mod)}; --mod-color-soft: ${modColorSoft(mod)};">
      <div class="tc-head">
        <div class="tc-icon">${svgIcon(t.icon, 14)}</div>
        <div class="tc-titles">
          <div class="tc-name">${name}</div>
          <div class="tc-module">${mod}</div>
        </div>
        <div class="tc-colcount">${t.columns.length}</div>
      </div>
      ${t.description ? `<div class="tc-desc">${t.description}</div>` : ""}
      <div class="tc-cols">
        ${rowsHtml}
        ${hiddenCount > 0 ? `<div class="tc-more tc-toggle" data-toggle="${name}" role="button" tabindex="0" aria-expanded="${isExpanded}">${isExpanded ? `${svgIcon("chevron-up",10)} Show less` : `${svgIcon("chevron-down",10)} + ${hiddenCount} more column${hiddenCount>1?"s":""}`}</div>` : ""}
      </div>
      <div class="tc-foot">
        <span>${svgIcon("key",10)} <b>${t.pk.length}</b> PK</span>
        <span>${svgIcon("link",10)} <b>${t.fks.length}</b> FK</span>
        <span>${svgIcon("list",10)} <b>${t.indexes.length}</b> idx</span>
        ${t.rowEstimate != null ? `<span class="tc-rows" title="Estimated row count (from schema data)">${svgIcon("bar-chart-2",10)} <b>${formatRowEstimate(t.rowEstimate)}</b></span>` : ""}
      </div>
    </div>`;
}

let cardNodes = {}; // name -> {g, fo, cardEl}
let groupNodes = {}; // module -> {rect, label}
let edgeNodes = []; // {pathBg, pathFg, flow, labelBg, labelText, data}

function renderAll(){
  svgEl.innerHTML = "";
  cardNodes = {}; groupNodes = {}; edgeNodes = [];

  // defs: blur filter used for the relationship-hover glow underlay
  const defs = el("defs", {}, svgEl);
  const filter = el("filter", { id: "edgeGlow", x: "-60%", y: "-60%", width: "220%", height: "220%" }, defs);
  el("feGaussianBlur", { stdDeviation: 3.2, result: "blur" }, filter);

  const layerGroups = el("g", { class: "layer-groups" }, svgEl);
  const layerEdges  = el("g", { class: "layer-edges" }, svgEl);
  const layerCards  = el("g", { class: "layer-cards" }, svgEl);

  // ---- group boxes ----
  SCHEMA.modules.forEach(mod => {
    const b = state.groupBoxes[mod];
    const g = el("g", { class: "group-node", "data-module": mod }, layerGroups);
    const rect = el("rect", {
      x: b.x, y: b.y, width: b.w, height: b.h, rx: 20,
      class: "group-box"
    }, g);
    if (isLightTheme()){
      rect.style.setProperty("--group-fill", `hsla(${hue(mod)},70%,50%,0.06)`);
      rect.style.setProperty("--group-stroke", `hsla(${hue(mod)},60%,42%,0.35)`);
    } else {
      rect.style.setProperty("--group-fill", `hsla(${hue(mod)},85%,60%,0.05)`);
      rect.style.setProperty("--group-stroke", `hsla(${hue(mod)},85%,65%,0.4)`);
    }
    const count = SCHEMA.order.filter(n => SCHEMA.tables[n].module === mod).length;
    const label = el("text", { x: b.x + 22, y: b.y + 24, class: "group-label" }, g);
    label.style.setProperty("--group-stroke", isLightTheme() ? `hsl(${hue(mod)},65%,38%)` : `hsl(${hue(mod)},90%,72%)`);
    label.textContent = mod;
    const cnt = el("text", { x: b.x + b.w - 18, y: b.y + 24, class: "group-count", "text-anchor":"end" }, g);
    cnt.textContent = count + " tables";
    groupNodes[mod] = { g, rect, label, cnt };
    attachGroupDragEvents(mod, g);
  });

  // ---- cards (foreignObject) ----
  SCHEMA.order.forEach(name => {
    const p = state.positions[name];
    const g = el("g", { class: "table-node", "data-table": name, transform: `translate(${p.x},${p.y})` }, layerCards);
    const fo = el("foreignObject", { x: 0, y: 0, width: p.w, height: p.h }, g);
    fo.innerHTML = buildCardHTML(name);
    cardNodes[name] = { g, fo };
    attachCardEvents(name, g);
  });

  // ---- edges ----
  SCHEMA.order.forEach(name => {
    const t = SCHEMA.tables[name];
    t.fks.forEach(fk => {
      if (!SCHEMA.tables[fk.ref_table]) return;
      const type = relType(name, fk);
      const color = relColor(type);
      const glow    = el("path", { class: "rel-glow", stroke: color, filter: "url(#edgeGlow)" }, layerEdges);
      const pathBg = el("path", { class: "rel-path", stroke: color }, layerEdges);
      const flow   = el("path", { class: "rel-path rel-flow", stroke: color }, layerEdges);
      const labelBg = el("rect", { class: "rel-label-bg", rx: 5 }, layerEdges);
      const labelText = el("text", { class: "rel-mult", fill: color }, layerEdges);
      labelText.textContent = type;

      const data = { from: name, to: fk.ref_table, fromCol: fk.column, toCol: fk.ref_column,
                     onDelete: fk.on_delete, onUpdate: fk.on_update, type, color };
      const idx = edgeNodes.length;
      edgeNodes.push({ pathBg, flow, glow, labelBg, labelText, data });

      [pathBg, flow].forEach(p => {
        p.addEventListener("mouseenter", () => showEdgeTooltip(idx));
        p.addEventListener("mousemove", (e) => moveTooltip(e));
        p.addEventListener("mouseleave", hideEdgeTooltip);
      });

      state.edgesByTable[name] = state.edgesByTable[name] || [];
      state.edgesByTable[name].push(idx);
      state.edgesByTable[fk.ref_table] = state.edgesByTable[fk.ref_table] || [];
      state.edgesByTable[fk.ref_table].push(idx);
    });
  });

  updateAllEdgePaths();
  applyFilters();
  updateStatsUI();
  renderMinimap();
  if (state.focusMode && state.selected) applyFocusMode();
}

// ---- accordion: expand/collapse a card's full column list ----
function toggleCardExpand(name){
  state.expanded[name] = !state.expanded[name];
  computeLayout();   // card height changed -> re-flow all cards so nothing overlaps
  renderAll();        // rebuild svg (pan/zoom + expanded state are preserved via `state`)
  updateExpandAllButton();
}

// ---- accordion: expand/collapse EVERY card at once ----
function tablesWithHiddenColumns(){
  return SCHEMA.order.filter(n => SCHEMA.tables[n].columns.length > MAX_VISIBLE_COLS);
}
function allCardsExpanded(){
  const list = tablesWithHiddenColumns();
  return list.length > 0 && list.every(n => state.expanded[n]);
}
function toggleExpandAll(){
  const list = tablesWithHiddenColumns();
  if (!list.length){ toast("No table has extra columns to expand"); return; }
  const expand = !allCardsExpanded();
  list.forEach(n => { state.expanded[n] = expand; });
  computeLayout();
  renderAll();
  updateExpandAllButton();
  toast(expand ? `Expanded all columns (${list.length} tables)` : "Collapsed all columns");
}
function updateExpandAllButton(){
  const btn = document.getElementById("btnExpandAll");
  if (!btn) return;
  const expanded = allCardsExpanded();
  btn.setAttribute("aria-pressed", String(expanded));
  btn.classList.toggle("active", expanded);
  const label = document.getElementById("btnExpandAllLabel");
  if (label) label.textContent = expanded ? "Collapse All" : "Expand All";
}

function anchorPoint(name, side){
  const p = state.positions[name];
  if (side === "right") return { x: p.x + p.w, y: p.y + p.h / 2 };
  if (side === "left")  return { x: p.x, y: p.y + p.h / 2 };
  return { x: p.x + p.w/2, y: p.y };
}

function edgePathData(fromName, toName){
  const a = state.positions[fromName], b = state.positions[toName];
  const aCenterX = a.x + a.w/2, bCenterX = b.x + b.w/2;
  const verticalAligned = Math.abs(aCenterX - bCenterX) < Math.max(a.w, b.w) * 0.7 && Math.abs((a.y) - (b.y)) > 40;
  let p1, p2;
  if (verticalAligned){
    const fromBottom = a.y < b.y;
    p1 = { x: aCenterX, y: fromBottom ? a.y + a.h : a.y };
    p2 = { x: bCenterX, y: fromBottom ? b.y : b.y + b.h };
  } else {
    const fromRight = aCenterX < bCenterX;
    p1 = fromRight ? anchorPoint(fromName, "right") : anchorPoint(fromName, "left");
    p2 = fromRight ? anchorPoint(toName, "left") : anchorPoint(toName, "right");
  }
  const mid = { x: (p1.x+p2.x)/2, y: (p1.y+p2.y)/2 };
  const mode = state.edgeRouting || "curved";

  if (mode === "straight"){
    return { d: `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`, mid };
  }
  if (mode === "orthogonal"){
    const r = 10; // corner radius for a slightly softer right-angle bend
    let d;
    if (verticalAligned){
      const midY = mid.y;
      const dxSign = p2.x > p1.x ? 1 : (p2.x < p1.x ? -1 : 0);
      const dySign1 = midY > p1.y ? 1 : -1, dySign2 = p2.y > midY ? 1 : -1;
      if (Math.abs(p2.x - p1.x) < 0.5 || r <= 0){
        d = `M ${p1.x} ${p1.y} L ${p1.x} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.y}`;
      } else {
        d = `M ${p1.x} ${p1.y} L ${p1.x} ${midY - r*dySign1} Q ${p1.x} ${midY} ${p1.x + r*dxSign} ${midY} L ${p2.x - r*dxSign} ${midY} Q ${p2.x} ${midY} ${p2.x} ${midY + r*dySign2} L ${p2.x} ${p2.y}`;
      }
    } else {
      const midX = mid.x;
      const dySign = p2.y > p1.y ? 1 : (p2.y < p1.y ? -1 : 0);
      const dxSign1 = midX > p1.x ? 1 : -1, dxSign2 = p2.x > midX ? 1 : -1;
      if (Math.abs(p2.y - p1.y) < 0.5 || r <= 0){
        d = `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`;
      } else {
        d = `M ${p1.x} ${p1.y} L ${midX - r*dxSign1} ${p1.y} Q ${midX} ${p1.y} ${midX} ${p1.y + r*dySign} L ${midX} ${p2.y - r*dySign} Q ${midX} ${p2.y} ${midX + r*dxSign2} ${p2.y} L ${p2.x} ${p2.y}`;
      }
    }
    return { d, mid };
  }

  // curved (default)
  if (verticalAligned){
    const dy = (p2.y - p1.y) * 0.5;
    return { d: `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y+dy}, ${p2.x} ${p2.y-dy}, ${p2.x} ${p2.y}`, mid };
  }
  const fromRight = aCenterX < bCenterX;
  const curveOffset = Math.max(60, Math.abs(p2.x - p1.x) * 0.4);
  const c1x = fromRight ? p1.x + curveOffset : p1.x - curveOffset;
  const c2x = fromRight ? p2.x - curveOffset : p2.x + curveOffset;
  return { d: `M ${p1.x} ${p1.y} C ${c1x} ${p1.y}, ${c2x} ${p2.y}, ${p2.x} ${p2.y}`, mid };
}

function updateEdgePath(edgeIdx){
  const e = edgeNodes[edgeIdx];
  const { d, mid } = edgePathData(e.data.from, e.data.to);
  e.pathBg.setAttribute("d", d);
  e.flow.setAttribute("d", d);
  e.glow.setAttribute("d", d);
  const label = e.data.type;
  const w = label.length * 6.4 + 10;
  e.labelBg.setAttribute("x", mid.x - w/2);
  e.labelBg.setAttribute("y", mid.y - 9);
  e.labelBg.setAttribute("width", w);
  e.labelBg.setAttribute("height", 15);
  e.labelText.setAttribute("x", mid.x);
  e.labelText.setAttribute("y", mid.y + 3);
  e.labelText.setAttribute("text-anchor", "middle");
}

function updateAllEdgePaths(){
  edgeNodes.forEach((_, i) => updateEdgePath(i));
}

function updateEdgesForTable(name){
  (state.edgesByTable[name] || []).forEach(updateEdgePath);
}

