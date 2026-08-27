import { fetchProjectJson, currentLanguage, localized } from "../core/json.mjs";
import { createModalController } from "../ui/modal.mjs";

let commandData = null;
let loading = null;
let languageListenerRegistered = false;

function statusText() {
  return currentLanguage() === "en"
    ? "Could not load the command data."
    : "명령어 데이터를 불러오지 못했습니다.";
}

function renderGroups(container) {
  if (!commandData || !container) return;
  const language = currentLanguage();
  container.innerHTML = "";

  commandData.groups.forEach(function (group) {
    const article = document.createElement("article");
    article.className = "card";
    const heading = document.createElement("h3");
    heading.textContent = localized(group.title, language);
    const list = document.createElement("div");

    group.commands.forEach(function (command) {
      const code = document.createElement("code");
      code.textContent = command.name;
      list.appendChild(code);
    });

    article.appendChild(heading);
    article.appendChild(list);
    container.appendChild(article);
  });
  container.classList.add("card-grid");
}

function renderTotal(data) {
  document.querySelectorAll("[data-mcp-total]").forEach(function (element) {
    element.textContent = String(data.total);
  });
}

function ensureLoaded(container) {
  if (commandData) {
    renderTotal(commandData);
    renderGroups(container);
    return Promise.resolve(commandData);
  }

  if (!loading) {
    loading = fetchProjectJson("assets/data/mcp-commands.json").then(function (data) {
      const commands = data.groups.reduce(function (all, group) {
        return all.concat(group.commands);
      }, []);
      if (data.total !== commands.length) throw new Error("MCP total does not match commands length.");
      commandData = data;
      return data;
    });
  }

  return loading.then(function (data) {
    renderTotal(data);
    renderGroups(container);
    return data;
  }).catch(function (error) {
    if (container) {
      container.className = "";
      container.innerHTML = '<div class="data-status">' + statusText() + '</div>';
    }
    throw error;
  });
}

export function initMcpCommands() {
  const modal = document.querySelector("[data-mcp-command-modal]");
  const container = document.querySelector("[data-mcp-command-groups]");
  const trigger = document.querySelector("[data-open-mcp-commands]");
  const totalTargets = document.querySelectorAll("[data-mcp-total]");
  if (!modal && !totalTargets.length) return;

  const controller = modal ? createModalController(modal, "[data-close-mcp-commands]") : null;

  ensureLoaded(container).catch(function (error) {
    console.error(error);
  });

  if (trigger && controller) {
    trigger.addEventListener("click", function () {
      controller.open();
      ensureLoaded(container).catch(function (error) {
        console.error(error);
      });
    });
  }

  if (!languageListenerRegistered) {
    languageListenerRegistered = true;
    document.addEventListener("pagerivet:languagechange", function () {
      renderGroups(document.querySelector("[data-mcp-command-groups]"));
    });
  }
}
