"use strict";

(function () {
  let appModulePromise = null;
  let previewNavigationInitialized = false;
  let isNavigating = false;

  const PAGE_SOURCES = Object.freeze({
    home: "index.md",
    about: "about.md",
    features: "features.md",
    mcp: "mcp.md",
    guide: "guide.md",
    update: "update.md"
  });

  const PAGE_ROUTES = Object.freeze({
    "/": "home",
    "/index.html": "home",
    "/about.html": "about",
    "/features.html": "features",
    "/mcp.html": "mcp",
    "/guide.html": "guide",
    "/update.html": "update"
  });

  const INCLUDE_SOURCES = Object.freeze({
    "header.md": "_includes/header.md",
    "footer.md": "_includes/footer.md",
    "download-guard.md": "_includes/download-guard.md",
    "update-toast.md": "_includes/update-toast.md"
  });

  const STYLE_SOURCES = Object.freeze([
    "_sass/base/_tokens.scss",
    "_sass/base/_base.scss",
    "_sass/layout/_site.scss",
    "_sass/components/_components.scss",
    "_sass/pages/_pages.scss"
  ]);

  function fetchText(path) {
    return fetch(path, { cache: "no-store" }).then(function (response) {
      if (!response.ok) {
        throw new Error(path + " 파일을 불러오지 못했습니다. HTTP " + response.status);
      }

      return response.text();
    });
  }

  function parseScalar(rawValue) {
    const value = String(rawValue || "").trim();

    if (!value) {
      return "";
    }

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      return value.slice(1, -1);
    }

    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }

    if (value === "null" || value === "~") {
      return null;
    }

    if (/^-?\d+(?:\.\d+)?$/.test(value)) {
      return Number(value);
    }

    return value;
  }

  function parseTopLevelYaml(source) {
    const data = {};

    source.split(/\r?\n/).forEach(function (line) {
      const match = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);

      if (match) {
        data[match[1]] = parseScalar(match[2]);
      }
    });

    return data;
  }

  function parseNavigationYaml(source) {
    const items = [];
    let currentItem = null;

    source.split(/\r?\n/).forEach(function (line) {
      const itemMatch = line.match(/^\s*-\s+([A-Za-z0-9_-]+):\s*(.*)$/);

      if (itemMatch) {
        currentItem = {};
        currentItem[itemMatch[1]] = parseScalar(itemMatch[2]);
        items.push(currentItem);
        return;
      }

      const propertyMatch = line.match(/^\s+([A-Za-z0-9_-]+):\s*(.*)$/);

      if (currentItem && propertyMatch) {
        currentItem[propertyMatch[1]] = parseScalar(propertyMatch[2]);
      }
    });

    return { items: items };
  }

  function splitFrontMatter(source, fileName) {
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

    if (!match) {
      throw new Error(fileName + " 파일에서 Jekyll Front Matter를 찾지 못했습니다.");
    }

    return {
      page: parseTopLevelYaml(match[1]),
      content: source.slice(match[0].length)
    };
  }

  function resolvePath(context, path) {
    return path.split(".").reduce(function (value, key) {
      if (value === undefined || value === null) {
        return undefined;
      }

      return value[key];
    }, context);
  }

  function evaluateAtom(expression, context) {
    const value = expression.trim();

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      return value.slice(1, -1);
    }

    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }

    return resolvePath(context, value);
  }

  function routeForPreview(value) {
    const original = String(value || "");

    if (/^(?:[a-z]+:|#|\/\/)/i.test(original)) {
      return original;
    }

    const parts = original.match(/^([^?#]*)(.*)$/);
    let path = parts ? parts[1] : original;
    const suffix = parts ? parts[2] : "";

    if (path.startsWith("/PageRivet/")) {
      path = path.slice("/PageRivet".length);
    }

    if (Object.prototype.hasOwnProperty.call(PAGE_ROUTES, path)) {
      const key = PAGE_ROUTES[path];
      return key === "home" ? "index.html" + suffix : "index.html?page=" + encodeURIComponent(key) + suffix;
    }

    return path.replace(/^\//, "") + suffix;
  }

  function applyFilter(value, filterExpression, context) {
    const separatorIndex = filterExpression.indexOf(":");
    const name = (separatorIndex >= 0 ? filterExpression.slice(0, separatorIndex) : filterExpression).trim();
    const argument = separatorIndex >= 0 ? filterExpression.slice(separatorIndex + 1).trim() : "";

    if (name === "default") {
      return value === undefined || value === null || value === ""
        ? evaluateAtom(argument, context)
        : value;
    }

    if (name === "relative_url") {
      return routeForPreview(value);
    }

    if (name === "date") {
      if (argument.replace(/['"]/g, "") === "%Y") {
        return String(new Date().getFullYear());
      }

      throw new Error("미리보기에서 지원하지 않는 date 형식입니다: " + argument);
    }

    throw new Error("미리보기에서 지원하지 않는 Liquid 필터입니다: " + name);
  }

  function renderVariable(expression, context) {
    const parts = expression.split("|").map(function (part) {
      return part.trim();
    });

    let value = evaluateAtom(parts.shift(), context);

    parts.forEach(function (filterExpression) {
      value = applyFilter(value, filterExpression, context);
    });

    return value === undefined || value === null ? "" : String(value);
  }

  function evaluateCondition(expression, context) {
    const equalityMatch = expression.match(/^(.+?)\s*(==|!=)\s*(.+)$/);

    if (equalityMatch) {
      const left = evaluateAtom(equalityMatch[1], context);
      const right = evaluateAtom(equalityMatch[3], context);
      return equalityMatch[2] === "==" ? left === right : left !== right;
    }

    return Boolean(evaluateAtom(expression, context));
  }

  function renderConditionals(template, context) {
    return template.replace(
      /{%\s*if\s+([^%]+?)\s*%}([\s\S]*?){%\s*endif\s*%}/g,
      function (_match, expression, content) {
        if (/{%\s*else\s*%}/.test(content)) {
          throw new Error("미리보기 렌더러는 Liquid else 구문을 아직 지원하지 않습니다.");
        }

        return evaluateCondition(expression, context) ? content : "";
      }
    );
  }

  function renderLoops(template, context) {
    return template.replace(
      /{%\s*for\s+([A-Za-z_][A-Za-z0-9_]*)\s+in\s+([A-Za-z0-9_.]+)\s*%}([\s\S]*?){%\s*endfor\s*%}/g,
      function (_match, itemName, collectionPath, content) {
        const collection = resolvePath(context, collectionPath);

        if (!Array.isArray(collection)) {
          throw new Error(collectionPath + " 값은 반복 가능한 목록이 아닙니다.");
        }

        return collection.map(function (item) {
          const childContext = Object.assign({}, context);
          childContext[itemName] = item;
          return renderConditionals(content, childContext).replace(
            /{{\s*([\s\S]*?)\s*}}/g,
            function (_variableMatch, expression) {
              return renderVariable(expression, childContext);
            }
          );
        }).join("");
      }
    );
  }

  function renderTemplate(template, context) {
    let output = renderLoops(template, context);
    output = renderConditionals(output, context);
    output = output.replace(
      /{{\s*([\s\S]*?)\s*}}/g,
      function (_match, expression) {
        return renderVariable(expression, context);
      }
    );

    const unresolved = output.match(/{{[\s\S]*?}}|{%[\s\S]*?%}/);

    if (unresolved) {
      throw new Error("지원되지 않는 Jekyll 구문이 남아 있습니다: " + unresolved[0]);
    }

    return output;
  }

  function replaceIncludes(template, includes) {
    return template.replace(
      /{%\s*include\s+([^\s%]+)\s*%}/g,
      function (_match, includeName) {
        if (!Object.prototype.hasOwnProperty.call(includes, includeName)) {
          throw new Error("미리보기 인클루드를 찾지 못했습니다: " + includeName);
        }

        return includes[includeName];
      }
    );
  }

  function getInitialTheme() {
    try {
      const savedTheme = localStorage.getItem("pagerivet.theme");

      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
    } catch (_error) {
      // 저장소를 사용할 수 없으면 시스템 테마를 사용합니다.
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function appendMeta(name, content) {
    if (!content) {
      return;
    }

    const meta = document.createElement("meta");
    meta.name = name;
    meta.content = content;
    document.head.appendChild(meta);
  }

  function parseRenderedPage(renderedHtml) {
    return new DOMParser().parseFromString(renderedHtml, "text/html");
  }

  function updateMeta(name, content) {
    const existing = document.head.querySelector('meta[name="' + name + '"]');
    if (!content) {
      if (existing) existing.remove();
      return;
    }

    if (existing) {
      existing.content = content;
      return;
    }

    appendMeta(name, content);
  }

  function applyInitialDocument(renderedHtml, cssText, pageKey) {
    const parsed = parseRenderedPage(renderedHtml);
    const parsedTitle = parsed.querySelector("title");
    const parsedDescription = parsed.querySelector('meta[name="description"]');
    const parsedThemeColor = parsed.querySelector('meta[name="theme-color"]');

    parsed.querySelectorAll("script, link[rel=\"stylesheet\"]").forEach(function (element) {
      element.remove();
    });

    document.documentElement.lang = parsed.documentElement.lang || "ko";
    document.documentElement.dataset.theme = getInitialTheme();
    document.head.replaceChildren();

    const charset = document.createElement("meta");
    charset.setAttribute("charset", "utf-8");
    document.head.appendChild(charset);

    const viewport = document.createElement("meta");
    viewport.name = "viewport";
    viewport.content = "width=device-width, initial-scale=1";
    document.head.appendChild(viewport);

    document.title = parsedTitle ? parsedTitle.textContent : "PageRivet";
    appendMeta("description", parsedDescription ? parsedDescription.content : "");
    appendMeta("theme-color", parsedThemeColor ? parsedThemeColor.content : "#0b0f18");
    appendMeta("robots", "noindex");

    const style = document.createElement("style");
    style.dataset.previewStyles = "";
    style.textContent = cssText + "\n@view-transition { navigation: none; }";
    document.head.appendChild(style);

    document.body.className = parsed.body.className;
    document.body.innerHTML = parsed.body.innerHTML;
    document.body.dataset.previewPage = pageKey;
  }

  function syncNavigationState(pageKey) {
    document.querySelectorAll(".site-header [data-nav-id]").forEach(function (link) {
      link.removeAttribute("aria-current");
      link.removeAttribute("aria-disabled");
      link.removeAttribute("tabindex");
    });

    const current = document.querySelector('.site-header [data-nav-id="' + pageKey + '"]');
    if (!current) return;

    current.setAttribute("aria-current", "page");
    current.setAttribute("aria-disabled", "true");
    current.setAttribute("tabindex", "-1");
  }

  function applyPageDocument(renderedHtml, pageKey) {
    const parsed = parseRenderedPage(renderedHtml);
    const nextMain = parsed.querySelector("#main-content");
    const currentMain = document.querySelector("#main-content");
    const parsedTitle = parsed.querySelector("title");
    const parsedDescription = parsed.querySelector('meta[name="description"]');
    const parsedThemeColor = parsed.querySelector('meta[name="theme-color"]');

    if (!nextMain || !currentMain) {
      throw new Error("미리보기 본문을 찾지 못했습니다.");
    }

    document.title = parsedTitle ? parsedTitle.textContent : "PageRivet";
    updateMeta("description", parsedDescription ? parsedDescription.content : "");
    updateMeta("theme-color", parsedThemeColor ? parsedThemeColor.content : "#0b0f18");

    document.body.className = parsed.body.className;
    document.body.dataset.previewPage = pageKey;
    currentMain.replaceWith(document.importNode(nextMain, true));
    syncNavigationState(pageKey);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function pageKeyFromUrl(url) {
    const requestedPage = url.searchParams.get("page") || "home";
    return requestedPage === "index" ? "home" : requestedPage;
  }

  function isPreviewPageNavigation(link, url) {
    const rawHref = link.getAttribute("href") || "";

    if (
      !rawHref ||
      rawHref.startsWith("#") ||
      link.hasAttribute("download") ||
      link.target ||
      url.origin !== window.location.origin ||
      url.pathname !== window.location.pathname
    ) {
      return false;
    }

    return Object.prototype.hasOwnProperty.call(PAGE_SOURCES, pageKeyFromUrl(url));
  }

  function loadAppModule() {
    if (!appModulePromise) {
      appModulePromise = import("./assets/js/main.mjs");
    }
    return appModulePromise;
  }

  async function navigatePreview(url, pushHistory) {
    const pageKey = pageKeyFromUrl(url);
    if (isNavigating || !PAGE_SOURCES[pageKey]) return;
    isNavigating = true;

    try {
      const page = await buildPreviewPage(pageKey);
      const apply = function () {
        applyPageDocument(page.template, pageKey);
      };

      if (!prefersReducedMotion() && typeof document.startViewTransition === "function") {
        const transition = document.startViewTransition(apply);
        await transition.finished.catch(function (error) {
          if (!error || error.name !== "AbortError") throw error;
        });
      } else {
        apply();
      }

      if (pushHistory) {
        window.history.pushState({ pageKey: pageKey }, "", url.href);
      }

      const app = await loadAppModule();
      if (typeof app.refreshPageFeatures === "function") {
        app.refreshPageFeatures();
      }

      console.info("[PageRivet Preview] " + page.pageSource + " 렌더링 완료");
    } catch (error) {
      console.error("[PageRivet Preview] 페이지 전환 실패", error);
    } finally {
      isNavigating = false;
    }
  }

  function initPreviewNavigation() {
    if (previewNavigationInitialized) return;
    previewNavigationInitialized = true;

    document.addEventListener("click", function (event) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = event.target.closest("a[href]");
      if (!link) return;

      const url = new URL(link.href, window.location.href);
      if (!isPreviewPageNavigation(link, url) || url.href === window.location.href) {
        return;
      }

      event.preventDefault();
      navigatePreview(url, true);
    });

    window.addEventListener("popstate", function () {
      navigatePreview(new URL(window.location.href), false);
    });
  }

  function showError(error) {
    console.error("[PageRivet Preview]", error);
    document.title = "PageRivet 미리보기 오류";
    document.body.className = "";
    document.body.innerHTML = "";

    const main = document.createElement("main");
    main.className = "preview-status";

    const heading = document.createElement("h1");
    heading.textContent = "홈페이지 미리보기를 만들지 못했습니다.";

    const message = document.createElement("p");
    message.textContent = error instanceof Error ? error.message : String(error);

    main.append(heading, message);
    document.body.appendChild(main);
  }

  async function buildPreviewPage(pageKey) {
    const pageSource = PAGE_SOURCES[pageKey];

    if (!pageSource) {
      throw new Error("지원하지 않는 미리보기 페이지입니다: " + pageKey);
    }

    const includeNames = Object.keys(INCLUDE_SOURCES);
    const requests = [
      fetchText(pageSource),
      fetchText("_layouts/default.html"),
      fetchText("_config.yml"),
      fetchText("_data/site.yml"),
      fetchText("_data/download.yml"),
      fetchText("_data/navigation.yml")
    ];

    includeNames.forEach(function (name) {
      requests.push(fetchText(INCLUDE_SOURCES[name]));
    });

    STYLE_SOURCES.forEach(function (path) {
      requests.push(fetchText(path));
    });

    const sources = await Promise.all(requests);
    const pageDocument = splitFrontMatter(sources[0], pageSource);
    const config = parseTopLevelYaml(sources[2]);
    const siteData = parseTopLevelYaml(sources[3]);
    const downloadData = parseTopLevelYaml(sources[4]);
    const navigationData = parseNavigationYaml(sources[5]);
    const includes = {};

    includeNames.forEach(function (name, index) {
      includes[name] = sources[6 + index];
    });

    const styleOffset = 6 + includeNames.length;
    const cssText = sources.slice(styleOffset).join("\n\n");
    const context = {
      content: pageDocument.content,
      page: pageDocument.page,
      site: Object.assign({}, config, {
        data: {
          site: siteData,
          download: downloadData,
          navigation: navigationData
        }
      })
    };

    let template = sources[1].replace("{{ content }}", pageDocument.content);
    template = replaceIncludes(template, includes);
    template = renderTemplate(template, context);

    return {
      template: template,
      cssText: cssText,
      pageKey: pageKey,
      pageSource: pageSource
    };
  }

  async function renderPreview() {
    const pageKey = pageKeyFromUrl(new URL(window.location.href));
    const page = await buildPreviewPage(pageKey);
    applyInitialDocument(page.template, page.cssText, pageKey);
    await loadAppModule();
    initPreviewNavigation();
    console.info("[PageRivet Preview] " + page.pageSource + " 렌더링 완료");
  }

  renderPreview().catch(showError);
})();
