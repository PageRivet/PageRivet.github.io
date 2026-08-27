export function initBackToTop() {
  const button = document.querySelector("[data-back-to-top]");
  if (!button) return;

  function update() {
    button.classList.toggle("is-visible", window.scrollY > 520);
  }

  window.addEventListener("scroll", update, { passive: true });
  update();

  button.addEventListener("click", function () {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    window.scrollTo({ top: 0, behavior: behavior });
  });
}
