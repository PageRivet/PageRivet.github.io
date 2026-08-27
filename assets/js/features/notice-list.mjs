let languageListenerInitialized = false;

function getCurrentLanguage(event) {
  const requestedLanguage = event && event.detail
    ? event.detail.language
    : document.documentElement.lang;

  return requestedLanguage === "en" ? "en" : "ko";
}

function syncNoticeList(event) {
  const language = getCurrentLanguage(event);
  const notices = Array.from(document.querySelectorAll("[data-notice-document]"));
  const visibleNotices = [];

  notices.forEach(function (notice) {
    const isVisible = notice.dataset.noticeLanguage === language;
    const latestBadge = notice.querySelector("[data-notice-latest-badge]");

    notice.hidden = !isVisible;
    notice.classList.remove("is-latest");
    notice.open = false;

    if (latestBadge) latestBadge.hidden = true;
    if (isVisible) visibleNotices.push(notice);
  });

  const latestNotice = visibleNotices[0];

  if (latestNotice) {
    latestNotice.classList.add("is-latest");
    latestNotice.open = true;

    const latestBadge = latestNotice.querySelector("[data-notice-latest-badge]");
    if (latestBadge) latestBadge.hidden = false;
  }

  document.querySelectorAll("[data-notice-count]").forEach(function (count) {
    count.textContent = String(visibleNotices.length);
  });

  document.querySelectorAll("[data-notice-count-label]").forEach(function (label) {
    if (language === "en") {
      label.textContent = visibleNotices.length === 1 ? "notice" : "notices";
    } else {
      label.textContent = "개의 공지";
    }
  });
}

export function initNoticeList() {
  syncNoticeList();

  if (languageListenerInitialized) return;
  languageListenerInitialized = true;
  document.addEventListener("pagerivet:languagechange", syncNoticeList);
}
