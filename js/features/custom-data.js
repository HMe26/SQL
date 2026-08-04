/* ============================================================
   CUSTOM DATA — add/import your own tables at runtime
   ------------------------------------------------------------
   This file is 100% self-contained on purpose: it never edits
   js/data/tables/*.js, js/data/schema-meta.js, or index.html's
   body markup. It only:
     1) reads/writes a small localStorage key,
     2) merges extra table definitions into the existing SCHEMA
        object at runtime (same shape the generated tables use),
     3) builds its own button + modal UI via JS and appends them
        to the page.
   Deleting this one file (and its <script>/<link> tags) removes
   the feature completely with zero side effects on the rest of
   the app.
   ============================================================ */

const CUSTOM_SCHEMA_KEY = "uip-custom-schema-v1";
let customTables = [];   // array of table-def objects, same shape as SCHEMA.tables[x]

/* ---------- persistence ---------- */
function loadCustomTables(){
  try {
    const raw = localStorage.getItem(CUSTOM_SCHEMA_KEY);
    customTables = raw ? JSON.parse(raw) : [];
  } catch (e) { customTables = []; }
}
function saveCustomTables(){
  try { localStorage.setItem(CUSTOM_SCHEMA_KEY, JSON.stringify(customTables)); }
  catch (e) { toast("Could not save to localStorage (storage full or blocked)"); }
}

/* ---------- merge into the live SCHEMA (additive, never mutates original tables) ---------- */
function customModuleHue(mod){
  let h = 0;
  for (let i = 0; i < mod.length; i++) h = (h * 31 + mod.charCodeAt(i)) % 360;
  return h;
}
function ensureModuleExists(mod, icon){
  if (!SCHEMA.modules.includes(mod)){
    SCHEMA.modules.push(mod);
    SCHEMA.moduleColors[mod] = { h: customModuleHue(mod) };
    SCHEMA.moduleIcons[mod] = icon || "database";
  }
  if (!(mod in state.moduleEnabled)) state.moduleEnabled[mod] = true;
}
// re-derives the shared `incomingRefs` lookup (owned by state-and-helpers.js)
// so newly-added FKs show up as "Referenced by" on their target tables too.
function rebuildIncomingRefsForCustomData(){
  Object.keys(incomingRefs).forEach(k => delete incomingRefs[k]);
  SCHEMA.order.forEach(n => incomingRefs[n] = []);
  SCHEMA.order.forEach(name => {
    SCHEMA.tables[name].fks.forEach(fk => {
      if (incomingRefs[fk.ref_table]){
        incomingRefs[fk.ref_table].push({ from: name, col: fk.column, refCol: fk.ref_column });
      }
    });
  });
}
function mergeCustomTables(){
  customTables.forEach(def => {
    ensureModuleExists(def.module, def.icon);
    SCHEMA.tables[def.name] = def;
    if (!SCHEMA.order.includes(def.name)) SCHEMA.order.push(def.name);
  });
  rebuildIncomingRefsForCustomData();
}
// merge immediately at script-load time (runs before main.js's init(), since
// scripts execute in document order) so refreshing the page keeps your data.
loadCustomTables();
mergeCustomTables();

// full refresh after the app has already booted (used when adding/deleting
// through the modal below, i.e. mid-session).
function refreshAfterCustomDataChange(focusName){
  computeLayout();
  renderAll();
  renderModuleFilters();
  renderTableIndex();
  renderLegend();
  populateDatatypeFilter();
  renderBreadcrumbs();
  if (focusName && state.positions[focusName]){
    requestAnimationFrame(() => { openDetails(focusName); centerOnTable(focusName); });
  }
}

function removeCustomTable(name){
  customTables = customTables.filter(t => t.name !== name);
  delete SCHEMA.tables[name];
  SCHEMA.order = SCHEMA.order.filter(n => n !== name);
  rebuildIncomingRefsForCustomData();
  saveCustomTables();
  if (state.selected === name){
    state.selected = null;
    detailsPanel.classList.remove("open");
  }
  refreshAfterCustomDataChange();
  toast(`"${name}" removed`);
}

function isCustomTable(name){ return customTables.some(t => t.name === name); }

/* ---------- validation / normalization for one incoming table def ---------- */
function normalizeIncomingTable(raw){
  if (!raw || typeof raw !== "object") throw new Error("Table definition must be an object");
  const name = (raw.name || "").trim();
  if (!name) throw new Error("Table is missing a name");
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) throw new Error(`"${name}": use letters, numbers, underscores only, and don't start with a number`);
  if (!Array.isArray(raw.columns) || !raw.columns.length) throw new Error(`"${name}": needs at least one column`);

  const columns = raw.columns.map(c => {
    if (!c || !c.name) throw new Error(`"${name}": every column needs a name`);
    return {
      name: String(c.name).trim(),
      type: String(c.type || "VARCHAR(255)").trim(),
      nullable: !!c.nullable,
      default: c.default != null ? String(c.default) : null,
      unique: !!c.unique,
    };
  });
  const colNames = new Set();
  columns.forEach(c => {
    if (colNames.has(c.name)) throw new Error(`"${name}": duplicate column "${c.name}"`);
    colNames.add(c.name);
  });

  const pk = Array.isArray(raw.pk) ? raw.pk.filter(c => colNames.has(c)) : [];
  const fks = Array.isArray(raw.fks) ? raw.fks.map(fk => {
    if (!fk.column || !colNames.has(fk.column)) throw new Error(`"${name}": FK references unknown local column "${fk.column}"`);
    if (!fk.ref_table) throw new Error(`"${name}": FK on "${fk.column}" is missing ref_table`);
    return {
      column: fk.column,
      ref_table: fk.ref_table,
      ref_column: fk.ref_column || "id",
      on_delete: fk.on_delete || "CASCADE",
      on_update: fk.on_update || "RESTRICT",
    };
  }) : [];
  const indexes = Array.isArray(raw.indexes) ? raw.indexes : [];
  const uniques = Array.isArray(raw.uniques) ? raw.uniques : [];

  return {
    name, columns, pk, fks, indexes, uniques,
    description: raw.description || "",
    module: (raw.module || "Custom / Imported").trim(),
    icon: raw.icon || "database",
    rowEstimate: (typeof raw.rowEstimate === "number") ? raw.rowEstimate : undefined,
  };
}

/* ---------- upsert a batch (used by both the form and the JSON importer) ---------- */
function upsertCustomTables(defs, { silent } = {}){
  const errors = [];
  const clean = [];
  defs.forEach(raw => {
    try { clean.push(normalizeIncomingTable(raw)); }
    catch (e) { errors.push(e.message); }
  });
  if (errors.length && !clean.length){
    return { ok: false, errors };
  }
  // soft-warn (not blocking) about FKs pointing at tables that don't exist
  // anywhere yet — could be a typo, or simply an ordering issue in the batch.
  const allNames = new Set([...SCHEMA.order, ...clean.map(c => c.name)]);
  const warnings = [];
  clean.forEach(def => {
    def.fks.forEach(fk => {
      if (!allNames.has(fk.ref_table)) warnings.push(`"${def.name}.${fk.column}" references unknown table "${fk.ref_table}" — the relationship line won't be drawn until that table exists.`);
    });
  });

  clean.forEach(def => {
    const idx = customTables.findIndex(t => t.name === def.name);
    if (idx >= 0) customTables[idx] = def; else customTables.push(def);
  });
  saveCustomTables();
  mergeCustomTables();
  if (!silent) refreshAfterCustomDataChange(clean.length === 1 ? clean[0].name : null);
  return { ok: true, added: clean.map(c => c.name), errors, warnings };
}

/* ============================================================
   UI — built entirely in JS, appended to the page
   ============================================================ */
const CD_ICON_CHOICES = ["database","table-2","file","file-text","layers","tags","bookmark","star","briefcase","flask-conical","brain-circuit","bell","calendar-clock","trophy","monitor","terminal","code","github"];
const CD_RULE_CHOICES = ["CASCADE","SET NULL","RESTRICT","NO ACTION"];

function cdInjectButton(){
  const actions = document.querySelector(".topbar-actions");
  const exportGroup = document.querySelector(".export-group");
  const btn = document.createElement("button");
  btn.className = "btn ghost";
  btn.id = "btnAddData";
  btn.title = "Add or import your own tables — no code editing needed";
  btn.innerHTML = `${svgIcon("database", 15)} Add Data`;
  actions.insertBefore(btn, exportGroup);
  btn.onclick = () => cdOpenModal();
}

function cdInjectModalShell(){
  const overlay = document.createElement("div");
  overlay.id = "cdModalOverlay";
  overlay.className = "cd-overlay";
  overlay.innerHTML = `
    <div class="cd-modal" role="dialog" aria-modal="true" aria-label="Add custom data">
      <div class="cd-head">
        <div class="cd-title">${svgIcon("database",16)} Add Data to the Diagram</div>
        <button class="cd-close" id="cdClose" aria-label="Close">${svgIcon("ban",15)}</button>
      </div>
      <div class="cd-tabs">
        <button class="cd-tab active" data-tab="form">New table (form)</button>
        <button class="cd-tab" data-tab="json">Bulk import (JSON)</button>
        <button class="cd-tab" data-tab="manage">My custom tables <span id="cdManageCount" class="cd-count"></span></button>
      </div>
      <div class="cd-body">
        <div class="cd-panel active" id="cdPanelForm"></div>
        <div class="cd-panel" id="cdPanelJson"></div>
        <div class="cd-panel" id="cdPanelManage"></div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (e) => { if (e.target === overlay) cdCloseModal(); });
  document.getElementById("cdClose").onclick = cdCloseModal;
  overlay.querySelectorAll(".cd-tab").forEach(tab => {
    tab.onclick = () => {
      overlay.querySelectorAll(".cd-tab").forEach(t => t.classList.remove("active"));
      overlay.querySelectorAll(".cd-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("cdPanel" + tab.dataset.tab[0].toUpperCase() + tab.dataset.tab.slice(1)).classList.add("active");
      if (tab.dataset.tab === "manage") cdRenderManageTab();
    };
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) cdCloseModal();
  });
}

function cdOpenModal(prefillName){
  document.getElementById("cdModalOverlay").classList.add("open");
  cdRenderFormTab(prefillName ? SCHEMA.tables[prefillName] : null);
  cdRenderJsonTab();
  cdRenderManageTab();
}
function cdCloseModal(){
  document.getElementById("cdModalOverlay").classList.remove("open");
}

/* ---------- Tab 1: form ---------- */
let cdFormCols = [];  // [{name,type,nullable,unique,pk}]
let cdFormFks = [];   // [{column,ref_table,ref_column,on_delete,on_update}]
let cdEditingOriginalName = null;

function cdBlankColumn(){ return { name: "", type: "VARCHAR(255)", nullable: false, unique: false, pk: false }; }

function cdRenderFormTab(existing){
  cdEditingOriginalName = existing ? existing.name : null;
  cdFormCols = existing ? existing.columns.map(c => ({ ...c, pk: existing.pk.includes(c.name) })) : [cdBlankColumn(), cdBlankColumn()];
  if (!existing){ cdFormCols[0].name = "id"; cdFormCols[0].type = "BIGINT UNSIGNED"; cdFormCols[0].pk = true; }
  cdFormFks = existing ? existing.fks.map(fk => ({ ...fk })) : [];

  const panel = document.getElementById("cdPanelForm");
  const moduleOptions = SCHEMA.modules.map(m => `<option value="${m}" ${existing && existing.module===m ? "selected":""}>${m}</option>`).join("");
  const iconOptions = CD_ICON_CHOICES.map(i => `<option value="${i}" ${existing && existing.icon===i ? "selected":""}>${i}</option>`).join("");

  panel.innerHTML = `
    ${existing ? `<div class="cd-editing-badge">Editing <b>${existing.name}</b> — saving will update it in place</div>` : ""}
    <div class="cd-grid2">
      <label class="cd-field"><span>Table name</span><input id="cdTableName" type="text" placeholder="e.g. mentorship_sessions" value="${existing ? existing.name : ""}" ${existing ? 'disabled title="Rename by deleting and re-adding"' : ""} /></label>
      <label class="cd-field"><span>Row estimate (optional)</span><input id="cdRowEstimate" type="number" min="0" placeholder="e.g. 5000" value="${existing && existing.rowEstimate!=null ? existing.rowEstimate : ""}" /></label>
    </div>
    <div class="cd-grid2">
      <label class="cd-field">
        <span>Module</span>
        <select id="cdModuleSelect">${moduleOptions}<option value="__new__">+ New module…</option></select>
      </label>
      <label class="cd-field" id="cdNewModuleWrap" style="display:none;"><span>New module name</span><input id="cdNewModule" type="text" placeholder="e.g. Mentorship" /></label>
      <label class="cd-field"><span>Icon</span><select id="cdIconSelect">${iconOptions}</select></label>
    </div>
    <label class="cd-field"><span>Description (optional)</span><textarea id="cdDescription" rows="2" placeholder="What is this table for?">${existing ? (existing.description||"") : ""}</textarea></label>

    <div class="cd-section-head"><span>Columns</span><button class="btn ghost sm" id="cdAddCol">+ Add column</button></div>
    <div class="cd-cols-editor" id="cdColsEditor"></div>

    <div class="cd-section-head"><span>Foreign keys (optional)</span><button class="btn ghost sm" id="cdAddFk">+ Add foreign key</button></div>
    <div class="cd-fks-editor" id="cdFksEditor"></div>

    <div class="cd-form-actions">
      <span class="cd-form-error" id="cdFormError"></span>
      <button class="btn primary" id="cdSubmitForm">${existing ? "Save changes" : "Add table to diagram"}</button>
    </div>
  `;

  document.getElementById("cdModuleSelect").onchange = (e) => {
    document.getElementById("cdNewModuleWrap").style.display = e.target.value === "__new__" ? "" : "none";
  };
  document.getElementById("cdAddCol").onclick = () => { cdFormCols.push(cdBlankColumn()); cdRenderColsEditor(); };
  document.getElementById("cdAddFk").onclick = () => {
    cdFormFks.push({ column: cdFormCols[0] ? cdFormCols[0].name : "", ref_table: SCHEMA.order[0] || "", ref_column: "id", on_delete: "CASCADE", on_update: "RESTRICT" });
    cdRenderFksEditor();
  };
  document.getElementById("cdSubmitForm").onclick = cdSubmitForm;

  cdRenderColsEditor();
  cdRenderFksEditor();
}

function cdRenderColsEditor(){
  const wrap = document.getElementById("cdColsEditor");
  wrap.innerHTML = cdFormCols.map((c, i) => `
    <div class="cd-col-row" data-i="${i}">
      <input class="cd-col-name" type="text" placeholder="column_name" value="${c.name}" />
      <input class="cd-col-type" type="text" placeholder="VARCHAR(255)" value="${c.type}" />
      <label class="cd-chk" title="Nullable"><input type="checkbox" class="cd-col-null" ${c.nullable ? "checked":""}/> NULL</label>
      <label class="cd-chk" title="Unique"><input type="checkbox" class="cd-col-unique" ${c.unique ? "checked":""}/> UQ</label>
      <label class="cd-chk" title="Primary key"><input type="checkbox" class="cd-col-pk" ${c.pk ? "checked":""}/> PK</label>
      <button class="cd-row-del" title="Remove column" ${cdFormCols.length<=1?"disabled":""}>${svgIcon("ban",12)}</button>
    </div>`).join("");
  wrap.querySelectorAll(".cd-col-row").forEach(row => {
    const i = +row.dataset.i;
    row.querySelector(".cd-col-name").oninput = (e) => { cdFormCols[i].name = e.target.value; cdRefreshFkColumnOptions(); };
    row.querySelector(".cd-col-type").oninput = (e) => { cdFormCols[i].type = e.target.value; };
    row.querySelector(".cd-col-null").onchange = (e) => { cdFormCols[i].nullable = e.target.checked; };
    row.querySelector(".cd-col-unique").onchange = (e) => { cdFormCols[i].unique = e.target.checked; };
    row.querySelector(".cd-col-pk").onchange = (e) => { cdFormCols[i].pk = e.target.checked; };
    row.querySelector(".cd-row-del").onclick = () => { cdFormCols.splice(i,1); cdRenderColsEditor(); cdRenderFksEditor(); };
  });
}

function cdRenderFksEditor(){
  const wrap = document.getElementById("cdFksEditor");
  if (!cdFormFks.length){ wrap.innerHTML = `<div class="cd-empty-hint">No foreign keys yet — add one if this table links to another.</div>`; return; }
  const colOptions = cdFormCols.filter(c=>c.name).map(c => `<option value="${c.name}">${c.name}</option>`).join("");
  const tableOptions = SCHEMA.order.map(n => `<option value="${n}">${n}</option>`).join("");
  wrap.innerHTML = cdFormFks.map((fk, i) => `
    <div class="cd-fk-row" data-i="${i}">
      <select class="cd-fk-col">${colOptions}</select>
      <span class="cd-fk-arrow">→</span>
      <select class="cd-fk-reftable">${tableOptions}</select>
      <select class="cd-fk-refcol"></select>
      <select class="cd-fk-ondelete" title="ON DELETE">${CD_RULE_CHOICES.map(r=>`<option ${r===fk.on_delete?"selected":""}>${r}</option>`).join("")}</select>
      <button class="cd-row-del" title="Remove">${svgIcon("ban",12)}</button>
    </div>`).join("");
  wrap.querySelectorAll(".cd-fk-row").forEach(row => {
    const i = +row.dataset.i;
    const colSel = row.querySelector(".cd-fk-col"), tblSel = row.querySelector(".cd-fk-reftable"), refColSel = row.querySelector(".cd-fk-refcol"), delSel = row.querySelector(".cd-fk-ondelete");
    colSel.value = cdFormFks[i].column; tblSel.value = cdFormFks[i].ref_table;
    const fillRefCols = () => {
      const refTable = SCHEMA.tables[tblSel.value];
      const cols = refTable ? refTable.columns.map(c => c.name) : ["id"];
      refColSel.innerHTML = cols.map(c => `<option value="${c}" ${c===cdFormFks[i].ref_column?"selected":""}>${c}</option>`).join("");
    };
    fillRefCols();
    colSel.onchange = () => { cdFormFks[i].column = colSel.value; };
    tblSel.onchange = () => { cdFormFks[i].ref_table = tblSel.value; fillRefCols(); cdFormFks[i].ref_column = refColSel.value; };
    refColSel.onchange = () => { cdFormFks[i].ref_column = refColSel.value; };
    delSel.onchange = () => { cdFormFks[i].on_delete = delSel.value; };
    row.querySelector(".cd-row-del").onclick = () => { cdFormFks.splice(i,1); cdRenderFksEditor(); };
  });
}
function cdRefreshFkColumnOptions(){ cdRenderFksEditor(); }

function cdSubmitForm(){
  const errEl = document.getElementById("cdFormError");
  errEl.textContent = "";
  const nameInput = document.getElementById("cdTableName");
  const name = cdEditingOriginalName || nameInput.value.trim();
  let moduleSel = document.getElementById("cdModuleSelect").value;
  if (moduleSel === "__new__") moduleSel = document.getElementById("cdNewModule").value.trim();

  if (!cdEditingOriginalName && SCHEMA.tables[name]){
    errEl.textContent = `A table named "${name}" already exists.`;
    return;
  }
  if (!moduleSel){
    errEl.textContent = "Pick a module, or type a new module name.";
    return;
  }

  const def = {
    name,
    module: moduleSel,
    icon: document.getElementById("cdIconSelect").value,
    description: document.getElementById("cdDescription").value.trim(),
    rowEstimate: document.getElementById("cdRowEstimate").value ? Number(document.getElementById("cdRowEstimate").value) : undefined,
    columns: cdFormCols.filter(c => c.name.trim()).map(c => ({ name: c.name.trim(), type: c.type.trim() || "VARCHAR(255)", nullable: c.nullable, default: null, unique: c.unique })),
    pk: cdFormCols.filter(c => c.pk && c.name.trim()).map(c => c.name.trim()),
    fks: cdFormFks.filter(fk => fk.column && fk.ref_table),
    indexes: [], uniques: [],
  };

  const result = upsertCustomTables([def]);
  if (!result.ok){ errEl.textContent = result.errors.join(" · "); return; }
  result.warnings.forEach(w => toast(w));
  toast(cdEditingOriginalName ? `"${name}" updated` : `"${name}" added to the diagram`);
  cdCloseModal();
}

/* ---------- Tab 2: bulk JSON import ---------- */
function cdRenderJsonTab(){
  const panel = document.getElementById("cdPanelJson");
  panel.innerHTML = `
    <p class="cd-hint">
      Paste one table object or a JSON array of tables — same shape used internally by the app.
      Unknown fields are ignored; missing optional fields default sensibly (module → "Custom / Imported", nullable → false, pk/fks/indexes → []).
    </p>
    <details class="cd-example">
      <summary>Show expected format</summary>
      <pre>${cdExampleJSON()}</pre>
    </details>
    <textarea id="cdJsonInput" class="cd-json-input" placeholder="Paste JSON here…" spellcheck="false"></textarea>
    <div class="cd-form-actions">
      <span class="cd-form-error" id="cdJsonError"></span>
      <button class="btn ghost sm" id="cdJsonFilePick">Load from .json file</button>
      <input type="file" id="cdJsonFile" accept="application/json" style="display:none;" />
      <button class="btn primary" id="cdJsonSubmit">Import</button>
    </div>
  `;
  document.getElementById("cdJsonSubmit").onclick = cdSubmitJson;
  document.getElementById("cdJsonFilePick").onclick = () => document.getElementById("cdJsonFile").click();
  document.getElementById("cdJsonFile").onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { document.getElementById("cdJsonInput").value = reader.result; };
    reader.readAsText(file);
  };
}
function cdExampleJSON(){
  return JSON.stringify([{
    name: "mentorship_sessions",
    module: "Mentorship",
    icon: "calendar-clock",
    description: "One row per 1:1 mentor/student session.",
    rowEstimate: 1200,
    columns: [
      { name: "id", type: "BIGINT UNSIGNED", nullable: false, unique: false },
      { name: "mentor_id", type: "BIGINT UNSIGNED", nullable: false },
      { name: "student_id", type: "BIGINT UNSIGNED", nullable: false },
      { name: "scheduled_at", type: "DATETIME", nullable: false },
      { name: "notes", type: "TEXT", nullable: true },
    ],
    pk: ["id"],
    fks: [
      { column: "mentor_id", ref_table: "users", ref_column: "id", on_delete: "CASCADE", on_update: "RESTRICT" },
      { column: "student_id", ref_table: "users", ref_column: "id", on_delete: "CASCADE", on_update: "RESTRICT" }
    ]
  }], null, 2);
}
function cdSubmitJson(){
  const errEl = document.getElementById("cdJsonError");
  errEl.textContent = "";
  const raw = document.getElementById("cdJsonInput").value.trim();
  if (!raw){ errEl.textContent = "Paste some JSON first."; return; }
  let parsed;
  try { parsed = JSON.parse(raw); }
  catch (e) { errEl.textContent = "Invalid JSON: " + e.message; return; }
  const defs = Array.isArray(parsed) ? parsed : [parsed];
  const result = upsertCustomTables(defs);
  if (!result.ok){ errEl.textContent = result.errors.join(" · "); return; }
  if (result.errors.length) toast(`Imported ${result.added.length} table(s), skipped ${result.errors.length}: ${result.errors.join(" · ")}`);
  else toast(`Imported ${result.added.length} table(s): ${result.added.join(", ")}`);
  result.warnings.forEach(w => toast(w));
  cdCloseModal();
}

/* ---------- Tab 3: manage ---------- */
function cdRenderManageTab(){
  const panel = document.getElementById("cdPanelManage");
  document.getElementById("cdManageCount").textContent = customTables.length ? `(${customTables.length})` : "";
  if (!customTables.length){
    panel.innerHTML = `<div class="cd-empty-hint">You haven't added any custom tables yet — use the "New table (form)" or "Bulk import (JSON)" tab.</div>`;
    return;
  }
  panel.innerHTML = `
    <div class="cd-manage-list">
      ${customTables.map(t => `
        <div class="cd-manage-row" data-name="${t.name}">
          <span class="dot" style="background:${modColor(t.module)}"></span>
          <span class="cd-manage-name">${t.name}</span>
          <span class="cd-manage-meta">${t.module} · ${t.columns.length} cols · ${t.fks.length} FK</span>
          <button class="btn ghost sm cd-manage-edit">Edit</button>
          <button class="btn ghost sm cd-manage-del">Delete</button>
        </div>`).join("")}
    </div>
    <div class="cd-form-actions">
      <button class="btn ghost sm" id="cdExportCustom">Export all as JSON</button>
      <button class="btn ghost sm cd-danger" id="cdClearCustom">Delete all custom tables</button>
    </div>
  `;
  panel.querySelectorAll(".cd-manage-edit").forEach(b => {
    b.onclick = () => {
      const name = b.closest(".cd-manage-row").dataset.name;
      document.querySelector('.cd-tab[data-tab="form"]').click();
      cdRenderFormTab(SCHEMA.tables[name]);
    };
  });
  panel.querySelectorAll(".cd-manage-del").forEach(b => {
    b.onclick = () => {
      const name = b.closest(".cd-manage-row").dataset.name;
      if (confirm(`Delete "${name}"? This only removes it from the diagram — nothing in your real database is touched.`)) removeCustomTable(name);
      cdRenderManageTab();
    };
  });
  document.getElementById("cdExportCustom").onclick = () => {
    const blob = new Blob([JSON.stringify(customTables, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "custom-tables.json"; a.click();
    URL.revokeObjectURL(url);
  };
  document.getElementById("cdClearCustom").onclick = () => {
    if (!confirm("Delete ALL custom tables from the diagram? This can't be undone (but you can re-import a JSON export).")) return;
    customTables.slice().forEach(t => removeCustomTable(t.name));
  };
}

/* ---------- boot the UI once the DOM exists ---------- */
document.addEventListener("DOMContentLoaded", () => {
  cdInjectButton();
  cdInjectModalShell();
});
