let activeObserver = null;

export function initGuideToc() {
  if (activeObserver) {
    activeObserver.disconnect();
    activeObserver = null;
  }

  const toc = document.querySelector("[data-guide-toc]");
  if (!toc) return;

  const links = Array.from(toc.querySelectorAll('a[href^="#"]'));
  const sections = links.map(function (link) {
    return document.querySelector(link.getAttribute("href"));
  }).filter(Boolean);

  if (!sections.length) return;

  activeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
      });
    });
  }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });

  sections.forEach(function (section) {
    activeObserver.observe(section);
  });
}
