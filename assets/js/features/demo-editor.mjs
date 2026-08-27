const FILES = {
  ko: {
    "index.html": '<!doctype html>\n<html lang="ko">\n  <head>\n    <link rel="stylesheet" href="style.css">\n  </head>\n  <body>\n    <h1>PageRivet</h1>\n    <p>AI와 함께 만드는 웹 프로젝트</p>\n  </body>\n</html>',
    "about.html": '<!doctype html>\n<html lang="ko">\n  <body>\n    <main>\n      <h1>PageRivet 소개</h1>\n      <p>정적 웹 프로젝트와 AI 협업을 하나로 연결합니다.</p>\n    </main>\n  </body>\n</html>',
    "style.css": ':root {\n  --accent: #7c5cff;\n  --background: #0a0d14;\n}\n\nbody {\n  margin: 0;\n  font-family: system-ui, sans-serif;\n  background: var(--background);\n  color: white;\n}',
    "main.js": '"use strict";\n\nconst startButton = document.querySelector("#start");\n\nstartButton?.addEventListener("click", () => {\n  console.log("Welcome to PageRivet");\n});'
  },
  en: {
    "index.html": '<!doctype html>\n<html lang="en">\n  <head>\n    <link rel="stylesheet" href="style.css">\n  </head>\n  <body>\n    <h1>PageRivet</h1>\n    <p>A web project built with AI</p>\n  </body>\n</html>',
    "about.html": '<!doctype html>\n<html lang="en">\n  <body>\n    <main>\n      <h1>About PageRivet</h1>\n      <p>Static web projects and AI collaboration, connected.</p>\n    </main>\n  </body>\n</html>'
  }
};

FILES.en["style.css"] = FILES.ko["style.css"];
FILES.en["main.js"] = FILES.ko["main.js"];

let activeRenderer = null;
let languageListenerRegistered = false;

export function initDemoEditor() {
  const code = document.querySelector("[data-demo-code]");
  const tab = document.querySelector("[data-demo-tab]");
  const buttons = Array.from(document.querySelectorAll("[data-demo-file]"));

  if (!code || !tab || !buttons.length) {
    activeRenderer = null;
    return;
  }

  let activeButton = buttons.find(function (button) {
    return button.getAttribute("aria-pressed") === "true";
  }) || buttons[0];

  function render(button) {
    const language = document.documentElement.lang === "en" ? "en" : "ko";
    const fileName = button.dataset.demoFile;
    code.textContent = FILES[language][fileName] || "";
    tab.textContent = fileName;
    activeButton = button;
    buttons.forEach(function (item) {
      const isActive = item === button;
      item.classList.toggle("on", isActive);
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      render(button);
    });
  });

  activeRenderer = function () {
    render(activeButton);
  };

  if (!languageListenerRegistered) {
    languageListenerRegistered = true;
    document.addEventListener("pagerivet:languagechange", function () {
      if (activeRenderer) activeRenderer();
    });
  }

  render(activeButton);
}
