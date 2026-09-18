const AUTH_ORIGIN = "https://auth.pagerivet.app";

const state = {
  page: 1,
  totalPages: 1,
  query: "",
  status: "",
  viewerId: "",
  csrfToken: ""
};

function language() {
  return document.documentElement.lang === "en" ? "en" : "ko";
}

function text(ko, en) {
  return language() === "en" ? en : ko;
}

function setStatus(root, message, tone = "info") {
  const status = root.querySelector("[data-admin-status]");
  if (!status) return;
  status.hidden = false;
  status.dataset.tone = tone;
  status.textContent = message;
}

function clearStatus(root) {
  const status = root.querySelector("[data-admin-status]");
  if (!status) return;
  status.hidden = true;
  status.textContent = "";
  delete status.dataset.tone;
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(language() === "en" ? "en" : "ko-KR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function statusLabel(value) {
  const labels = {
    active: text("활성", "Active"),
    suspended: text("정지", "Suspended"),
    pending_verification: text("확인 대기", "Pending"),
    deleted: text("탈퇴", "Deleted")
  };
  return labels[value] || value;
}

function providerLabel(value) {
  const labels = {
    email: text("이메일", "Email"),
    google: "Google",
    kakao: "Kakao"
  };
  return labels[value] || value;
}

function createCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  return cell;
}

function renderUsers(root, payload) {
  const body = root.querySelector("[data-admin-users]");
  const empty = root.querySelector("[data-admin-empty]");
  body.replaceChildren();

  payload.users.forEach(function (user) {
    const row = document.createElement("tr");

    const member = document.createElement("td");
    const name = document.createElement("strong");
    const email = document.createElement("span");
    name.textContent = user.displayName;
    email.textContent = user.email || "-";
    member.append(name, email);
    row.append(member);

    row.append(createCell((user.providers || []).map(providerLabel).join(", ") || "-"));

    const status = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "admin-badge";
    badge.dataset.status = user.status;
    badge.textContent = statusLabel(user.status);
    status.append(badge);
    row.append(status);

    row.append(createCell(formatDate(user.createdAt)));
    row.append(createCell(formatDate(user.lastLoginAt)));

    const actions = document.createElement("td");
    if (user.adminRole) {
      const role = document.createElement("span");
      role.className = "admin-role";
      role.textContent = user.adminRole === "owner"
        ? text("소유자", "Owner")
        : text("관리자", "Admin");
      actions.append(role);
    } else if (user.id !== state.viewerId && (user.status === "active" || user.status === "suspended")) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = user.status === "active" ? "btn admin-action danger" : "btn admin-action secondary";
      button.dataset.adminUserAction = user.status === "active" ? "suspended" : "active";
      button.dataset.userId = user.id;
      button.dataset.userName = user.displayName;
      button.textContent = user.status === "active"
        ? text("정지", "Suspend")
        : text("활성화", "Activate");
      actions.append(button);
    } else {
      actions.textContent = "-";
    }
    row.append(actions);
    body.append(row);
  });

  empty.hidden = payload.users.length > 0;
  state.page = payload.page;
  state.totalPages = payload.totalPages;
  state.viewerId = payload.viewer.id;

  root.querySelector("[data-admin-page-label]").textContent =
    text(`${state.page} / ${state.totalPages} 페이지`, `Page ${state.page} of ${state.totalPages}`);
  root.querySelector("[data-admin-previous]").disabled = state.page <= 1;
  root.querySelector("[data-admin-next]").disabled = state.page >= state.totalPages;
}

function renderSummary(root, summary) {
  root.querySelector("[data-admin-total]").textContent = summary.total;
  root.querySelector("[data-admin-active]").textContent = summary.active;
  root.querySelector("[data-admin-suspended]").textContent = summary.suspended;
  root.querySelector("[data-admin-pending]").textContent = summary.pending;
}

async function loadUsers(root) {
  setStatus(root, text("회원 정보를 불러오고 있습니다.", "Loading members."));
  const params = new URLSearchParams({ page: String(state.page) });
  if (state.query) params.set("query", state.query);
  if (state.status) params.set("status", state.status);

  try {
    const response = await fetch(AUTH_ORIGIN + "/admin/users?" + params.toString(), {
      method: "GET",
      credentials: "include",
      headers: { "Accept": "application/json" }
    });
    const payload = await response.json().catch(function () { return {}; });

    if (response.status === 401) {
      window.location.replace("/login.html");
      return;
    }
    if (response.status === 403) {
      setStatus(root, payload.message || text("관리자 권한이 필요합니다.", "Administrator access is required."), "error");
      return;
    }
    if (!response.ok || !Array.isArray(payload.users)) {
      throw new Error("admin_load_failed");
    }

    renderSummary(root, payload.summary);
    renderUsers(root, payload);
    root.querySelector("[data-admin-content]").hidden = false;
    clearStatus(root);
  } catch {
    setStatus(root, text("회원 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.", "Could not load members. Please try again."), "error");
  }
}

async function getCsrfToken() {
  if (state.csrfToken) return state.csrfToken;
  const response = await fetch(AUTH_ORIGIN + "/auth/csrf", {
    method: "GET",
    credentials: "include",
    headers: { "Accept": "application/json" }
  });
  const payload = await response.json().catch(function () { return {}; });
  if (!response.ok || !payload.csrfToken) throw new Error("csrf_unavailable");
  state.csrfToken = payload.csrfToken;
  return state.csrfToken;
}

async function updateUserStatus(root, button) {
  const nextStatus = button.dataset.adminUserAction;
  const userName = button.dataset.userName || text("이 회원", "this member");
  const question = nextStatus === "suspended"
    ? text(`${userName} 계정을 정지할까요? 현재 로그인된 모든 기기에서도 로그아웃됩니다.`, `Suspend ${userName}? All active sessions will be signed out.`)
    : text(`${userName} 계정을 다시 활성화할까요?`, `Reactivate ${userName}?`);
  if (!window.confirm(question)) return;

  button.disabled = true;
  setStatus(root, text("회원 상태를 변경하고 있습니다.", "Updating member status."));
  try {
    const token = await getCsrfToken();
    const response = await fetch(AUTH_ORIGIN + "/admin/users/status", {
      method: "POST",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": token
      },
      body: JSON.stringify({
        userId: button.dataset.userId,
        status: nextStatus
      })
    });
    const payload = await response.json().catch(function () { return {}; });
    if (!response.ok) {
      if (payload.error === "csrf_invalid") state.csrfToken = "";
      setStatus(root, payload.message || text("회원 상태를 변경하지 못했습니다.", "Could not update member status."), "error");
      return;
    }
    await loadUsers(root);
  } catch {
    setStatus(root, text("회원 상태를 변경하지 못했습니다.", "Could not update member status."), "error");
  } finally {
    button.disabled = false;
  }
}

function syncLocale(root) {
  const search = root.querySelector('input[name="query"]');
  if (search) {
    search.placeholder = language() === "en"
      ? search.dataset.placeholderEn
      : search.dataset.placeholderKo;
  }
}

export function initAdminPage() {
  const root = document.querySelector("[data-admin-page]");
  if (!root || root.dataset.adminReady === "true") return;
  root.dataset.adminReady = "true";
  syncLocale(root);

  root.querySelector("[data-admin-filters]")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const form = event.currentTarget;
    state.query = form.elements.query.value.trim();
    state.status = form.elements.status.value;
    state.page = 1;
    loadUsers(root);
  });

  root.querySelector("[data-admin-previous]")?.addEventListener("click", function () {
    if (state.page <= 1) return;
    state.page -= 1;
    loadUsers(root);
  });

  root.querySelector("[data-admin-next]")?.addEventListener("click", function () {
    if (state.page >= state.totalPages) return;
    state.page += 1;
    loadUsers(root);
  });

  root.querySelector("[data-admin-users]")?.addEventListener("click", function (event) {
    const button = event.target.closest("[data-admin-user-action]");
    if (button) updateUserStatus(root, button);
  });

  loadUsers(root);
}

document.addEventListener("pagerivet:languagechange", function () {
  const root = document.querySelector("[data-admin-page]");
  if (!root) return;
  syncLocale(root);
  loadUsers(root);
});
