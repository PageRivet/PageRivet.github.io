import { readPreference, removePreference, savePreference } from "../core/preferences.mjs";

const POPUP_ENDPOINT = "https://api.pagerivet.app/popup";
const EXIT_DURATION = 380;
let showTimer = null;
let autoCloseTimer = null;
let exitTimer = null;
let currentPopup = null;

function clearToastTimers() {
  [showTimer, autoCloseTimer, exitTimer].forEach(function (timer) {
    if (timer !== null) window.clearTimeout(timer);
  });
  showTimer = null;
  autoCloseTimer = null;
  exitTimer = null;
}

function closeToast(toast) {
  clearToastTimers();
  toast.classList.remove("is-visible");
  exitTimer = window.setTimeout(function () {
    toast.hidden = true;
    exitTimer = null;
  }, EXIT_DURATION);
}

function language() {
  return document.documentElement.lang === "en" ? "en" : "ko";
}

function renderPopup(toast, popup) {
  const lang = language();
  const title = toast.querySelector("[data-release-title]");
  const message = toast.querySelector("[data-release-message]");
  const link = toast.querySelector("[data-release-primary]");
  if (title) title.textContent = popup.title[lang] || popup.title.ko;
  if (message) message.textContent = popup.message[lang] || popup.message.ko;
  if (link) {
    const label = popup.link.label[lang] || popup.link.label.ko;
    link.textContent = label;
    link.href = popup.link.url || "/news.html?category=update";
    link.hidden = !label;
  }
}

function readPopup(payload) {
  const popup = payload && payload.ok === true && payload.active === true ? payload.popup : null;
  if (!popup || !popup.title || !popup.message || !popup.link) return null;
  const visibleSeconds = Number(popup.visibleSeconds);
  return {
    visibleSeconds: Number.isFinite(visibleSeconds) ? Math.min(Math.max(visibleSeconds, 3), 60) : 7,
    updatedAt: String(popup.updatedAt || "current"),
    title: popup.title,
    message: popup.message,
    link: popup.link,
  };
}

export async function initReleaseToast() {
  clearToastTimers();

  const toast = document.querySelector("[data-release-toast]");
  if (!toast) return;
  toast.classList.remove("is-visible");
  toast.hidden = true;

  const previewPage = document.body.dataset.previewPage;
  if (previewPage && previewPage !== "home") return;

  try {
    const response = await fetch(POPUP_ENDPOINT, { headers: { "Accept": "application/json" } });
    if (!response.ok) throw new Error("Popup request failed: HTTP " + response.status);
    currentPopup = readPopup(await response.json());
  } catch (error) {
    currentPopup = null;
    console.warn(JSON.stringify({
      event: "release_popup_error",
      error: error instanceof Error ? error.message : String(error),
    }));
  }
  if (!currentPopup) return;

  renderPopup(toast, currentPopup);
  const hiddenVersionKey = "release-popup-" + currentPopup.updatedAt + "-hidden";
  const hideVersion = toast.querySelector("[data-release-hide-version]");

  if (hideVersion && !toast.hasAttribute("data-release-toast-initialized")) {
    hideVersion.checked = false;
    hideVersion.addEventListener("change", function () {
      if (!currentPopup) return;
      const key = "release-popup-" + currentPopup.updatedAt + "-hidden";
      if (hideVersion.checked) savePreference(key, "true");
      else removePreference(key);
    });
    toast.querySelectorAll("[data-close-release-toast], [data-dismiss-release-toast]").forEach(function (element) {
      element.addEventListener("click", function () { closeToast(toast); });
    });
    document.addEventListener("pagerivet:languagechange", function () {
      if (currentPopup) renderPopup(toast, currentPopup);
    });
    toast.setAttribute("data-release-toast-initialized", "");
  }

  if (readPreference(hiddenVersionKey, "false") === "true") return;
  showTimer = window.setTimeout(function () {
    showTimer = null;
    if (!currentPopup || readPreference(hiddenVersionKey, "false") === "true") return;
    toast.hidden = false;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        toast.classList.add("is-visible");
        autoCloseTimer = window.setTimeout(function () {
          closeToast(toast);
        }, currentPopup.visibleSeconds * 1000);
      });
    });
  }, 700);
}
