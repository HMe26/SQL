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
  populateDatatypeFilter();
  initMinimapPanels();
  renderBreadcrumbs();

  requestAnimationFrame(fitView);

  // ---- loading skeleton: shown by default in HTML/CSS so first paint
  // never shows an empty canvas; hide it once the diagram has actually
  // been laid out and rendered above.
  const skeletonEl = document.getElementById("loadingSkeleton");
  if (skeletonEl){
    requestAnimationFrame(() => {
      skeletonEl.classList.add("hide");
      setTimeout(() => { skeletonEl.style.display = "none"; }, 400);
    });
  }

  setTimeout(() => {
    const hint = document.getElementById("canvasHint");
    if (hint) hint.style.opacity = "0";
  }, 5000);
}

document.addEventListener("DOMContentLoaded", init);