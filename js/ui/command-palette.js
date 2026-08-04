/* ============================================================
   COMMAND PALETTE  (Ctrl+K)
   Searchable list of tables, modules, and actions - fuzzy match,
   keyboard nav (Up/Down/Enter), executes instantly on selection.
   ============================================================ */
const cpOverlayEl = document.getElementById("commandPalette");
const cpInputEl = document.getElementById("cpInput");
const cpResultsEl = document.getElementById("cpResults");
let cpItems = [];       // flat, filtered list currently rendered
let cpActiveIdx = -1;
let cpLastFocus = null;

function cpActionCommands(){
  return [
    { group: "Actions", icon: "layout-grid", label: "Fit to screen", sub: "", action: () => (state.view === "mapping" ? fitMapView() : fitView()) },
    { group: "Actions", icon: "layout-dashboard", label: "Re-run auto layout", sub: "Ctrl+L", action: () => document.getElementById("btnAutoLayout").click() },
    { group: "Actions", icon: "layers", label: (typeof allCardsExpanded === "function" && allCardsExpanded()) ? "Collapse all columns" : "Expand all columns", sub: "Ctrl+Shift+E", action: () => document.getElementById("btnExpandAll").click() },
    { group: "Actions", icon: state.view === "erd" ? "layers" : "table-2", label: state.view === "erd" ? "Switch to Mapping view" : "Switch to ERD view", sub: "Ctrl+M", action: () => switchView(state.view === "erd" ? "mapping" : "erd") },
    { group: "Actions", icon: "target", label: state.focusMode ? "Turn off Focus Mode" : "Turn on Focus Mode", sub: "Ctrl+Shift+F", action: () => toggleFocusMode() },
    { group: "Actions", icon: isLightTheme() ? "moon" : "sun", label: isLightTheme() ? "Switch to Dark theme" : "Switch to Light theme", sub: "Ctrl+D", action: () => setTheme(isLightTheme() ? "dark" : "light") },
    { group: "Actions", icon: "filter", label: "Reset all filters", sub: "", action: () => document.querySelector('[data-quick="reset"]').click() },
    { group: "Actions", icon: "download", label: "Export as PNG", sub: "", action: () => exportPNG() },
    { group: "Actions", icon: "download", label: "Export as SVG", sub: "", action: () => exportSVG() },
    { group: "Actions", icon: "download", label: "Export as PDF", sub: "", action: () => exportPDF() },
    { group: "Actions", icon: "download", label: "Export as JSON", sub: "", action: () => exportJSON() },
    { group: "Actions", icon: "download", label: "Export as Mermaid (.mmd)", sub: "", action: () => exportMermaid() },
    { group: "Actions", icon: "download", label: "Export as PlantUML (.puml)", sub: "", action: () => exportPlantUML() },
    { group: "Actions", icon: "download", label: "Export as Draw.io (.drawio)", sub: "", action: () => exportDrawio() },
  ];
}
function cpModuleCommands(){
  return SCHEMA.modules.map(mod => ({
    group: "Modules", icon: (SCHEMA.moduleIcons && SCHEMA.moduleIcons[mod]) || "layers",
    label: mod, sub: `${SCHEMA.order.filter(n => SCHEMA.tables[n].module === mod).length} tables`,
    action: () => navigateToModule(mod),
  }));
}
function cpTableCommands(){
  return SCHEMA.order.map(name => ({
    group: "Tables", icon: "table-2", label: name, sub: SCHEMA.tables[name].module,
    action: () => {
      if (state.view !== "erd") switchView("erd");
      openDetails(name);
      centerOnTable(name);
    },
  }));
}

// simple fuzzy score: exact/prefix/substring beat subsequence; -1 = no match
function cpFuzzyScore(label, q){
  const l = label.toLowerCase();
  if (!q) return 0;
  if (l === q) return 100;
  if (l.startsWith(q)) return 80;
  const idx = l.indexOf(q);
  if (idx !== -1) return 60 - idx;
  let qi = 0;
  for (let i = 0; i < l.length && qi < q.length; i++) if (l[i] === q[qi]) qi++;
  return qi === q.length ? 10 : -1;
}

function cpRender(){
  const q = cpInputEl.value.trim().toLowerCase();
  const all = [...cpActionCommands(), ...cpModuleCommands(), ...cpTableCommands()];
  let scored = all.map(it => ({ it, score: cpFuzzyScore(it.label, q) }));
  scored = scored.filter(s => s.score >= 0);
  scored.sort((a, b) => b.score - a.score);
  const limited = q ? scored.slice(0, 40) : scored.filter(s => s.it.group !== "Tables").slice(0, 20);
  cpItems = limited.map(s => s.it);
  cpActiveIdx = cpItems.length ? 0 : -1;

  if (!cpItems.length){
    cpResultsEl.innerHTML = `<div class="cp-group-label">No matches</div>`;
    return;
  }
  let html = "";
  let lastGroup = null;
  cpItems.forEach((it, i) => {
    if (it.group !== lastGroup){ html += `<div class="cp-group-label">${it.group}</div>`; lastGroup = it.group; }
    html += `<div class="cp-item${i === cpActiveIdx ? " active" : ""}" data-cp-idx="${i}">
      <span class="cp-icon">${svgIcon(it.icon, 15)}</span><span>${it.label}</span>
      ${it.sub ? `<span class="cp-sub">${it.sub}</span>` : ""}
    </div>`;
  });
  cpResultsEl.innerHTML = html;
  cpResultsEl.querySelectorAll(".cp-item").forEach(el => {
    el.addEventListener("mouseenter", () => cpSetActive(parseInt(el.dataset.cpIdx, 10)));
    el.addEventListener("click", () => cpExecute(parseInt(el.dataset.cpIdx, 10)));
  });
}

function cpSetActive(idx){
  cpActiveIdx = idx;
  cpResultsEl.querySelectorAll(".cp-item").forEach(el => {
    el.classList.toggle("active", parseInt(el.dataset.cpIdx, 10) === idx);
  });
  const activeEl = cpResultsEl.querySelector(".cp-item.active");
  if (activeEl) activeEl.scrollIntoView({ block: "nearest" });
}

function cpExecute(idx){
  const it = cpItems[idx];
  if (!it) return;
  closeCommandPalette();
  it.action();
}

function openCommandPalette(){
  cpLastFocus = document.activeElement;
  cpOverlayEl.classList.add("open");
  cpInputEl.value = "";
  cpRender();
  requestAnimationFrame(() => cpInputEl.focus());
}
function closeCommandPalette(){
  cpOverlayEl.classList.remove("open");
  if (cpLastFocus && cpLastFocus.focus) cpLastFocus.focus();
}

cpInputEl.addEventListener("input", cpRender);
cpInputEl.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown"){ e.preventDefault(); if (cpItems.length) cpSetActive((cpActiveIdx + 1) % cpItems.length); }
  else if (e.key === "ArrowUp"){ e.preventDefault(); if (cpItems.length) cpSetActive((cpActiveIdx - 1 + cpItems.length) % cpItems.length); }
  else if (e.key === "Enter"){ e.preventDefault(); cpExecute(cpActiveIdx); }
  else if (e.key === "Escape"){ e.preventDefault(); closeCommandPalette(); }
});
cpOverlayEl.addEventListener("mousedown", (e) => { if (e.target === cpOverlayEl) closeCommandPalette(); });
document.getElementById("btnCommandPalette").onclick = () => openCommandPalette();

