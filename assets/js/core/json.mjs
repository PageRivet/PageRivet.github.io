export async function fetchProjectJson(relativePath) {
  const url = new URL(relativePath, document.baseURI);
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("HTTP " + response.status + " · " + url.pathname);
  }
  return response.json();
}

export function currentLanguage() {
  return document.documentElement.lang === "en" ? "en" : "ko";
}

export function localized(value, language) {
  if (value && typeof value === "object") {
    return value[language] || value.ko || value.en || "";
  }
  return value || "";
}
