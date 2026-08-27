import { readPreference, removePreference, savePreference } from "../core/preferences.mjs";

const VISIBLE_DURATION = 7000;
const EXIT_DURATION = 380;
let showTimer = null;
let autoCloseTimer = null;
let exitTimer = null;

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

export function initReleaseToast() {
  clearToastTimers();

  const toast = document.querySelector("[data-release-toast]");
  if (!toast) return;
  toast.classList.remove("is-visible");
  toast.hidden = true;

  const previewPage = document.body.dataset.previewPage;
  if (previewPage && previewPage !== "home") return;

  const version = toast.dataset.releaseVersion;
  const expiresAt = Date.parse(toast.dataset.releaseExpiresAt || "");
  const hiddenVersionKey = "release-" + version + "-hidden";
  const hideVersion = toast.querySelector("[data-release-hide-version]");

  if (Number.isFinite(expiresAt) && Date.now() > expiresAt) return;
  if (readPreference(hiddenVersionKey, "false") === "true") return;

  if (hideVersion && !toast.hasAttribute("data-release-toast-initialized")) {
    hideVersion.checked = false;
    hideVersion.addEventListener("change", function () {
      if (hideVersion.checked) {
        savePreference(hiddenVersionKey, "true");
      } else {
        removePreference(hiddenVersionKey);
      }
    });

    toast.querySelectorAll("[data-close-release-toast], [data-dismiss-release-toast]").forEach(function (element) {
      element.addEventListener("click", function () {
        closeToast(toast);
      });
    });
    toast.setAttribute("data-release-toast-initialized", "");
  }

  showTimer = window.setTimeout(function () {
    showTimer = null;
    if (Number.isFinite(expiresAt) && Date.now() > expiresAt) return;
    if (readPreference(hiddenVersionKey, "false") === "true") return;

    toast.hidden = false;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        toast.classList.add("is-visible");
        autoCloseTimer = window.setTimeout(function () {
          closeToast(toast);
        }, VISIBLE_DURATION);
      });
    });
  }, 700);
}
