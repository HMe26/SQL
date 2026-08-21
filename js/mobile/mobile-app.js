/* ============================================================
   MOBILE EXPERIENCE — app shell
   ------------------------------------------------------------
   This file builds a purpose-built mobile UI on top of the
   existing desktop engine (SCHEMA, state, cardNodes, openDetails,
   switchView, applyFilters, showContextMenu, openCommandPalette,
   etc. — all defined earlier in the script load order).

   It never modifies desktop behaviour: everything here is either
   (a) new DOM appended once and hidden by default via CSS scoped
   to `body.is-mobile`, or (b) a thin wrapper around an existing
   global function that also keeps the mobile chrome in sync.
   Desktop users never see or load any of this UI.
   ============================================================ */

const MOBILE_BREAKPOINT = "(max-width: 900px)";
let mobileActiveTab = "browse";
let mobileBuilt = false;

/* ---------- helpers reused across the mobile shell ---------- */
function mobileVisibleTables(){
  return SCHEMA.order.filter(n => {
    const node = cardNodes[n];
    return !node || node.g.style.display !== "none";
  });
}
function mobileHasActiveFilters(){
  if (state.search) return true;
  if (Object.values(state.moduleEnabled).some(v => !v)) return true;
  if (state.quick.pk || state.quick.fk || state.quick.hideIsolated || state.quick.datatype) return true;
  return false;
}

/* ============================================================
   BUILD (runs once, DOM only — visibility fully controlled by CSS)
   ============================================================ */
function mobileBuildOnce(){
  if (mobileBuilt) return;
  mobileBuilt = true;

  mobileBuildHeaderControls();
  mobileBuildSearchOverlay();
  mobileBuildDrawerChrome();
  mobileBuildBottomNav();
  mobileBuildBrowseView();
  mobileBuildMoreSheet();
  mobileWrapCoreFunctions();
}

/* ---- header: hamburger / title / search / more ---- */
function mobileBuildHeaderControls(){
  const topbar = document.getElementById("topbar");

  const hamburger = document.createElement("button");
  hamburger.id = "mobileHamburgerBtn";
  hamburger.className = "mobile-header-btn";
  hamburger.setAttribute("aria-label", "Open filters and overview");
  hamburger.innerHTML = `<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`;
  hamburger.onclick = () => mobileOpenDrawer();
  topbar.insertBefore(hamburger, topbar.firstChild);

  const title = document.createElement("span");
  title.className = "mobile-title";
  title.textContent = "Database Atlas";
  topbar.insertBefore(title, hamburger.nextSibling);

  const spacer = document.createElement("div");
  spacer.className = "mobile-header-spacer";
  topbar.appendChild(spacer);

  const searchBtn = document.createElement("button");
  searchBtn.id = "mobileSearchBtn";
  searchBtn.className = "mobile-header-btn";
  searchBtn.setAttribute("aria-label", "Search tables, columns, modules");
  searchBtn.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`;
  searchBtn.onclick = () => mobileOpenSearch();
  topbar.appendChild(searchBtn);

  const moreBtn = document.createElement("button");
  moreBtn.id = "mobileMoreBtn";
  moreBtn.className = "mobile-header-btn";
  moreBtn.setAttribute("aria-label", "More actions");
  moreBtn.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none"/></svg>`;
  moreBtn.onclick = () => mobileOpenMoreSheet();
  topbar.appendChild(moreBtn);
}

/* ---- search: real #searchInput is reused in place, just repositioned by CSS ---- */
function mobileBuildSearchOverlay(){
  const backdrop = document.createElement("div");
  backdrop.className = "mobile-search-backdrop";
  backdrop.onclick = () => mobileCloseSearch();
  document.getElementById("topbar").insertAdjacentElement("afterend", backdrop);

  const closeBtn = document.createElement("button");
  closeBtn.className = "mobile-search-close";
  closeBtn.setAttribute("aria-label", "Close search");
  closeBtn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
  closeBtn.onclick = () => mobileCloseSearch();
  document.querySelector(".search-wrap").appendChild(closeBtn);
}
function mobileOpenSearch(){
  document.body.classList.add("mobile-search-open");
  setTimeout(() => document.getElementById("searchInput").focus(), 50);
}
function mobileCloseSearch(){
  document.body.classList.remove("mobile-search-open");
}

/* ---- drawer: reuse #sidebar, just add a mobile-only head + backdrop ---- */
function mobileBuildDrawerChrome(){
  const sidebar = document.getElementById("sidebar");
  const head = document.createElement("div");
  head.className = "mobile-drawer-head";
  head.innerHTML = `<h2>Overview &amp; Filters</h2>`;
  const closeBtn = document.createElement("button");
  closeBtn.className = "mobile-drawer-close";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.textContent = "✕";
  closeBtn.onclick = () => mobileCloseDrawer();
  head.appendChild(closeBtn);
  sidebar.insertBefore(head, sidebar.firstChild);

  const backdrop = document.createElement("div");
  backdrop.className = "mobile-drawer-backdrop";
  backdrop.onclick = () => mobileCloseDrawer();
  document.body.appendChild(backdrop);
}
function mobileOpenDrawer(){
  document.getElementById("sidebar").classList.add("open");
  document.body.classList.add("mobile-drawer-open");
}
function mobileCloseDrawer(){
  document.getElementById("sidebar").classList.remove("open");
  document.body.classList.remove("mobile-drawer-open");
}

/* ---- bottom navigation ---- */
function mobileBuildBottomNav(){
  const nav = document.createElement("nav");
  nav.id = "mobileBottomNav";
  nav.setAttribute("aria-label", "Main sections");
  nav.innerHTML = `
    <button class="mnav-btn" data-tab="browse" aria-label="Browse tables">
      <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
      <span>Browse</span>
    </button>
    <button class="mnav-btn" data-tab="erd" aria-label="ERD diagram">
      <svg viewBox="0 0 24 24"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>
      <span>Diagram</span>
    </button>
    <button class="mnav-btn" data-tab="map" aria-label="Database mapping view">
      <svg viewBox="0 0 24 24"><path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 13l9 5 9-5"/></svg>
      <span>Map</span>
    </button>
    <button class="mnav-btn" data-tab="more" aria-label="More">
      <svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none"/></svg>
      <span>More</span>
    </button>`;
  document.getElementById("app").appendChild(nav);

  nav.querySelectorAll(".mnav-btn").forEach(btn => {
    btn.onclick = () => {
      const tab = btn.dataset.tab;
      if (tab === "browse") mobileShowBrowse();
      else if (tab === "erd") mobileGoToView("erd");
      else if (tab === "map") mobileGoToView("mapping");
      else if (tab === "more") mobileOpenMoreSheet();
    };
  });
}
function updateMobileNavActive(){
  document.querySelectorAll("#mobileBottomNav .mnav-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === mobileActiveTab);
  });
}
function mobileGoToView(view){
  document.getElementById("mobileBrowseView").classList.remove("active");
  if (state.view === view){
    document.getElementById("canvasWrap").style.display = view === "erd" ? "" : "none";
    document.getElementById("mappingWrap").style.display = view === "mapping" ? "" : "none";
    document.getElementById("depsWrap").style.display = "none";
  } else {
    switchView(view);
  }
  mobileActiveTab = view === "mapping" ? "map" : "erd";
  updateMobileNavActive();
}
function mobileShowBrowse(){
  document.getElementById("canvasWrap").style.display = "none";
  document.getElementById("mappingWrap").style.display = "none";
  document.getElementById("depsWrap").style.display = "none";
  document.getElementById("mobileBrowseView").classList.add("active");
  mobileActiveTab = "browse";
  updateMobileNavActive();
  renderMobileBrowseList();
}

/* ---- Browse view: the mobile-native replacement for "shrink the table" ---- */
function mobileBuildBrowseView(){
  const view = document.createElement("main");
  view.id = "mobileBrowseView";
  view.innerHTML = `
    <div class="mb-toolbar">
      <span class="mb-count" id="mbCount"></span>
      <button class="mb-filter-btn" id="mbFilterBtn">${svgIcon("filter", 13)} Filters</button>
    </div>
    <div id="mobileBrowseList"></div>`;
  document.getElementById("app").appendChild(view);
  document.getElementById("mbFilterBtn").onclick = () => mobileOpenDrawer();
}
function renderMobileBrowseList(){
  const wrap = document.getElementById("mobileBrowseList");
  if (!wrap) return;
  const visible = mobileVisibleTables();
  const countEl = document.getElementById("mbCount");
  if (countEl) countEl.textContent = `${visible.length} of ${SCHEMA.order.length} tables`;
  const filterBtn = document.getElementById("mbFilterBtn");
  if (filterBtn) filterBtn.classList.toggle("has-active", mobileHasActiveFilters());

  if (!visible.length){
    wrap.innerHTML = `
      <div class="mb-empty">
        ${svgIcon("database", 40)}
        <h3>No tables match</h3>
        <p>Try a different search term, or reset your module and quick filters.</p>
        <button id="mbResetBtn">Reset filters</button>
      </div>`;
    const resetBtn = document.getElementById("mbResetBtn");
    if (resetBtn) resetBtn.onclick = () => {
      const resetChip = document.querySelector('[data-quick="reset"]');
      if (resetChip) resetChip.click();
      const input = document.getElementById("searchInput");
      input.value = "";
      state.search = "";
      applyFilters();
    };
    return;
  }

  const byModule = {};
  visible.forEach(n => {
    const m = SCHEMA.tables[n].module;
    (byModule[m] = byModule[m] || []).push(n);
  });

  let html = "";
  SCHEMA.modules.forEach(mod => {
    const tables = byModule[mod];
    if (!tables || !tables.length) return;
    const c = modColor(mod);
    html += `<div class="mb-module-group">
      <div class="mb-module-head"><span class="dot" style="background:${c};color:${c}"></span><span>${mod}</span><span class="cnt">${tables.length}</span></div>`;
    tables.forEach(name => {
      const t = SCHEMA.tables[name];
      const incCount = (incomingRefs[name] || []).length;
      html += `<div class="mb-card" data-table="${name}" tabindex="0" role="button" aria-label="Open ${name} details">
        <div class="mb-card-main">
          <div class="mb-name">${name}</div>
          <div class="mb-meta">
            <span class="mb-badge">${t.columns.length} col${t.columns.length === 1 ? "" : "s"}</span>
            ${t.pk.length ? `<span class="mb-badge pk">${svgIcon("key", 10)} PK</span>` : ""}
            ${t.fks.length ? `<span class="mb-badge fk">${svgIcon("link", 10)} ${t.fks.length} FK</span>` : ""}
            ${incCount ? `<span class="mb-badge">${incCount} ref</span>` : ""}
          </div>
        </div>
        <span class="mb-chevron">›</span>
      </div>`;
    });
    html += `</div>`;
  });
  wrap.innerHTML = html;

  wrap.querySelectorAll(".mb-card").forEach(card => {
    const name = card.dataset.table;
    let pressTimer = null;
    let longPressed = false;
    card.addEventListener("click", () => {
      if (longPressed){ longPressed = false; return; }
      openDetails(name);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " "){ e.preventDefault(); openDetails(name); }
    });
    card.addEventListener("touchstart", () => {
      longPressed = false;
      pressTimer = setTimeout(() => {
        longPressed = true;
        if (navigator.vibrate) navigator.vibrate(15);
        mobileShowCardMenu(name, card);
      }, 500);
    }, { passive: true });
    ["touchend", "touchmove", "touchcancel"].forEach(ev => {
      card.addEventListener(ev, () => { if (pressTimer) clearTimeout(pressTimer); }, { passive: true });
    });
  });
}
function mobileShowCardMenu(name, cardEl){
  const rect = cardEl.getBoundingClientRect();
  showContextMenu([
    { header: name },
    { label: "Open details", icon: "file-text", action: () => openDetails(name) },
    { label: "Focus this table", icon: "target", action: () => { openDetails(name); toggleFocusMode(true); } },
    { label: "Dependency graph", icon: "layers", action: () => openDependencyGraph(name) },
    { sep: true },
    { label: "Copy table name", icon: "copy", action: () => { navigator.clipboard.writeText(name); toast("Table name copied"); } },
    { label: "Copy CREATE TABLE SQL", icon: "copy", action: () => { navigator.clipboard.writeText(buildCreateTableSQL(name)); toast("SQL copied"); } },
  ], rect.left, rect.top);
}

/* ---- More actions bottom sheet (proxies to the existing desktop controls) ---- */
function mobileBuildMoreSheet(){
  const backdrop = document.createElement("div");
  backdrop.className = "mobile-sheet-backdrop";
  backdrop.onclick = () => mobileCloseMoreSheet();

  const sheet = document.createElement("div");
  sheet.className = "mobile-sheet";
  sheet.id = "mobileMoreSheet";
  sheet.innerHTML = `<div class="mobile-sheet-handle"></div><div class="mobile-sheet-title">More</div><div id="mobileMoreSheetBody"></div>`;

  const root = document.createElement("div");
  root.id = "mobileMoreSheetRoot";
  root.appendChild(backdrop);
  root.appendChild(sheet);
  document.body.appendChild(root);
}
function mobileMoreItems(){
  const click = (id) => () => { const el = document.getElementById(id); if (el) el.click(); };
  return [
    { group: "Explore", icon: "layers", label: "Dependency graph", action: () => openDependencyGraph(state.selected || SCHEMA.order[0]) },
    { group: "Explore", icon: "terminal", label: "Command palette", sub: "Ctrl K", action: () => openCommandPalette() },
    { group: "Explore", icon: "database", label: "Add data", sub: "custom tables", action: click("btnAddData") },
    { group: "Explore", icon: "list", label: state.quick && document.getElementById("legend").classList.contains("mobile-open") ? "Hide legend" : "Show legend", action: () => mobileToggleLegend() },
    { group: "Diagram", icon: "layout-dashboard", label: "Re-run auto layout", action: click("btnAutoLayout") },
    { group: "Diagram", icon: "layout-grid", label: "Fit to screen", action: click("btnFitView") },
    { group: "Diagram", icon: "layers", label: (typeof allCardsExpanded === "function" && allCardsExpanded()) ? "Collapse all columns" : "Expand all columns", action: click("btnExpandAll") },
    { group: "Diagram", icon: "target", label: state.focusMode ? "Turn off focus mode" : "Focus mode", action: click("btnFocusMode") },
    { group: "Diagram", icon: state.layoutMode === "organic" ? "layout-grid" : "activity", label: state.layoutMode === "organic" ? "Switch to Grid layout" : "Switch to Organic layout", action: () => { const b = document.querySelector(`#layoutModeSwitch [data-layout="${state.layoutMode === "organic" ? "grid" : "organic"}"]`); if (b) b.click(); } },
    { group: "Appearance", icon: isLightTheme() ? "moon" : "sun", label: isLightTheme() ? "Switch to Dark theme" : "Switch to Light theme", action: click("btnThemeToggle") },
    { group: "Appearance", icon: "grid-snap", label: state.snapToGrid ? "Turn off snap to grid" : "Snap to grid", action: click("btnSnapToggle") },
    { group: "Appearance", icon: (typeof isFullscreen === "function" && isFullscreen()) ? "minimize" : "maximize", label: (typeof isFullscreen === "function" && isFullscreen()) ? "Exit fullscreen" : "Fullscreen", action: click("btnFullscreen") },
    { group: "Data", icon: "filter", label: "Reset all filters", action: () => { const b = document.querySelector('[data-quick="reset"]'); if (b) b.click(); } },
    { group: "Export", icon: "download", label: "Export diagram…", sub: "PNG · SVG · PDF · JSON · more", action: click("btnExportMenu") },
  ];
}
function mobileOpenMoreSheet(){
  const body = document.getElementById("mobileMoreSheetBody");
  const items = mobileMoreItems();
  let html = "";
  let lastGroup = null;
  items.forEach((it, i) => {
    if (it.group !== lastGroup){ html += `<div class="mobile-sheet-group-label">${it.group}</div>`; lastGroup = it.group; }
    html += `<button class="mobile-sheet-row" data-idx="${i}">
      <span class="ico">${svgIcon(it.icon, 17)}</span><span>${it.label}</span>
      ${it.sub ? `<span class="sub">${it.sub}</span>` : ""}
    </button>`;
  });
  body.innerHTML = html;
  body.querySelectorAll(".mobile-sheet-row").forEach(row => {
    row.onclick = () => { mobileCloseMoreSheet(); items[parseInt(row.dataset.idx, 10)].action(); };
  });
  document.getElementById("mobileMoreSheetRoot").classList.add("mobile-sheet-open");
}
function mobileCloseMoreSheet(){
  const root = document.getElementById("mobileMoreSheetRoot");
  if (root) root.classList.remove("mobile-sheet-open");
}
function mobileToggleLegend(){
  const legend = document.getElementById("legend");
  legend.classList.toggle("mobile-open");
}

/* ---- wrap core desktop functions so mobile chrome stays in sync ---- */
function mobileWrapCoreFunctions(){
  const _origApplyFilters = applyFilters;
  applyFilters = function(){
    _origApplyFilters();
    if (document.body.classList.contains("is-mobile")) renderMobileBrowseList();
  };

  const _origSwitchView = switchView;
  switchView = function(view){
    _origSwitchView(view);
    if (document.body.classList.contains("is-mobile")){
      document.getElementById("mobileBrowseView").classList.remove("active");
      mobileActiveTab = view === "mapping" ? "map" : view;
      updateMobileNavActive();
    }
  };

  const _origOpenDetails = openDetails;
  openDetails = function(name){
    _origOpenDetails(name);
    if (document.body.classList.contains("is-mobile")) mobileCloseDrawer();
  };
}

/* ============================================================
   MODE SWITCHING — enter/exit mobile based on viewport
   ============================================================ */
function mobileEnable(){
  mobileBuildOnce();
  document.body.classList.add("is-mobile");
  mobileShowBrowse();
}
function mobileDisable(){
  document.body.classList.remove("is-mobile", "mobile-search-open", "mobile-drawer-open", "mobile-sheet-open");
  mobileCloseMoreSheet();
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("legend").classList.remove("mobile-open");
  // restore desktop display state to match the underlying view
  document.getElementById("canvasWrap").style.display = state.view === "erd" ? "" : "none";
  document.getElementById("mappingWrap").style.display = state.view === "mapping" ? "" : "none";
  document.getElementById("depsWrap").style.display = state.view === "deps" ? "" : "none";
  const browseView = document.getElementById("mobileBrowseView");
  if (browseView) browseView.classList.remove("active");
}
function mobileHandleModeChange(mql){
  if (mql.matches) mobileEnable(); else mobileDisable();
}

document.addEventListener("DOMContentLoaded", () => {
  const mql = window.matchMedia(MOBILE_BREAKPOINT);
  mobileHandleModeChange(mql);
  if (mql.addEventListener) mql.addEventListener("change", mobileHandleModeChange);
  else if (mql.addListener) mql.addListener(mobileHandleModeChange); // Safari <14 fallback
});
