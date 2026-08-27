import { readPreference, savePreference } from "./preferences.mjs";
import { CONTENT_TRANSLATIONS, PAGE_METADATA, TRANSLATIONS } from "./translations.mjs";

const SUPPORTED = ["ko", "en"];
const originalText = new WeakMap();
let initialized = false;

function translatePageContent(language) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    const parent = node.parentElement;
    if (parent && !parent.closest("script, style, code, pre, [data-i18n]")) {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      const koreanText = originalText.get(node);
      const key = koreanText.trim();
      const translation = CONTENT_TRANSLATIONS[key];

      if (language === "en" && translation) {
        node.nodeValue = koreanText.replace(key, translation);
      } else if (language === "ko") {
        node.nodeValue = koreanText;
      }
    }
    node = walker.nextNode();
  }
}

function translatePageMetadata(language) {
  const fileName = window.location.pathname.split("/").pop() || "index.html";
  const routeKey = fileName.replace(/\.html$/i, "") || "index";
  const pageKey = document.body.dataset.previewPage || (routeKey === "index" ? "home" : routeKey);
  const metadata = PAGE_METADATA[pageKey];
  if (!metadata) return;

  document.title = pageKey === "home"
    ? metadata.title[language]
    : metadata.title[language] + " · PageRivet";

  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = metadata.description[language];
}

function applyLanguage(language) {
  const nextLanguage = SUPPORTED.indexOf(language) >= 0 ? language : "ko";
  document.documentElement.lang = nextLanguage;
  translatePageMetadata(nextLanguage);

  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    const entry = TRANSLATIONS[element.dataset.i18n];
    if (entry && typeof entry[nextLanguage] === "string") {
      element.innerHTML = entry[nextLanguage];
    }
  });

  translatePageContent(nextLanguage);

  document.querySelectorAll("[data-language]").forEach(function (button) {
    const isActive = button.dataset.language === nextLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  savePreference("language", nextLanguage);
  document.dispatchEvent(new CustomEvent("pagerivet:languagechange", { detail: { language: nextLanguage } }));
}

export function refreshI18n() {
  applyLanguage(readPreference("language", "ko"));
}

export function initI18n() {
  refreshI18n();
  if (initialized) return;
  initialized = true;

  document.querySelectorAll("[data-language]").forEach(function (button) {
    button.addEventListener("click", function () {
      applyLanguage(button.dataset.language);
    });
  });
}
