const PAGE_ORDER = ["home", "notice", "about", "guide", "update", "download"];
const EXIT_DURATION = 450;
const TRANSITION_GAP = 120;
const ENTER_DURATION = 520;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

function getDirection(currentPageKey, nextPageKey) {
  const currentIndex = PAGE_ORDER.indexOf(currentPageKey);
  const nextIndex = PAGE_ORDER.indexOf(nextPageKey);

  if (currentIndex === -1 || nextIndex === -1) return "forward";
  return nextIndex >= currentIndex ? "forward" : "backward";
}

export async function runPreviewPageTransition(options) {
  const currentPageKey = options.currentPageKey;
  const nextPageKey = options.nextPageKey;
  const apply = options.apply;
  const currentMain = document.querySelector("#main-content");

  if (typeof apply !== "function") {
    throw new TypeError("미리보기 페이지 적용 함수가 필요합니다.");
  }

  if (!currentMain || prefersReducedMotion()) {
    apply();
    return;
  }

  const directionClass = "page-router-" + getDirection(currentPageKey, nextPageKey);
  document.documentElement.classList.add("is-page-navigating");

  try {
    currentMain.classList.add("page-router-leave", directionClass);
    await waitForAnimation(currentMain, EXIT_DURATION);
    currentMain.style.visibility = "hidden";
    await wait(TRANSITION_GAP);

    apply();

    const nextMain = document.querySelector("#main-content");
    if (!nextMain) {
      throw new Error("미리보기 전환 후 본문을 찾지 못했습니다.");
    }

    nextMain.classList.add("page-router-enter-ready", directionClass);
    await waitForNextPaint();
    nextMain.classList.remove("page-router-enter-ready");
    nextMain.classList.add("page-router-enter");
    await waitForAnimation(nextMain, ENTER_DURATION);
    nextMain.classList.remove("page-router-enter", directionClass);
  } catch (error) {
    currentMain.classList.remove(
      "page-router-leave",
      "page-router-forward",
      "page-router-backward"
    );
    currentMain.style.removeProperty("visibility");
    throw error;
  } finally {
    document.documentElement.classList.remove("is-page-navigating");
  }
}
