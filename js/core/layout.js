/* ============================================================
   LAYOUT
   ============================================================ */
const CARD_W = 252;
const MAX_VISIBLE_COLS = 8;
const GROUP_PAD = 30;
const GROUP_HEADER = 34;
const CARD_GAP_X = 26;
const CARD_GAP_Y = 26;
const GROUP_GAP = 60;
const MAX_ROW_WIDTH = 2500;

function formatRowEstimate(n){
  if (n >= 1e9) return (n/1e9).toFixed(1).replace(/\.0$/,"") + "B";
  if (n >= 1e6) return (n/1e6).toFixed(1).replace(/\.0$/,"") + "M";
  if (n >= 1e3) return (n/1e3).toFixed(1).replace(/\.0$/,"") + "K";
  return String(n);
}

// Fixed pixel heights used by the card layout — these MUST stay in sync
// with the corresponding CSS rules (.tc-head, .tc-desc, .tc-col, .tc-more,
// .tc-foot all use box-sizing:border-box with these exact heights) so the
// computed card height always matches the real rendered height exactly —
// no font-metric guessing, no clipped footers, regardless of theme,
// content length, or browser.
const TC_HEAD_H = 50;
const TC_DESC_H = 38;
const TC_COLS_PAD = 14; // .tc-cols top+bottom padding (6 + 8)
const TC_ROW_H = 23;    // .tc-col
const TC_MORE_H = 22;   // "+ N more columns" row
const TC_FOOT_H = 34;
const TC_CARD_BORDER = 2; // .table-card 1px top + 1px bottom border

function cardHeight(table){
  const t = SCHEMA.tables[table];
  const isExpanded = !!state.expanded[table];
  const visCols = isExpanded ? t.columns.length : Math.min(t.columns.length, MAX_VISIBLE_COLS);
  let h = TC_HEAD_H;
  if (t.description) h += TC_DESC_H;
  h += TC_COLS_PAD + visCols * TC_ROW_H;
  // toggle row: "+ N more columns" when collapsed, "Show less" when expanded
  // (only shown at all when there's something to collapse, i.e. more than MAX_VISIBLE_COLS)
  if (t.columns.length > MAX_VISIBLE_COLS) h += TC_MORE_H;
  h += TC_FOOT_H + TC_CARD_BORDER;
  return h;
}

/* ---- module ordering heuristic: place highly-connected modules next to
   each other to shorten inter-module edges and reduce visual crossings ---- */
function orderModulesForLayout(){
  const graph = computeModuleGraph();
  const weight = {};
  SCHEMA.modules.forEach(m => weight[m] = {});
  graph.edges.forEach(e => {
    weight[e.parent][e.child] = (weight[e.parent][e.child] || 0) + e.count;
    weight[e.child][e.parent] = (weight[e.child][e.parent] || 0) + e.count;
  });
  let start = SCHEMA.modules[0], bestDeg = -1;
  SCHEMA.modules.forEach(m => {
    const deg = Object.values(weight[m]).reduce((a,b) => a+b, 0);
    if (deg > bestDeg){ bestDeg = deg; start = m; }
  });
  const remaining = new Set(SCHEMA.modules);
  const ordered = [start];
  remaining.delete(start);
  while (remaining.size){
    let best = null, bestScore = -1;
    remaining.forEach(m => {
      let score = 0;
      ordered.forEach((placed, i) => { score += (weight[m][placed] || 0) * (1 + i * 0.02); });
      if (score > bestScore){ bestScore = score; best = m; }
    });
    if (best == null) best = SCHEMA.modules.find(m => remaining.has(m));
    ordered.push(best);
    remaining.delete(best);
  }
  return ordered;
}

function computeLayout(){
  let curX = 0, curY = 0, rowMaxH = 0;
  state.groupBoxes = {};
  state.positions = {};

  orderModulesForLayout().forEach(mod => {
    // hub tables (more relations) placed first, so they land near the group's
    // top-left where the most connections converge — shortens average edge length
    const tables = SCHEMA.order.filter(n => SCHEMA.tables[n].module === mod)
      .sort((a,b) => (SCHEMA.tables[b].fks.length + incomingRefs[b].length) - (SCHEMA.tables[a].fks.length + incomingRefs[a].length));
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

