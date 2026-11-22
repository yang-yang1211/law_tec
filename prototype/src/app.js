import { PAGES } from "./pages.js";
import { renderNavigation, renderPage, renderRail } from "./ui.js";

function currentPage() {
  const pageId = window.location.hash.replace(/^#\/?/, "");
  return Object.hasOwn(PAGES, pageId) ? pageId : "home";
}

function renderApp() {
  const pageId = currentPage();
  renderNavigation(pageId);
  renderPage(pageId);
  renderRail();
}

document.addEventListener("click", (event) => {
  const control = event.target.closest("[data-page]");
  if (!control || !PAGES[control.dataset.page]) return;
  window.location.hash = `/${control.dataset.page}`;
});

window.addEventListener("hashchange", renderApp);
if (!window.location.hash) window.location.hash = "/home";
renderApp();