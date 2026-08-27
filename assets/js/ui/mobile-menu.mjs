function setMenuOpen(toggle, panel, isOpen) {
  toggle.setAttribute("aria-expanded", String(isOpen));
  panel.classList.toggle("is-open", isOpen);
  const label = toggle.querySelector("[data-mobile-menu-label]");
  if (label) label.textContent = isOpen ? "메뉴 닫기" : "메뉴 열기";
}

export function initMobileMenu() {
  const toggle = document.querySelector("[data-mobile-menu-toggle]");
  const panel = document.querySelector("[data-mobile-menu-panel]");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", function () {
    setMenuOpen(toggle, panel, toggle.getAttribute("aria-expanded") !== "true");
  });

  panel.addEventListener("click", function (event) {
    if (event.target.closest("a")) setMenuOpen(toggle, panel, false);
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".site-nav")) setMenuOpen(toggle, panel, false);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1024) setMenuOpen(toggle, panel, false);
  });
}
