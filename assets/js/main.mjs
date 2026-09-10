import { initI18n, refreshI18n } from "./core/i18n.mjs";
import { initTheme } from "./ui/theme.mjs";
import { initMobileMenu } from "./ui/mobile-menu.mjs";
import { initBackToTop } from "./ui/back-to-top.mjs";
import { initPageNavigation } from "./ui/page-navigation.mjs";
import { initDemoEditor } from "./features/demo-editor.mjs";
import { initGuideToc } from "./features/guide-toc.mjs";
import { initMcpCommands } from "./features/mcp-commands.mjs";
import { initNewsBoard } from "./features/news-board.mjs";
import { initSectionNavigation } from "./features/section-navigation.mjs";
import { initDownloadGuard, initLatestDownloadRelease } from "./features/download-guard.mjs";
import { initReleaseToast } from "./features/release-toast.mjs";
import { initContactForms } from "./features/contact-form.mjs";

let initialized = false;

function initCurrentNavigation() {
  const fileName = window.location.pathname.split("/").pop() || "index.html";
  const pageKey = fileName.replace(/\.html?$/i, "") || "home";
  const activeKey = pageKey === "index" ? "home" : pageKey;

  document.querySelectorAll(".site-header [data-nav-id]").forEach(function (link) {
    const isActive = link.dataset.navId === activeKey;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("tabindex", "-1");
    }
  });

  document.addEventListener("click", function (event) {
    const target = event.target instanceof Element
      ? event.target.closest('.site-header a[aria-disabled="true"]')
      : null;

    if (target) event.preventDefault();
  });
}

export function initPageFeatures() {
  initDemoEditor();
  initGuideToc();
  initMcpCommands();
  initNewsBoard();
  initSectionNavigation();
  initLatestDownloadRelease();
  initContactForms();
}

export function refreshPageFeatures() {
  initPageFeatures();
  initReleaseToast();
  refreshI18n();
}

function init() {
  if (initialized) return;
  initialized = true;

  initTheme();
  initI18n();
  initMobileMenu();
  initCurrentNavigation();
  initBackToTop();
  initDownloadGuard();
  initPageFeatures();
  initReleaseToast();
  initPageNavigation(refreshPageFeatures);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
