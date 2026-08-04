/* ============================================================
   INTERACTION: drag, pan, zoom
   ============================================================ */
function attachCardEvents(name, g){
  let dragState = null;
  const cardEl = () => g.querySelector(".table-card");

  g.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const p = state.positions[name];
    dragState = {
      startX: e.clientX, startY: e.clientY,
      origX: p.x, origY: p.y, moved: false,
      pendingEvent: null, rafId: null
    };
    cardEl() && cardEl().classList.add("dragging");

    // PERF: a raw "mousemove" can fire 100+ times/sec, far faster than the
    // screen can redraw. Writing the SVG transform + recomputing every FK
    // edge path on each one caused visible stutter while dragging. Instead
    // we just record the latest mouse position here and do the actual DOM
    // work at most once per animation frame via applyPendingDrag().
    const applyPendingDrag = () => {
      dragState.rafId = null;
      const ev = dragState.pendingEvent;
      if (!ev) return;
      const dx = (ev.clientX - dragState.startX) / state.zoom;
      const dy = (ev.clientY - dragState.startY) / state.zoom;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragState.moved = true;
      p.x = dragState.origX + dx;
      p.y = dragState.origY + dy;
      g.setAttribute("transform", `translate(${p.x},${p.y})`);
      updateEdgesForTable(name);
    };
    const onMove = (ev) => {
      dragState.pendingEvent = ev;
      if (dragState.rafId == null) dragState.rafId = requestAnimationFrame(applyPendingDrag);
    };
    const onUp = () => {
      if (dragState.rafId != null) { cancelAnimationFrame(dragState.rafId); applyPendingDrag(); }
      cardEl() && cardEl().classList.remove("dragging");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      renderMinimap();
      if (!dragState.moved) openDetails(name);
      dragState = null;
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });

  g.addEventListener("mouseenter", () => highlightRelated(name, true));
  g.addEventListener("mouseleave", () => highlightRelated(name, false));

  g.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " "){
      e.preventDefault();
      openDetails(name);
    }
  });
  g.addEventListener("focus", () => highlightRelated(name, true), true);
  g.addEventListener("blur", () => highlightRelated(name, false), true);
}

/* ---- drag an entire module (group box + all its member tables) as one unit ---- */
function attachGroupDragEvents(mod, groupEl){
  let dragState = null;
  groupEl.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const b = state.groupBoxes[mod];
    const memberTables = SCHEMA.order.filter(n => SCHEMA.tables[n].module === mod);
    dragState = {
      startX: e.clientX, startY: e.clientY,
      origBoxX: b.x, origBoxY: b.y,
      members: memberTables.map(n => ({ name: n, x: state.positions[n].x, y: state.positions[n].y })),
      pendingEvent: null, rafId: null
    };
    groupEl.classList.add("dragging-group");

    // PERF: same coalescing as single-card drag, but here it matters even
    // more — a whole module can contain a dozen+ tables, each with its own
    // FK edges, all recomputed together on every mousemove. Batching this
    // to once per frame keeps dragging a whole module smooth.
    const applyPendingDrag = () => {
      dragState.rafId = null;
      const ev = dragState.pendingEvent;
      if (!ev) return;
      const dx = (ev.clientX - dragState.startX) / state.zoom;
      const dy = (ev.clientY - dragState.startY) / state.zoom;
      b.x = dragState.origBoxX + dx;
      b.y = dragState.origBoxY + dy;
      const gn = groupNodes[mod];
      gn.rect.setAttribute("x", b.x);
      gn.rect.setAttribute("y", b.y);
      gn.label.setAttribute("x", b.x + 22);
      gn.label.setAttribute("y", b.y + 24);
      gn.cnt.setAttribute("x", b.x + b.w - 18);
      gn.cnt.setAttribute("y", b.y + 24);
      dragState.members.forEach(mem => {
        const p = state.positions[mem.name];
        p.x = mem.x + dx;
        p.y = mem.y + dy;
        cardNodes[mem.name].g.setAttribute("transform", `translate(${p.x},${p.y})`);
        updateEdgesForTable(mem.name);
      });
    };
    const onMove = (ev) => {
      dragState.pendingEvent = ev;
      if (dragState.rafId == null) dragState.rafId = requestAnimationFrame(applyPendingDrag);
    };
    const onUp = () => {
      if (dragState.rafId != null) { cancelAnimationFrame(dragState.rafId); applyPendingDrag(); }
      groupEl.classList.remove("dragging-group");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      renderMinimap();
      dragState = null;
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });
}

function highlightRelated(name, on){
  (state.edgesByTable[name] || []).forEach(i => {
    edgeNodes[i].pathBg.classList.toggle("hover-active", on);
    edgeNodes[i].flow.classList.toggle("hover-active", on);
    edgeNodes[i].glow.classList.toggle("hover-active", on);
  });
}

/* ---- pan & zoom ---- */
const canvasWrap = document.getElementById("canvasWrap");

function applyTransform(){
  viewportEl.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
  document.getElementById("zoomLevel").textContent = Math.round(state.zoom * 100) + "%";
  const mmBadge = document.getElementById("minimapZoomBadge");
  if (mmBadge) mmBadge.textContent = Math.round(state.zoom * 100) + "%";
  renderMinimapViewport();
}

// PERF: applyTransform() ends up calling canvasWrap.getBoundingClientRect()
// (via renderMinimapViewport), which forces the browser to stop and
// recompute layout synchronously. Calling that on every raw mousemove/wheel
// event (which can fire far faster than the screen redraws) is what caused
// panning/zooming to feel like it was hanging. requestTransformUpdate()
// coalesces any number of calls within the same frame into a single
// applyTransform() right before the next repaint.
let transformRafId = null;
function requestTransformUpdate(){
  if (transformRafId != null) return;
  transformRafId = requestAnimationFrame(() => {
    transformRafId = null;
    applyTransform();
  });
}

let isPanning = false, panStart = null;
canvasWrap.addEventListener("mousedown", (e) => {
  if (e.target.closest(".table-card")) return;
  isPanning = true;
  canvasWrap.classList.add("panning");
  panStart = { x: e.clientX - state.panX, y: e.clientY - state.panY };
});
window.addEventListener("mousemove", (e) => {
  if (!isPanning) return;
  state.panX = e.clientX - panStart.x;
  state.panY = e.clientY - panStart.y;
  requestTransformUpdate();
});
window.addEventListener("mouseup", () => { isPanning = false; canvasWrap.classList.remove("panning"); });

canvasWrap.addEventListener("wheel", (e) => {
  e.preventDefault();
  const rect = canvasWrap.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  const worldX = (mx - state.panX) / state.zoom;
  const worldY = (my - state.panY) / state.zoom;
  const delta = -e.deltaY * 0.0016;
  const newZoom = Math.min(2.4, Math.max(0.18, state.zoom * (1 + delta)));
  state.panX = mx - worldX * newZoom;
  state.panY = my - worldY * newZoom;
  state.zoom = newZoom;
  requestTransformUpdate();
}, { passive: false });

// touch support (pinch + pan + double-tap zoom + long-press to open details)
let touchState = null;
let lastTapTime = 0, lastTapPos = null;
let longPressTimer = null;
function clearLongPress(){ if (longPressTimer){ clearTimeout(longPressTimer); longPressTimer = null; } }

canvasWrap.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1){
    const touch = e.touches[0];
    touchState = { mode: "pan", x: touch.clientX - state.panX, y: touch.clientY - state.panY, startX: touch.clientX, startY: touch.clientY };

    // long-press: open details for the table under the finger
    const targetCard = e.target.closest(".table-card");
    clearLongPress();
    longPressTimer = setTimeout(() => {
      longPressTimer = null;
      if (navigator.vibrate) navigator.vibrate(15);
      if (targetCard) openDetails(targetCard.dataset.table);
      else toggleFocusMode();
    }, 550);

    // double-tap: zoom in/out centered on the tap point
    const now = Date.now();
    if (lastTapPos && now - lastTapTime < 320 && Math.hypot(touch.clientX - lastTapPos.x, touch.clientY - lastTapPos.y) < 34){
      clearLongPress();
      const rect = canvasWrap.getBoundingClientRect();
      const mx = touch.clientX - rect.left, my = touch.clientY - rect.top;
      const worldX = (mx - state.panX) / state.zoom, worldY = (my - state.panY) / state.zoom;
      const newZoom = state.zoom < 1.05 ? Math.min(2.4, state.zoom * 1.9) : 0.6;
      state.panX = mx - worldX * newZoom;
      state.panY = my - worldY * newZoom;
      state.zoom = newZoom;
      applyTransform();
      lastTapTime = 0; lastTapPos = null;
    } else {
      lastTapTime = now; lastTapPos = { x: touch.clientX, y: touch.clientY };
    }
  } else if (e.touches.length === 2){
    clearLongPress();
    const [a,b] = e.touches;
    const dist = Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY);
    touchState = { mode: "pinch", dist, zoom: state.zoom };
  }
}, { passive: true });
canvasWrap.addEventListener("touchmove", (e) => {
  if (touchState && touchState.startX != null && e.touches[0]){
    const t = e.touches[0];
    if (Math.abs(t.clientX - touchState.startX) > 10 || Math.abs(t.clientY - touchState.startY) > 10) clearLongPress();
  }
  if (!touchState) return;
  if (touchState.mode === "pan" && e.touches.length === 1){
    state.panX = e.touches[0].clientX - touchState.x;
    state.panY = e.touches[0].clientY - touchState.y;
    requestTransformUpdate();
  } else if (touchState.mode === "pinch" && e.touches.length === 2){
    const [a,b] = e.touches;
    const dist = Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY);
    state.zoom = Math.min(2.4, Math.max(0.18, touchState.zoom * (dist / touchState.dist)));
    requestTransformUpdate();
  }
}, { passive: true });
canvasWrap.addEventListener("touchend", () => { touchState = null; clearLongPress(); });

document.getElementById("zoomIn").onclick = () => { state.zoom = Math.min(2.4, state.zoom * 1.2); applyTransform(); };
document.getElementById("zoomOut").onclick = () => { state.zoom = Math.max(0.18, state.zoom / 1.2); applyTransform(); };

function fitView(){
  const bounds = contentBounds();
  const rect = canvasWrap.getBoundingClientRect();
  const zx = rect.width / bounds.w, zy = rect.height / bounds.h;
  state.zoom = Math.min(1.1, Math.min(zx, zy) * 0.94);
  state.panX = (rect.width - bounds.w * state.zoom) / 2;
  state.panY = 40;
  applyTransform();
}

/* ---- tooltip for edges ---- */
let tooltipEl;
function setEdgeEndpointHighlight(idx, on){
  const d = edgeNodes[idx].data;
  [d.from, d.to].forEach(n => {
    const wrap = cardNodes[n];
    if (!wrap) return;
    const cardEl = wrap.fo.querySelector(".table-card");
    if (!cardEl) return;
    cardEl.classList.toggle("rel-endpoint", on);
    if (on) cardEl.style.setProperty("--rel-glow-color", d.color);
  });
}
function showEdgeTooltip(idx){
  const d = edgeNodes[idx].data;
  tooltipEl.innerHTML = `
    <div class="rt-title">${d.from} → ${d.to}</div>
    <div><b>FK column:</b> ${d.fromCol}</div>
    <div><b>References:</b> ${d.to}.${d.toCol}</div>
    <div><b>Delete rule:</b> ${d.onDelete}</div>
    <div><b>Update rule:</b> ${d.onUpdate}</div>
    <div><b>Multiplicity:</b> ${d.type}</div>`;
  tooltipEl.classList.add("show");
  edgeNodes[idx].pathBg.classList.add("hover-active");
  edgeNodes[idx].flow.classList.add("hover-active");
  edgeNodes[idx].glow.classList.add("hover-active");
  setEdgeEndpointHighlight(idx, true);
  state.hoverEdge = idx;
}
function hideEdgeTooltip(){
  tooltipEl.classList.remove("show");
  if (state.hoverEdge != null){
    edgeNodes[state.hoverEdge].pathBg.classList.remove("hover-active");
    edgeNodes[state.hoverEdge].flow.classList.remove("hover-active");
    edgeNodes[state.hoverEdge].glow.classList.remove("hover-active");
    setEdgeEndpointHighlight(state.hoverEdge, false);
  }
  state.hoverEdge = null;
}
function moveTooltip(e){
  const rect = canvasWrap.getBoundingClientRect();
  tooltipEl.style.left = (e.clientX - rect.left + 16) + "px";
  tooltipEl.style.top = (e.clientY - rect.top + 12) + "px";
}

