/* ============================================================
   RESIZABLE + DRAGGABLE MINIMAP PANELS
   ============================================================ */
function makePanelDraggable(panelEl, handleEl){
  let drag = null;
  handleEl.addEventListener("mousedown", (e) => {
    if (e.target.closest(".icon-btn")) return; // don't drag when clicking a button
    const r = panelEl.getBoundingClientRect();
    const parentR = panelEl.offsetParent.getBoundingClientRect();
    // switch from right/bottom anchoring to left/top so it can be freely dragged
    panelEl.style.left = (r.left - parentR.left) + "px";
    panelEl.style.top = (r.top - parentR.top) + "px";
    panelEl.style.right = "auto";
    panelEl.style.bottom = "auto";
    drag = { startX: e.clientX, startY: e.clientY, left: r.left - parentR.left, top: r.top - parentR.top };
    panelEl.classList.add("dragging");
    e.preventDefault();
  });
  window.addEventListener("mousemove", (e) => {
    if (!drag) return;
    const parentR = panelEl.offsetParent.getBoundingClientRect();
    let nl = drag.left + (e.clientX - drag.startX);
    let nt = drag.top + (e.clientY - drag.startY);
    nl = Math.max(0, Math.min(nl, parentR.width - panelEl.offsetWidth));
    nt = Math.max(0, Math.min(nt, parentR.height - panelEl.offsetHeight));
    panelEl.style.left = nl + "px";
    panelEl.style.top = nt + "px";
  });
  window.addEventListener("mouseup", () => {
    if (drag){ drag = null; panelEl.classList.remove("dragging"); }
  });
}

function makePanelResizable(panelEl, handleEl, onResize){
  let resize = null;
  handleEl.addEventListener("mousedown", (e) => {
    resize = { startX: e.clientX, startY: e.clientY, w: panelEl.offsetWidth, h: panelEl.offsetHeight };
    panelEl.classList.add("resizing");
    e.preventDefault();
    e.stopPropagation();
  });
  window.addEventListener("mousemove", (e) => {
    if (!resize) return;
    const cs = getComputedStyle(panelEl);
    const minW = parseFloat(cs.minWidth) || 170, minH = parseFloat(cs.minHeight) || 120;
    const maxW = parseFloat(cs.maxWidth) || 520, maxH = parseFloat(cs.maxHeight) || 420;
    const nw = Math.max(minW, Math.min(maxW, resize.w + (e.clientX - resize.startX)));
    const nh = Math.max(minH, Math.min(maxH, resize.h + (e.clientY - resize.startY)));
    panelEl.style.width = nw + "px";
    panelEl.style.height = nh + "px";
    if (onResize) onResize();
  });
  window.addEventListener("mouseup", () => {
    if (resize){ resize = null; panelEl.classList.remove("resizing"); if (onResize) onResize(); }
  });
}

function initMinimapPanels(){
  const mm = document.getElementById("minimap");
  const mmHandle = document.getElementById("minimapDragHandle");
  const mmResize = document.getElementById("minimapResizeHandle");
  makePanelDraggable(mm, mmHandle);
  makePanelResizable(mm, mmResize, renderMinimap);
  document.getElementById("minimapFitBtn").onclick = (e) => { e.stopPropagation(); fitView(); };

  const mapMm = document.getElementById("mapMinimap");
  const mapMmHandle = document.getElementById("mapMinimapDragHandle");
  const mapMmResize = document.getElementById("mapMinimapResizeHandle");
  makePanelDraggable(mapMm, mapMmHandle);
  makePanelResizable(mapMm, mapMmResize, renderMapMinimap);
  document.getElementById("mapMinimapFitBtn").onclick = (e) => { e.stopPropagation(); fitMapView(); };
}

