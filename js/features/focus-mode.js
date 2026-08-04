/* ============================================================
   SMART FOCUS MODE
   ============================================================ */
function applyFocusMode(){
  if (!state.selected){ clearFocusMode(); return; }
  if (state.activeModuleNav) clearModuleNav();
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

