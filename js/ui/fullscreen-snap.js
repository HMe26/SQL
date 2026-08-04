/* ============================================================
   FULLSCREEN MODE & SNAP-TO-GRID
   ============================================================ */

// ---- Fullscreen ----
function isFullscreen(){ return !!document.fullscreenElement; }
function applyFullscreenIcon(){
  const icon = document.getElementById("fullscreenIcon");
  if (icon) icon.innerHTML = svgIcon(isFullscreen() ? "minimize" : "maximize", 15);
  const btn = document.getElementById("btnFullscreen");
  if (btn){
    btn.setAttribute("aria-pressed", isFullscreen() ? "true" : "false");
    btn.title = isFullscreen() ? "Exit fullscreen" : "Toggle fullscreen";
  }
}
function toggleFullscreen(){
  if (!document.fullscreenEnabled){ toast("Fullscreen isn't supported in this browser"); return; }
  if (isFullscreen()) document.exitFullscreen();
  else document.getElementById("app").requestFullscreen().catch(() => toast("Couldn't enter fullscreen"));
}
document.getElementById("btnFullscreen").onclick = () => toggleFullscreen();
document.addEventListener("fullscreenchange", () => {
  applyFullscreenIcon();
  toast(isFullscreen() ? "Fullscreen on" : "Fullscreen off");
});
applyFullscreenIcon();

// ---- Snap to grid ----
function applySnapButtonState(){
  const btn = document.getElementById("btnSnapToggle");
  const icon = document.getElementById("snapIcon");
  if (icon) icon.innerHTML = svgIcon("grid-snap", 15);
  if (btn){
    btn.classList.toggle("active", state.snapToGrid);
    btn.setAttribute("aria-pressed", state.snapToGrid ? "true" : "false");
  }
  const canvasWrap = document.getElementById("canvasWrap");
  if (canvasWrap) canvasWrap.classList.toggle("snap-grid-active", state.snapToGrid);
}
function toggleSnapToGrid(force){
  state.snapToGrid = (typeof force === "boolean") ? force : !state.snapToGrid;
  try { localStorage.setItem("snapToGrid", state.snapToGrid ? "1" : "0"); } catch (e) {}
  applySnapButtonState();
  toast(state.snapToGrid ? "Snap to grid on" : "Snap to grid off");
}
document.getElementById("btnSnapToggle").onclick = () => toggleSnapToGrid();
applySnapButtonState();
