import { createModalController } from "../ui/modal.mjs";

const DOWNLOADS_ENDPOINT = "https://api.pagerivet.app/downloads";

let initialized = false;

function environment() {
  const userAgent = navigator.userAgent || "";
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
  const isWindows = /Windows/i.test(userAgent);
  return { isMobile: isMobile, isWindows: isWindows };
}

function readManagedDownloads(data) {
  if (!data || data.ok !== true || !Array.isArray(data.downloads)) {
    throw new Error("Invalid download metadata response");
  }

  const items = new Map(data.downloads.map(function (item) {
    return [item.key, item];
  }));
  const pagerivet = items.get("pagerivet");
  const diagnostic = items.get("diagnostic");
  if (
    !pagerivet ||
    !diagnostic ||
    typeof pagerivet.versionText !== "string" ||
    !pagerivet.versionText ||
    typeof pagerivet.environmentText !== "string" ||
    !pagerivet.environmentText ||
    typeof pagerivet.packageText !== "string" ||
    !pagerivet.packageText ||
    typeof diagnostic.environmentText !== "string" ||
    !diagnostic.environmentText ||
    typeof diagnostic.packageText !== "string" ||
    !diagnostic.packageText ||
    typeof pagerivet.enabled !== "boolean" ||
    typeof diagnostic.enabled !== "boolean"
  ) {
    throw new Error("Incomplete download metadata response");
  }

  return { pagerivet, diagnostic };
}

function setText(selector, value) {
  const target = document.querySelector(selector);
  if (target) target.textContent = value;
}

function setDownloadAvailability(key, enabled) {
  const target = document.querySelector(`[data-download-key="${key}"]`);
  if (!(target instanceof HTMLAnchorElement)) return;
  target.dataset.downloadEnabled = enabled ? "true" : "false";
  target.setAttribute("aria-disabled", enabled ? "false" : "true");
}

export async function initLatestDownloadRelease() {
  const root = document.querySelector(".download-page");
  if (!root || root.dataset.downloadMetadataState) return;

  root.dataset.downloadMetadataState = "loading";
  try {
    const response = await fetch(DOWNLOADS_ENDPOINT, {
      headers: { "Accept": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Download metadata request failed: HTTP ${response.status}`);
    }

    const downloads = readManagedDownloads(await response.json());
    setText("[data-download-version]", downloads.pagerivet.versionText);
    setText('[data-download-environment="pagerivet"]', downloads.pagerivet.environmentText);
    setText('[data-download-package="pagerivet"]', downloads.pagerivet.packageText);
    setText('[data-download-environment="diagnostic"]', downloads.diagnostic.environmentText);
    setText('[data-download-package="diagnostic"]', downloads.diagnostic.packageText);
    setDownloadAvailability("pagerivet", downloads.pagerivet.enabled);
    setDownloadAvailability("diagnostic", downloads.diagnostic.enabled);
    root.dataset.downloadMetadataState = "ready";
  } catch (error) {
    root.dataset.downloadMetadataState = "error";
    console.warn(JSON.stringify({
      event: "download_metadata_display_error",
      error: error instanceof Error ? error.message : String(error),
    }));
  }
}

export function initDownloadGuard() {
  if (initialized) return;

  const modal = document.querySelector("[data-download-guard]");
  if (!modal) return;

  initialized = true;
  const message = modal.querySelector("[data-download-guard-message]");
  const title = modal.querySelector("[data-download-guard-title]");
  const continuation = modal.querySelector("[data-download-continue]");
  const dismiss = modal.querySelector("[data-download-guard-dismiss]");
  const controller = createModalController(modal, "[data-close-download-guard]");

  document.addEventListener("click", function (event) {
    const target = event.target instanceof Element ? event.target.closest("[data-download-link]") : null;
    if (!(target instanceof HTMLAnchorElement) || !continuation || !dismiss) return;

    const isEnglish = document.documentElement.lang === "en";
    const isDisabled = target.dataset.downloadEnabled === "false" || target.getAttribute("aria-disabled") === "true";
    if (isDisabled) {
      event.preventDefault();
      continuation.hidden = true;
      dismiss.textContent = isEnglish ? "OK" : "확인";
      title.textContent = isEnglish ? "Download temporarily unavailable" : "다운로드 일시 중지";
      message.textContent = isEnglish
        ? "This download is currently unavailable due to maintenance."
        : "현재 점검으로 인해 다운로드할 수 없습니다.";
      controller.open();
      return;
    }

    continuation.hidden = false;
    dismiss.textContent = isEnglish ? "Cancel" : "취소";
    const current = environment();
    if (current.isWindows && !current.isMobile) return;

    event.preventDefault();
    continuation.setAttribute("href", target.href);
    if (current.isMobile) {
      title.textContent = isEnglish ? "PageRivet is not available on mobile" : "모바일 환경에서는 사용할 수 없습니다";
      message.textContent = isEnglish
        ? "PageRivet currently provides a portable package for Windows x64 desktop systems."
        : "PageRivet은 현재 Windows x64 데스크톱용 포터블 패키지를 제공합니다.";
    } else {
      title.textContent = isEnglish ? "Check your operating system" : "지원 운영체제를 확인해 주세요";
      message.textContent = isEnglish
        ? "This package is for Windows x64. Continuing will download the ZIP file."
        : "이 패키지는 Windows x64용입니다. 계속하면 ZIP 파일을 내려받습니다.";
    }
    controller.open();
  });
}
