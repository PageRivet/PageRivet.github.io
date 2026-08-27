import { initI18n, refreshI18n } from "./core/i18n.mjs";
import { initTheme } from "./ui/theme.mjs";
import { initMobileMenu } from "./ui/mobile-menu.mjs";
import { initBackToTop } from "./ui/back-to-top.mjs";
import { initPageNavigation } from "./ui/page-navigation.mjs";
import { initDemoEditor } from "./features/demo-editor.mjs";
import { initGuideToc } from "./features/guide-toc.mjs";
import { initMcpCommands } from "./features/mcp-commands.mjs";
import { initUpdateLog } from "./features/update-log.mjs";
import { initNoticeList } from "./features/notice-list.mjs";
import { initSectionNavigation } from "./features/section-navigation.mjs";
import { initDownloadGuard } from "./features/download-guard.mjs";
import { initReleaseToast } from "./features/release-toast.mjs";

let initialized = false;

function initCurrentNavigation() {
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
  initUpdateLog();
  initNoticeList();
  initSectionNavigation();
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
