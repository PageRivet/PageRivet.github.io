const EXIT_DURATION = 450;
const TRANSITION_GAP = 120;
const ENTER_DURATION = 520;
const activeStages = new WeakSet();

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToContentStart(target) {
  if (!target || typeof target.scrollIntoView !== "function") return;

  target.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start"
  });
}

function wait(duration) {
  return new Promise(function (resolve) {
    window.setTimeout(resolve, duration);
  });
}

function waitForNextPaint() {
  return new Promise(function (resolve) {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(resolve);
    });
  });
}

function waitForAnimation(element, duration) {
  return new Promise(function (resolve) {
    let completed = false;

    function finish() {
      if (completed) return;
      completed = true;
      element.removeEventListener("animationend", handleAnimationEnd);
      window.clearTimeout(fallbackTimer);
      resolve();
    }

    function handleAnimationEnd(event) {
      if (event.target !== element) return;
      finish();
    }

    const fallbackTimer = window.setTimeout(finish, duration + 120);
    element.addEventListener("animationend", handleAnimationEnd);
  });
}

export async function transitionContentPanels(currentPanel, nextPanel, direction, options) {
  if (!currentPanel || !nextPanel || currentPanel === nextPanel) return false;

  const settings = options || {};
  const stage = currentPanel.parentElement;

  if (!stage || activeStages.has(stage)) return false;
  activeStages.add(stage);

  const directionClass = direction === "backward"
    ? "content-router-backward"
    : "content-router-forward";
  const shouldAnimate = !prefersReducedMotion();
  const initialHeight = currentPanel.offsetHeight;

  stage.classList.add("is-content-transitioning");
  stage.style.minHeight = initialHeight + "px";

  if (settings.scrollToStart) {
    scrollToContentStart(settings.scrollTarget || stage);
  }

  try {
    if (shouldAnimate) {
      currentPanel.classList.add("content-router-leave", directionClass);
      await waitForAnimation(currentPanel, EXIT_DURATION);
    }

    currentPanel.hidden = true;
    currentPanel.classList.remove("content-router-leave", directionClass);

    if (settings.removeCurrent) {
      currentPanel.remove();
    }

    if (shouldAnimate) {
      await wait(TRANSITION_GAP);
      nextPanel.classList.add("content-router-enter-ready", directionClass);
    }

    nextPanel.hidden = false;
    stage.style.minHeight = nextPanel.offsetHeight + "px";

    if (shouldAnimate) {
      await waitForNextPaint();
      nextPanel.classList.remove("content-router-enter-ready");
      nextPanel.classList.add("content-router-enter");
      await waitForAnimation(nextPanel, ENTER_DURATION);
      nextPanel.classList.remove("content-router-enter", directionClass);
    }

    return true;
  } finally {
    stage.classList.remove("is-content-transitioning");
    stage.style.removeProperty("min-height");
    activeStages.delete(stage);
  }
}
