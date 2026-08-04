/* ============================================================
   EXPORT
   ============================================================ */
function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => t.classList.remove("show"), 2600);
}

function buildExportSVG(){
  const light = isLightTheme();
  const usingMap = state.view === "mapping";
  const bgColor = light ? "#f5f6fb" : "#07080d";
  const bounds = usingMap ? mapContentBounds() : contentBounds();
  const sourceSvg = usingMap ? mapSvgEl : svgEl;
  const clone = sourceSvg.cloneNode(true);
  clone.setAttribute("width", bounds.w);
  clone.setAttribute("height", bounds.h);
  clone.setAttribute("viewBox", `0 0 ${bounds.w} ${bounds.h}`);
  clone.style.background = bgColor;

  // inline a background rect
  const bg = document.createElementNS(svgNS, "rect");
  bg.setAttribute("x", 0); bg.setAttribute("y", 0);
  bg.setAttribute("width", bounds.w); bg.setAttribute("height", bounds.h);
  bg.setAttribute("fill", bgColor);
  clone.insertBefore(bg, clone.firstChild);

  // foreignObject HTML needs xmlns to render standalone
  clone.querySelectorAll("foreignObject > div").forEach(div => {
    div.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  });

  // hidden nodes: strip display:none elements so they don't linger in export
  clone.querySelectorAll('[style*="display: none"], [style*="display:none"]').forEach(n => n.remove());

  const styleTag = document.createElementNS(svgNS, "style");
  // Inline minimal CSS needed for card rendering in the exported (standalone) file —
  // it can't rely on style.css, so theme colors are duplicated here literally.
  styleTag.textContent = usingMap
    ? (light ? `
    * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
    .map-node{ border-radius:18px; background:linear-gradient(180deg,#ffffff,#f8f9fc); border:1.5px solid var(--mod-color); display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:6px; height:100%; }
    .mn-icon{ width:34px; height:34px; border-radius:10px; background:var(--mod-color-soft); color:var(--mod-color); display:flex; align-items:center; justify-content:center; }
    .mn-name{ font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:14px; color:#1a1d29; }
    .mn-sub{ font-size:10.5px; color:#6b7189; }
  ` : `
    * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
    .map-node{ border-radius:18px; background:linear-gradient(180deg,#1a1d2c,#10121c); border:1.5px solid var(--mod-color); display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:6px; height:100%; }
    .mn-icon{ width:34px; height:34px; border-radius:10px; background:var(--mod-color-soft); color:var(--mod-color); display:flex; align-items:center; justify-content:center; }
    .mn-name{ font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:14px; color:#f3f5fb; }
    .mn-sub{ font-size:10.5px; color:#6b7189; }
  `)
    : (light ? `
    * { box-sizing: border-box; font-family: 'JetBrains Mono', monospace; }
    .table-card{ border-radius:16px; background:linear-gradient(180deg,#ffffff,#f8f9fc); border:1px solid rgba(15,23,42,0.1); overflow:hidden; }
    .tc-head{ display:flex; align-items:center; gap:8px; height:50px; box-sizing:border-box; padding:0 12px; border-bottom:1px solid rgba(15,23,42,0.08); }
    .tc-icon{ width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;background:var(--mod-color-soft);color:var(--mod-color); }
    .tc-titles{ flex:1; min-width:0; }
    .tc-name{ font-size:12.5px; font-weight:700; color:#1a1d29; font-family:'JetBrains Mono',monospace; }
    .tc-module{ font-size:9.5px; color:var(--mod-color); text-transform:uppercase; }
    .tc-colcount{ font-size:10px; color:#6b7189; background:rgba(15,23,42,0.06); padding:2px 6px; border-radius:20px; }
    .tc-desc{ font-size:10.5px; color:#6b7189; height:38px; box-sizing:border-box; padding:7px 12px 0; line-height:1.4; overflow:hidden; }
    .tc-cols{ padding:6px 0 8px; }
    .tc-col{ display:flex; align-items:center; gap:6px; height:23px; box-sizing:border-box; padding:0 12px; font-size:11px; font-family:'JetBrains Mono',monospace; color:#1a1d29; }
    .tc-col .ctype{ color:#6b7189; font-size:9.5px; margin-left:auto; }
    .tc-col.is-pk .cname{ color:#b8860a; }
    .tc-col.is-fk .cname{ color:#1f7bbf; }
    .tc-more{ height:22px; box-sizing:border-box; padding:0 12px; display:flex; align-items:center; font-size:10px; color:#6b7189; font-style:italic; }
    .tc-foot{ display:flex; align-items:center; gap:10px; height:34px; box-sizing:border-box; padding:0 12px; border-top:1px solid rgba(15,23,42,0.08); font-size:9.5px; color:#6b7189; }
    .group-label{ font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:600; }
  ` : `
    * { box-sizing: border-box; font-family: 'JetBrains Mono', monospace; }
    .table-card{ border-radius:16px; background:linear-gradient(180deg,#1a1d2c,#10121c); border:1px solid rgba(255,255,255,0.08); overflow:hidden; }
    .tc-head{ display:flex; align-items:center; gap:8px; height:50px; box-sizing:border-box; padding:0 12px; border-bottom:1px solid rgba(255,255,255,0.08); }
    .tc-icon{ width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;background:var(--mod-color-soft);color:var(--mod-color); }
    .tc-titles{ flex:1; min-width:0; }
    .tc-name{ font-size:12.5px; font-weight:700; color:#f3f5fb; font-family:'JetBrains Mono',monospace; }
    .tc-module{ font-size:9.5px; color:var(--mod-color); text-transform:uppercase; }
    .tc-colcount{ font-size:10px; color:#6b7189; background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:20px; }
    .tc-desc{ font-size:10.5px; color:#6b7189; height:38px; box-sizing:border-box; padding:7px 12px 0; line-height:1.4; overflow:hidden; }
    .tc-cols{ padding:6px 0 8px; }
    .tc-col{ display:flex; align-items:center; gap:6px; height:23px; box-sizing:border-box; padding:0 12px; font-size:11px; font-family:'JetBrains Mono',monospace; color:#f3f5fb; }
    .tc-col .ctype{ color:#6b7189; font-size:9.5px; margin-left:auto; }
    .tc-col.is-pk .cname{ color:#ffd76a; }
    .tc-col.is-fk .cname{ color:#7fd0ff; }
    .tc-more{ height:22px; box-sizing:border-box; padding:0 12px; display:flex; align-items:center; font-size:10px; color:#6b7189; font-style:italic; }
    .tc-foot{ display:flex; align-items:center; gap:10px; height:34px; box-sizing:border-box; padding:0 12px; border-top:1px solid rgba(255,255,255,0.08); font-size:9.5px; color:#6b7189; }
    .group-label{ font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:600; }
  `);
  clone.insertBefore(styleTag, clone.firstChild);

  return { svgString: new XMLSerializer().serializeToString(clone), bounds, usingMap };
}

function downloadBlob(dataUrlOrBlobUrl, filename){
  const a = document.createElement("a");
  a.href = dataUrlOrBlobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function exportSVG(){
  const { svgString, usingMap } = buildExportSVG();
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  downloadBlob(url, usingMap ? "uip-database-mapping.svg" : "uip-database-atlas.svg");
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  toast("SVG exported");
}

function exportPNG(){
  const { svgString, bounds, usingMap } = buildExportSVG();
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = () => {
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = bounds.w * scale;
    canvas.height = bounds.h * scale;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = isLightTheme() ? "#f5f6fb" : "#07080d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, bounds.w, bounds.h);
    URL.revokeObjectURL(url);
    try {
      canvas.toBlob(blob => {
        if (!blob) { pngFallback(); return; }
        const pngUrl = URL.createObjectURL(blob);
        downloadBlob(pngUrl, usingMap ? "uip-database-mapping.png" : "uip-database-atlas.png");
        setTimeout(() => URL.revokeObjectURL(pngUrl), 3000);
        toast("PNG exported");
      });
    } catch (err) {
      // Chrome/Safari refuse to read pixels back from a canvas that has
      // painted an SVG containing <foreignObject> (our table cards are
      // HTML inside foreignObject for crisp text) — this is a browser
      // security restriction, not something inline-CSS/embedding can fix.
      pngFallback();
    }
  };
  img.onerror = () => pngFallback();
  img.src = url;

  function pngFallback(){
    toast("This browser blocks PNG rasterization of the diagram (rich HTML cards) — exporting SVG instead, which opens in any browser or image editor.");
    exportSVG();
  }
}

function exportPDF(){
  toast("Preparing print dialog — choose \"Save as PDF\"");
  setTimeout(() => window.print(), 300);
}

/* ---- text/data export formats: JSON, Mermaid, PlantUML, Draw.io ---- */
function downloadText(content, filename, mime){
  const blob = new Blob([content], { type: mime + ";charset=utf-8" });
  const url = URL.createObjectURL(blob);
  downloadBlob(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

function escapeXml(s){
  return String(s).replace(/[<>&'"]/g, c => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;", "'":"&apos;", '"':"&quot;" }[c]));
}

function exportJSON(){
  const data = {
    generated: new Date().toISOString(),
    modules: SCHEMA.modules,
    tables: SCHEMA.order.map(name => {
      const t = SCHEMA.tables[name];
      return {
        name, module: t.module, description: t.description || null,
        columns: t.columns, primaryKey: t.pk, foreignKeys: t.fks,
        indexes: t.indexes, uniques: t.uniques
      };
    })
  };
  downloadText(JSON.stringify(data, null, 2), "uip-database-atlas.json", "application/json");
  toast("JSON exported");
}

function exportMermaid(){
  let out = "erDiagram\n";
  SCHEMA.order.forEach(name => {
    SCHEMA.tables[name].fks.forEach(fk => {
      if (!SCHEMA.tables[fk.ref_table]) return;
      out += `    ${fk.ref_table} ||--o{ ${name} : "${fk.column}"\n`;
    });
  });
  SCHEMA.order.forEach(name => {
    const t = SCHEMA.tables[name];
    out += `    ${name} {\n`;
    t.columns.forEach(c => {
      const type = normalizeType(c.type).toLowerCase().replace(/[^a-z0-9_]/g, "") || "text";
      const isPk = t.pk.includes(c.name);
      const isFk = t.fks.some(f => f.column === c.name);
      const key = isPk ? " PK" : (isFk ? " FK" : "");
      out += `        ${type} ${c.name}${key}\n`;
    });
    out += `    }\n`;
  });
  downloadText(out, "uip-database-atlas.mmd", "text/plain");
  toast("Mermaid ERD exported (.mmd)");
}

function exportPlantUML(){
  let out = "@startuml\nhide circle\nskinparam linetype ortho\n\n";
  SCHEMA.order.forEach(name => {
    const t = SCHEMA.tables[name];
    out += `entity "${name}" as ${name} {\n`;
    const pkCols = t.columns.filter(c => t.pk.includes(c.name));
    const otherCols = t.columns.filter(c => !t.pk.includes(c.name));
    pkCols.forEach(c => { out += `  * ${c.name} : ${c.type} <<PK>>\n`; });
    if (pkCols.length && otherCols.length) out += "  --\n";
    otherCols.forEach(c => {
      const isFk = t.fks.some(f => f.column === c.name);
      out += `  ${c.nullable ? " " : "*"} ${c.name} : ${c.type}${isFk ? " <<FK>>" : ""}\n`;
    });
    out += "}\n\n";
  });
  SCHEMA.order.forEach(name => {
    SCHEMA.tables[name].fks.forEach(fk => {
      if (!SCHEMA.tables[fk.ref_table]) return;
      out += `${fk.ref_table} ||--o{ ${name} : "${fk.column}"\n`;
    });
  });
  out += "@enduml\n";
  downloadText(out, "uip-database-atlas.puml", "text/plain");
  toast("PlantUML exported (.puml)");
}

function exportDrawio(){
  const bounds = contentBounds();
  const idMap = {};
  let idCounter = 2;
  const cells = [];
  SCHEMA.order.forEach(name => {
    const t = SCHEMA.tables[name];
    const p = state.positions[name] || { x: 0, y: 0, w: CARD_W, h: 140 };
    const id = `t${idCounter++}`;
    idMap[name] = id;
    const colsText = t.columns.slice(0, 14).map(c => {
      const isPk = t.pk.includes(c.name);
      const isFk = t.fks.some(f => f.column === c.name);
      return `${isPk ? "PK " : isFk ? "FK " : ""}${c.name}: ${c.type}`;
    }).join("&#10;");
    const label = `${name}&#10;--------------------&#10;${colsText}`;
    cells.push(`<mxCell id="${id}" value="${escapeXml(label)}" style="rounded=1;whiteSpace=wrap;html=1;align=left;verticalAlign=top;spacingLeft=8;spacingTop=8;fillColor=#eef2ff;strokeColor=#7c9dff;fontFamily=Helvetica;fontSize=11;" vertex="1" parent="1"><mxGeometry x="${Math.round(p.x)}" y="${Math.round(p.y)}" width="${Math.round(p.w)}" height="${Math.round(p.h)}" as="geometry" /></mxCell>`);
  });
  let edgeCounter = 1;
  SCHEMA.order.forEach(name => {
    SCHEMA.tables[name].fks.forEach(fk => {
      if (!SCHEMA.tables[fk.ref_table] || !idMap[fk.ref_table]) return;
      const eid = `e${edgeCounter++}`;
      cells.push(`<mxCell id="${eid}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=block;strokeColor=#7c9dff;" edge="1" parent="1" source="${idMap[fk.ref_table]}" target="${idMap[name]}"><mxGeometry relative="1" as="geometry" /></mxCell>`);
    });
  });
  const xml = `<mxfile host="app.diagrams.net"><diagram name="ERD" id="erd1"><mxGraphModel dx="1000" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${Math.round(bounds.w+200)}" pageHeight="${Math.round(bounds.h+200)}" math="0" shadow="0"><root><mxCell id="0" /><mxCell id="1" parent="0" />${cells.join("")}</root></mxGraphModel></diagram></mxfile>`;
  downloadText(xml, "uip-database-atlas.drawio", "application/xml");
  toast("Draw.io file exported (.drawio)");
}

document.getElementById("btnExportMenu").onclick = (e) => {
  e.stopPropagation();
  document.getElementById("exportMenu").classList.toggle("open");
};
document.addEventListener("click", () => document.getElementById("exportMenu").classList.remove("open"));
document.querySelectorAll("#exportMenu button").forEach(btn => {
  btn.onclick = () => {
    const kind = btn.dataset.export;
    if (kind === "png") exportPNG();
    else if (kind === "svg") exportSVG();
    else if (kind === "pdf") exportPDF();
    else if (kind === "print") window.print();
    else if (kind === "json") exportJSON();
    else if (kind === "mermaid") exportMermaid();
    else if (kind === "plantuml") exportPlantUML();
    else if (kind === "drawio") exportDrawio();
    document.getElementById("exportMenu").classList.remove("open");
  };
});

