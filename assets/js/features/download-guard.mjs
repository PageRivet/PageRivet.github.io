import { createModalController } from "../ui/modal.mjs";

let initialized = false;

function environment() {
  const userAgent = navigator.userAgent || "";
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
  const isWindows = /Windows/i.test(userAgent);
  return { isMobile: isMobile, isWindows: isWindows };
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
