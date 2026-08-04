/* ============================================================
   UIP Database Atlas — interactive ERD engine
   Vanilla JS. No frameworks. Consumes SCHEMA from schema-data.js
   ============================================================ */

// ---------- Early theme detection (avoids flash of wrong theme) ----------
(function initEarlyTheme(){
  try {
    const saved = localStorage.getItem("uip-theme");
    const theme = (saved === "light" || saved === "dark")
      ? saved
      : ((window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();

// ---------- Icon library (minimal hand-drawn stroke icons) ----------
const ICON_PATHS = {
  "user": ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z","M4 20c1.2-3.6 4-5.5 8-5.5s6.8 1.9 8 5.5"],
  "user-check": ["M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z","M3 20c1-3.4 3.6-5.2 6-5.4","M15 15l2.4 2.4L22 12.6"],
  "shield": ["M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"],
  "shield-alert": ["M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z","M12 8v4","M12 15.2h.01"],
  "key": ["M15 7a4 4 0 1 1-4 4","M11 11 3 19v2h2l1-1h2v-2h2l1.5-1.5"],
  "key-round": ["M16.5 9.5a4 4 0 1 1-4-4","M12.5 5.5 4 14v3.5h3.5L12 13"],
  "link": ["M9 15l6-6","M8 12 5.5 14.5a3 3 0 0 0 4 4L12 16","M16 12l2.5-2.5a3 3 0 0 0-4-4L12 8"],
  "graduation-cap": ["M2 9 12 4l10 5-10 5-10-5Z","M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5","M22 9v6"],
  "landmark": ["M3 21h18","M5 21V9M9 21V9M15 21V9M19 21V9","M2 9l10-6 10 6"],
  "building-2": ["M4 21V6l7-3 7 3v15","M8 9h1M8 13h1M8 17h1M15 9h1M15 13h1M15 17h1","M4 21h16"],
  "flask-conical": ["M9 3h6","M10 3v6l-5.5 9a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9V3"],
  "line-chart": ["M4 4v16h16","M6 15l4-4 3 3 5-6"],
  "trending-up": ["M3 16l6-6 4 4 8-9","M15 5h6v6"],
  "layout-grid": ["M4 4h6v6H4z","M14 4h6v6h-6z","M4 14h6v6H4z","M14 14h6v6h-6z"],
  "layout-dashboard": ["M4 4h7v6H4z","M13 4h7v10h-7z","M4 12h7v8H4z","M13 16h7v4h-7z"],
  "file": ["M6 2h9l4 4v16H6z","M15 2v5h4"],
  "file-text": ["M6 2h9l4 4v16H6z","M15 2v5h4","M9 12h6M9 16h6"],
  "file-cog": ["M6 2h9l4 4v16H6z","M15 2v5h4","M12 12v1M12 18v1M9.2 13.5l.9.5M14.9 17l.9.5M9.2 18.5l.9-.5M14.9 15l.9-.5"],
  "file-lock": ["M6 2h9l4 4v16H6z","M15 2v5h4","M9.5 14h5v4h-5z","M10.3 14v-1.5a1.7 1.7 0 0 1 3.4 0V14"],
  "check-circle": ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z","M8 12l2.5 2.5L16 9"],
  "brain-circuit": ["M9 4.5a2.5 2.5 0 0 0-2.5 2.5v.4A2.6 2.6 0 0 0 5 9.8v.6a2.6 2.6 0 0 0 1 5v.3A2.5 2.5 0 0 0 8.5 18","M9 4.5c1 0 1.8.4 2.4 1M9 18c1 0 1.8-.4 2.4-1M9 4.5v13.5","M15 9.8h3M15 15.4h3"],
  "gauge": ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z","M12 12 16 8","M12 12v.01"],
  "tags": ["M4 4h6l10 10-6 6L4 10z","M8 8h.01"],
  "rocket": ["M14.5 9.5c1.5-1.5 2-5.5 2-5.5s-4 .5-5.5 2c-1.2 1.2-3.7 4.8-4.5 6.5l1.5 1.5c1.7-.8 5.3-3.3 6.5-4.5Z","M9 15l-3 3M6 18l-2.5 1L5 16.5","M8.5 8.5c-2 0-4 1-5.5 3"],
  "lightbulb": ["M9 18h6","M10 21h4","M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3Z"],
  "briefcase": ["M3 8h18v11H3z","M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2","M3 13h18"],
  "bell": ["M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z","M10 18a2 2 0 0 0 4 0"],
  "bell-ring": ["M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z","M10 18a2 2 0 0 0 4 0","M3 6l-1-1M21 6l1-1"],
  "messages-square": ["M4 5h13v9H8l-4 4z","M20 9v9h-4l-4 4v-4"],
  "message-circle": ["M12 20a8 8 0 1 0-6.5-3.3L4 20l3.5-1.2A8 8 0 0 0 12 20Z"],
  "bar-chart-2": ["M6 20V10M12 20V4M18 20v-7"],
  "activity": ["M3 12h4l2.5 7L14 5l2.5 7H21"],
  "history": ["M3 12a9 9 0 1 0 3-6.7","M3 5v5h5","M12 8v4l3 2"],
  "settings": ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z","M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 2.5h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21.5h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z"],
  "badge-check": ["M12 2 14.5 4.5 18 4l.5 3.5L22 9l-1.7 3 1.7 3-3.5 1.5-.5 3.5-3.5-.5L12 22l-2.5-2.5-3.5.5-.5-3.5L2 15l1.7-3L2 9l3.5-1.5L6 4l3.5.5Z","M8.5 12l2.3 2.3L16 9"],
  "github": ["M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2-.2 4-1 4-4.5a3.6 3.6 0 0 0-1-2.5 3.3 3.3 0 0 0-.1-2.5s-.9-.3-2.9 1a10 10 0 0 0-5 0c-2-1.3-2.9-1-2.9-1a3.3 3.3 0 0 0-.1 2.5A3.6 3.6 0 0 0 5.5 12c0 3.4 2 4.3 4 4.5-.4.4-.6 1-.5 2V21"],
  "scroll": ["M8 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11v14H8a2 2 0 0 0-2 2 2 2 0 0 0 2 2h11","M12 7h4M12 11h4"],
  "send": ["M22 2 11 13","M22 2 15 22l-4-9-9-4 20-7Z"],
  "trophy": ["M8 4h8v5a4 4 0 0 1-8 0V4Z","M8 6H5a2 2 0 0 0 3 4","M16 6h3a2 2 0 0 1-3 4","M10 15v3h4v-3","M8 21h8"],
  "code": ["M9 8 4.5 12 9 16","M15 8l4.5 4-4.5 4"],
  "mail-check": ["M4 5h13v11H4z","M4 5l6.5 5L17 5","M16 18l2 2 4-4"],
  "bookmark": ["M6 3h10v18l-5-3.5L6 21Z"],
  "star": ["M12 2.5l2.9 6 6.6.7-4.9 4.6 1.3 6.5L12 17l-5.9 3.3 1.3-6.5-4.9-4.6 6.6-.7Z"],
  "calendar-clock": ["M4 7h14v13H4z","M4 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2","M8 3v3M14 3v3","M15 16a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z","M15 12.5v1.3l.9.5"],
  "terminal": ["M4 5h16v14H4z","M7 9l3 3-3 3","M13 15h4"],
  "ban": ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z","M6 6l12 12"],
  "siren": ["M5 12a7 7 0 0 1 14 0v6H5Z","M12 2v3","M4 12H2M22 12h-2","M5.6 5.6 4.2 4.2M18.4 5.6l1.4-1.4","M4 21h16"],
  "list": ["M8 6h12M8 12h12M8 18h12","M4 6h.01M4 12h.01M4 18h.01"],
  "list-tree": ["M5 4v14a1 1 0 0 0 1 1h5","M5 10h6","M12 18h7","M12 6h7"],
  "monitor": ["M3 5h18v11H3z","M8 20h8M12 16v4"],
  "bug": ["M9 8h6M4 12h3M17 12h3M6 16l-2 2M18 16l2 2M6 6 4.5 4.5M18 6l1.5-1.5","M9.5 6.5h5a2.5 2.5 0 0 1 2.5 2.5v6a4 4 0 0 1-8 0V9a2.5 2.5 0 0 1 2.5-2.5Z"],
  "filter": ["M4 4h16l-6 8v6l-4 2v-8Z"],
  "download": ["M12 3v12","M7 11l5 5 5-5","M4 20h16"],
  "database": ["M12 5c4.4 0 8-1.1 8-2.5S16.4 0 12 0 4 1.1 4 2.5 7.6 5 12 5Z","M4 2.5V19c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V2.5","M4 10.8c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5"],
  "table-2": ["M3 4h18v16H3z","M3 10h18M9 4v16"],
  "circle-dashed": ["M12 3a9 9 0 1 0 9 9"],
  "sun": ["M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4 4.2 19.8M19.8 4.2l-1.4 1.4","M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"],
  "moon": ["M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"],
  "target": ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z","M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z","M12 12.9a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Z"],
  "copy": ["M8 8h11v11H8z","M5 5h11v3H8v8H5z"],
};

function svgIcon(name, size){
  size = size || 14;
  const paths = ICON_PATHS[name] || ICON_PATHS["table-2"];
  const inner = paths.map(d => `<path d="${d}"/>`).join("");
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

// ---------- Theme ----------
const THEME_KEY = "uip-theme";
function isLightTheme(){ return document.documentElement.getAttribute("data-theme") === "light"; }

// ---------- Module color helpers (theme-aware) ----------
function hue(mod){ return (SCHEMA.moduleColors[mod] && SCHEMA.moduleColors[mod].h) || 220; }
function modColor(mod, alpha){
  const h = hue(mod);
  if (isLightTheme()) return `hsla(${h}, 72%, 40%, ${alpha==null?1:alpha})`;
  return `hsla(${h}, 90%, 68%, ${alpha==null?1:alpha})`;
}
function modColorSoft(mod){
  const h = hue(mod);
  if (isLightTheme()) return `hsla(${h}, 75%, 55%, 0.16)`;
  return `hsla(${h}, 85%, 60%, 0.16)`;
}

// relationship type colors (theme-aware)
const REL_COLORS_DARK  = { "1:1": "#8ffcd6", "N:1": "#7c9dff", "N:M": "#ffb454" };
const REL_COLORS_LIGHT = { "1:1": "#0f9d68", "N:1": "#3b63f0", "N:M": "#c9720a" };
const REL_COLORS = REL_COLORS_DARK; // kept for the set of relationship types (legend iteration)
function relColor(type){ return (isLightTheme() ? REL_COLORS_LIGHT : REL_COLORS_DARK)[type]; }

// ---------- Global state ----------
const state = {
  positions: {},        // name -> {x,y,w,h}
  groupBoxes: {},        // module -> {x,y,w,h}
  zoom: 1,
  panX: 80,
  panY: 40,
  selected: null,
  hoverEdge: null,
  search: "",
  moduleEnabled: {},     // module -> bool
  quick: { pk:false, fk:false, hideIsolated:false },
  dragging: null,
  edgesByTable: {},      // table -> [edgeIndex,...]
  edges: [],             // {from,to,fromCol,toCol,onDelete,onUpdate,type,path elements ref}
  focusMode: false,       // Smart Focus Mode toggle
  searchMatchIndex: -1,   // for Ctrl+G cycling through search matches
};

SCHEMA.modules.forEach(m => state.moduleEnabled[m] = true);

// incoming refs map: table -> [{from, col, refCol}]
const incomingRefs = {};
SCHEMA.order.forEach(n => incomingRefs[n] = []);
SCHEMA.order.forEach(name => {
  const t = SCHEMA.tables[name];
  t.fks.forEach(fk => {
    if (incomingRefs[fk.ref_table]) {
      incomingRefs[fk.ref_table].push({ from: name, col: fk.column, refCol: fk.ref_column });
    }
  });
});

function relType(table, fk){
  const t = SCHEMA.tables[table];
  const col = t.columns.find(c => c.name === fk.column);
  const isSingleUnique = (col && col.unique) || (t.pk.length === 1 && t.pk[0] === fk.column);
  const isCompositePk = t.pk.includes(fk.column) && t.pk.length > 1;
  if (isSingleUnique) return "1:1";
  if (isCompositePk) return "N:M";
  return "N:1";
}

function hasRelations(name){
  return SCHEMA.tables[name].fks.length > 0 || incomingRefs[name].length > 0;
}

/* ============================================================
   LAYOUT
   ============================================================ */
const CARD_W = 252;
const ROW_H = 19;
const MAX_VISIBLE_COLS = 8;
const GROUP_PAD = 30;
const GROUP_HEADER = 34;
const CARD_GAP_X = 26;
const CARD_GAP_Y = 26;
const GROUP_GAP = 60;
const MAX_ROW_WIDTH = 2500;

function cardHeight(table){
  const t = SCHEMA.tables[table];
  const visCols = Math.min(t.columns.length, MAX_VISIBLE_COLS);
  let h = 46; // head
  if (t.description) h += 30;
  h += visCols * ROW_H + 10;
  if (t.columns.length > MAX_VISIBLE_COLS) h += 20;
  h += 28; // footer
  return h;
}

function computeLayout(){
  let curX = 0, curY = 0, rowMaxH = 0;
  state.groupBoxes = {};
  state.positions = {};

  SCHEMA.modules.forEach(mod => {
    const tables = SCHEMA.order.filter(n => SCHEMA.tables[n].module === mod);
    const count = tables.length;
    const cols = Math.max(1, Math.min(4, Math.ceil(Math.sqrt(count))));
    const rows = Math.ceil(count / cols);

    // compute column widths / row heights for this module's sub-grid
    const colHeights = new Array(rows).fill(0);
    tables.forEach((tname, i) => {
      const r = Math.floor(i / cols);
      colHeights[r] = Math.max(colHeights[r], cardHeight(tname));
    });

    const groupW = cols * CARD_W + (cols - 1) * CARD_GAP_X + GROUP_PAD * 2;
    const groupH = colHeights.reduce((a,b) => a+b, 0) + (rows - 1) * CARD_GAP_Y + GROUP_PAD * 2 + GROUP_HEADER;

    // wrap to next row of groups if exceeding max width
    if (curX > 0 && curX + groupW > MAX_ROW_WIDTH){
      curX = 0;
      curY += rowMaxH + GROUP_GAP;
      rowMaxH = 0;
    }

    state.groupBoxes[mod] = { x: curX, y: curY, w: groupW, h: groupH };

    // place tables within group
    let rowY = curY + GROUP_HEADER + GROUP_PAD;
    for (let r = 0; r < rows; r++){
      let colX = curX + GROUP_PAD;
      for (let c = 0; c < cols; c++){
        const idx = r * cols + c;
        if (idx >= count) break;
        const tname = tables[idx];
        const h = cardHeight(tname);
        state.positions[tname] = { x: colX, y: rowY, w: CARD_W, h };
        colX += CARD_W + CARD_GAP_X;
      }
      rowY += colHeights[r] + CARD_GAP_Y;
    }

    curX += groupW + GROUP_GAP;
    rowMaxH = Math.max(rowMaxH, groupH);
  });
}

function contentBounds(){
  let maxX = 0, maxY = 0;
  Object.values(state.groupBoxes).forEach(b => {
    maxX = Math.max(maxX, b.x + b.w);
    maxY = Math.max(maxY, b.y + b.h);
  });
  return { w: maxX + 100, h: maxY + 100 };
}

/* ============================================================
   RENDER: cards / groups / edges
   ============================================================ */
const svgNS = "http://www.w3.org/2000/svg";
let svgEl, viewportEl;

function el(tag, attrs, parent){
  const e = document.createElementNS(svgNS, tag);
  if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}

function buildCardHTML(name){
  const t = SCHEMA.tables[name];
  const mod = t.module;
  const visCols = t.columns.slice(0, MAX_VISIBLE_COLS);
  const moreCount = t.columns.length - visCols.length;

  const rowsHtml = visCols.map(c => {
    const isPk = t.pk.includes(c.name);
    const fk = t.fks.find(f => f.column === c.name);
    let icoHtml, cls = "tc-col";
    if (isPk){ icoHtml = `<span class="ico" style="color:var(--pk-color)">${svgIcon("key",11)}</span>`; cls += " is-pk"; }
    else if (fk){ icoHtml = `<span class="ico" style="color:var(--fk-color)">${svgIcon("link",11)}</span>`; cls += " is-fk"; }
    else { icoHtml = `<span class="ico" style="color:var(--text-2)">${svgIcon("circle-dashed",10)}</span>`; }
    if (c.nullable && !isPk) cls += " nullable";
    return `<div class="${cls}">${icoHtml}<span class="cname">${c.name}</span><span class="ctype">${c.type}</span>${c.nullable && !isPk ? '<span class="badge-null">NULL</span>' : ''}</div>`;
  }).join("");

  return `
    <div class="table-card" data-table="${name}" style="--mod-color: ${modColor(mod)}; --mod-color-soft: ${modColorSoft(mod)};">
      <div class="tc-head">
        <div class="tc-icon">${svgIcon(t.icon, 14)}</div>
        <div class="tc-titles">
          <div class="tc-name">${name}</div>
          <div class="tc-module">${mod}</div>
        </div>
        <div class="tc-colcount">${t.columns.length}</div>
      </div>
      ${t.description ? `<div class="tc-desc">${t.description}</div>` : ""}
      <div class="tc-cols">
        ${rowsHtml}
        ${moreCount > 0 ? `<div class="tc-more">+ ${moreCount} more column${moreCount>1?"s":""}</div>` : ""}
      </div>
      <div class="tc-foot">
        <span>${svgIcon("key",10)} <b>${t.pk.length}</b> PK</span>
        <span>${svgIcon("link",10)} <b>${t.fks.length}</b> FK</span>
        <span>${svgIcon("list",10)} <b>${t.indexes.length}</b> idx</span>
      </div>
    </div>`;
}

let cardNodes = {}; // name -> {g, fo, cardEl}
let groupNodes = {}; // module -> {rect, label}
let edgeNodes = []; // {pathBg, pathFg, flow, labelBg, labelText, data}

function renderAll(){
  svgEl.innerHTML = "";
  cardNodes = {}; groupNodes = {}; edgeNodes = [];

  // defs: blur filter used for the relationship-hover glow underlay
  const defs = el("defs", {}, svgEl);
  const filter = el("filter", { id: "edgeGlow", x: "-60%", y: "-60%", width: "220%", height: "220%" }, defs);
  el("feGaussianBlur", { stdDeviation: 3.2, result: "blur" }, filter);

  const layerGroups = el("g", { class: "layer-groups" }, svgEl);
  const layerEdges  = el("g", { class: "layer-edges" }, svgEl);
  const layerCards  = el("g", { class: "layer-cards" }, svgEl);

  // ---- group boxes ----
  SCHEMA.modules.forEach(mod => {
    const b = state.groupBoxes[mod];
    const g = el("g", { class: "group-node", "data-module": mod }, layerGroups);
    const rect = el("rect", {
      x: b.x, y: b.y, width: b.w, height: b.h, rx: 20,
      class: "group-box"
    }, g);
    if (isLightTheme()){
      rect.style.setProperty("--group-fill", `hsla(${hue(mod)},70%,50%,0.06)`);
      rect.style.setProperty("--group-stroke", `hsla(${hue(mod)},60%,42%,0.35)`);
    } else {
      rect.style.setProperty("--group-fill", `hsla(${hue(mod)},85%,60%,0.05)`);
      rect.style.setProperty("--group-stroke", `hsla(${hue(mod)},85%,65%,0.4)`);
    }
    const count = SCHEMA.order.filter(n => SCHEMA.tables[n].module === mod).length;
    const label = el("text", { x: b.x + 22, y: b.y + 24, class: "group-label" }, g);
    label.style.setProperty("--group-stroke", isLightTheme() ? `hsl(${hue(mod)},65%,38%)` : `hsl(${hue(mod)},90%,72%)`);
    label.textContent = mod;
    const cnt = el("text", { x: b.x + b.w - 18, y: b.y + 24, class: "group-count", "text-anchor":"end" }, g);
    cnt.textContent = count + " tables";
    groupNodes[mod] = { g, rect, label };
  });

  // ---- cards (foreignObject) ----
  SCHEMA.order.forEach(name => {
    const p = state.positions[name];
    const g = el("g", { class: "table-node", "data-table": name, transform: `translate(${p.x},${p.y})` }, layerCards);
    const fo = el("foreignObject", { x: 0, y: 0, width: p.w, height: p.h }, g);
    fo.innerHTML = buildCardHTML(name);
    cardNodes[name] = { g, fo };
    attachCardEvents(name, g);
  });

  // ---- edges ----
  SCHEMA.order.forEach(name => {
    const t = SCHEMA.tables[name];
    t.fks.forEach(fk => {
      if (!SCHEMA.tables[fk.ref_table]) return;
      const type = relType(name, fk);
      const color = relColor(type);
      const glow    = el("path", { class: "rel-glow", stroke: color, filter: "url(#edgeGlow)" }, layerEdges);
      const pathBg = el("path", { class: "rel-path", stroke: color }, layerEdges);
      const flow   = el("path", { class: "rel-path rel-flow", stroke: color }, layerEdges);
      const labelBg = el("rect", { class: "rel-label-bg", rx: 5 }, layerEdges);
      const labelText = el("text", { class: "rel-mult", fill: color }, layerEdges);
      labelText.textContent = type;

      const data = { from: name, to: fk.ref_table, fromCol: fk.column, toCol: fk.ref_column,
                     onDelete: fk.on_delete, onUpdate: fk.on_update, type, color };
      const idx = edgeNodes.length;
      edgeNodes.push({ pathBg, flow, glow, labelBg, labelText, data });

      [pathBg, flow].forEach(p => {
        p.addEventListener("mouseenter", () => showEdgeTooltip(idx));
        p.addEventListener("mousemove", (e) => moveTooltip(e));
        p.addEventListener("mouseleave", hideEdgeTooltip);
      });

      state.edgesByTable[name] = state.edgesByTable[name] || [];
      state.edgesByTable[name].push(idx);
      state.edgesByTable[fk.ref_table] = state.edgesByTable[fk.ref_table] || [];
      state.edgesByTable[fk.ref_table].push(idx);
    });
  });

  updateAllEdgePaths();
  applyFilters();
  updateStatsUI();
  renderMinimap();
  if (state.focusMode && state.selected) applyFocusMode();
}

function anchorPoint(name, side){
  const p = state.positions[name];
  if (side === "right") return { x: p.x + p.w, y: p.y + p.h / 2 };
  if (side === "left")  return { x: p.x, y: p.y + p.h / 2 };
  return { x: p.x + p.w/2, y: p.y };
}

function edgePathData(fromName, toName){
  const a = state.positions[fromName], b = state.positions[toName];
  const aCenterX = a.x + a.w/2, bCenterX = b.x + b.w/2;
  let p1, p2, curveOffset;
  if (Math.abs(aCenterX - bCenterX) < Math.max(a.w, b.w) * 0.7 && Math.abs((a.y) - (b.y)) > 40){
    // roughly vertically aligned: connect top/bottom
    const fromBottom = a.y < b.y;
    p1 = { x: aCenterX, y: fromBottom ? a.y + a.h : a.y };
    p2 = { x: bCenterX, y: fromBottom ? b.y : b.y + b.h };
    const dy = (p2.y - p1.y) * 0.5;
    return { d: `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y+dy}, ${p2.x} ${p2.y-dy}, ${p2.x} ${p2.y}`, mid: { x:(p1.x+p2.x)/2, y:(p1.y+p2.y)/2 } };
  }
  const fromRight = aCenterX < bCenterX;
  p1 = fromRight ? anchorPoint(fromName, "right") : anchorPoint(fromName, "left");
  p2 = fromRight ? anchorPoint(toName, "left") : anchorPoint(toName, "right");
  curveOffset = Math.max(60, Math.abs(p2.x - p1.x) * 0.4);
  const c1x = fromRight ? p1.x + curveOffset : p1.x - curveOffset;
  const c2x = fromRight ? p2.x - curveOffset : p2.x + curveOffset;
  return { d: `M ${p1.x} ${p1.y} C ${c1x} ${p1.y}, ${c2x} ${p2.y}, ${p2.x} ${p2.y}`, mid: { x:(p1.x+p2.x)/2, y:(p1.y+p2.y)/2 } };
}

function updateEdgePath(edgeIdx){
  const e = edgeNodes[edgeIdx];
  const { d, mid } = edgePathData(e.data.from, e.data.to);
  e.pathBg.setAttribute("d", d);
  e.flow.setAttribute("d", d);
  e.glow.setAttribute("d", d);
  const label = e.data.type;
  const w = label.length * 6.4 + 10;
  e.labelBg.setAttribute("x", mid.x - w/2);
  e.labelBg.setAttribute("y", mid.y - 9);
  e.labelBg.setAttribute("width", w);
  e.labelBg.setAttribute("height", 15);
  e.labelText.setAttribute("x", mid.x);
  e.labelText.setAttribute("y", mid.y + 3);
  e.labelText.setAttribute("text-anchor", "middle");
}

function updateAllEdgePaths(){
  edgeNodes.forEach((_, i) => updateEdgePath(i));
}

function updateEdgesForTable(name){
  (state.edgesByTable[name] || []).forEach(updateEdgePath);
}

/* ============================================================
   INTERACTION: drag, pan, zoom
   ============================================================ */
function attachCardEvents(name, g){
  let dragState = null;
  const cardEl = () => g.querySelector(".table-card");

  g.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const p = state.positions[name];
    dragState = {
      startX: e.clientX, startY: e.clientY,
      origX: p.x, origY: p.y, moved: false
    };
    cardEl() && cardEl().classList.add("dragging");
    const onMove = (ev) => {
      const dx = (ev.clientX - dragState.startX) / state.zoom;
      const dy = (ev.clientY - dragState.startY) / state.zoom;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragState.moved = true;
      p.x = dragState.origX + dx;
      p.y = dragState.origY + dy;
      g.setAttribute("transform", `translate(${p.x},${p.y})`);
      updateEdgesForTable(name);
    };
    const onUp = () => {
      cardEl() && cardEl().classList.remove("dragging");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      renderMinimap();
      if (!dragState.moved) openDetails(name);
      dragState = null;
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });

  g.addEventListener("mouseenter", () => highlightRelated(name, true));
  g.addEventListener("mouseleave", () => highlightRelated(name, false));
}

function highlightRelated(name, on){
  (state.edgesByTable[name] || []).forEach(i => {
    edgeNodes[i].pathBg.classList.toggle("hover-active", on);
    edgeNodes[i].flow.classList.toggle("hover-active", on);
    edgeNodes[i].glow.classList.toggle("hover-active", on);
  });
}

/* ---- pan & zoom ---- */
const canvasWrap = document.getElementById("canvasWrap");

function applyTransform(){
  viewportEl.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
  document.getElementById("zoomLevel").textContent = Math.round(state.zoom * 100) + "%";
  renderMinimapViewport();
}

let isPanning = false, panStart = null;
canvasWrap.addEventListener("mousedown", (e) => {
  if (e.target.closest(".table-card")) return;
  isPanning = true;
  canvasWrap.classList.add("panning");
  panStart = { x: e.clientX - state.panX, y: e.clientY - state.panY };
});
window.addEventListener("mousemove", (e) => {
  if (!isPanning) return;
  state.panX = e.clientX - panStart.x;
  state.panY = e.clientY - panStart.y;
  applyTransform();
});
window.addEventListener("mouseup", () => { isPanning = false; canvasWrap.classList.remove("panning"); });

canvasWrap.addEventListener("wheel", (e) => {
  e.preventDefault();
  const rect = canvasWrap.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  const worldX = (mx - state.panX) / state.zoom;
  const worldY = (my - state.panY) / state.zoom;
  const delta = -e.deltaY * 0.0016;
  const newZoom = Math.min(2.4, Math.max(0.18, state.zoom * (1 + delta)));
  state.panX = mx - worldX * newZoom;
  state.panY = my - worldY * newZoom;
  state.zoom = newZoom;
  applyTransform();
}, { passive: false });

// touch support (basic pinch + pan)
let touchState = null;
canvasWrap.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1){
    touchState = { mode: "pan", x: e.touches[0].clientX - state.panX, y: e.touches[0].clientY - state.panY };
  } else if (e.touches.length === 2){
    const [a,b] = e.touches;
    const dist = Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY);
    touchState = { mode: "pinch", dist, zoom: state.zoom };
  }
}, { passive: true });
canvasWrap.addEventListener("touchmove", (e) => {
  if (!touchState) return;
  if (touchState.mode === "pan" && e.touches.length === 1){
    state.panX = e.touches[0].clientX - touchState.x;
    state.panY = e.touches[0].clientY - touchState.y;
    applyTransform();
  } else if (touchState.mode === "pinch" && e.touches.length === 2){
    const [a,b] = e.touches;
    const dist = Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY);
    state.zoom = Math.min(2.4, Math.max(0.18, touchState.zoom * (dist / touchState.dist)));
    applyTransform();
  }
}, { passive: true });
canvasWrap.addEventListener("touchend", () => { touchState = null; });

document.getElementById("zoomIn").onclick = () => { state.zoom = Math.min(2.4, state.zoom * 1.2); applyTransform(); };
document.getElementById("zoomOut").onclick = () => { state.zoom = Math.max(0.18, state.zoom / 1.2); applyTransform(); };

function fitView(){
  const bounds = contentBounds();
  const rect = canvasWrap.getBoundingClientRect();
  const zx = rect.width / bounds.w, zy = rect.height / bounds.h;
  state.zoom = Math.min(1.1, Math.min(zx, zy) * 0.94);
  state.panX = (rect.width - bounds.w * state.zoom) / 2;
  state.panY = 40;
  applyTransform();
}

/* ---- tooltip for edges ---- */
let tooltipEl;
function setEdgeEndpointHighlight(idx, on){
  const d = edgeNodes[idx].data;
  [d.from, d.to].forEach(n => {
    const wrap = cardNodes[n];
    if (!wrap) return;
    const cardEl = wrap.fo.querySelector(".table-card");
    if (!cardEl) return;
    cardEl.classList.toggle("rel-endpoint", on);
    if (on) cardEl.style.setProperty("--rel-glow-color", d.color);
  });
}
function showEdgeTooltip(idx){
  const d = edgeNodes[idx].data;
  tooltipEl.innerHTML = `
    <div class="rt-title">${d.from} → ${d.to}</div>
    <div><b>FK column:</b> ${d.fromCol}</div>
    <div><b>References:</b> ${d.to}.${d.toCol}</div>
    <div><b>Delete rule:</b> ${d.onDelete}</div>
    <div><b>Update rule:</b> ${d.onUpdate}</div>
    <div><b>Multiplicity:</b> ${d.type}</div>`;
  tooltipEl.classList.add("show");
  edgeNodes[idx].pathBg.classList.add("hover-active");
  edgeNodes[idx].flow.classList.add("hover-active");
  edgeNodes[idx].glow.classList.add("hover-active");
  setEdgeEndpointHighlight(idx, true);
  state.hoverEdge = idx;
}
function hideEdgeTooltip(){
  tooltipEl.classList.remove("show");
  if (state.hoverEdge != null){
    edgeNodes[state.hoverEdge].pathBg.classList.remove("hover-active");
    edgeNodes[state.hoverEdge].flow.classList.remove("hover-active");
    edgeNodes[state.hoverEdge].glow.classList.remove("hover-active");
    setEdgeEndpointHighlight(state.hoverEdge, false);
  }
  state.hoverEdge = null;
}
function moveTooltip(e){
  const rect = canvasWrap.getBoundingClientRect();
  tooltipEl.style.left = (e.clientX - rect.left + 16) + "px";
  tooltipEl.style.top = (e.clientY - rect.top + 12) + "px";
}

/* ============================================================
   SMART FOCUS MODE
   ============================================================ */
function applyFocusMode(){
  if (!state.selected){ clearFocusMode(); return; }
  const name = state.selected;
  const related = new Set([name]);
  SCHEMA.tables[name].fks.forEach(fk => related.add(fk.ref_table));
  incomingRefs[name].forEach(r => related.add(r.from));

  Object.keys(cardNodes).forEach(n => {
    const cardEl = cardNodes[n].fo.querySelector(".table-card");
    if (cardEl) cardEl.classList.toggle("focus-dim", !related.has(n));
  });
  edgeNodes.forEach(e => {
    const relevant = e.data.from === name || e.data.to === name;
    e.pathBg.classList.toggle("focus-dim", !relevant);
    e.flow.classList.toggle("focus-dim", !relevant);
    e.pathBg.classList.toggle("focus-active", relevant);
    e.flow.classList.toggle("focus-active", relevant);
  });
}
function clearFocusMode(){
  Object.values(cardNodes).forEach(c => {
    const cardEl = c.fo.querySelector(".table-card");
    if (cardEl) cardEl.classList.remove("focus-dim");
  });
  edgeNodes.forEach(e => {
    e.pathBg.classList.remove("focus-dim", "focus-active");
    e.flow.classList.remove("focus-dim", "focus-active");
  });
}
function toggleFocusMode(force){
  state.focusMode = (typeof force === "boolean") ? force : !state.focusMode;
  const btn = document.getElementById("btnFocusMode");
  if (btn) btn.classList.toggle("active", state.focusMode);
  if (state.focusMode && state.selected) applyFocusMode();
  else clearFocusMode();
  toast(state.focusMode ? "Focus mode on — select a table to isolate its relations" : "Focus mode off");
}
document.getElementById("btnFocusMode").onclick = () => toggleFocusMode();

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

document.getElementById("searchInput").addEventListener("input", (e) => {
  state.search = e.target.value;
  state.searchMatchIndex = -1;
  applyFilters();
});

/* ---- sidebar: module filters ---- */
function renderModuleFilters(){
  const wrap = document.getElementById("moduleFilters");
  wrap.innerHTML = "";
  SCHEMA.modules.forEach(mod => {
    const count = SCHEMA.order.filter(n => SCHEMA.tables[n].module === mod).length;
    const row = document.createElement("div");
    row.className = "mod-filter" + (state.moduleEnabled[mod] ? "" : " disabled");
    row.innerHTML = `<span class="dot" style="background:${modColor(mod)};color:${modColor(mod)}"></span><span class="name">${mod}</span><span class="count">${count}</span>`;
    row.onclick = () => {
      state.moduleEnabled[mod] = !state.moduleEnabled[mod];
      row.classList.toggle("disabled", !state.moduleEnabled[mod]);
      applyFilters();
    };
    wrap.appendChild(row);
  });
}

/* ---- quick filters ---- */
document.querySelectorAll("#quickFilters .chip").forEach(btn => {
  btn.onclick = () => {
    const kind = btn.dataset.quick;
    if (kind === "reset"){
      state.quick = { pk:false, fk:false, hideIsolated:false };
      state.search = "";
      document.getElementById("searchInput").value = "";
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
function updateStatsUI(){
  const tables = SCHEMA.order;
  let totalCols = 0, totalPk = 0, totalFk = 0, totalIdx = 0;
  tables.forEach(n => {
    const t = SCHEMA.tables[n];
    totalCols += t.columns.length;
    totalPk += t.pk.length;
    totalFk += t.fks.length;
    totalIdx += t.indexes.length + t.uniques.length;
  });
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
  ];
  const grid = document.getElementById("statGrid");
  grid.innerHTML = stats.map(s => `<div class="stat-card"><div class="num">${s.num}</div><div class="lbl">${s.lbl}</div></div>`).join("");
}

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
};

document.querySelectorAll(".details-tabs .tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".details-tabs .tab").forEach(x => x.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(x => x.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
  };
});

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
  const bgColor = light ? "#f5f6fb" : "#07080d";
  const bounds = contentBounds();
  const clone = svgEl.cloneNode(true);
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
  styleTag.textContent = light ? `
    * { box-sizing: border-box; font-family: 'JetBrains Mono', monospace; }
    .table-card{ border-radius:16px; background:linear-gradient(180deg,#ffffff,#f8f9fc); border:1px solid rgba(15,23,42,0.1); overflow:hidden; }
    .tc-head{ display:flex; align-items:center; gap:8px; padding:10px 12px; border-bottom:1px solid rgba(15,23,42,0.08); }
    .tc-icon{ width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;background:var(--mod-color-soft);color:var(--mod-color); }
    .tc-titles{ flex:1; min-width:0; }
    .tc-name{ font-size:12.5px; font-weight:700; color:#1a1d29; font-family:'JetBrains Mono',monospace; }
    .tc-module{ font-size:9.5px; color:var(--mod-color); text-transform:uppercase; }
    .tc-colcount{ font-size:10px; color:#6b7189; background:rgba(15,23,42,0.06); padding:2px 6px; border-radius:20px; }
    .tc-desc{ font-size:10.5px; color:#6b7189; padding:7px 12px 0; }
    .tc-cols{ padding:6px 0 8px; }
    .tc-col{ display:flex; gap:6px; padding:3.5px 12px; font-size:11px; font-family:'JetBrains Mono',monospace; color:#1a1d29; }
    .tc-col .ctype{ color:#6b7189; font-size:9.5px; margin-left:auto; }
    .tc-col.is-pk .cname{ color:#b8860a; }
    .tc-col.is-fk .cname{ color:#1f7bbf; }
    .tc-more{ padding:5px 12px; font-size:10px; color:#6b7189; font-style:italic; }
    .tc-foot{ display:flex; gap:10px; padding:8px 12px; border-top:1px solid rgba(15,23,42,0.08); font-size:9.5px; color:#6b7189; }
    .group-label{ font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:600; }
  ` : `
    * { box-sizing: border-box; font-family: 'JetBrains Mono', monospace; }
    .table-card{ border-radius:16px; background:linear-gradient(180deg,#1a1d2c,#10121c); border:1px solid rgba(255,255,255,0.08); overflow:hidden; }
    .tc-head{ display:flex; align-items:center; gap:8px; padding:10px 12px; border-bottom:1px solid rgba(255,255,255,0.08); }
    .tc-icon{ width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;background:var(--mod-color-soft);color:var(--mod-color); }
    .tc-titles{ flex:1; min-width:0; }
    .tc-name{ font-size:12.5px; font-weight:700; color:#f3f5fb; font-family:'JetBrains Mono',monospace; }
    .tc-module{ font-size:9.5px; color:var(--mod-color); text-transform:uppercase; }
    .tc-colcount{ font-size:10px; color:#6b7189; background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:20px; }
    .tc-desc{ font-size:10.5px; color:#6b7189; padding:7px 12px 0; }
    .tc-cols{ padding:6px 0 8px; }
    .tc-col{ display:flex; gap:6px; padding:3.5px 12px; font-size:11px; font-family:'JetBrains Mono',monospace; color:#f3f5fb; }
    .tc-col .ctype{ color:#6b7189; font-size:9.5px; margin-left:auto; }
    .tc-col.is-pk .cname{ color:#ffd76a; }
    .tc-col.is-fk .cname{ color:#7fd0ff; }
    .tc-more{ padding:5px 12px; font-size:10px; color:#6b7189; font-style:italic; }
    .tc-foot{ display:flex; gap:10px; padding:8px 12px; border-top:1px solid rgba(255,255,255,0.08); font-size:9.5px; color:#6b7189; }
    .group-label{ font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:600; }
  `;
  clone.insertBefore(styleTag, clone.firstChild);

  return { svgString: new XMLSerializer().serializeToString(clone), bounds };
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
  const { svgString } = buildExportSVG();
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  downloadBlob(url, "uip-database-atlas.svg");
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  toast("SVG exported");
}

function exportPNG(){
  const { svgString, bounds } = buildExportSVG();
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
        downloadBlob(pngUrl, "uip-database-atlas.png");
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
    document.getElementById("exportMenu").classList.remove("open");
  };
});

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

document.getElementById("btnFitView").onclick = fitView;

/* ============================================================
   KEYBOARD SHORTCUTS
   ============================================================ */
document.addEventListener("keydown", (e) => {
  const mod = e.ctrlKey || e.metaKey;
  if (!mod) return;
  const k = e.key.toLowerCase();
  if (k === "f" && e.shiftKey){ e.preventDefault(); toggleFocusMode(); return; }
  if (k === "f"){ e.preventDefault(); const si = document.getElementById("searchInput"); si.focus(); si.select(); return; }
  if (k === "g"){ e.preventDefault(); cycleSearchMatch(); return; }
  if (k === "l"){ e.preventDefault(); document.getElementById("btnAutoLayout").click(); return; }
  if (k === "e"){ e.preventDefault(); document.getElementById("exportMenu").classList.toggle("open"); return; }
  if (k === "d"){ e.preventDefault(); setTheme(isLightTheme() ? "dark" : "light"); return; }
});
document.getElementById("btnAutoLayout").onclick = () => {
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
  });
  updateAllEdgePaths();
  renderMinimap();
  fitView();
  toast("Layout reset");
};

/* ============================================================
   INIT
   ============================================================ */
function init(){
  applyThemeIcon();
  document.getElementById("focusIcon").innerHTML = svgIcon("target", 15);
  svgEl = document.getElementById("canvasSvg");
  viewportEl = document.getElementById("canvasViewport");
  tooltipEl = document.createElement("div");
  tooltipEl.className = "rel-tooltip";
  document.getElementById("canvasWrap").appendChild(tooltipEl);

  computeLayout();
  const bounds = contentBounds();
  svgEl.setAttribute("width", bounds.w);
  svgEl.setAttribute("height", bounds.h);

  renderAll();
  renderModuleFilters();
  renderTableIndex();
  renderLegend();

  requestAnimationFrame(fitView);

  setTimeout(() => {
    const hint = document.getElementById("canvasHint");
    if (hint) hint.style.opacity = "0";
  }, 5000);
}

document.addEventListener("DOMContentLoaded", init);