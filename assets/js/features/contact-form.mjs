const TURNSTILE_SOURCE = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const REQUEST_TIMEOUT = 15000;
const widgetIds = new WeakMap();
let turnstilePromise;
let languageListenerInitialized = false;

function getMessage(form, name) {
  const node = form.querySelector('[data-contact-message="' + name + '"]');
  return node ? node.textContent.trim() : "";
}

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstilePromise) return turnstilePromise;

  let script = Array.from(document.scripts).find(function (item) {
    return item.src.startsWith("https://challenges.cloudflare.com/turnstile/");
  });

  if (!script) {
    script = document.createElement("script");
    script.src = TURNSTILE_SOURCE;
    script.defer = true;
    document.head.append(script);
  }

  turnstilePromise = new Promise(function (resolve, reject) {
    const startedAt = Date.now();
    const poll = window.setInterval(function () {
      if (window.turnstile) {
        window.clearInterval(poll);
        resolve(window.turnstile);
        return;
      }

      if (Date.now() - startedAt >= REQUEST_TIMEOUT) {
        window.clearInterval(poll);
        reject(new Error("Turnstile could not be loaded."));
      }
    }, 50);
  });

  return turnstilePromise;
}

async function renderWidget(form) {
  if (widgetIds.has(form)) return widgetIds.get(form);

  const container = form.querySelector("[data-turnstile-container]");
  if (!container) throw new Error("Turnstile container is missing.");

  const turnstile = await loadTurnstile();
  const widgetId = turnstile.render(container, {
    sitekey: form.dataset.turnstileSiteKey,
    action: form.dataset.turnstileAction || "contact",
    theme: "auto"
  });

  widgetIds.set(form, widgetId);
  return widgetId;
}

async function resetWidget(form) {
  const widgetId = widgetIds.get(form);
  if (widgetId === undefined || !window.turnstile) return;
  window.turnstile.reset(widgetId);
}

function parseResponse(response) {
  return response.text().then(function (text) {
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      return {};
    }
  });
}

async function submitContactForm(form) {
  const result = form.querySelector("[data-contact-result]");
  const submitButton = form.querySelector("[data-contact-submit]");

  if (!form.reportValidity()) return;

  submitButton.disabled = true;
  result.textContent = getMessage(form, "submitting");

  const controller = new AbortController();
  const timeout = window.setTimeout(function () {
    controller.abort();
  }, REQUEST_TIMEOUT);

  try {
    const widgetId = await renderWidget(form);
    const token = window.turnstile.getResponse(widgetId);

    if (!token) {
      throw new Error(getMessage(form, "error"));
    }

    const response = await fetch(form.dataset.endpoint, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    const data = await parseResponse(response);

    if (!response.ok) {
      throw new Error(data.error || getMessage(form, "error"));
    }

    result.textContent = data.message || getMessage(form, "success");
    form.reset();
  } catch (error) {
    result.textContent = error && error.message
      ? error.message
      : getMessage(form, "error");
  } finally {
    window.clearTimeout(timeout);
    submitButton.disabled = false;
    await resetWidget(form);
  }
}

function initContactForm(form) {
  if (form.hasAttribute("data-contact-initialized")) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    submitContactForm(form);
  });

  form.setAttribute("data-contact-initialized", "");
}

function syncContactDocuments(event) {
  const requested = event && event.detail ? event.detail.language : document.documentElement.lang;
  const language = requested === "en" ? "en" : "ko";

  document.querySelectorAll("[data-contact-document]").forEach(function (documentPanel) {
    const isVisible = documentPanel.dataset.contactLanguage === language;
    documentPanel.hidden = !isVisible;

    if (isVisible) {
      const form = documentPanel.querySelector("[data-contact-form]");
      if (form) renderWidget(form).catch(function () {
        const result = form.querySelector("[data-contact-result]");
        if (result) result.textContent = getMessage(form, "error");
      });
    }
  });
}

export function initContactForms() {
  document.querySelectorAll("[data-contact-form]").forEach(initContactForm);
  syncContactDocuments();

  if (languageListenerInitialized) return;
  languageListenerInitialized = true;
  document.addEventListener("pagerivet:languagechange", syncContactDocuments);
}
