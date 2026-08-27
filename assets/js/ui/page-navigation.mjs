const PAGE_CACHE = new Map();
const PAGE_ORDER = ["home", "notice", "about", "guide", "update"];
const EXIT_DURATION = 450;
const TRANSITION_GAP = 120;
const ENTER_DURATION = 520;
let initialized = false;
let isNavigating = false;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isPageUrl(url) {
  if (url.origin !== window.location.origin) return false;

  const fileName = url.pathname.split("/").pop() || "";
  return fileName === "" || /\.html?$/i.test(fileName);
}

function getNavigationTarget(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return null;
  }

  const link = event.target instanceof Element
    ? event.target.closest("a[href]")
    : null;

  if (
    !link ||
    link.target ||
    link.hasAttribute("download") ||
    link.hasAttribute("data-download-link") ||
    link.getAttribute("aria-disabled") === "true"
  ) {
    return null;
  }

  const rawHref = link.getAttribute("href");
  if (
    !rawHref ||
    rawHref === "#" ||
    rawHref.startsWith("#") ||
    rawHref.startsWith("javascript:")
  ) {
    return null;
  }

  const url = new URL(link.href, window.location.href);
  if (!isPageUrl(url)) return null;

  if (
    url.pathname === window.location.pathname &&
    url.search === window.location.search
  ) {
    return null;
  }

  return url;
}

async function loadPage(url) {
  const cacheKey = url.pathname + url.search;

  if (!PAGE_CACHE.has(cacheKey)) {
    PAGE_CACHE.set(
      cacheKey,
      fetch(url.href, {
        credentials: "same-origin",
        headers: { "X-Requested-With": "PageRivetNavigation" }
      }).then(function (response) {
        if (!response.ok) {
          throw new Error("Page request failed with status " + response.status);
        }
        return response.text();
      }).catch(function (error) {
        PAGE_CACHE.delete(cacheKey);
        throw error;
      })
    );
  }

  const html = await PAGE_CACHE.get(cacheKey);
  return new DOMParser().parseFromString(html, "text/html");
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
  if (prefersReducedMotion()) return Promise.resolve();

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

function updateMetadata(nextDocument) {
  document.title = nextDocument.title;

  const nextDescription = nextDocument.querySelector('meta[name="description"]');
  const currentDescription = document.querySelector('meta[name="description"]');

  if (nextDescription && currentDescription) {
    currentDescription.setAttribute(
      "content",
      nextDescription.getAttribute("content") || ""
    );
  }
}

function getPageKeyFromUrl(url) {
  const fileName = url.pathname.split("/").pop() || "index.html";
  return fileName.replace(/\.html?$/i, "") || "home";
}

function getPageKey(nextDocument, url) {
  const activeNavigation = nextDocument.querySelector(
    '.site-header [data-nav-id][aria-current="page"]'
  );

  if (activeNavigation && activeNavigation.dataset.navId) {
    return activeNavigation.dataset.navId;
  }

  return getPageKeyFromUrl(url);
}

function getCurrentPageKey() {
  const activeNavigation = document.querySelector(
    '.site-header [data-nav-id][aria-current="page"]'
  );

  if (activeNavigation && activeNavigation.dataset.navId) {
    return activeNavigation.dataset.navId;
  }

  const fileName = window.location.pathname.split("/").pop() || "index.html";
  return fileName.replace(/\.html?$/i, "") || "home";
}

function getNavigationDirection(currentPageKey, nextPageKey) {
  const currentIndex = PAGE_ORDER.indexOf(currentPageKey);
  const nextIndex = PAGE_ORDER.indexOf(nextPageKey);

  if (currentIndex === -1 || nextIndex === -1) return "forward";
  return nextIndex >= currentIndex ? "forward" : "backward";
}

function syncNavigation(pageKey) {
  document.querySelectorAll(".site-header [data-nav-id]").forEach(function (link) {
    const isActive = link.dataset.navId === pageKey;

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("tabindex", "-1");
    } else {
      link.removeAttribute("aria-current");
      link.removeAttribute("aria-disabled");
      link.removeAttribute("tabindex");
    }
  });
}

function syncReleaseToast(nextDocument) {
  const currentToast = document.querySelector("[data-release-toast]");
  const nextToast = nextDocument.querySelector("[data-release-toast]");

  if (currentToast) currentToast.remove();
  if (!nextToast) return;

  const footer = document.querySelector(".site-footer");
  const importedToast = document.importNode(nextToast, true);

  if (footer) {
    footer.before(importedToast);
  } else {
    document.body.append(importedToast);
  }
}

function scrollToDestination(url) {
  if (!url.hash) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return;
  }

  let target = null;

  try {
    target = document.querySelector(url.hash);
  } catch {
    target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  }

  if (target) {
    target.scrollIntoView({ block: "start", behavior: "auto" });
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }
}

function focusDestination(url, main) {
  let target = null;

  if (url.hash) {
    try {
      target = document.querySelector(url.hash);
    } catch {
      target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    }
  }

  target = target || main;

  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
    target.addEventListener("blur", function () {
      target.removeAttribute("tabindex");
    }, { once: true });
  }

  target.focus({ preventScroll: true });
}

async function navigate(url, pushHistory, onPageChange) {
  if (isNavigating) return;
  isNavigating = true;

  const currentMain = document.querySelector("#main-content");
  if (!currentMain) {
    window.location.assign(url.href);
    return;
  }

  try {
    const nextDocument = await loadPage(url);
    const nextMainSource = nextDocument.querySelector("#main-content");

    if (!nextMainSource) {
      throw new Error("The destination page does not contain #main-content.");
    }

    const pageKey = getPageKey(nextDocument, url);
    const currentPageKey = getCurrentPageKey();
    const direction = getNavigationDirection(currentPageKey, pageKey);
    const directionClass = "page-router-" + direction;
    const shouldAnimate = !prefersReducedMotion();

    const visibleToast = document.querySelector("[data-release-toast]");
    if (visibleToast) {
      visibleToast.classList.remove("is-visible");
      visibleToast.hidden = true;
    }

    document.documentElement.classList.add("is-page-navigating");

    if (shouldAnimate) {
      currentMain.classList.add("page-router-leave", directionClass);
      await waitForAnimation(currentMain, EXIT_DURATION);
      currentMain.style.visibility = "hidden";
      await wait(TRANSITION_GAP);
    }

    const nextMain = document.importNode(nextMainSource, true);

    if (shouldAnimate) {
      nextMain.classList.add("page-router-enter-ready", directionClass);
    }

    updateMetadata(nextDocument);
    document.body.className = nextDocument.body.className;
    document.body.dataset.previewPage = pageKey;
    currentMain.replaceWith(nextMain);
    syncReleaseToast(nextDocument);
    syncNavigation(pageKey);

    if (pushHistory) {
      window.history.pushState({ pageRivetRoute: true }, "", url.href);
    }

    scrollToDestination(url);

    if (typeof onPageChange === "function") {
      onPageChange();
    }

    if (shouldAnimate) {
      await waitForNextPaint();
      nextMain.classList.remove("page-router-enter-ready");
      nextMain.classList.add("page-router-enter");
      await waitForAnimation(nextMain, ENTER_DURATION);
      nextMain.classList.remove("page-router-enter", directionClass);
    }

    focusDestination(url, nextMain);
  } catch (error) {
    console.error("PageRivet page navigation failed.", error);
    currentMain.classList.remove(
      "page-router-leave",
      "page-router-forward",
      "page-router-backward"
    );
    currentMain.style.removeProperty("visibility");
    window.location.assign(url.href);
  } finally {
    document.documentElement.classList.remove("is-page-navigating");
    isNavigating = false;
  }
}

function prefetchLink(event) {
  const link = event.target instanceof Element
    ? event.target.closest("a[href]")
    : null;

  if (
    !link ||
    link.target ||
    link.hasAttribute("download") ||
    link.hasAttribute("data-download-link") ||
    link.getAttribute("aria-disabled") === "true"
  ) {
    return;
  }

  const url = new URL(link.href, window.location.href);

  if (
    isPageUrl(url) &&
    (url.pathname !== window.location.pathname || url.search !== window.location.search)
  ) {
    loadPage(url).catch(function () {
      // Navigation will use the browser fallback if this request still fails.
    });
  }
}

export function initPageNavigation(onPageChange) {
  if (initialized || document.body.dataset.previewPage) return;
  initialized = true;

  document.addEventListener("click", function (event) {
    const url = getNavigationTarget(event);
    if (!url) return;

    event.preventDefault();
    navigate(url, true, onPageChange);
  });

  document.addEventListener("pointerover", prefetchLink, { passive: true });
  document.addEventListener("focusin", prefetchLink);

  window.addEventListener("popstate", function () {
    const url = new URL(window.location.href);

    if (getPageKeyFromUrl(url) === getCurrentPageKey()) {
      return;
    }

    navigate(url, false, onPageChange);
  });
}
