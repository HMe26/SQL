/* ============================================================
   AUTO GROUPING — real modularity-based community detection
   ------------------------------------------------------------
   Builds an undirected weighted graph from the schema's actual
   foreign keys (edge weight = number of FK columns linking two
   tables) and runs a greedy Louvain-style modularity optimization
   over it — the *manual* `module` field on each table is never
   consulted by the algorithm itself, only afterwards, to measure
   how well the automatically discovered clusters line up with the
   hand-assigned modules.
   ============================================================ */

let lastAutoGroupResult = null;

/* ---- build the FK adjacency graph ---- */
function buildFkGraph(){
  const nodes = SCHEMA.order.slice();
  const adj = {};
  nodes.forEach(n => { adj[n] = new Map(); });
  let totalWeight = 0;
  function addEdge(a, b, w){
    if (a === b) return; // ignore self-referencing FKs — they carry no clustering signal
    adj[a].set(b, (adj[a].get(b) || 0) + w);
    adj[b].set(a, (adj[b].get(a) || 0) + w);
    totalWeight += w;
  }
  nodes.forEach(name => {
    const t = SCHEMA.tables[name];
    t.fks.forEach(fk => {
      if (!SCHEMA.tables[fk.ref_table]) return;
      addEdge(name, fk.ref_table, 1);
    });
  });
  const degree = {};
  nodes.forEach(n => {
    let k = 0; adj[n].forEach(w => { k += w; });
    degree[n] = k;
  });
  return { nodes, adj, degree, totalWeight };
}

/* ---- greedy Louvain-style local-moving modularity optimization ---- */
function louvainCommunities(graph){
  const { nodes, adj, degree, totalWeight } = graph;
  const m2 = 2 * totalWeight; // sum of all node degrees
  const community = {};
  nodes.forEach(n => { community[n] = n; });
  if (m2 === 0){
    return { community, modularity: 0, passes: 0 };
  }

  // running sum of degree per community, kept in sync as nodes move
  const sigmaTot = {};
  nodes.forEach(n => { sigmaTot[n] = degree[n]; });

  // deterministic but non-trivial visiting order (helps escape ties consistently)
  const order = nodes.slice().sort((a, b) => degree[b] - degree[a] || a.localeCompare(b));

  let improvedAny = true, passes = 0;
  const MAX_PASSES = 60;
  while (improvedAny && passes < MAX_PASSES){
    improvedAny = false; passes++;
    order.forEach(n => {
      const currentComm = community[n];
      sigmaTot[currentComm] -= degree[n];

      const neighWeight = new Map();
      adj[n].forEach((w, neigh) => {
        const c = community[neigh];
        neighWeight.set(c, (neighWeight.get(c) || 0) + w);
      });

      let bestComm = currentComm;
      let bestGain = (neighWeight.get(currentComm) || 0) - (sigmaTot[currentComm] * degree[n]) / m2;
      neighWeight.forEach((w, c) => {
        if (c === currentComm) return;
        const gain = w - (sigmaTot[c] * degree[n]) / m2;
        if (gain > bestGain + 1e-9){ bestGain = gain; bestComm = c; }
      });

      sigmaTot[bestComm] += degree[n];
      if (bestComm !== currentComm){ community[n] = bestComm; improvedAny = true; }
    });
  }

  const modularity = computeModularity(graph, community);
  return { community, modularity, passes };
}

function computeModularity(graph, community){
  const { nodes, adj, degree, totalWeight } = graph;
  const m2 = 2 * totalWeight;
  if (m2 === 0) return 0;
  const members = {};
  nodes.forEach(n => { (members[community[n]] = members[community[n]] || []).push(n); });
  let Q = 0;
  Object.keys(members).forEach(c => {
    let innerDegSum = 0, sigmaTot = 0;
    members[c].forEach(n => {
      sigmaTot += degree[n];
      adj[n].forEach((w, neigh) => { if (community[neigh] === c) innerDegSum += w; });
    });
    Q += innerDegSum / m2 - Math.pow(sigmaTot / m2, 2);
  });
  return Q;
}

/* ---- run the algorithm and package results, including a comparison against the manual `module` field ---- */
function computeAutoGroups(){
  const graph = buildFkGraph();
  const { community, modularity, passes } = louvainCommunities(graph);

  const byId = {};
  graph.nodes.forEach(n => { (byId[community[n]] = byId[community[n]] || []).push(n); });

  const clusters = Object.keys(byId).map(id => {
    const members = byId[id].slice().sort();
    const moduleCounts = {};
    members.forEach(n => {
      const mod = SCHEMA.tables[n].module;
      moduleCounts[mod] = (moduleCounts[mod] || 0) + 1;
    });
    const dominantModule = Object.keys(moduleCounts).sort((a, b) => moduleCounts[b] - moduleCounts[a])[0];
    const purity = moduleCounts[dominantModule] / members.length;
    let internalEdges = 0, externalEdges = 0;
    members.forEach(n => {
      graph.adj[n].forEach((w, neigh) => {
        if (members.includes(neigh)) internalEdges += w; else externalEdges += w;
      });
    });
    internalEdges /= 2;
    return { id, members, dominantModule, moduleCounts, purity, internalEdges, externalEdges };
  }).sort((a, b) => b.members.length - a.members.length)
    .map((c, i) => Object.assign(c, { label: `Cluster ${i + 1}` }));

  // overall agreement: fraction of tables whose own module equals their cluster's dominant module
  let agree = 0;
  clusters.forEach(c => { agree += c.moduleCounts[c.dominantModule] || 0; });
  const agreementRate = graph.nodes.length ? agree / graph.nodes.length : 0;

  const outliers = [];
  clusters.forEach(c => {
    c.members.forEach(n => {
      if (SCHEMA.tables[n].module !== c.dominantModule) outliers.push({ table: n, cluster: c.label, ownModule: SCHEMA.tables[n].module, clusterModule: c.dominantModule });
    });
  });

  const result = {
    clusters, modularity, passes, agreementRate, outliers,
    tableCount: graph.nodes.length,
    edgeCount: graph.totalWeight,
    manualModuleCount: SCHEMA.modules.length,
  };
  lastAutoGroupResult = result;
  return result;
}

/* ---- modularity quality label ---- */
function modularityQualityLabel(q){
  if (q >= 0.5) return "strong community structure";
  if (q >= 0.3) return "clear community structure";
  if (q >= 0.1) return "weak community structure";
  return "little to no community structure";
}

/* ---- render results panel ---- */
function renderAutoGroupPanel(result){
  const body = document.getElementById("autoGroupBody");
  if (!body) return;
  const pct = n => Math.round(n * 100) + "%";
  let html = `
    <div class="ag-summary">
      <div class="ag-stat"><div class="n">${result.clusters.length}</div><div class="l">Clusters found</div></div>
      <div class="ag-stat"><div class="n">${result.modularity.toFixed(3)}</div><div class="l">Modularity Q</div></div>
      <div class="ag-stat"><div class="n">${pct(result.agreementRate)}</div><div class="l">Match vs manual modules</div></div>
    </div>
    <div class="ag-note">
      Computed with a greedy Louvain-style modularity optimization over the actual FK graph
      (${result.edgeCount} FK edges across ${result.tableCount} tables, converged in ${result.passes} pass${result.passes===1?"":"es"}) —
      ${modularityQualityLabel(result.modularity)}. This never reads the hand-assigned <code>module</code> field;
      that field is only used afterwards, below, to see how closely the graph-driven grouping tracks it.
    </div>
    <div class="ag-clusters">
  `;
  result.clusters.forEach(c => {
    html += `
      <div class="ag-cluster">
        <div class="ag-cluster-head">
          <span class="ag-dot" style="background:${modColor(c.dominantModule)}"></span>
          <b>${c.label}</b>
          <span class="ag-size">${c.members.length} table${c.members.length===1?"":"s"}</span>
          <span class="ag-purity" title="Share of members whose manual module matches this cluster's dominant module">${pct(c.purity)} purity</span>
        </div>
        <div class="ag-cluster-sub">Closest manual module: <b style="color:${modColor(c.dominantModule)}">${c.dominantModule}</b> · ${c.internalEdges} internal FK link${c.internalEdges===1?"":"s"}, ${c.externalEdges} external</div>
        <div class="ag-members">
          ${c.members.map(n => {
            const mismatch = SCHEMA.tables[n].module !== c.dominantModule;
            return `<span class="ag-chip${mismatch ? " mismatch" : ""}" data-table="${n}" title="${mismatch ? "Manual module: " + SCHEMA.tables[n].module : "Matches manual module"}">${n}</span>`;
          }).join("")}
        </div>
      </div>
    `;
  });
  html += `</div>`;
  if (result.outliers.length){
    html += `<div class="ag-note" style="margin-top:10px;">
      <b>${result.outliers.length}</b> table${result.outliers.length===1?"":"s"} sit structurally closer (by FK density) to a different
      cluster than their manually assigned module would suggest — hover a highlighted chip above for details.
    </div>`;
  }
  body.innerHTML = html;

  body.querySelectorAll(".ag-cluster-head").forEach(head => {
    head.style.cursor = "pointer";
    head.onclick = () => {
      const clusterEl = head.closest(".ag-cluster");
      const tables = Array.from(clusterEl.querySelectorAll(".ag-chip")).map(el => el.dataset.table);
      highlightAutoCluster(tables);
    };
  });
  body.querySelectorAll(".ag-chip").forEach(chip => {
    chip.onclick = (e) => {
      e.stopPropagation();
      switchView("erd");
      openDetails(chip.dataset.table);
      centerOnTable(chip.dataset.table);
    };
  });
}

/* highlight a set of tables in the ERD using the existing matched/dimmed styling */
function highlightAutoCluster(tables){
  switchView("erd");
  requestAnimationFrame(() => {
    Object.keys(cardNodes).forEach(n => {
      const cardEl = cardNodes[n].fo.querySelector(".table-card");
      const inCluster = tables.includes(n);
      cardEl.classList.toggle("matched", inCluster);
      cardEl.classList.toggle("dimmed", !inCluster);
    });
    toast(`Highlighting ${tables.length} table${tables.length===1?"":"s"} from this cluster — clear via search/reset`);
  });
}

function runAutoGrouping(){
  const body = document.getElementById("autoGroupBody");
  if (body) body.innerHTML = `<div class="ag-note">Running modularity optimization…</div>`;
  requestAnimationFrame(() => {
    const result = computeAutoGroups();
    renderAutoGroupPanel(result);
  });
}

(function initAutoGroupPanel(){
  const toggle = document.getElementById("autoGroupToggle");
  const runBtn = document.getElementById("autoGroupRun");
  const body = document.getElementById("autoGroupBody");
  if (!toggle || !runBtn || !body) return;

  toggle.onclick = (e) => {
    const collapsed = body.style.display === "none";
    body.style.display = collapsed ? "" : "none";
    e.target.textContent = collapsed ? "–" : "+";
    if (collapsed && !lastAutoGroupResult) runAutoGrouping();
  };
  runBtn.onclick = runAutoGrouping;
})();
