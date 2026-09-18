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
    future: "비밀번호 재설정 기능은 회원 시스템 활성화와 함께 제공됩니다.",
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
    future: "Password recovery will be available when the account service launches.",
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

function setStatus(card, text, tone = "info") {
  const status = card.querySelector("[data-auth-status]");
  if (!status) return;
  status.hidden = false;
  status.dataset.tone = tone;
  status.textContent = text;
}

function setProviderState(card, enabled) {
  card.querySelectorAll("[data-auth-provider]").forEach(function (link) {
    link.classList.toggle("is-disabled", !enabled);
    link.setAttribute("aria-disabled", String(!enabled));
  });
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
    setProviderState(card, enabled);

    if (!enabled) setStatus(card, message("unavailable"), "notice");
  } catch {
    card.dataset.authService = "unreachable";
    setProviderState(card, false);
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
  const endpoint = mode === "register" ? "/auth/register" : "/auth/login";
  const submitButton = form.querySelector('[type="submit"]');
  const payload = {
    email: form.elements.email.value.trim(),
    password: form.elements.password.value
  };
  if (mode === "register") payload.displayName = form.elements.displayName.value.trim();
  if (mode === "login") payload.remember = Boolean(form.elements.remember?.checked);

  submitButton.disabled = true;
  setStatus(card, message("working"));

  try {
    const response = await fetch(AUTH_ORIGIN + endpoint, {
      method: "POST",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(function () { return {}; });

    if (!response.ok) {
      setStatus(card, result.message || message("failed"), "error");
      return;
    }

    if (mode === "register" && result.requiresEmailVerification) {
      window.location.assign("/verify-email.html");
      return;
    }
    window.location.assign("/account.html");
  } catch {
    setStatus(card, message("unreachable"), "error");
  } finally {
    submitButton.disabled = false;
  }
}

function initCard(card) {
  if (card.dataset.authReady === "true") return;
  card.dataset.authReady = "true";
  syncLocale(card);

  card.querySelectorAll("[data-password-toggle]").forEach(function (button) {
    button.addEventListener("click", function () {
      const input = button.closest(".auth-password-control")?.querySelector("input");
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      syncLocale(card);
      input.focus();
    });
  });

  card.querySelectorAll("[data-auth-provider]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      if (card.dataset.authService !== "enabled") {
        event.preventDefault();
        setStatus(card, message("unavailable"), "notice");
      }
    });
  });

  card.querySelectorAll("[data-auth-future]").forEach(function (button) {
    button.addEventListener("click", function () {
      setStatus(card, message("future"), "notice");
    });
  });

  const form = card.querySelector("[data-auth-form]");
  form?.addEventListener("submit", function (event) {
    event.preventDefault();
    submit(card, form);
  });

  readServiceState(card);
}

export function initAuthForms() {
  document.querySelectorAll("[data-auth-card]").forEach(initCard);
}

document.addEventListener("pagerivet:languagechange", function () {
  document.querySelectorAll("[data-auth-card]").forEach(function (card) {
    syncLocale(card);
    if (card.dataset.authService === "disabled") {
      setStatus(card, message("unavailable"), "notice");
    } else if (card.dataset.authService === "unreachable") {
      setStatus(card, message("unreachable"), "error");
    }
  });
});
