import { fetchProjectJson, currentLanguage, localized } from "../core/json.mjs";
import { transitionContentPanels } from "../ui/content-transition.mjs";

const UI_TEXT = {
  ko: {
    latest: "최신",
    release: "릴리스",
    loadingDetails: "업데이트 내용을 불러오는 중입니다.",
    detailsError: "업데이트 내용을 불러오지 못했습니다.",
    listError: "업데이트 목록을 불러오지 못했습니다."
  },
  en: {
    latest: "Latest",
    release: "Release",
    loadingDetails: "Loading update details.",
    detailsError: "Could not load update details.",
    listError: "Could not load the update list."
  }
};

function textFor(key) {
  const language = currentLanguage();
  return (UI_TEXT[language] || UI_TEXT.ko)[key];
}

let indexData = null;
let currentUpdate = null;
let languageListenerRegistered = false;
let currentVersionIndex = 0;
let updateTransitioning = false;

function renderDetails(container, data) {
  if (!container || !data) return;
  const language = currentLanguage();
  const overview = localized(data.overview, language);
  container.innerHTML = "";

  const heading = document.createElement("div");
  heading.className = "section-heading";
  heading.innerHTML = '<span class="badge">' + textFor(data.latest ? "latest" : "release") + '</span><h2>PageRivet ' + data.version + '</h2><p>' + overview + '</p>';

  const meta = document.createElement("p");
  meta.textContent = [data.date, data.platform, data.packageType].filter(Boolean).join(" · ");
  heading.appendChild(meta);
  container.appendChild(heading);

  data.groups.forEach(function (group, index) {
    const details = document.createElement("details");
    details.className = "update-group";
    details.open = typeof group.open === "boolean" ? group.open : index === 0;

    const items = Array.isArray(group.items)
      ? group.items
      : (group.items[language] || group.items.ko || group.items.en || []);

    const summary = document.createElement("summary");
    summary.textContent = localized(group.title, language) + " · " + items.length;

    const list = document.createElement("ul");
    items.forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = localized(item, language);
      list.appendChild(li);
    });

    details.appendChild(summary);
    details.appendChild(list);
    container.appendChild(details);
  });
}

async function selectVersion(stage, file, targetIndex, animate) {
  const currentDetails = stage.querySelector("[data-update-details]");
  if (!currentDetails || updateTransitioning) return false;

  updateTransitioning = true;

  try {
    const nextUpdate = await fetchProjectJson("assets/data/" + file);

    if (!animate) {
      currentUpdate = nextUpdate;
      currentVersionIndex = targetIndex;
      renderDetails(currentDetails, currentUpdate);
      return true;
    }

    const nextDetails = document.createElement("div");
    nextDetails.className = "update-details";
    nextDetails.dataset.updateDetails = "";
    nextDetails.hidden = true;
    renderDetails(nextDetails, nextUpdate);
    stage.appendChild(nextDetails);

    const direction = targetIndex > currentVersionIndex ? "forward" : "backward";
    const changed = await transitionContentPanels(
      currentDetails,
      nextDetails,
      direction,
      { removeCurrent: true, scrollToStart: true }
    );

    if (changed) {
      currentUpdate = nextUpdate;
      currentVersionIndex = targetIndex;
    }

    return changed;
  } catch (error) {
    currentDetails.innerHTML = '<div class="data-status">' + textFor("detailsError") + '</div>';
    console.error(error);
    return false;
  } finally {
    updateTransitioning = false;
  }
}

function renderVersionList(container, stage) {
  container.innerHTML = "";
  indexData.versions.forEach(function (entry, index) {
    const button = document.createElement("button");
    button.className = "update-version-button";
    button.type = "button";
    button.textContent = "PageRivet " + entry.version;
    button.dataset.updateFile = entry.file;
    button.classList.toggle("is-active", index === currentVersionIndex);
    button.addEventListener("click", async function () {
      if (index === currentVersionIndex || updateTransitioning) return;

      const changed = await selectVersion(stage, entry.file, index, true);

      if (changed) {
        container.querySelectorAll(".update-version-button").forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });
      }
    });
    container.appendChild(button);
  });
}

export function initUpdateLog() {
  const versionList = document.querySelector("[data-update-version-list]");
  const stage = document.querySelector("[data-update-stage]");
  if (!versionList || !stage) return;

  function start(data) {
    if (!Array.isArray(data.versions) || !data.versions.length) {
      throw new Error("Update index is empty.");
    }

    indexData = data;
    currentVersionIndex = Math.min(currentVersionIndex, data.versions.length - 1);
    renderVersionList(versionList, stage);
    selectVersion(
      stage,
      data.versions[currentVersionIndex].file,
      currentVersionIndex,
      false
    );
  }

  if (indexData) {
    start(indexData);
  } else {
    fetchProjectJson("assets/data/updates-index.json").then(start).catch(function (error) {
      versionList.innerHTML = '<div class="data-status">' + textFor("listError") + '</div>';
      console.error(error);
    });
  }

  if (!languageListenerRegistered) {
    languageListenerRegistered = true;
    document.addEventListener("pagerivet:languagechange", function () {
      renderDetails(document.querySelector("[data-update-details]"), currentUpdate);
    });
  }
}
