import { createModalController } from "../ui/modal.mjs";

const LATEST_RELEASE_ENDPOINT = "https://api.pagerivet.app/releases/latest";

let initialized = false;

function environment() {
  const userAgent = navigator.userAgent || "";
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
  const isWindows = /Windows/i.test(userAgent);
  return { isMobile: isMobile, isWindows: isWindows };
}

function readLatestRelease(data) {
  const release = data && data.ok === true ? data.release : null;
  if (
    !release ||
    typeof release.version !== "string" ||
    !release.version ||
    !release.asset ||
    typeof release.asset.name !== "string" ||
    !release.asset.name
  ) {
    throw new Error("Invalid latest release response");
  }
  return release;
}

export async function initLatestDownloadRelease() {
  const root = document.querySelector("[data-latest-download]");
  if (!root || root.dataset.releaseState) return;

  const version = root.querySelector("[data-latest-release-version]");
  root.dataset.releaseState = "loading";

  try {
    const response = await fetch(LATEST_RELEASE_ENDPOINT, {
      headers: { "Accept": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Latest release request failed: HTTP ${response.status}`);
    }

    const release = readLatestRelease(await response.json());
    if (version) version.textContent = release.version;
    root.dataset.releaseAsset = release.asset.name;
    root.dataset.releaseState = "ready";
  } catch (error) {
    root.dataset.releaseState = "error";
    console.warn(JSON.stringify({
      event: "latest_release_display_error",
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
  const controller = createModalController(modal, "[data-close-download-guard]");

  document.addEventListener("click", function (event) {
    const target = event.target instanceof Element ? event.target.closest("[data-download-link]") : null;
    if (!(target instanceof HTMLAnchorElement) || !continuation) return;

    const current = environment();
    if (current.isWindows && !current.isMobile) return;

    event.preventDefault();
    continuation.setAttribute("href", target.href);
    const isEnglish = document.documentElement.lang === "en";
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
