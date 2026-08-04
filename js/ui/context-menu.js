/* ============================================================
   CONTEXT MENU
   ============================================================ */
const contextMenuEl = document.getElementById("contextMenu");
function hideContextMenu(){ contextMenuEl.classList.remove("open"); }
function showContextMenu(items, x, y){
  contextMenuEl.innerHTML = items.map((it, i) => {
    if (it.sep) return `<div class="cm-sep"></div>`;
    if (it.header) return `<div class="cm-label">${it.header}</div>`;
    return `<button data-cm-idx="${i}">${it.icon ? svgIcon(it.icon, 14) : ""}<span>${it.label}</span></button>`;
  }).join("");
  contextMenuEl.classList.add("open");
  contextMenuEl.style.left = "-9999px";
  contextMenuEl.style.top = "-9999px";
  requestAnimationFrame(() => {
    const rect = contextMenuEl.getBoundingClientRect();
    let left = Math.min(x, window.innerWidth - rect.width - 8);
    let top = Math.min(y, window.innerHeight - rect.height - 8);
    contextMenuEl.style.left = Math.max(8, left) + "px";
    contextMenuEl.style.top = Math.max(8, top) + "px";
  });
  items.forEach((it, i) => {
    if (it.sep || it.header) return;
    const btn = contextMenuEl.querySelector(`[data-cm-idx="${i}"]`);
    if (btn) btn.onclick = () => { hideContextMenu(); it.action(); };
  });
}
document.addEventListener("click", hideContextMenu);
document.addEventListener("scroll", hideContextMenu, true);
document.addEventListener("keydown", (e) => { if (e.key === "Escape"){ hideContextMenu(); if (cpOverlayEl && cpOverlayEl.classList.contains("open")) closeCommandPalette(); } });

canvasWrap.addEventListener("contextmenu", (e) => {
  const cardEl = e.target.closest(".table-card");
  e.preventDefault();
  if (cardEl){
    const name = cardEl.dataset.table;
    showContextMenu([
      { header: name },
      { label: "Open details", icon: "file-text", action: () => openDetails(name) },
      { label: "Focus this table", icon: "target", action: () => { openDetails(name); toggleFocusMode(true); } },
      { sep: true },
      { label: "Copy table name", icon: "copy", action: () => { navigator.clipboard.writeText(name); toast("Table name copied"); } },
      { label: "Copy CREATE TABLE SQL", icon: "copy", action: () => { navigator.clipboard.writeText(buildCreateTableSQL(name)); toast("SQL copied"); } },
      { sep: true },
      { label: "Center in view", icon: "target", action: () => centerOnTable(name) },
    ], e.clientX, e.clientY);
  } else {
    showContextMenu([
      { label: "Fit to screen", icon: "layout-grid", action: () => fitView() },
      { label: "Re-run auto layout", icon: "layout-dashboard", action: () => document.getElementById("btnAutoLayout").click() },
      { sep: true },
      { label: "Reset filters", icon: "filter", action: () => document.querySelector('[data-quick="reset"]').click() },
      { label: "Open command palette", icon: "terminal", action: () => openCommandPalette() },
    ], e.clientX, e.clientY);
  }
});

mappingWrap.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  showContextMenu([
    { label: "Fit to screen", icon: "layout-grid", action: () => fitMapView() },
    { label: "Reset map layout", icon: "layout-dashboard", action: () => document.getElementById("btnAutoLayout").click() },
    { sep: true },
    { label: "Switch to ERD view", icon: "layers", action: () => switchView("erd") },
  ], e.clientX, e.clientY);
});

