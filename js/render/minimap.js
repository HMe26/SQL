/* ============================================================
   MINIMAP
   ============================================================ */
function renderMinimap(){
  const svg = document.getElementById("minimapSvg");
  svg.innerHTML = "";
  const bounds = contentBounds();
  const pad = 6;
  const vw = 220, vh = 150;
  const scale = Math.min((vw - pad*2) / bounds.w, (vh - pad*2) / bounds.h);
  const g = el("g", { transform: `translate(${pad},${pad}) scale(${scale})` }, svg);

  SCHEMA.modules.forEach(mod => {
    const b = state.groupBoxes[mod];
    el("rect", { x: b.x, y: b.y, width: b.w, height: b.h, rx: 6, fill: `hsla(${hue(mod)},85%,60%,0.07)`, stroke: `hsla(${hue(mod)},85%,65%,0.3)` , "stroke-width": 1.5/scale }, g);
  });
  SCHEMA.order.forEach(name => {
    const p = state.positions[name];
    const t = SCHEMA.tables[name];
    el("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: 3, class:"mm-node", fill: modColor(t.module) }, g);
  });

  const vpRect = el("rect", { id: "mmViewport", class:"mm-viewport", rx: 3 }, g);
  svg.dataset.scale = scale; svg.dataset.pad = pad;
  renderMinimapViewport();

  svg.onclick = (e) => {
    const rect = svg.getBoundingClientRect();
    const mx = (e.clientX - rect.left - pad) / scale;
    const my = (e.clientY - rect.top - pad) / scale;
    const wrapRect = canvasWrap.getBoundingClientRect();
    state.panX = wrapRect.width/2 - mx * state.zoom;
    state.panY = wrapRect.height/2 - my * state.zoom;
    applyTransform();
  };
}

function renderMinimapViewport(){
  const svg = document.getElementById("minimapSvg");
  const vp = svg.querySelector("#mmViewport");
  if (!vp) return;
  const scale = parseFloat(svg.dataset.scale || "1");
  const wrapRect = canvasWrap.getBoundingClientRect();
  const worldX = -state.panX / state.zoom;
  const worldY = -state.panY / state.zoom;
  const worldW = wrapRect.width / state.zoom;
  const worldH = wrapRect.height / state.zoom;
  vp.setAttribute("x", worldX);
  vp.setAttribute("y", worldY);
  vp.setAttribute("width", worldW);
  vp.setAttribute("height", worldH);
  vp.setAttribute("stroke-width", 2/scale);
}

