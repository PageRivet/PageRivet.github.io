const COPY = {
  ko: {
    count: "개의 글",
    loading: "소식을 불러오는 중입니다.",
    empty: "등록된 글이 없습니다.",
    error: "소식을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
    latest: "최신",
    notice: "공지사항",
    update: "업데이트",
    unknownDate: "날짜 미상",
    detailLoading: "내용을 불러오는 중입니다.",
    detailError: "내용을 불러오지 못했습니다.",
  },
  en: {
    count: "posts",
    loading: "Loading news.",
    empty: "No posts are available.",
    error: "News could not be loaded. Please try again shortly.",
    latest: "Latest",
    notice: "Notices",
    update: "Updates",
    unknownDate: "Date unavailable",
    detailLoading: "Loading details.",
    detailError: "Details could not be loaded.",
  },
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderInline(value) {
  const codeTokens = [];
  const tokenized = String(value).replace(/`([^`]+)`/g, function (_, code) {
    const token = `\u0000CODE${codeTokens.length}\u0000`;
    codeTokens.push(`<code>${escapeHtml(code)}</code>`);
    return token;
  });

  return escapeHtml(tokenized)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\u0000CODE(\d+)\u0000/g, function (_, index) {
      return codeTokens[Number(index)] || "";
    });
}

function renderMarkdown(markdown) {
  const lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n");
  const output = [];
  let paragraph = [];
  let listItems = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    output.push(`<p>${paragraph.map(renderInline).join("<br>")}</p>`);
    paragraph = [];
  }

  function flushList() {
    if (!listItems.length) return;
    output.push(`<ul>${listItems.map(function (item) {
      return `<li>${renderInline(item)}</li>`;
    }).join("")}</ul>`);
    listItems = [];
  }

  lines.forEach(function (line) {
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);

    if (!line.trim()) {
      flushParagraph();
      flushList();
      return;
    }

    if (heading) {
      flushParagraph();
      flushList();
      const level = Math.min(4, heading[1].length + 1);
      output.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      return;
    }

    if (bullet) {
      flushParagraph();
      listItems.push(bullet[1]);
      return;
    }

    flushList();
    paragraph.push(line.trim());
  });

  flushParagraph();
  flushList();
  return output.join("");
}

function language() {
  return document.documentElement.lang === "en" ? "en" : "ko";
}

function displayDate(value, lang) {
  if (!value) return COPY[lang].unknownDate;
  const datePart = String(value).slice(0, 10).replaceAll(".", "-");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return String(value);
  return lang === "ko" ? datePart.replaceAll("-", ".") : datePart;
}

function createCard(post, state) {
  const details = document.createElement("details");
  details.className = "notice-card";
  details.dataset.newsSlug = post.slug;
  details.dataset.newsType = post.type;

  const summary = document.createElement("summary");
  summary.className = "notice-card-trigger";

  const heading = document.createElement("span");
  heading.className = "notice-card-heading";

  const meta = document.createElement("span");
  meta.className = "notice-card-meta";

  if (post.pinned) {
    const latest = document.createElement("span");
    latest.className = "badge";
    latest.textContent = COPY[state.language].latest;
    meta.append(latest);
  }

  const category = document.createElement("span");
  category.textContent = COPY[state.language][post.type];
  meta.append(category);

  if (post.version) {
    const version = document.createElement("span");
    version.textContent = post.version;
    meta.append(version);
  }

  const time = document.createElement("time");
  if (post.publishedAt) time.dateTime = post.publishedAt;
  time.textContent = displayDate(post.publishedAt, state.language);
  meta.append(time);

  const title = document.createElement("span");
  title.className = "notice-card-title";
  title.textContent = post.title;
  heading.append(meta, title);

  if (post.summary) {
    const excerpt = document.createElement("span");
    excerpt.className = "news-card-summary";
    excerpt.textContent = post.summary;
    heading.append(excerpt);
  }

  const toggle = document.createElement("span");
  toggle.className = "notice-card-toggle";
  toggle.setAttribute("aria-hidden", "true");
  summary.append(heading, toggle);

  const body = document.createElement("div");
  body.className = "notice-card-body";
  body.lang = state.language;
  body.textContent = COPY[state.language].detailLoading;
  details.append(summary, body);

  details.addEventListener("toggle", async function () {
    if (!details.open || details.dataset.loaded === "true") return;
    try {
      const endpoint = `${state.apiBase}/news/${encodeURIComponent(post.type)}/${encodeURIComponent(post.slug)}?lang=${state.language}`;
      const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`News detail request failed: ${response.status}`);
      const payload = await response.json();
      body.innerHTML = renderMarkdown(payload.post.bodyMarkdown);
      details.dataset.loaded = "true";
    } catch (error) {
      console.error(error);
      body.textContent = COPY[state.language].detailError;
    }
  });

  return details;
}

async function loadCategory(root, state) {
  const list = root.querySelector("[data-news-list]");
  const status = root.querySelector("[data-news-status]");
  const count = root.querySelector("[data-news-count]");
  const countLabel = root.querySelector("[data-news-count-label]");

  state.controller?.abort();
  state.controller = new AbortController();
  status.hidden = false;
  status.textContent = COPY[state.language].loading;
  list.replaceChildren();
  count.textContent = "0";
  countLabel.textContent = COPY[state.language].count;

  try {
    const endpoint = new URL(state.apiBase + "/news");
    endpoint.searchParams.set("type", state.category);
    endpoint.searchParams.set("lang", state.language);
    endpoint.searchParams.set("limit", "50");
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      signal: state.controller.signal,
    });
    if (!response.ok) throw new Error(`News request failed: ${response.status}`);
    const payload = await response.json();
    count.textContent = String(payload.total);
    status.hidden = payload.posts.length > 0;
    status.textContent = payload.posts.length ? "" : COPY[state.language].empty;
    payload.posts.forEach(function (post) {
      list.append(createCard(post, state));
    });
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error(error);
    status.hidden = false;
    status.textContent = COPY[state.language].error;
  }
}

function selectCategory(root, state, category, updateUrl) {
  state.category = category === "update" ? "update" : "notice";
  root.querySelectorAll("[data-news-category]").forEach(function (button) {
    const active = button.dataset.newsCategory === state.category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("category", state.category);
    history.replaceState(null, "", url);
  }

  loadCategory(root, state);
}

export function initNewsBoard() {
  const root = document.querySelector("[data-news-board]");
  if (!root || root.dataset.newsReady === "true") return;
  root.dataset.newsReady = "true";

  const requestedCategory = new URL(window.location.href).searchParams.get("category");
  const state = {
    apiBase: root.dataset.apiBase.replace(/\/$/, ""),
    category: requestedCategory === "update" ? "update" : "notice",
    language: language(),
    controller: null,
  };

  root.querySelectorAll("[data-news-category]").forEach(function (button) {
    button.addEventListener("click", function () {
      selectCategory(root, state, button.dataset.newsCategory, true);
    });
  });

  document.addEventListener("pagerivet:languagechange", function (event) {
    if (!root.isConnected) return;
    state.language = event.detail?.language === "en" ? "en" : "ko";
    selectCategory(root, state, state.category, false);
  });

  selectCategory(root, state, state.category, false);
}
