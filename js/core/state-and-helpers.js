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
  "layers": ["M12 3 3 8l9 5 9-5-9-5Z","M3 13l9 5 9-5","M3 18l9 5 9-5"],
  "chevron-down": ["M5 8.5 12 15.5 19 8.5"],
  "chevron-up": ["M5 15.5 12 8.5 19 15.5"],
  "maximize": ["M8 3H5a2 2 0 0 0-2 2v3","M16 3h3a2 2 0 0 1 2 2v3","M8 21H5a2 2 0 0 1-2-2v-3","M16 21h3a2 2 0 0 0 2-2v-3"],
  "minimize": ["M9 3v4a2 2 0 0 1-2 2H3","M15 3v4a2 2 0 0 0 2 2h4","M9 21v-4a2 2 0 0 0-2-2H3","M15 21v-4a2 2 0 0 1 2-2h4"],
  "grid-snap": ["M4 4h4v4H4z","M10 4h4v4h-4z","M16 4h4v4h-4z","M4 10h4v4H4z","M10 10h4v4h-4z","M16 10h4v4h-4z","M4 16h4v4H4z","M10 16h4v4h-4z","M16 16h4v4h-4z"],
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
  quick: { pk:false, fk:false, hideIsolated:false, datatype:"" },
  dragging: null,
  edgesByTable: {},      // table -> [edgeIndex,...]
  edges: [],             // {from,to,fromCol,toCol,onDelete,onUpdate,type,path elements ref}
  focusMode: false,       // Smart Focus Mode toggle
  searchMatchIndex: -1,   // for Ctrl+G cycling through search matches
  activeModuleNav: null,   // module currently highlighted by the Module Navigator
  view: "erd",             // "erd" | "mapping"
  mapPositions: {},        // module -> {x,y,w,h} (Database Mapping view layout)
  mapZoom: 1,
  mapPanX: 60,
  mapPanY: 60,
  mapInitialized: false,
  edgeRouting: (localStorage.getItem("edgeRouting") || "curved"), // "curved" | "straight" | "orthogonal"
  layoutMode: (localStorage.getItem("layoutMode") || "grid"), // "grid" | "organic" (force-directed)
  expanded: {},           // table name -> bool (accordion expand/collapse of full column list)
  snapToGrid: (localStorage.getItem("snapToGrid") === "1"), // snap card/module dragging to the canvas grid
  depsRoot: null,          // Dependency Graph view — currently focused table
  depsMaxDepth: 3,         // how many hops of ancestors/descendants to show
  depsZoom: 1,
  depsPanX: 60,
  depsPanY: 60,
};

// ---------- Snap-to-grid ----------
// matches the 42px canvas background grid, so snapped cards visibly line up with it
const GRID_SIZE = 42;
function snapVal(v){ return state.snapToGrid ? Math.round(v / GRID_SIZE) * GRID_SIZE : v; }

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

