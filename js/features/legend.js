/* ============================================================
   LEGEND
   ============================================================ */
function renderLegend(){
  const body = document.getElementById("legendBody");
  let html = `<div class="legend-row"><span class="ico" style="color:var(--pk-color)">${svgIcon("key",13)}</span> Primary key</div>
              <div class="legend-row"><span class="ico" style="color:var(--fk-color)">${svgIcon("link",13)}</span> Foreign key</div>
              <div class="legend-row"><span class="ico">${svgIcon("circle-dashed",12)}</span> Regular column</div>
              <div class="legend-row"><span class="badge-null" style="margin-left:0;">NULL</span> Nullable</div>
              <div style="height:1px;background:var(--panel-border);margin:2px 0;"></div>`;
  Object.keys(REL_COLORS).forEach(type => {
    html += `<div class="legend-row"><span class="legend-line" style="border-color:${relColor(type)}"></span> ${type} relationship</div>`;
  });
  html += `<div style="height:1px;background:var(--panel-border);margin:2px 0;"></div>`;
  SCHEMA.modules.forEach(mod => {
    html += `<div class="legend-row"><span class="legend-swatch" style="background:${modColor(mod)}"></span> ${mod}</div>`;
  });
  body.innerHTML = html;
}

document.getElementById("legendToggle").onclick = (e) => {
  const body = document.getElementById("legendBody");
  const collapsed = body.style.display === "none";
  body.style.display = collapsed ? "" : "none";
  e.target.textContent = collapsed ? "–" : "+";
};

