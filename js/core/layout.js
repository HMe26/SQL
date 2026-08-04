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
  computeGridLayout();
  if (state.layoutMode === "organic") computeOrganicLayout();
}

function computeGridLayout(){
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

/* ============================================================
   ORGANIC LAYOUT — force-directed refinement pass with real
   pairwise collision detection, run on top of the grid seed.
   Nodes repel each other, FK edges act as springs toward an
   ideal length, and a weak pull back toward each table's
   original module cluster keeps modules from drifting into
   one another over the course of the simulation.
   ============================================================ */
function computeOrganicLayout(){
  const names = SCHEMA.order.filter(n => state.positions[n]);
  if (!names.length) return;

  // anchor each table to its module's grid-seeded center, so cohesion has
  // a stable target instead of chasing a centroid that moves every iteration
  const anchor = {};
  names.forEach(n => {
    const b = state.groupBoxes[SCHEMA.tables[n].module];
    anchor[n] = b ? { x: b.x + b.w / 2, y: b.y + b.h / 2 } : { x: 0, y: 0 };
  });

  const node = {};
  names.forEach(n => {
    const p = state.positions[n];
    node[n] = { x: p.x + p.w / 2, y: p.y + p.h / 2, w: p.w, h: p.h, vx: 0, vy: 0 };
  });

  const edges = [];
  names.forEach(n => {
    SCHEMA.tables[n].fks.forEach(fk => {
      if (node[fk.ref_table] && fk.ref_table !== n) edges.push([n, fk.ref_table]);
    });
  });

  const REPEL_RADIUS = 460, REPEL_STRENGTH = 26000;
  const SPRING_LEN = 300, SPRING_K = 0.02;
  const COHESION_K = 0.012;
  const DAMPING = 0.82;
  const ITERATIONS = 160;

  for (let iter = 0; iter < ITERATIONS; iter++){
    names.forEach(n => { node[n].fx = 0; node[n].fy = 0; });

    // pairwise repulsion — keeps cards from bunching together
    for (let i = 0; i < names.length; i++){
      const a = node[names[i]];
      for (let j = i + 1; j < names.length; j++){
        const b = node[names[j]];
        let dx = b.x - a.x, dy = b.y - a.y;
        let distSq = dx*dx + dy*dy;
        if (distSq < 1) { dx = (Math.random()-0.5); dy = (Math.random()-0.5); distSq = 1; }
        const dist = Math.sqrt(distSq);
        if (dist < REPEL_RADIUS){
          const force = REPEL_STRENGTH / distSq;
          const fx = (dx / dist) * force, fy = (dy / dist) * force;
          a.fx -= fx; a.fy -= fy;
          b.fx += fx; b.fy += fy;
        }
      }
    }

    // FK edges act as springs toward an ideal resting length
    edges.forEach(([an, bn]) => {
      const a = node[an], b = node[bn];
      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.max(1, Math.sqrt(dx*dx + dy*dy));
      const force = (dist - SPRING_LEN) * SPRING_K;
      const fx = (dx / dist) * force, fy = (dy / dist) * force;
      a.fx += fx; a.fy += fy;
      b.fx -= fx; b.fy -= fy;
    });

    // weak pull back toward the table's original module cluster
    names.forEach(n => {
      const a = node[n];
      a.fx += (anchor[n].x - a.x) * COHESION_K;
      a.fy += (anchor[n].y - a.y) * COHESION_K;
    });

    // integrate
    names.forEach(n => {
      const a = node[n];
      a.vx = (a.vx + a.fx) * DAMPING;
      a.vy = (a.vy + a.fy) * DAMPING;
      a.x += a.vx;
      a.y += a.vy;
    });

    // direct AABB collision resolution — guarantees no overlapping cards
    // survive the simulation even where spring/repulsion forces balance out
    for (let i = 0; i < names.length; i++){
      const a = node[names[i]];
      for (let j = i + 1; j < names.length; j++){
        const b = node[names[j]];
        const overlapX = (a.w + b.w) / 2 + CARD_GAP_X - Math.abs(b.x - a.x);
        const overlapY = (a.h + b.h) / 2 + CARD_GAP_Y - Math.abs(b.y - a.y);
        if (overlapX > 0 && overlapY > 0){
          if (overlapX < overlapY){
            const push = (overlapX / 2) * (b.x >= a.x ? 1 : -1);
            a.x -= push; b.x += push;
          } else {
            const push = (overlapY / 2) * (b.y >= a.y ? 1 : -1);
            a.y -= push; b.y += push;
          }
        }
      }
    }
  }

  // finishing pass: pure collision separation, no springs/repulsion pulling
  // cards back together, so any overlap left over from the simulation is
  // fully resolved rather than just reduced
  for (let pass = 0; pass < 60; pass++){
    let anyOverlap = false;
    for (let i = 0; i < names.length; i++){
      const a = node[names[i]];
      for (let j = i + 1; j < names.length; j++){
        const b = node[names[j]];
        const overlapX = (a.w + b.w) / 2 + CARD_GAP_X - Math.abs(b.x - a.x);
        const overlapY = (a.h + b.h) / 2 + CARD_GAP_Y - Math.abs(b.y - a.y);
        if (overlapX > 0 && overlapY > 0){
          anyOverlap = true;
          if (overlapX < overlapY){
            const push = (overlapX / 2 + 0.5) * (b.x >= a.x ? 1 : -1);
            a.x -= push; b.x += push;
          } else {
            const push = (overlapY / 2 + 0.5) * (b.y >= a.y ? 1 : -1);
            a.y -= push; b.y += push;
          }
        }
      }
    }
    if (!anyOverlap) break;
  }

  names.forEach(n => {
    const a = node[n];
    state.positions[n] = { x: a.x - a.w/2, y: a.y - a.h/2, w: a.w, h: a.h };
  });

  // re-fit each module's group box tightly around its members' final positions
  SCHEMA.modules.forEach(mod => {
    const members = names.filter(n => SCHEMA.tables[n].module === mod);
    if (!members.length){ state.groupBoxes[mod] = { x: 0, y: 0, w: CARD_W + GROUP_PAD*2, h: GROUP_HEADER + GROUP_PAD*2 }; return; }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    members.forEach(n => {
      const p = state.positions[n];
      minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x + p.w); maxY = Math.max(maxY, p.y + p.h);
    });
    state.groupBoxes[mod] = {
      x: minX - GROUP_PAD, y: minY - GROUP_PAD - GROUP_HEADER,
      w: (maxX - minX) + GROUP_PAD*2, h: (maxY - minY) + GROUP_PAD*2 + GROUP_HEADER
    };
  });

  // organic layout can produce a negative bounding origin — shift everything
  // back into positive space so contentBounds()/fitView() behave normally
  let shiftX = 0, shiftY = 0;
  Object.values(state.groupBoxes).forEach(b => { shiftX = Math.min(shiftX, b.x); shiftY = Math.min(shiftY, b.y); });
  if (shiftX < 0 || shiftY < 0){
    Object.values(state.groupBoxes).forEach(b => { b.x -= shiftX; b.y -= shiftY; });
    Object.values(state.positions).forEach(p => { p.x -= shiftX; p.y -= shiftY; });
  }
}


