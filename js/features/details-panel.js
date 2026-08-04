/* ============================================================
   DETAILS PANEL
   ============================================================ */
const detailsPanel = document.getElementById("detailsPanel");

function sqlTypeUpper(t){ return t; }

function buildCreateTableSQL(name){
  const t = SCHEMA.tables[name];
  const lines = t.columns.map(c => {
    let l = `  \`${c.name}\` ${c.type}`;
    if (!c.nullable) l += " NOT NULL";
    if (c.auto_increment) l += " AUTO_INCREMENT";
    if (c.default) l += ` DEFAULT ${c.default}`;
    if (c.unique) l += " UNIQUE";
    return l;
  });
  if (t.pk.length) lines.push(`  PRIMARY KEY (${t.pk.map(c=>"`"+c+"`").join(", ")})`);
  t.uniques.forEach(u => lines.push(`  UNIQUE KEY (${u.map(c=>"`"+c+"`").join(", ")})`));
  t.fks.forEach(fk => lines.push(`  FOREIGN KEY (\`${fk.column}\`) REFERENCES \`${fk.ref_table}\`(\`${fk.ref_column}\`) ON DELETE ${fk.on_delete} ON UPDATE ${fk.on_update}`));
  t.indexes.forEach(ix => lines.push(`  ${ix.fulltext ? "FULLTEXT " : ""}INDEX (${ix.cols.map(c=>"`"+c+"`").join(", ")})`));
  return `CREATE TABLE \`${name}\` (\n${lines.join(",\n")}\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
}

function highlightSQL(sql){
  return sql
    .replace(/\b(CREATE TABLE|PRIMARY KEY|FOREIGN KEY|REFERENCES|UNIQUE KEY|INDEX|FULLTEXT|NOT NULL|DEFAULT|AUTO_INCREMENT|ON DELETE|ON UPDATE|ENGINE|DEFAULT CHARSET)\b/g, '<span class="kw">$1</span>')
    .replace(/`([a-zA-Z0-9_]+)`/g, '`<span class="tbl">$1</span>`');
}

function openDetails(name){
  state.selected = name;
  const t = SCHEMA.tables[name];
  if (state.activeModuleNav) clearModuleNav();

  Object.keys(cardNodes).forEach(n => cardNodes[n].fo.querySelector(".table-card").classList.toggle("selected", n === name));

  document.getElementById("detailsModule").textContent = t.module;
  document.getElementById("detailsModule").style.setProperty("--mod-color", modColor(t.module));
  document.getElementById("detailsTitle").textContent = name;
  detailsPanel.style.setProperty("--mod-color", modColor(t.module));

  // overview tab
  const inc = incomingRefs[name];
  document.getElementById("tab-overview").innerHTML = `
    <div class="dp-stat-row">
      <div class="dp-stat"><div class="n">${t.columns.length}</div><div class="l">Columns</div></div>
      <div class="dp-stat"><div class="n">${t.fks.length}</div><div class="l">Outgoing FK</div></div>
      <div class="dp-stat"><div class="n">${inc.length}</div><div class="l">Referenced by</div></div>
    </div>
    <div class="dp-field"><div class="lbl">Description</div><div class="val">${t.description || "No description provided in the migration comments."}</div></div>
    <div class="dp-field"><div class="lbl">Purpose</div><div class="val">Part of the <b>${t.module}</b> module. ${t.pk.length>1 ? "Composite primary key — likely a many-to-many join table." : "Uses a single-column primary key."}</div></div>
    <div class="dp-field"><div class="lbl">Primary key</div><div class="val">${t.pk.map(c=>`<code>${c}</code>`).join(", ") || "—"}</div></div>
    <div class="dp-field"><div class="lbl">Indexes &amp; uniques</div><div class="val">${t.indexes.length + t.uniques.length} defined</div></div>
  `;

  // columns tab
  document.getElementById("tab-columns").innerHTML = t.columns.map(c => {
    const isPk = t.pk.includes(c.name);
    const fk = t.fks.find(f => f.column === c.name);
    const cls = isPk ? "pk" : (fk ? "fk" : "");
    const ico = isPk ? svgIcon("key",13) : (fk ? svgIcon("link",13) : svgIcon("circle-dashed",12));
    return `<div class="dp-col-row ${cls}"><span class="ico">${ico}</span><span class="cname">${c.name}</span><span class="ctype">${c.type}${c.nullable?" · NULL":" · NOT NULL"}</span></div>`;
  }).join("");

  // relations tab
  let relHtml = "";
  relHtml += `<button class="btn ghost" id="btnOpenDepsGraph" style="width:100%;justify-content:center;margin-bottom:12px;">${svgIcon("layers",13)} View full dependency graph</button>`;
  relHtml += `<div class="dp-rel-group"><h4>Outgoing (${t.fks.length})</h4>`;
  if (t.fks.length){
    relHtml += t.fks.map(fk => `<div class="dp-rel-item" data-jump="${fk.ref_table}"><span>${fk.column}</span><span class="arrow">→</span><b>${fk.ref_table}</b><span class="rule">${fk.on_delete}</span></div>`).join("");
  } else relHtml += `<div class="val" style="color:var(--text-2);font-size:12px;">None</div>`;
  relHtml += `</div><div class="dp-rel-group"><h4>Referenced by (${inc.length})</h4>`;
  if (inc.length){
    relHtml += inc.map(r => `<div class="dp-rel-item" data-jump="${r.from}"><b>${r.from}</b><span class="arrow">→</span><span>${r.col}</span></div>`).join("");
  } else relHtml += `<div class="val" style="color:var(--text-2);font-size:12px;">None</div>`;
  relHtml += `</div>`;
  document.getElementById("tab-relations").innerHTML = relHtml;
  document.querySelectorAll(".dp-rel-item").forEach(item => {
    item.onclick = () => { const target = item.dataset.jump; openDetails(target); centerOnTable(target); };
  });
  const depsBtn = document.getElementById("btnOpenDepsGraph");
  if (depsBtn) depsBtn.onclick = () => openDependencyGraph(name);

  // sql tab
  const createSql = buildCreateTableSQL(name);
  document.getElementById("tab-sql").innerHTML = `
    <div class="sql-toolbar">
      <span class="sql-toolbar-label">CREATE TABLE definition</span>
      <button class="btn ghost sql-copy-btn" id="btnCopySql">${svgIcon("copy",12)} Copy SQL</button>
    </div>
    <pre class="sql-block">${highlightSQL(createSql)}</pre>
    <div class="dp-field" style="margin-top:18px;">
      <div class="lbl">Constraints &amp; indexes</div>
      ${buildConstraintsSummary(name)}
    </div>
    <div class="dp-field">
      <div class="lbl">Views · Triggers · Procedures</div>
      <div class="val" style="color:var(--text-2);font-size:12px;">Not present in this schema.</div>
    </div>
  `;
  document.getElementById("btnCopySql").onclick = () => {
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(createSql).then(
        () => toast("SQL copied to clipboard"),
        () => toast("Copy failed — select the text manually")
      );
    } else {
      toast("Clipboard unavailable — select the text manually");
    }
  };

  if (state.focusMode) applyFocusMode();

  detailsPanel.classList.add("open");
  renderBreadcrumbs();
}

function buildConstraintsSummary(name){
  const t = SCHEMA.tables[name];
  let html = "";
  if (t.pk.length) html += `<div class="dp-rel-item" style="cursor:default;"><b>PRIMARY KEY</b><span class="rule">${t.pk.join(", ")}</span></div>`;
  t.uniques.forEach(u => { html += `<div class="dp-rel-item" style="cursor:default;"><b>UNIQUE</b><span class="rule">${u.join(", ")}</span></div>`; });
  t.indexes.forEach(ix => { html += `<div class="dp-rel-item" style="cursor:default;"><b>${ix.fulltext ? "FULLTEXT " : ""}INDEX</b><span class="rule">${ix.cols.join(", ")}</span></div>`; });
  t.fks.forEach(fk => { html += `<div class="dp-rel-item" style="cursor:default;"><b>FOREIGN KEY</b><span class="rule">${fk.column} → ${fk.ref_table}.${fk.ref_column}</span></div>`; });
  if (!html) html = `<div class="val" style="color:var(--text-2);font-size:12px;">No constraints defined</div>`;
  return html;
}

document.getElementById("detailsClose").onclick = () => {
  detailsPanel.classList.remove("open");
  state.selected = null;
  Object.values(cardNodes).forEach(c => c.fo.querySelector(".table-card").classList.remove("selected"));
  clearFocusMode();
  renderBreadcrumbs();
};

document.querySelectorAll(".details-tabs .tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".details-tabs .tab").forEach(x => x.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(x => x.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
  };
});

