const TURNSTILE_SOURCE = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const REQUEST_TIMEOUT = 15000;
const widgetIds = new WeakMap();
const templateStates = new WeakMap();
const attachmentStates = new WeakMap();
let turnstilePromise;
let languageListenerInitialized = false;

function getMessage(form, name, replacements = {}) {
  const node = form.querySelector('[data-contact-message="' + name + '"]');
  let message = node ? node.textContent.trim() : "";
  const values = Object.assign({
    maxFiles: form.dataset.attachmentMaxFiles || "",
    maxFileSize: form.dataset.attachmentMaxFileLabel || "",
    maxTotalSize: form.dataset.attachmentMaxTotalLabel || ""
  }, replacements);

  Object.entries(values).forEach(function ([key, value]) {
    message = message.split("{" + key + "}").join(String(value));
  });
  return message;
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

function getSelectedCategory(form) {
  const select = form.querySelector("[data-contact-category]");
  if (!select || !select.value) return null;
  return select.options[select.selectedIndex] || null;
}

function syncCategoryFields(form) {
  const option = getSelectedCategory(form);
  const templateButton = form.querySelector("[data-contact-template-load]");

  if (templateButton) templateButton.disabled = !option;
}

function setTemplateStatus(form, message) {
  const status = form.querySelector("[data-contact-template-status]");
  if (status) status.textContent = message || "";
}

async function loadCategoryTemplate(form, options = {}) {
  const option = getSelectedCategory(form);
  const textarea = form.querySelector("[data-contact-message-input]");
  const button = form.querySelector("[data-contact-template-load]");
  const state = templateStates.get(form);

  if (!option || !textarea || !state || !option.dataset.templateUrl) return false;

  const hasUserContent = textarea.value.trim() && textarea.value !== state.appliedTemplate;
  if (options.confirmReplace && hasUserContent && !window.confirm(getMessage(form, "template_replace"))) {
    return false;
  }

  const requestId = state.requestId + 1;
  state.requestId = requestId;
  if (button) {
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
  }
  setTemplateStatus(form, getMessage(form, "template_loading"));

  try {
    const response = await fetch(option.dataset.templateUrl, {
      credentials: "same-origin",
      headers: { Accept: "text/markdown, text/plain;q=0.9" }
    });

    if (!response.ok) throw new Error("Template request failed.");
    const template = (await response.text()).replace(/\r\n/g, "\n").trim();

    if (state.requestId !== requestId || getSelectedCategory(form) !== option) return false;

    textarea.value = template;
    state.appliedTemplate = template;
    setTemplateStatus(form, "");
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    if (options.focus) textarea.focus();
    return true;
  } catch {
    if (state.requestId === requestId) {
      setTemplateStatus(form, getMessage(form, "template_error"));
    }
    return false;
  } finally {
    if (state.requestId === requestId && button) {
      button.disabled = !getSelectedCategory(form);
      button.removeAttribute("aria-busy");
    }
  }
}

function formatFileSize(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2) + "MB";
}

function setAttachmentStatus(form, message) {
  const status = form.querySelector("[data-contact-attachment-status]");
  if (status) status.textContent = message || "";
}

function replaceInputFiles(input, files) {
  if (typeof DataTransfer === "undefined") return false;

  const transfer = new DataTransfer();
  files.forEach(function (file) {
    transfer.items.add(file);
  });
  input.files = transfer.files;
  return true;
}

function createAttachmentButton(form, action, index, fileName) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "contact-attachment-action" + (action === "remove" ? " is-remove" : "");
  button.dataset.attachmentAction = action;
  button.dataset.attachmentIndex = String(index);
  button.textContent = getMessage(form, action === "remove" ? "attachment_remove" : "attachment_replace");
  button.setAttribute("aria-label", getMessage(
    form,
    action === "remove" ? "attachment_remove_aria" : "attachment_replace_aria",
    { fileName }
  ));
  return button;
}

function renderAttachmentList(form, files) {
  const selection = form.querySelector("[data-contact-attachment-selection]");
  const list = form.querySelector("[data-contact-attachment-list]");
  if (!selection || !list) return;

  list.replaceChildren();
  files.forEach(function (file, index) {
    const item = document.createElement("li");
    const information = document.createElement("span");
    const name = document.createElement("span");
    const size = document.createElement("span");
    const actions = document.createElement("span");

    information.className = "contact-attachment-information";
    name.className = "contact-attachment-name";
    name.textContent = file.name;
    name.title = file.name;
    size.className = "contact-attachment-size";
    size.textContent = formatFileSize(file.size);
    actions.className = "contact-attachment-actions";

    information.append(name, size);
    actions.append(
      createAttachmentButton(form, "replace", index, file.name),
      createAttachmentButton(form, "remove", index, file.name)
    );
    item.append(information, actions);
    list.append(item);
  });

  selection.hidden = files.length === 0;
}

function validateAttachments(form) {
  const input = form.querySelector("[data-contact-attachment]");
  if (!input) return true;

  const files = Array.from(input.files || []);
  const maxFiles = Number(form.dataset.attachmentMaxFiles || 0);
  const maxFileBytes = Number(form.dataset.attachmentMaxFileBytes || 0);
  const maxTotalBytes = Number(form.dataset.attachmentMaxTotalBytes || 0);
  const totalBytes = files.reduce(function (sum, file) { return sum + file.size; }, 0);
  const oversizedFile = files.find(function (file) {
    return maxFileBytes && file.size > maxFileBytes;
  });
  let errorMessage = "";

  if (maxFiles && files.length > maxFiles) {
    errorMessage = getMessage(form, "attachment_too_many");
  } else if (oversizedFile) {
    errorMessage = getMessage(form, "attachment_file_too_large", { fileName: oversizedFile.name });
  } else if (maxTotalBytes && totalBytes > maxTotalBytes) {
    errorMessage = getMessage(form, "attachment_total_too_large");
  }

  renderAttachmentList(form, files);
  input.setCustomValidity(errorMessage);
  if (errorMessage) {
    setAttachmentStatus(form, errorMessage);
  } else if (files.length) {
    setAttachmentStatus(form, getMessage(form, "attachment_summary", {
      fileCount: files.length,
      totalSize: formatFileSize(totalBytes)
    }));
  } else {
    setAttachmentStatus(form, "");
  }

  return !errorMessage;
}

function resetContactFormState(form) {
  const state = templateStates.get(form);
  if (state) {
    state.appliedTemplate = "";
    state.requestId += 1;
  }

  const attachment = form.querySelector("[data-contact-attachment]");
  if (attachment) attachment.setCustomValidity("");
  const replacement = form.querySelector("[data-contact-attachment-replacement]");
  if (replacement) replacement.value = "";
  const attachmentState = attachmentStates.get(form);
  if (attachmentState) attachmentState.replaceIndex = null;
  renderAttachmentList(form, []);
  setAttachmentStatus(form, "");
  setTemplateStatus(form, "");
  syncCategoryFields(form);
}

async function submitContactForm(form) {
  const result = form.querySelector("[data-contact-result]");
  const submitButton = form.querySelector("[data-contact-submit]");

  if (!validateAttachments(form) || !form.reportValidity()) {
    form.reportValidity();
    return;
  }

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

    const formData = new FormData(form);
    const category = getSelectedCategory(form);
    formData.set("subject", category ? category.dataset.subject || "" : "");

    const response = await fetch(form.dataset.endpoint, {
      method: "POST",
      body: formData,
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

  const category = form.querySelector("[data-contact-category]");
  const message = form.querySelector("[data-contact-message-input]");
  const templateButton = form.querySelector("[data-contact-template-load]");
  const attachment = form.querySelector("[data-contact-attachment]");
  const attachmentReplacement = form.querySelector("[data-contact-attachment-replacement]");
  const attachmentList = form.querySelector("[data-contact-attachment-list]");
  templateStates.set(form, { appliedTemplate: "", requestId: 0 });
  attachmentStates.set(form, { replaceIndex: null });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    submitContactForm(form);
  });

  if (category) {
    category.addEventListener("change", function () {
      const state = templateStates.get(form);
      const canApplyAutomatically = message && state
        ? !message.value.trim() || message.value === state.appliedTemplate
        : false;

      syncCategoryFields(form);
      setTemplateStatus(form, "");
      if (canApplyAutomatically) loadCategoryTemplate(form);
    });
  }

  if (templateButton) {
    templateButton.addEventListener("click", function () {
      loadCategoryTemplate(form, { confirmReplace: true, focus: true });
    });
  }

  if (attachment) {
    attachment.addEventListener("change", function () {
      const state = attachmentStates.get(form);
      if (state) state.replaceIndex = null;
      validateAttachments(form);
      if (!attachment.checkValidity()) attachment.reportValidity();
    });
  }

  if (attachmentList && attachment && attachmentReplacement) {
    attachmentList.addEventListener("click", function (event) {
      const button = event.target instanceof Element
        ? event.target.closest("[data-attachment-action]")
        : null;
      if (!button) return;

      const index = Number(button.dataset.attachmentIndex);
      const files = Array.from(attachment.files || []);
      if (!Number.isInteger(index) || index < 0 || index >= files.length) return;

      if (button.dataset.attachmentAction === "remove") {
        files.splice(index, 1);
        if (replaceInputFiles(attachment, files)) validateAttachments(form);
        return;
      }

      const state = attachmentStates.get(form);
      if (state) state.replaceIndex = index;
      attachmentReplacement.value = "";
      attachmentReplacement.click();
    });

    attachmentReplacement.addEventListener("change", function () {
      const state = attachmentStates.get(form);
      const replacementFile = attachmentReplacement.files && attachmentReplacement.files[0];
      if (!state || state.replaceIndex === null || !replacementFile) return;

      const files = Array.from(attachment.files || []);
      if (state.replaceIndex >= 0 && state.replaceIndex < files.length) {
        files[state.replaceIndex] = replacementFile;
        if (replaceInputFiles(attachment, files)) {
          validateAttachments(form);
          if (!attachment.checkValidity()) attachment.reportValidity();
        }
      }
      state.replaceIndex = null;
      attachmentReplacement.value = "";
    });
  }

  form.addEventListener("reset", function () {
    window.setTimeout(function () {
      resetContactFormState(form);
    }, 0);
  });

  syncCategoryFields(form);
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
