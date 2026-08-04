/* ============================================================
   SEARCH + FILTERS
   ============================================================ */
function tableMatchesSearch(name, q){
  if (!q) return true;
  const t = SCHEMA.tables[name];
  if (name.includes(q)) return true;
  if (t.module.toLowerCase().includes(q)) return true;
  if (t.description && t.description.toLowerCase().includes(q)) return true;
  return t.columns.some(c => c.name.toLowerCase().includes(q));
}

/* ---- datatype filter ---- */
function normalizeType(type){
  return (type || "").replace(/\(.*\)/, "").trim().split(" ")[0].toUpperCase();
}
function populateDatatypeFilter(){
  const select = document.getElementById("datatypeFilter");
  const types = new Set();
  SCHEMA.order.forEach(name => {
    SCHEMA.tables[name].columns.forEach(c => types.add(normalizeType(c.type)));
  });
  const sorted = Array.from(types).sort();
  select.innerHTML = `<option value="">Filter by column datatype…</option>` +
    sorted.map(t => `<option value="${t}">${t}</option>`).join("");
  select.onchange = () => {
    state.quick.datatype = select.value;
    applyFilters();
  };
}

function applyFilters(){
  const q = state.search.trim().toLowerCase();
  let firstMatch = null;

  SCHEMA.order.forEach(name => {
    const t = SCHEMA.tables[name];
    const cardWrap = cardNodes[name];
    if (!cardWrap) return;
    const cardEl = cardWrap.fo.querySelector(".table-card");
    let visible = state.moduleEnabled[t.module];

    if (visible && state.quick.fk) visible = t.fks.length > 0;
    if (visible && state.quick.pk) visible = t.pk.length > 0;
    if (visible && state.quick.hideIsolated) visible = hasRelations(name);
    if (visible && state.quick.datatype) visible = t.columns.some(c => normalizeType(c.type) === state.quick.datatype);

    const matchesSearch = tableMatchesSearch(name, q);

    cardWrap.g.style.display = visible ? "" : "none";
    cardEl.classList.toggle("matched", !!q && matchesSearch && visible);
    cardEl.classList.toggle("dimmed", visible && !!q && !matchesSearch);

    if (visible && q && matchesSearch && !firstMatch) firstMatch = name;
  });

  // group box visibility: dim group if all its tables hidden
  SCHEMA.modules.forEach(mod => {
    const gn = groupNodes[mod];
    const visible = state.moduleEnabled[mod];
    gn.g.style.display = visible ? "" : "none";
  });

  // edges: show only if both endpoints visible
  edgeNodes.forEach(e => {
    const aVisible = cardNodes[e.data.from].g.style.display !== "none";
    const bVisible = cardNodes[e.data.to].g.style.display !== "none";
    const show = aVisible && bVisible;
    e.pathBg.style.display = show ? "" : "none";
    e.flow.style.display = show ? "" : "none";
    e.labelBg.style.display = show ? "" : "none";
    e.labelText.style.display = show ? "" : "none";
    if (q){
      const dim = !(tableMatchesSearch(e.data.from, q) && tableMatchesSearch(e.data.to, q));
      e.pathBg.classList.toggle("dimmed", dim);
    } else {
      e.pathBg.classList.toggle("dimmed", false);
    }
  });

  updateTableIndexUI();
  updateSearchCount(q, firstMatch);

  if (q && firstMatch) centerOnTable(firstMatch);
}

function updateSearchCount(q, firstMatch){
  const countEl = document.getElementById("searchCount");
  if (!q){ countEl.textContent = ""; return; }
  const matches = SCHEMA.order.filter(n => tableMatchesSearch(n, q) && cardNodes[n].g.style.display !== "none");
  countEl.textContent = matches.length ? `${matches.length} match${matches.length>1?"es":""}` : "no matches";
}

function centerOnTable(name){
  const p = state.positions[name];
  const rect = canvasWrap.getBoundingClientRect();
  const targetZoom = Math.max(state.zoom, 0.85);
  state.zoom = Math.min(1.3, targetZoom);
  state.panX = rect.width/2 - (p.x + p.w/2) * state.zoom;
  state.panY = rect.height/2 - (p.y + p.h/2) * state.zoom;
  applyTransform();
}

function cycleSearchMatch(){
  const q = state.search.trim().toLowerCase();
  const input = document.getElementById("searchInput");
  if (!q){ input.focus(); input.select(); return; }
  const matches = SCHEMA.order.filter(n => tableMatchesSearch(n, q) && cardNodes[n] && cardNodes[n].g.style.display !== "none");
  if (!matches.length) return;
  state.searchMatchIndex = (state.searchMatchIndex + 1) % matches.length;
  const target = matches[state.searchMatchIndex];
  centerOnTable(target);
  openDetails(target);
}

// PERF: applyFilters() walks every table card and every FK edge to update
// visibility/highlighting. Running it on every keystroke made fast typing
// feel laggy. Debouncing by ~120ms means it only runs once typing pauses
// briefly, which is imperceptible to the person typing but avoids dozens
// of redundant full passes for a single search term.
let searchDebounceId = null;
document.getElementById("searchInput").addEventListener("input", (e) => {
  state.search = e.target.value;
  state.searchMatchIndex = -1;
  if (searchDebounceId != null) clearTimeout(searchDebounceId);
  searchDebounceId = setTimeout(() => {
    searchDebounceId = null;
    applyFilters();
  }, 120);
});

/* ---- sidebar: module navigator ---- */
function renderModuleFilters(){
  const wrap = document.getElementById("moduleFilters");
  wrap.innerHTML = "";
  SCHEMA.modules.forEach(mod => {
    const count = SCHEMA.order.filter(n => SCHEMA.tables[n].module === mod).length;
    const row = document.createElement("div");
    row.className = "mod-filter" + (state.moduleEnabled[mod] ? "" : " disabled") + (state.activeModuleNav === mod ? " nav-active" : "");
    row.innerHTML = `<span class="dot" style="background:${modColor(mod)};color:${modColor(mod)}"></span><span class="name">${mod}</span><span class="count">${count}</span><button class="mod-nav-btn" title="Zoom to module, highlight it and show stats">${svgIcon("target",12)}</button>`;
    row.onclick = () => {
      state.moduleEnabled[mod] = !state.moduleEnabled[mod];
      row.classList.toggle("disabled", !state.moduleEnabled[mod]);
      applyFilters();
    };
    row.querySelector(".mod-nav-btn").onclick = (e) => {
      e.stopPropagation();
      navigateToModule(mod);
    };
    wrap.appendChild(row);
    if (state.activeModuleNav === mod){
      const panel = document.createElement("div");
      panel.className = "mod-stats-panel";
      panel.id = "modStatsPanel";
      panel.innerHTML = buildModuleStatsHTML(mod);
      wrap.appendChild(panel);
    }
  });
}

function computeModuleStats(mod){
  const tables = SCHEMA.order.filter(n => SCHEMA.tables[n].module === mod);
  let columnCount = 0, pkCount = 0, internalRel = 0, outboundRel = 0, inboundRel = 0;
  tables.forEach(n => {
    const t = SCHEMA.tables[n];
    columnCount += t.columns.length;
    pkCount += t.pk.length;
    t.fks.forEach(fk => {
      if (!SCHEMA.tables[fk.ref_table]) return;
      if (SCHEMA.tables[fk.ref_table].module === mod) internalRel++;
      else outboundRel++;
    });
  });
  SCHEMA.order.forEach(n => {
    if (SCHEMA.tables[n].module === mod) return;
    SCHEMA.tables[n].fks.forEach(fk => {
      if (SCHEMA.tables[fk.ref_table] && SCHEMA.tables[fk.ref_table].module === mod) inboundRel++;
    });
  });
  return { tableCount: tables.length, columnCount, pkCount, internalRel, outboundRel, inboundRel };
}

function buildModuleStatsHTML(mod){
  const s = computeModuleStats(mod);
  return `
    <div class="row"><span class="l">Tables</span><b>${s.tableCount}</b></div>
    <div class="row"><span class="l">Columns</span><b>${s.columnCount}</b></div>
    <div class="row"><span class="l">Primary keys</span><b>${s.pkCount}</b></div>
    <div class="row"><span class="l">Internal relations</span><b>${s.internalRel}</b></div>
    <div class="row"><span class="l">Outgoing to other modules</span><b>${s.outboundRel}</b></div>
    <div class="row"><span class="l">Incoming from other modules</span><b>${s.inboundRel}</b></div>
  `;
}

function navigateToModule(mod){
  if (state.view !== "erd") switchView("erd");
  if (state.activeModuleNav === mod){ clearModuleNav(); return; }
  state.activeModuleNav = mod;

  const b = state.groupBoxes[mod];
  if (b){
    const rect = canvasWrap.getBoundingClientRect();
    const zx = rect.width / (b.w + 140), zy = rect.height / (b.h + 140);
    state.zoom = Math.min(1.3, Math.max(0.3, Math.min(zx, zy)));
    state.panX = rect.width/2 - (b.x + b.w/2) * state.zoom;
    state.panY = rect.height/2 - (b.y + b.h/2) * state.zoom;
    applyTransform();
  }

  Object.keys(cardNodes).forEach(n => {
    const cardEl = cardNodes[n].fo.querySelector(".table-card");
    if (cardEl) cardEl.classList.toggle("focus-dim", SCHEMA.tables[n].module !== mod);
  });
  edgeNodes.forEach(e => {
    const relevant = SCHEMA.tables[e.data.from].module === mod || SCHEMA.tables[e.data.to].module === mod;
    e.pathBg.classList.toggle("focus-dim", !relevant);
    e.flow.classList.toggle("focus-dim", !relevant);
    e.pathBg.classList.toggle("focus-active", relevant);
    e.flow.classList.toggle("focus-active", relevant);
  });
  Object.entries(groupNodes).forEach(([m, gn]) => gn.rect.classList.toggle("group-pulse", m === mod));

  renderModuleFilters();
  renderBreadcrumbs();
}

function clearModuleNav(){
  state.activeModuleNav = null;
  Object.values(cardNodes).forEach(c => {
    const cardEl = c.fo.querySelector(".table-card");
    if (cardEl && !state.focusMode) cardEl.classList.remove("focus-dim");
  });
  if (!state.focusMode){
    edgeNodes.forEach(e => {
      e.pathBg.classList.remove("focus-dim", "focus-active");
      e.flow.classList.remove("focus-dim", "focus-active");
    });
  }
  Object.values(groupNodes).forEach(gn => gn.rect.classList.remove("group-pulse"));
  renderModuleFilters();
  renderBreadcrumbs();
}

/* ---- breadcrumbs ---- */
function renderBreadcrumbs(){
  const bar = document.getElementById("breadcrumbBar");
  if (!bar) return;
  const parts = [];
  parts.push({ label: "Atlas", crumb: "root" });
  if (state.view === "mapping"){
    parts.push({ label: "Mapping", crumb: "mapping", current: true });
  } else if (state.view === "deps"){
    parts.push({ label: "Deps", crumb: "deps", current: !state.depsRoot });
    if (state.depsRoot) parts.push({ label: state.depsRoot, crumb: "table", current: true });
  } else {
    if (state.activeModuleNav){
      parts.push({ label: state.activeModuleNav, crumb: "module", current: !state.selected });
    }
    if (state.selected){
      parts.push({ label: state.selected, crumb: "table", current: true });
    }
  }
  bar.innerHTML = parts.map((p, i) => {
    const sep = i > 0 ? `<span class="crumb-sep">›</span>` : "";
    return `${sep}<button class="crumb${p.current ? " current" : ""}" data-crumb="${p.crumb}">${p.label}</button>`;
  }).join("");
}
(function(){
  document.getElementById("breadcrumbBar").addEventListener("click", (e) => {
    const btn = e.target.closest(".crumb");
    if (!btn || btn.classList.contains("current")) return;
    const kind = btn.dataset.crumb;
    if (kind === "root"){
      if (state.view !== "erd") switchView("erd");
      if (state.selected) document.getElementById("detailsClose").click();
      if (state.activeModuleNav) clearModuleNav();
    } else if (kind === "module"){
      if (state.selected) document.getElementById("detailsClose").click();
    } else if (kind === "deps"){
      document.getElementById("depsChangeRoot").click();
    }
  });
})();

/* ---- quick filters ---- */
document.querySelectorAll("#quickFilters .chip").forEach(btn => {
  btn.onclick = () => {
    const kind = btn.dataset.quick;
    if (kind === "reset"){
      state.quick = { pk:false, fk:false, hideIsolated:false, datatype:"" };
      state.search = "";
      document.getElementById("searchInput").value = "";
      document.getElementById("datatypeFilter").value = "";
      SCHEMA.modules.forEach(m => state.moduleEnabled[m] = true);
      document.querySelectorAll("#quickFilters .chip").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".mod-filter").forEach(r => r.classList.remove("disabled"));
    } else {
      state.quick[kind] = !state.quick[kind];
      btn.classList.toggle("active", state.quick[kind]);
    }
    applyFilters();
  };
});

/* ---- table index list ---- */
function renderTableIndex(){
  const wrap = document.getElementById("tableIndex");
  wrap.innerHTML = "";
  SCHEMA.order.forEach(name => {
    const t = SCHEMA.tables[name];
    const row = document.createElement("div");
    row.className = "idx-row";
    row.dataset.table = name;
    row.innerHTML = `<span class="dot" style="background:${modColor(t.module)}"></span><span class="n">${name}</span>`;
    row.onclick = () => { openDetails(name); centerOnTable(name); };
    wrap.appendChild(row);
  });
  document.getElementById("tableIndexCount").textContent = `(${SCHEMA.order.length})`;
}
function updateTableIndexUI(){
  document.querySelectorAll("#tableIndex .idx-row").forEach(row => {
    const name = row.dataset.table;
    const visible = cardNodes[name] && cardNodes[name].g.style.display !== "none";
    row.classList.toggle("dimmed", !visible);
  });
}

/* ---- stats ---- */
function countCircularDependencies(){
  const graph = computeModuleGraph();
  const visited = {}, inStack = {};
  let cycles = 0;
  function dfs(node){
    visited[node] = true; inStack[node] = true;
    graph.parents[node].forEach(next => {
      if (inStack[next]) cycles++;
      else if (!visited[next]) dfs(next);
    });
    inStack[node] = false;
  }
  SCHEMA.modules.forEach(m => { if (!visited[m]) dfs(m); });
  return cycles;
}

function computeComplexityScore(tableCount, totalFk, avgCols, circular, unused){
  // heuristic 0-100 blend: relation density + column density + cycle/unused penalties
  const relDensity = tableCount ? Math.min(1, totalFk / (tableCount * 1.5)) : 0;
  const colDensity = Math.min(1, avgCols / 14);
  let score = (relDensity * 55) + (colDensity * 30);
  score += Math.min(15, circular * 6);
  score -= Math.min(10, unused * 1.2);
  return Math.max(1, Math.min(100, Math.round(score)));
}

/* ---- unified schema health indicator (green/yellow/red) ---- */
function computeSchemaHealth(tableCount, circular, unused, complexity){
  let score = 100;
  score -= Math.min(45, circular * 18);                                   // dependency cycles are the biggest red flag
  const unusedRatio = tableCount ? unused / tableCount : 0;
  score -= Math.min(30, unusedRatio * 100 * 0.6);                          // isolated / orphaned tables
  if (complexity > 80) score -= Math.min(20, (complexity - 80) * 1.2);     // over-dense schema is harder to maintain
  score = Math.max(0, Math.min(100, Math.round(score)));

  let level = "good", label = "Healthy schema";
  if (score < 55){ level = "bad"; label = "At risk"; }
  else if (score < 80){ level = "warn"; label = "Needs attention"; }

  const reasons = [];
  if (circular) reasons.push(`${circular} circular dependenc${circular === 1 ? "y" : "ies"}`);
  if (unused) reasons.push(`${unused} unused table${unused === 1 ? "" : "s"}`);
  if (complexity > 80) reasons.push("high relation density");
  const sub = reasons.length ? reasons.join(" · ") : "No cycles, no isolated tables";

  return { score, level, label, sub };
}

function renderSchemaHealth(health){
  const wrap = document.getElementById("schemaHealth");
  if (!wrap) return;
  wrap.className = `schema-health ${health.level}`;
  const R = 18, C = 2 * Math.PI * R;
  const offset = C * (1 - health.score / 100);
  wrap.innerHTML = `
    <div class="sh-ring">
      <svg viewBox="0 0 44 44">
        <circle class="sh-track" cx="22" cy="22" r="${R}"></circle>
        <circle class="sh-fill" cx="22" cy="22" r="${R}" stroke-dasharray="${C}" stroke-dashoffset="${offset}"></circle>
      </svg>
      <div class="sh-num">${health.score}</div>
    </div>
    <div class="sh-body">
      <div class="sh-label">${health.label}</div>
      <div class="sh-sub">${health.sub}</div>
    </div>`;
  wrap.title = `Schema health score: ${health.score}/100 — ${health.sub}`;
}

function updateStatsUI(){
  const tables = SCHEMA.order;
  let totalCols = 0, totalPk = 0, totalFk = 0, totalIdx = 0;
  let largest = { name: "—", count: 0 };
  let unusedCount = 0;
  tables.forEach(n => {
    const t = SCHEMA.tables[n];
    totalCols += t.columns.length;
    totalPk += t.pk.length;
    totalFk += t.fks.length;
    totalIdx += t.indexes.length + t.uniques.length;
    if (t.columns.length > largest.count) largest = { name: n, count: t.columns.length };
    if (!hasRelations(n)) unusedCount++;
  });
  const avgCols = tables.length ? (totalCols / tables.length) : 0;
  const circular = countCircularDependencies();
  const complexity = computeComplexityScore(tables.length, totalFk, avgCols, circular, unusedCount);
  renderSchemaHealth(computeSchemaHealth(tables.length, circular, unusedCount, complexity));

  const stats = [
    { num: tables.length, lbl: "Tables" },
    { num: totalCols, lbl: "Columns" },
    { num: totalPk, lbl: "Primary keys" },
    { num: totalFk, lbl: "Foreign keys" },
    { num: totalFk, lbl: "Relationships" },
    { num: totalIdx, lbl: "Indexes" },
    { num: 0, lbl: "Views" },
    { num: 0, lbl: "Triggers" },
    { num: 0, lbl: "Procedures" },
    { num: 0, lbl: "Functions" },
    { num: SCHEMA.modules.length, lbl: "Modules" },
    { num: avgCols.toFixed(1), lbl: "Avg cols / table" },
    { num: complexity, lbl: "Complexity score", title: `Heuristic 0–100 blend of relation density, average column count, ${circular} circular dependenc${circular===1?"y":"ies"} and ${unusedCount} unused table${unusedCount===1?"":"s"}.` },
    { num: circular, lbl: "Circular deps", title: circular ? "Module-level dependency cycles detected in the cross-module foreign keys." : "No module-level dependency cycles detected." },
    { num: unusedCount, lbl: "Unused tables", title: "Tables with no incoming or outgoing foreign keys." },
    { num: largest.name, lbl: `Largest table (${largest.count} cols)`, wide: true },
  ];
  const grid = document.getElementById("statGrid");
  grid.innerHTML = stats.map(s => `<div class="stat-card${s.wide ? " wide" : ""}" ${s.title ? `title="${s.title}"` : ""}><div class="num">${s.num}</div><div class="lbl">${s.lbl}</div></div>`).join("");
}

