import { transitionContentPanels } from "../ui/content-transition.mjs";

function setButtonState(button, isActive) {
  button.classList.toggle("is-active", isActive);
  button.setAttribute("aria-selected", String(isActive));
  button.setAttribute("tabindex", isActive ? "0" : "-1");
}

function updateHash(panelId) {
  const url = new URL(window.location.href);
  url.hash = panelId;
  window.history.replaceState(window.history.state, "", url.href);
}

function initNavigationRoot(root) {
  if (root.hasAttribute("data-section-navigation-initialized")) return;

  const buttons = Array.from(root.querySelectorAll("[data-section-target]"));
  const panels = Array.from(root.querySelectorAll("[data-section-panel]"));

  if (!buttons.length || !panels.length) return;

  const panelOrder = panels.map(function (panel) {
    return panel.dataset.sectionPanel;
  });
  const requestedPanel = window.location.hash.slice(1);
  const defaultPanel = root.dataset.defaultSection || panelOrder[0];
  let currentPanelId = panelOrder.includes(requestedPanel)
    ? requestedPanel
    : defaultPanel;
  let currentIndex = panelOrder.indexOf(currentPanelId);
  let transitioning = false;

  panels.forEach(function (panel) {
    panel.hidden = panel.dataset.sectionPanel !== currentPanelId;
  });

  buttons.forEach(function (button) {
    const panelId = button.dataset.sectionTarget;
    setButtonState(button, panelId === currentPanelId);

    button.addEventListener("click", async function () {
      const nextPanelId = button.dataset.sectionTarget;
      const nextIndex = panelOrder.indexOf(nextPanelId);

      if (transitioning || nextIndex === -1 || nextPanelId === currentPanelId) return;

      const currentPanel = panels[currentIndex];
      const nextPanel = panels[nextIndex];
      const direction = nextIndex > currentIndex ? "forward" : "backward";

      transitioning = true;
      buttons.forEach(function (item) {
        setButtonState(item, item === button);
      });

      try {
        const changed = await transitionContentPanels(
          currentPanel,
          nextPanel,
          direction,
          { scrollToStart: true }
        );

        if (changed) {
          currentPanelId = nextPanelId;
          currentIndex = nextIndex;
          updateHash(nextPanelId);
        }
      } finally {
        buttons.forEach(function (item) {
          setButtonState(item, item.dataset.sectionTarget === currentPanelId);
        });
        transitioning = false;
      }
    });
  });

  root.setAttribute("data-section-navigation-initialized", "");
}

export function initSectionNavigation() {
  document.querySelectorAll("[data-section-navigation]").forEach(initNavigationRoot);
}
