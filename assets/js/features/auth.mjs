const AUTH_ORIGIN = "https://auth.pagerivet.app";

const COPY = {
  ko: {
    checking: "PageRivet Account 연결 상태를 확인하고 있습니다.",
    unavailable: "회원 시스템의 안전한 연결을 준비하고 있습니다. 현재는 화면만 확인할 수 있습니다.",
    unreachable: "회원 시스템에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.",
    required: "필수 항목을 모두 입력해 주세요.",
    email: "올바른 이메일 주소를 입력해 주세요.",
    password: "비밀번호는 10자 이상이어야 합니다.",
    mismatch: "비밀번호가 서로 일치하지 않습니다.",
    terms: "이용약관과 개인정보처리방침에 동의해 주세요.",
    working: "안전하게 처리하고 있습니다.",
    failed: "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    sent: "요청을 확인했습니다. 이메일이 등록되어 있다면 안내 메일을 보내드립니다.",
    resetComplete: "비밀번호가 변경되었습니다. 로그인 화면으로 이동합니다.",
    verified: "이메일 확인이 완료되었습니다. 계정을 이용할 수 있습니다.",
    oauthUnavailable: "이 로그인 방식은 아직 설정되지 않았습니다.",
    show: "보기",
    hide: "숨기기",
    showLabel: "비밀번호 표시",
    hideLabel: "비밀번호 숨기기"
  },
  en: {
    checking: "Checking the PageRivet Account connection.",
    unavailable: "The secure account connection is being prepared. You can review the interface for now.",
    unreachable: "The account service is unavailable. Please try again later.",
    required: "Complete all required fields.",
    email: "Enter a valid email address.",
    password: "Use at least 10 characters for your password.",
    mismatch: "The passwords do not match.",
    terms: "Agree to the Terms and Privacy Policy.",
    working: "Processing your request securely.",
    failed: "We could not complete the request. Please try again later.",
    sent: "Request received. If the email is registered, instructions will be sent.",
    resetComplete: "Your password has been changed. Redirecting to sign in.",
    verified: "Your email has been verified. Your account is ready.",
    oauthUnavailable: "This sign-in provider has not been configured yet.",
    show: "Show",
    hide: "Hide",
    showLabel: "Show password",
    hideLabel: "Hide password"
  }
};

function language() {
  return document.documentElement.lang === "en" ? "en" : "ko";
}

function message(key) {
  return COPY[language()][key];
}

let csrfToken = "";

function setStatus(card, text, tone = "info") {
  const status = card.querySelector("[data-auth-status]");
  if (!status) return;
  status.hidden = false;
  status.dataset.tone = tone;
  status.textContent = text;
}

function clearStatus(card) {
  const status = card.querySelector("[data-auth-status]");
  if (!status) return;
  status.hidden = true;
  status.textContent = "";
  delete status.dataset.tone;
}

function setProviderState(card, providers = {}) {
  card.querySelectorAll("[data-auth-provider]").forEach(function (link) {
    const enabled = providers[link.dataset.provider] === true;
    link.classList.toggle("is-disabled", !enabled);
    link.setAttribute("aria-disabled", String(!enabled));
    if ("disabled" in link) link.disabled = !enabled;
    if (enabled) link.removeAttribute("tabindex");
    else link.setAttribute("tabindex", "-1");
  });
}

async function refreshCsrfToken() {
  const response = await fetch(AUTH_ORIGIN + "/auth/csrf", {
    method: "GET",
    credentials: "include",
    headers: { "Accept": "application/json" }
  });
  const payload = await response.json().catch(function () { return {}; });
  if (!response.ok || !payload.csrfToken) throw new Error("csrf_unavailable");
  csrfToken = payload.csrfToken;
  return csrfToken;
}

async function getCsrfToken() {
  return csrfToken || refreshCsrfToken();
}

function locallyAuthenticated() {
  try {
    return localStorage.getItem("pagerivet.authenticated") === "true";
  } catch {
    return false;
  }
}

function syncHeaderAccountEntry() {
  const link = document.querySelector(".site-header .account-link");
  if (!link || !locallyAuthenticated()) return;
  link.href = "/account.html";
  link.dataset.navId = "account";
  link.textContent = language() === "en" ? "My account" : "내 계정";

  const isAccountPage = /\/account\.html$/i.test(window.location.pathname);
  link.classList.toggle("is-active", isAccountPage);
  if (isAccountPage) link.setAttribute("aria-current", "page");
  else link.removeAttribute("aria-current");
}

async function readServiceState(card) {
  card.dataset.authService = "checking";
  setStatus(card, message("checking"));

  const productionHosts = new Set(["pagerivet.app", "www.pagerivet.app"]);
  if (!productionHosts.has(window.location.hostname)) {
    card.dataset.authService = "disabled";
    setProviderState(card, false);
    setStatus(card, message("unavailable"), "notice");
    return;
  }

  try {
    const response = await fetch(AUTH_ORIGIN + "/", {
      method: "GET",
      credentials: "include",
      headers: { "Accept": "application/json" }
    });
    const payload = await response.json();
    const enabled = response.ok && payload.authenticationEnabled === true;
    card.dataset.authService = enabled ? "enabled" : "disabled";
    setProviderState(card, enabled ? payload.providers : {});

    if (enabled) {
      await refreshCsrfToken();
      clearStatus(card);
    } else {
      setStatus(card, message("unavailable"), "notice");
    }
  } catch {
    card.dataset.authService = "unreachable";
    setProviderState(card, {});
    setStatus(card, message("unreachable"), "error");
  }
}

function syncLocale(card) {
  card.querySelectorAll("[data-placeholder-ko]").forEach(function (input) {
    input.placeholder = language() === "en"
      ? input.dataset.placeholderEn
      : input.dataset.placeholderKo;
  });

  card.querySelectorAll("[data-password-toggle]").forEach(function (button) {
    const input = button.closest(".auth-password-control")?.querySelector("input");
    const visible = input?.type === "text";
    button.textContent = visible ? message("hide") : message("show");
    button.setAttribute("aria-label", visible ? message("hideLabel") : message("showLabel"));
  });
}

function validate(card, form) {
  const mode = card.dataset.authMode;
  const email = form.elements.email;
  const password = form.elements.password;
  const displayName = form.elements.displayName;
  const passwordConfirm = form.elements.passwordConfirm;
  const terms = form.elements.terms;

  if (mode === "forgot" || mode === "verify") {
    if (!email?.value.trim()) return "required";
    if (!email.validity.valid) return "email";
    return null;
  }
  if (mode === "reset") {
    if (!password?.value || !passwordConfirm?.value) return "required";
    if (password.value.length < 10) return "password";
    if (password.value !== passwordConfirm.value) return "mismatch";
    if (!new URLSearchParams(window.location.search).get("token")) return "failed";
    return null;
  }
  if (!email?.value.trim() || !password?.value || (mode === "register" && !displayName?.value.trim())) {
    return "required";
  }
  if (!email.validity.valid) return "email";
  if (mode === "register" && password.value.length < 10) return "password";
  if (mode === "register" && password.value !== passwordConfirm?.value) return "mismatch";
  if (mode === "register" && !terms?.checked) return "terms";
  return null;
}

async function submit(card, form) {
  const error = validate(card, form);
  if (error) {
    setStatus(card, message(error), "error");
    return;
  }

  if (card.dataset.authService !== "enabled") {
    setStatus(card, message("unavailable"), "notice");
    return;
  }

  const mode = card.dataset.authMode;
  const endpoints = {
    register: "/auth/register",
    login: "/auth/login",
    forgot: "/auth/password/forgot",
    reset: "/auth/password/reset",
    verify: "/auth/verify-email/resend"
  };
  const endpoint = endpoints[mode];
  const submitButton = form.querySelector('[type="submit"]');
  const payload = {};
  if (form.elements.email) payload.email = form.elements.email.value.trim();
  if (form.elements.password) payload.password = form.elements.password.value;
  if (mode === "register") {
    payload.displayName = form.elements.displayName.value.trim();
    payload.termsAccepted = true;
    payload.privacyAcknowledged = true;
    payload.termsVersion = "2026-09-18";
    payload.privacyVersion = "2026-09-18";
  }
  if (mode === "login") payload.remember = Boolean(form.elements.remember?.checked);
  if (mode === "reset") payload.token = new URLSearchParams(window.location.search).get("token");

  submitButton.disabled = true;
  setStatus(card, message("working"));

  try {
    const token = await getCsrfToken();
    const response = await fetch(AUTH_ORIGIN + endpoint, {
      method: "POST",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": token
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(function () { return {}; });

    if (!response.ok) {
      if (result.error === "csrf_invalid") csrfToken = "";
      setStatus(card, result.message || message("failed"), "error");
      return;
    }

    if (mode === "forgot" || mode === "verify") {
      setStatus(card, result.message || message("sent"), "success");
      form.reset();
      return;
    }
    if (mode === "reset") {
      setStatus(card, message("resetComplete"), "success");
      window.setTimeout(function () { window.location.assign("/login.html?reset=1"); }, 900);
      return;
    }
    if (mode === "register" && result.requiresEmailVerification) {
      try { sessionStorage.setItem("pagerivet.verificationEmail", payload.email); } catch {}
      window.location.assign("/verify-email.html");
      return;
    }
    try {
      localStorage.setItem("pagerivet.authenticated", "true");
    } catch {
      // The secure cookie remains the source of truth when storage is unavailable.
    }
    window.location.assign("/account.html");
  } catch {
    setStatus(card, message("unreachable"), "error");
  } finally {
    submitButton.disabled = false;
  }
}

function initLegalModal(scope) {
  const modal = document.querySelector("[data-legal-modal]");
  if (!modal || modal.dataset.legalReady === "true") return;
  modal.dataset.legalReady = "true";

  const panel = modal.querySelector(".legal-modal-panel");
  const title = modal.querySelector("[data-legal-modal-title]");
  const body = modal.querySelector("[data-legal-modal-body]");
  const closeButton = modal.querySelector(".legal-modal-close");
  let restoreFocus = null;

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("has-legal-modal");
    body.replaceChildren();
    restoreFocus?.focus();
    restoreFocus = null;
  }

  function trapFocus(event) {
    if (event.key === "Escape") {
      closeModal();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(modal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function (element) {
      return !element.hidden && element.tabIndex >= 0;
    });
    if (!focusable.length) {
      event.preventDefault();
      panel.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  async function openModal(link) {
    restoreFocus = link;
    const documentPath = new URL(link.href, window.location.href).pathname;
    const privacyDocument = /\/privacy\.html$/i.test(documentPath);
    title.textContent = language() === "en"
      ? (link.dataset.titleEn || (privacyDocument ? "Privacy Policy" : "Terms of Service"))
      : (link.dataset.titleKo || (privacyDocument ? "개인정보처리방침" : "이용약관"));
    closeButton.textContent = language() === "en" ? "Close" : "닫기";
    closeButton.setAttribute("aria-label", language() === "en" ? "Close document" : "문서 닫기");
    body.textContent = language() === "en" ? "Loading document…" : "문서를 불러오고 있습니다…";
    body.setAttribute("aria-busy", "true");
    modal.hidden = false;
    document.body.classList.add("has-legal-modal");
    panel.focus();

    try {
      const response = await fetch(link.href, { headers: { "Accept": "text/html" } });
      if (!response.ok) throw new Error("legal_document_unavailable");
      const html = await response.text();
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const documentBody = parsed.querySelector(".legal-document");
      if (!documentBody) throw new Error("legal_document_missing");
      body.replaceChildren(...Array.from(documentBody.childNodes, function (node) {
        return document.importNode(node, true);
      }));
    } catch {
      body.textContent = language() === "en"
        ? "The document could not be loaded. Open the link again or try later."
        : "문서를 불러오지 못했습니다. 링크를 다시 누르거나 잠시 후 시도해 주세요.";
    } finally {
      body.removeAttribute("aria-busy");
    }
  }

  scope.querySelectorAll("[data-legal-document]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      openModal(link);
    });
  });
  modal.querySelectorAll("[data-legal-close]").forEach(function (button) {
    button.addEventListener("click", closeModal);
  });
  body.addEventListener("click", function (event) {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const path = new URL(link.href, window.location.href).pathname;
    if (!/\/(terms|privacy)\.html$/i.test(path)) return;
    event.preventDefault();
    openModal(link);
  });
  modal.addEventListener("keydown", trapFocus);
}

function initCard(card) {
  if (card.dataset.authReady === "true") return;
  card.dataset.authReady = "true";
  syncLocale(card);
  initLegalModal(card);

  card.querySelectorAll("[data-password-toggle]").forEach(function (button) {
    button.addEventListener("click", function () {
      const input = button.closest(".auth-password-control")?.querySelector("input");
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      syncLocale(card);
      input.focus();
    });
  });

  card.querySelectorAll("[data-auth-provider]").forEach(function (button) {
    button.addEventListener("click", async function () {
      if (card.dataset.authService !== "enabled") {
        setStatus(card, message("unavailable"), "notice");
        return;
      }
      if (button.getAttribute("aria-disabled") === "true") {
        setStatus(card, message("oauthUnavailable"), "notice");
        return;
      }
      const mode = button.dataset.authOauthMode || card.dataset.authMode;
      const terms = card.querySelector('input[name="terms"]');
      if (mode === "register" && !terms?.checked) {
        setStatus(card, message("terms"), "error");
        terms?.focus();
        return;
      }
      button.disabled = true;
      setStatus(card, message("working"));
      try {
        const token = await getCsrfToken();
        const response = await fetch(AUTH_ORIGIN + "/auth/oauth/start", {
          method: "POST",
          credentials: "include",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-CSRF-Token": token
          },
          body: JSON.stringify({
            provider: button.dataset.provider,
            mode,
            returnTo: window.location.origin + "/account.html",
            termsAccepted: mode === "register",
            privacyAcknowledged: mode === "register",
            termsVersion: "2026-09-18",
            privacyVersion: "2026-09-18"
          })
        });
        const result = await response.json().catch(function () { return {}; });
        if (!response.ok || !result.authorizationUrl) {
          setStatus(card, result.message || message("failed"), "error");
          button.disabled = false;
          return;
        }
        window.location.assign(result.authorizationUrl);
      } catch {
        setStatus(card, message("unreachable"), "error");
        button.disabled = false;
      }
    });
  });

  const form = card.querySelector("[data-auth-form]");
  form?.addEventListener("submit", function (event) {
    event.preventDefault();
    submit(card, form);
  });

  if (card.dataset.authMode === "verify") {
    try {
      const savedEmail = sessionStorage.getItem("pagerivet.verificationEmail");
      const input = card.querySelector('input[name="email"]');
      if (savedEmail && input) input.value = savedEmail;
    } catch {}
  }

  const query = new URLSearchParams(window.location.search);
  const queryError = query.get("error");
  if (queryError) setStatus(card, query.get("message") || message("failed"), "error");
  else if (query.get("verified") === "1") setStatus(card, message("verified"), "success");
  else if (query.get("reset") === "1") setStatus(card, message("resetComplete"), "success");

  readServiceState(card);
}

function formatAccountDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(language() === "en" ? "en" : "ko-KR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function accountStatus(accountCard, text, tone = "info") {
  const status = accountCard.querySelector("[data-account-status]");
  if (!status) return;
  status.hidden = false;
  status.dataset.tone = tone;
  status.textContent = text;
}

async function initAccountPage() {
  const accountCard = document.querySelector("[data-account-card]");
  if (!accountCard || accountCard.dataset.accountReady === "true") return;
  accountCard.dataset.accountReady = "true";

  const productionHosts = new Set(["pagerivet.app", "www.pagerivet.app"]);
  if (!productionHosts.has(window.location.hostname)) {
    accountStatus(accountCard, message("unavailable"), "notice");
    return;
  }

  try {
    const response = await fetch(AUTH_ORIGIN + "/account", {
      method: "GET",
      credentials: "include",
      headers: { "Accept": "application/json" }
    });
    const result = await response.json().catch(function () { return {}; });

    if (response.status === 401) {
      try {
        localStorage.removeItem("pagerivet.authenticated");
      } catch {
        // Ignore unavailable storage.
      }
      window.location.replace("/login.html");
      return;
    }
    if (!response.ok || !result.user) throw new Error("account_unavailable");

    try {
      localStorage.setItem("pagerivet.authenticated", "true");
    } catch {
      // The secure cookie remains the source of truth when storage is unavailable.
    }
    syncHeaderAccountEntry();

    const profile = accountCard.querySelector("[data-account-profile]");
    const user = result.user;
    accountCard.querySelector("[data-account-name]").textContent = user.displayName;
    accountCard.querySelector("[data-account-email]").textContent = user.email;
    accountCard.querySelector("[data-account-avatar]").textContent =
      String(user.displayName || "P").trim().charAt(0).toUpperCase() || "P";
    accountCard.querySelector("[data-account-created]").textContent = formatAccountDate(user.createdAt);
    accountCard.querySelector("[data-account-login]").textContent = formatAccountDate(user.lastLoginAt);
    accountCard.querySelector("[data-account-state]").textContent =
      language() === "en" ? "Active" : "활성";
    accountCard.querySelector("[data-account-status]").hidden = true;
    profile.hidden = false;

    accountCard.querySelector("[data-account-logout]")?.addEventListener("click", async function (event) {
      const button = event.currentTarget;
      button.disabled = true;
      accountStatus(accountCard, language() === "en" ? "Signing out." : "로그아웃하고 있습니다.");
      try {
        const token = await refreshCsrfToken();
        const logoutResponse = await fetch(AUTH_ORIGIN + "/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: {
            "Accept": "application/json",
            "X-CSRF-Token": token
          }
        });
        if (!logoutResponse.ok) throw new Error("logout_failed");
        try {
          localStorage.removeItem("pagerivet.authenticated");
        } catch {
          // Ignore unavailable storage.
        }
        window.location.replace("/login.html");
      } catch {
        accountStatus(accountCard, message("failed"), "error");
        button.disabled = false;
      }
    });
  } catch {
    accountStatus(accountCard, message("unreachable"), "error");
  }
}

export function initAuthForms() {
  syncHeaderAccountEntry();
  document.querySelectorAll("[data-auth-card]").forEach(initCard);
  initAccountPage();
}

document.addEventListener("pagerivet:languagechange", function () {
  syncHeaderAccountEntry();
  document.querySelectorAll("[data-auth-card]").forEach(function (card) {
    syncLocale(card);
    if (card.dataset.authService === "disabled") {
      setStatus(card, message("unavailable"), "notice");
    } else if (card.dataset.authService === "unreachable") {
      setStatus(card, message("unreachable"), "error");
    }
  });
});
