/* ============================================================
   THEME TOGGLE
   ============================================================ */
function applyThemeIcon(){
  const icon = document.getElementById("themeIcon");
  if (icon) icon.innerHTML = svgIcon(isLightTheme() ? "moon" : "sun", 15);
}

function refreshThemedUI(){
  // module colors / rel colors / group tints depend on theme — rebuild in the
  // right order so filter states (dimmed / disabled) are reapplied correctly.
  renderTableIndex();
  renderModuleFilters();
  renderAll();   // rebuilds cards, groups, edges; also re-runs applyFilters/stats/minimap
  renderLegend();
  if (state.mapInitialized) renderMapView({ keepLayout: true });

  if (state.selected && cardNodes[state.selected]){
    const cardEl = cardNodes[state.selected].fo.querySelector(".table-card");
    if (cardEl) cardEl.classList.add("selected");
    const mod = SCHEMA.tables[state.selected].module;
    document.getElementById("detailsModule").style.setProperty("--mod-color", modColor(mod));
    detailsPanel.style.setProperty("--mod-color", modColor(mod));
  }
  if (state.focusMode && state.selected) applyFocusMode();
  applyTransform();
}

function setTheme(theme, opts){
  opts = opts || {};
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  applyThemeIcon();
  if (!opts.silent){
    refreshThemedUI();
    toast(theme === "light" ? "Light theme" : "Dark theme");
  }
}

document.getElementById("btnThemeToggle").onclick = () => {
  setTheme(isLightTheme() ? "dark" : "light");
};

if (window.matchMedia){
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    // only auto-follow the OS if the user never explicitly chose a theme
    let hasExplicitChoice = false;
    try { hasExplicitChoice = !!localStorage.getItem(THEME_KEY); } catch (err) {}
    if (!hasExplicitChoice) setTheme(e.matches ? "light" : "dark");
  });
}

document.getElementById("btnFitView").onclick = () => {
  if (state.view === "mapping") fitMapView(); else fitView();
};

