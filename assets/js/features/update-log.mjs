let languageListenerInitialized = false;

function getLanguage(event) {
  const requested = event && event.detail ? event.detail.language : document.documentElement.lang;
  return requested === "en" ? "en" : "ko";
}

function selectRelease(root, language, requestedVersion) {
  const buttons = Array.from(root.querySelectorAll("[data-update-version]"));
  const documents = Array.from(root.querySelectorAll("[data-update-document]"));
  const visibleButtons = buttons.filter(function (button) {
    return button.dataset.updateLanguage === language;
  });

  buttons.forEach(function (button) {
    button.hidden = button.dataset.updateLanguage !== language;
  });

  const selectedButton = visibleButtons.find(function (button) {
    return button.dataset.updateVersion === requestedVersion;
  }) || visibleButtons.find(function (button) {
    return button.classList.contains("is-active");
  }) || visibleButtons[0];

  const selectedVersion = selectedButton ? selectedButton.dataset.updateVersion : "";

  buttons.forEach(function (button) {
    const isActive = button === selectedButton;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  documents.forEach(function (documentPanel) {
    documentPanel.hidden = !(
      documentPanel.dataset.updateLanguage === language &&
      documentPanel.dataset.updateVersion === selectedVersion
    );
  });

  root.dataset.selectedVersion = selectedVersion;
}

function syncUpdatePages(event) {
  const language = getLanguage(event);
  document.querySelectorAll("[data-update-page]").forEach(function (root) {
    selectRelease(root, language, root.dataset.selectedVersion);
  });
}

function initUpdateRoot(root) {
  if (root.hasAttribute("data-update-initialized")) return;

  root.addEventListener("click", function (event) {
    const button = event.target instanceof Element
      ? event.target.closest("[data-update-version]")
      : null;

    if (!button || !root.contains(button)) return;
    selectRelease(root, getLanguage(), button.dataset.updateVersion);
  });

  root.setAttribute("data-update-initialized", "");
}

export function initUpdateLog() {
  document.querySelectorAll("[data-update-page]").forEach(initUpdateRoot);
  syncUpdatePages();

  if (languageListenerInitialized) return;
  languageListenerInitialized = true;
  document.addEventListener("pagerivet:languagechange", syncUpdatePages);
}
