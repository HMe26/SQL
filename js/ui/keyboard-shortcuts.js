/* ============================================================
   KEYBOARD SHORTCUTS
   ============================================================ */
document.addEventListener("keydown", (e) => {
  const mod = e.ctrlKey || e.metaKey;
  if (!mod) return;
  const k = e.key.toLowerCase();
  if (k === "k"){ e.preventDefault(); openCommandPalette(); return; }
  if (k === "f" && e.shiftKey){ e.preventDefault(); toggleFocusMode(); return; }
  if (k === "f"){ e.preventDefault(); const si = document.getElementById("searchInput"); si.focus(); si.select(); return; }
  if (k === "g"){ e.preventDefault(); cycleSearchMatch(); return; }
  if (k === "l"){ e.preventDefault(); document.getElementById("btnAutoLayout").click(); return; }
  if (k === "e" && e.shiftKey){ e.preventDefault(); document.getElementById("btnExpandAll").click(); return; }
  if (k === "e"){ e.preventDefault(); document.getElementById("exportMenu").classList.toggle("open"); return; }
  if (k === "d"){ e.preventDefault(); setTheme(isLightTheme() ? "dark" : "light"); return; }
  if (k === "m"){ e.preventDefault(); switchView(state.view === "erd" ? "mapping" : "erd"); return; }
});
document.getElementById("btnAutoLayout").onclick = () => {
  if (state.view === "mapping"){
    renderMapView();
    fitMapView();
    toast("Module map layout reset");
    return;
  }
  computeLayout();
  SCHEMA.order.forEach(name => {
    const p = state.positions[name];
    cardNodes[name].g.setAttribute("transform", `translate(${p.x},${p.y})`);
    cardNodes[name].fo.setAttribute("width", p.w);
    cardNodes[name].fo.setAttribute("height", p.h);
  });
  SCHEMA.modules.forEach(mod => {
    const b = state.groupBoxes[mod];
    const gn = groupNodes[mod];
    gn.rect.setAttribute("x", b.x); gn.rect.setAttribute("y", b.y);
    gn.rect.setAttribute("width", b.w); gn.rect.setAttribute("height", b.h);
    gn.label.setAttribute("x", b.x + 22); gn.label.setAttribute("y", b.y + 24);
    gn.cnt.setAttribute("x", b.x + b.w - 18); gn.cnt.setAttribute("y", b.y + 24);
  });
  updateAllEdgePaths();
  renderMinimap();
  fitView();
  toast("Layout reset");
};

document.getElementById("btnExpandAll").onclick = () => toggleExpandAll();
updateExpandAllButton();

/* ---- relationship routing style switch ---- */
function applyRoutingButtonState(){
  document.querySelectorAll("#routingSwitch button").forEach(b => {
    b.classList.toggle("active", b.dataset.routing === state.edgeRouting);
  });
}
document.querySelectorAll("#routingSwitch button").forEach(btn => {
  btn.onclick = () => {
    state.edgeRouting = btn.dataset.routing;
    localStorage.setItem("edgeRouting", state.edgeRouting);
    applyRoutingButtonState();
    updateAllEdgePaths();
    toast(`Routing: ${btn.dataset.routing}`);
  };
});
applyRoutingButtonState();


/* ============================================================
   INIT
   ============================================================ */
