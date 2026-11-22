import { NAV_ITEMS, PAGES, RAIL_MODULES } from "./pages.js";

function navMarkup(activePage, mobile = false) {
  const items = mobile ? NAV_ITEMS.filter((item) => ["home", "legislature", "ask", "saved", "settings"].includes(item.id)) : NAV_ITEMS;
  return items.map((item) => `
    <button class="nav-link" type="button" data-page="${item.id}"${activePage === item.id ? ' aria-current="page"' : ""}>
      <span class="nav-icon" aria-hidden="true">${item.symbol}</span><span>${item.label}</span>
    </button>`).join("");
}

function moduleMarkup(module) {
  const rows = module.type === "rows" || module.type === "list" || module.type === "conversation";
  const rowCount = module.type === "conversation" ? 3 : module.type === "rows" ? 2 : 3;
  const content = rows
    ? `<div class="skeleton-stack">${Array.from({ length: rowCount }, (_, index) => `
        <div class="skeleton-row"><span class="skeleton-dot"></span><span class="skeleton-lines"><i class="skeleton-line ${index === 1 ? "medium" : "long"}"></i><i class="skeleton-line short"></i></span></div>`).join("")}</div>`
    : `<div class="skeleton-block" aria-hidden="true"></div>`;
  return `<section class="module-card ${module.layout === "wide" ? "wide" : ""}"><h2>${module.title}</h2>${content}</section>`;
}

export function renderNavigation(activePage) {
  document.querySelector("#primary-navigation").innerHTML = navMarkup(activePage);
  document.querySelector("#mobile-navigation").innerHTML = navMarkup(activePage, true);
}

export function renderPage(pageId) {
  const page = PAGES[pageId] ?? PAGES.home;
  document.querySelector("#page-content").innerHTML = `
    <header class="page-heading">
      <p class="eyebrow">法訊雷達 / ${page.title}</p>
      <h1>${page.title}</h1>
      <p>${page.description}</p>
    </header>
    <div class="module-grid">${page.modules.map(moduleMarkup).join("")}</div>`;
  document.title = `${page.title}｜法訊雷達`;
}

export function renderRail() {
  document.querySelector("#context-rail").innerHTML = RAIL_MODULES.map((title) => `
    <section class="rail-card"><h2>${title}</h2><div class="skeleton-stack"><div class="skeleton-line long"></div><div class="skeleton-line medium"></div><div class="skeleton-line short"></div></div></section>`).join("");
}