"use strict";

const demoFiles = {
    "index.html": [
        "<!doctype html>",
        "<html lang=\"ko\">",
        "  <head>",
        "    <link rel=\"stylesheet\" href=\"style.css\">",
        "  </head>",
        "  <body>",
        "    <h1>PageRivet</h1>",
        "    <p>AI와 함께 만드는 웹 프로젝트</p>",
        "  </body>",
        "</html>"
    ].join("\n"),
    "about.html": [
        "<!doctype html>",
        "<html lang=\"ko\">",
        "  <body>",
        "    <main>",
        "      <h1>PageRivet 소개</h1>",
        "      <p>정적 웹 프로젝트와 AI 협업을 하나로 연결합니다.</p>",
        "    </main>",
        "  </body>",
        "</html>"
    ].join("\n"),
    "style.css": [
        ":root {",
        "  --accent: #7c5cff;",
        "  --background: #0a0d14;",
        "}",
        "",
        "body {",
        "  margin: 0;",
        "  font-family: system-ui, sans-serif;",
        "  background: var(--background);",
        "  color: white;",
        "}"
    ].join("\n"),
    "main.js": [
        "\"use strict\";",
        "",
        "const startButton = document.querySelector(\"#start\");",
        "",
        "startButton?.addEventListener(\"click\", () => {",
        "  console.log(\"Welcome to PageRivet\");",
        "});"
    ].join("\n")
};

const demoFileButtons = document.querySelectorAll("[data-demo-file]");
const demoTab = document.querySelector("[data-demo-tab]");
const demoCode = document.querySelector("[data-demo-code]");

function showDemoFile(button) {
    const fileName = button.dataset.demoFile;
    const content = (typeof activeLanguage !== "undefined" && activeLanguage === "en" ? demoFilesEn : demoFiles)[fileName];

    if (!content || !demoTab || !demoCode) {
        return;
    }

    demoFileButtons.forEach((item) => {
        const isSelected = item === button;
        item.classList.toggle("on", isSelected);
        item.setAttribute("aria-pressed", String(isSelected));
    });

    demoTab.textContent = fileName;
    demoCode.textContent = content;
}

demoFileButtons.forEach((button) => {
    button.addEventListener("click", () => showDemoFile(button));
});

const backToTopButton = document.createElement("button");
backToTopButton.className = "back-to-top";
backToTopButton.type = "button";
backToTopButton.setAttribute("aria-label", "페이지 최상단으로 이동");
backToTopButton.title = "맨 위로";
backToTopButton.textContent = "↑";
document.body.append(backToTopButton);

function updateBackToTopVisibility() {
    backToTopButton.classList.toggle("is-visible", window.scrollY >= 500);
}

backToTopButton.addEventListener("click", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({top: 0, behavior: reduceMotion ? "auto" : "smooth"});
});

window.addEventListener("scroll", updateBackToTopVisibility, {passive: true});
updateBackToTopVisibility();

const guideTocLinks = Array.from(document.querySelectorAll('.guide-toc a[href^="#"]'));
const guideSections = guideTocLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

let guideScrollFrame = 0;

function updateGuideToc() {
    guideScrollFrame = 0;

    if (!guideSections.length) {
        return;
    }

    const headerHeight = document.querySelector("header")?.offsetHeight ?? 0;
    const marker = window.scrollY + headerHeight + 150;
    let activeSection = guideSections[0];

    guideSections.forEach((section) => {
        if (section.offsetTop <= marker) {
            activeSection = section;
        }
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        activeSection = guideSections[guideSections.length - 1];
    }

    guideTocLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${activeSection.id}`;
        link.classList.toggle("is-active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

function requestGuideTocUpdate() {
    if (!guideScrollFrame) {
        guideScrollFrame = window.requestAnimationFrame(updateGuideToc);
    }
}

if (guideTocLinks.length) {
    window.addEventListener("scroll", requestGuideTocUpdate, {passive: true});
    window.addEventListener("resize", requestGuideTocUpdate);
    updateGuideToc();
}

const commandModal = document.querySelector("[data-mcp-command-modal]");
const openCommandButton = document.querySelector("[data-open-mcp-commands]");
const closeCommandButtons = document.querySelectorAll("[data-close-mcp-commands]");
let commandModalPreviousFocus = null;

function openCommandModal() {
    if (!commandModal) {
        return;
    }

    commandModalPreviousFocus = document.activeElement;
    commandModal.hidden = false;
    document.body.classList.add("modal-open");
    commandModal.querySelector(".mcp-command-close")?.focus();
}

function closeCommandModal() {
    if (!commandModal || commandModal.hidden) {
        return;
    }

    commandModal.hidden = true;
    document.body.classList.remove("modal-open");
    commandModalPreviousFocus?.focus();
}

openCommandButton?.addEventListener("click", openCommandModal);
closeCommandButtons.forEach((button) => button.addEventListener("click", closeCommandModal));

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeCommandModal();
    }
});

const demoFilesEn = {
    "index.html": ["<!doctype html>","<html lang=\"en\">","  <head>","    <link rel=\"stylesheet\" href=\"style.css\">","  </head>","  <body>","    <h1>PageRivet</h1>","    <p>A web project built with AI</p>","  </body>","</html>"].join("\n"),
    "about.html": ["<!doctype html>","<html lang=\"en\">","  <body>","    <main>","      <h1>About PageRivet</h1>","      <p>Static web projects and AI collaboration, connected.</p>","    </main>","  </body>","</html>"].join("\n"),
    "style.css": demoFiles["style.css"],
    "main.js": demoFiles["main.js"]
};

const translations = new Map([
["소개","About"],["기능","Features"],["MCP & AI 협업","MCP & AI Collaboration"],["가이드","Guide"],["다운로드","Download"],["커뮤니티","Community"],["링크","Links"],["지원","Support"],["문의하기","Contact"],["고마운 플랫폼","With Thanks"],
["정적 웹 프로젝트의 개발과 AI 협업을 하나로.","Static web development and AI collaboration, in one place."],["HTML, CSS, JavaScript 편집부터 실시간 미리보기, 검증, 히스토리 관리, MCP 기반 AI 협업까지 하나의 작업 공간으로 연결합니다.","Connect HTML, CSS, and JavaScript editing, live preview, validation, history, and MCP-based AI collaboration in one workspace."],["정적 웹 프로젝트의","Static web projects,"],["개발과 AI 협업을 하나로","development and AI collaboration in one place"],["지금 다운로드","Download Now"],["시작 가이드 보기","View Getting Started Guide"],["주요 기능","Core Features"],["웹 프로젝트 제작과 안전한 AI 협업을 위한 핵심 기능","Core features for web project creation and safe AI collaboration"],
["직관적인 코드 편집","Intuitive Code Editing"],["HTML, CSS, JavaScript를 파일 단위로 편집하고 빠르게 적용합니다.","Edit HTML, CSS, and JavaScript by file and apply changes quickly."],["실시간 미리보기","Live Preview"],["WebView2 기반 미리보기로 결과를 즉시 확인합니다.","See results immediately with the WebView2-based preview."],["히스토리 & 복구","History & Recovery"],["변경 기록을 저장하고 원하는 시점으로 복원합니다.","Keep a change history and restore any saved point."],["검증 & 안전한 저장","Validation & Safe Saving"],["코드 검증과 트랜잭션 기반 저장으로 변경 안정성을 높입니다.","Improve reliability with code validation and transactional saving."],["MCP 기반 AI 협업","MCP-based AI Collaboration"],["외부 AI 클라이언트가 프로젝트를 읽고 수정할 수 있도록 연결합니다.","Connect external AI clients so they can read and modify the project."],["다중 파일 지원","Multiple File Support"],["여러 HTML, CSS, JavaScript 파일을 하나의 프로젝트에서 관리합니다.","Manage multiple HTML, CSS, and JavaScript files in one project."],
["AI와 함께 더 나은 결과를","Better Results with AI"],["PageRivet은 특정 AI를 강제하지 않습니다. MCP를 통해 사용자가 사용하는 AI 클라이언트와 프로젝트를 연결하고, 검증과 히스토리 흐름 안에서 변경을 관리합니다.","PageRivet does not lock you into a specific AI. MCP connects your chosen AI client to the project while validation and history keep changes controlled."],["프로젝트 읽기 및 분석","Read and analyze the project"],["코드 수정 제안 및 적용","Propose and apply code changes"],["히스토리 기반 변경 추적","Track changes through history"],["사용자 승인 기반 안전한 변경","Safe, user-approved changes"],["프로젝트 읽기","Read project"],["수정 제안","Propose changes"],["변경 적용","Apply changes"],["히스토리 관리","Manage history"],
["빠르게 시작하기","Quick Start"],["프로젝트 열기","Open a Project"],["새 프로젝트를 만들거나 기존 프로젝트를 불러옵니다.","Create a new project or open an existing one."],["코드 편집","Edit Code"],["코드를 수정하고 미리보기로 결과를 확인합니다.","Edit the code and check the result in preview."],["AI와 협업","Collaborate with AI"],["MCP 클라이언트를 연결하고 자연어로 작업을 요청합니다.","Connect an MCP client and request work in natural language."],["공식 GitHub Releases에서 최신 버전을 다운로드합니다.","Download the latest version from the official GitHub Releases page."],["PageRivet을 다운로드하고 시작해보세요.","Download PageRivet and get started."],
["감사합니다","Thank You"],["PageRivet이 세상과 만날 수 있도록 크고 작은 계기와 영감을 건네주신 모든 분께 감사드립니다.","Thank you to everyone who gave PageRivet the moments and inspiration that helped it meet the world."],["이 목록은 제휴, 후원, 광고 또는 특정한 관계를 의미하지 않습니다.","This list does not imply partnership, sponsorship, advertising, or any special relationship."],["PageRivet의 여정에 계기와 영감을 더해준 모든 만남을 기억하기 위한 순수한 감사의 인사입니다.","It is simply a note of gratitude for every encounter that brought inspiration and momentum to PageRivet's journey."],["PageRivet을 소개할 수 있는 공간을 마련해준 데 감사드립니다.","Thank you for providing a place where PageRivet could be introduced."],["방문하기 →","Visit →"],
["파일","File"],["편집","Edit"],["보기","View"],["프로젝트","Project"],["도움말","Help"],["기록","History"],["오류","Errors"],["MCP 로그","MCP Log"],["콘솔","Console"],["웹 제작과 AI 협업을 하나로","Web creation and AI collaboration in one place"],["정적 웹 프로젝트를 더 빠르고 안전하게 구성하세요.","Build static web projects faster and more safely."],["시작하기","Get Started"],

["AI와 웹 코드를 더 자연스럽게 연결하는 작업 공간","A workspace that connects AI and web code more naturally"],["PageRivet은 HTML, CSS, JavaScript로 구성된 정적 웹 프로젝트를 만들고 편집하며, 결과를 바로 확인할 수 있는 Windows 데스크톱 에디터입니다.","PageRivet is a Windows desktop editor for creating and editing static HTML, CSS, and JavaScript projects with immediate results."],["필요에서 시작된 도구","A Tool Born from Need"],["PageRivet은 처음부터 범용 웹 에디터를 목표로 시작한 프로그램이 아닙니다. AI로 HTML, CSS, JavaScript 코드를 만들 때마다 생성된 내용을 확인하고, 필요한 부분을 수정한 뒤 다시 적용하는 과정이 반복됐습니다.","PageRivet did not begin as a general-purpose web editor. Working with AI-generated HTML, CSS, and JavaScript meant repeatedly reviewing, correcting, and applying code."],["이 불편한 흐름을 한곳에서 다룰 수 있는 도구가 필요했습니다. 단순한 코드 편집과 미리보기 기능으로 시작했지만, 실제 작업에서 필요한 기능을 하나씩 더하며 지금의 PageRivet으로 발전했습니다.","A tool was needed to handle that awkward workflow in one place. It began with simple editing and preview features, then grew as real work revealed what else was needed."],
["웹 프로젝트의 흐름을 한곳에서","The Web Project Workflow in One Place"],["코드를 작성하는 순간부터 결과를 확인하고, 문제를 찾고, 이전 상태로 돌아가는 과정까지 하나의 작업 공간으로 연결합니다.","From writing code to reviewing results, finding issues, and returning to an earlier state, the whole process stays connected in one workspace."],["편집과 미리보기","Edit and Preview"],["여러 HTML, CSS, JavaScript 파일을 관리하고 WebView2 기반 미리보기로 변경 결과를 즉시 확인합니다.","Manage multiple HTML, CSS, and JavaScript files and see changes immediately in the WebView2-based preview."],["검증과 진단","Validate and Diagnose"],["코드 검증과 오류·콘솔 정보를 통해 문제가 발생한 지점을 더 빠르게 확인할 수 있습니다.","Use validation, errors, and console information to locate problems faster."],["기록과 복구","History and Recovery"],["History, Undo/Redo, 과거 상태 복원과 외부 파일 변경 감지를 통해 작업 흐름을 안전하게 관리합니다.","Keep the workflow safe with History, Undo/Redo, state restoration, and external file-change detection."],
["특정 AI가 아닌,","Not a Specific AI,"],["사용자가 선택하는 AI","the AI You Choose"],["PageRivet은 API 토큰을 등록해 특정 AI 서비스를 프로그램 안에 직접 내장하는 대신 MCP를 선택했습니다. 하나의 서비스에 종속되기보다 사용자가 원하는 AI 클라이언트를 선택할 수 있는 구조가 더 적합하다고 판단했기 때문입니다.","Instead of embedding a specific AI service through an API token, PageRivet uses MCP so users can choose the AI client that suits them."],["로컬 MCP 서버를 통해 Codex, Claude Code, Cursor, VS Code 및 GitHub Copilot 같은 MCP 클라이언트가 프로젝트를 읽고 분석할 수 있습니다. 코드 변경은 검증과 사용자 승인 과정을 거쳐 안전하게 적용됩니다.","Through the local MCP server, clients such as Codex, Claude Code, Cursor, VS Code, and GitHub Copilot can read and analyze the project. Code changes are applied through validation and user approval."],
["AI와 함께, 반복해서 완성했습니다","Built Iteratively with AI"],["PageRivet의 기획과 필요한 기능, 동작 방식, 주요 설계 방향은 실제 사용 흐름을 기준으로 정했습니다. 구현에는 AI를 적극적으로 활용했지만, 한 번의 프롬프트로 생성한 결과물이 아닙니다. 결과를 직접 확인하고 문제를 다시 정의하며 구조와 기능을 반복해서 다듬었습니다.","PageRivet's plan, features, behavior, and design direction were shaped by real workflows. AI played an active role in implementation, but this was never a one-prompt result. The structure and features were refined through repeated review and problem definition."],["PageRivet이 집중하는 것","What PageRivet Focuses On"],["PageRivet은 웹 빌더나 전문 IDE를 대체하려는 프로그램이 아닙니다. 서버, CMS, 호스팅 기능을 포함하지 않으며 정적 HTML, CSS, JavaScript 프로젝트와 안전한 AI 협업에 집중합니다.","PageRivet is not intended to replace a web builder or professional IDE. It does not include server, CMS, or hosting features; it focuses on static HTML, CSS, and JavaScript projects and safe AI collaboration."],

["PageRivet으로 할 수 있는 일","What You Can Do with PageRivet"],["정적 웹 프로젝트를 만들고 편집하는 순간부터 미리보기, 검증, 기록과 복구, 내보내기까지 하나의 작업 환경에서 관리합니다.","Manage the full workflow—from creating and editing a static web project to preview, validation, history, recovery, and export—in one environment."],["프로젝트와 코드를 한곳에서 관리합니다","Manage Projects and Code in One Place"],["하나의 파일만 편집하는 도구가 아니라 여러 HTML, CSS, JavaScript 파일로 구성된 정적 웹 프로젝트 전체를 다룹니다.","PageRivet manages an entire static web project made of multiple HTML, CSS, and JavaScript files, not just a single file."],
["프로젝트 생성과 관리","Project Creation and Management"],["새 프로젝트를 시작하거나 기존 프로젝트를 열고 파일 단위 작업부터 전체 프로젝트 저장까지 이어서 처리합니다.","Start a new project or open an existing one, then continue from file-level work through full-project saving."],["새 프로젝트 생성 및 기존 프로젝트 열기","Create new projects and open existing ones"],["저장 및 다른 이름으로 저장","Save and Save As"],["다중 HTML, CSS, JavaScript 파일 관리","Manage multiple HTML, CSS, and JavaScript files"],["파일 생성, 이름 변경, 삭제","Create, rename, and delete files"],
["HTML, CSS, JavaScript 편집","HTML, CSS, and JavaScript Editing"],["코드를 직접 편집하고 현재 작성 중인 내용과 프로젝트에 적용된 정상 상태를 구분해 관리합니다.","Edit code directly while keeping in-progress content separate from the valid state applied to the project."],["구문 강조와 줄 번호","Syntax highlighting and line numbers"],["검색과 줄 이동","Search and go to line"],["저장되지 않은 변경 표시","Unsaved-change indicators"],["적용 전 검증을 거치는 안전한 반영","Safe application after validation"],
["결과를 확인하고 안전하게 되돌립니다","Review Results and Recover Safely"],["웹 페이지 미리보기","Web Page Preview"],["WebView2 기반 미리보기에서 HTML 페이지를 선택하고 CSS와 JavaScript 적용 결과를 바로 확인합니다.","Choose an HTML page in the WebView2 preview and immediately review the applied CSS and JavaScript."],["코드 적용 후 자동 갱신","Automatic refresh after applying code"],["미리보기 페이지 선택","Preview page selection"],["미리보기 최대화 및 복원","Maximize and restore preview"],
["코드 검증과 오류 확인","Code Validation and Errors"],["프로젝트에 변경을 적용하기 전에 HTML, CSS, JavaScript의 문제를 확인합니다.","Check HTML, CSS, and JavaScript issues before applying changes to the project."],["파일·줄·열 기준 오류 표시","File, line, and column error locations"],["실행 예외 및 콘솔 메시지 확인","Runtime exceptions and console messages"],["여러 파일을 하나의 변경 단위로 처리","Handle multiple files as one change"],
["히스토리와 복구","History and Recovery"],["변경 기록을 확인하고 원하는 시점을 선택해 복원합니다. 복원 역시 새로운 기록으로 남습니다.","Review the change history and restore a selected point. A restoration is also recorded as a new change."],["Undo 및 Redo","Undo and Redo"],["변경 히스토리 조회","Review change history"],["과거 상태 선택 및 복원","Select and restore a past state"],["최대 Undo 횟수 설정","Configure maximum Undo count"],
["외부 변경도 같은 흐름으로","External Changes in the Same Workflow"],["다른 편집기나 도구에서 파일이 변경되면 이를 감지하고 다시 검증합니다. 정상적인 변경만 프로젝트 상태에 반영하고 히스토리에 기록합니다.","When another editor or tool changes a file, PageRivet detects and revalidates it. Only valid changes enter the project state and history."],["일반적인 웹 프로젝트로 내보내기","Export as a Standard Web Project"],["작업 결과는 PageRivet에 종속되지 않습니다. 프로젝트 폴더, ZIP 또는 코드 복사 방식으로 내보내 계속 사용할 수 있습니다.","Your work is not locked to PageRivet. Export a project folder, ZIP archive, or copied code and continue anywhere."],
["작업을 돕는 편의 기능","Convenience Features"],["한국어 / 영어 UI","Korean / English UI"],["라이트 / 다크 모드","Light / Dark Mode"],["시작 가이드","Getting Started Guide"],["MCP 명령어 안내","MCP Command Guide"],["포터블 실행","Portable App"],["AI와 함께 작업하는 방법이 궁금하신가요?","Want to Work with AI?"],["PageRivet의 MCP 연결과 안전한 변경 흐름을 확인해보세요.","Explore PageRivet's MCP connection and safe change workflow."],["MCP & AI 협업 보기","View MCP & AI Collaboration"],

["사용자가 선택한 AI와 함께 작업합니다","Work with the AI You Choose"],["PageRivet은 특정 AI를 직접 내장하지 않습니다. 로컬 MCP 서버를 통해 사용자가 선택한 AI 클라이언트와 프로젝트를 연결합니다.","PageRivet does not embed a specific AI. Its local MCP server connects your chosen AI client to the project."],["PageRivet이 정하는 AI가 아닌,","Not an AI Chosen by PageRivet—"],["사용자가 선택한 AI와 연결합니다","Connect with the AI You Choose"],["특정 모델이나 채팅 기능에 종속되는 대신 MCP를 사용합니다. 사용자는 익숙한 AI 클라이언트에서 자연어로 요청하고, AI는 PageRivet의 활성 프로젝트를 기준으로 코드를 확인하고 작업합니다.","MCP avoids lock-in to a model or chat feature. You make natural-language requests in a familiar AI client, which works against PageRivet's active project."],
["복사와 붙여넣기를 하나의 흐름으로","Replace Copy and Paste with One Workflow"],["AI와 편집기 사이에서 코드를 반복해서 옮기는 과정을 줄이고 사용자와 AI가 같은 프로젝트를 기준으로 협업합니다.","Reduce repeated code transfers between AI and editor so both user and AI collaborate on the same project."],["일반적인 작업 흐름","Typical Workflow"],["AI에게 코드 요청","Ask AI for code"],["생성된 코드 확인","Review generated code"],["코드 복사 및 붙여넣기","Copy and paste code"],["결과 확인","Review result"],["다시 수정 요청","Request another revision"],["사용자가 AI에게 작업 요청","User requests a task"],["AI가 PageRivet 프로젝트 확인","AI reviews the PageRivet project"],["필요한 코드 분석 및 변경","Analyze and change the required code"],["PageRivet에서 검증과 적용","Validate and apply in PageRivet"],["사용자가 결과 확인","User reviews the result"],
["연결된 AI가 할 수 있는 일","What a Connected AI Can Do"],["프로젝트 이해","Understand the Project"],["활성 프로젝트 정보와 상태 확인","Review active project information and state"],["프로젝트 파일 목록 조회","List project files"],["HTML, CSS, JavaScript 읽기","Read HTML, CSS, and JavaScript"],["코드 작업","Code Work"],["HTML, CSS, JavaScript 수정","Modify HTML, CSS, and JavaScript"],["파일 생성 및 이름 변경","Create and rename files"],["필요한 파일 삭제","Delete files when needed"],["오류 확인","Inspect Errors"],["프로젝트 검증 요청","Request project validation"],["코드와 실행 오류 확인","Inspect code and runtime errors"],["브라우저 콘솔 정보 확인","Review browser console information"],["변경 기록 활용","Use Change History"],["히스토리 조회와 상태 비교","Review history and compare states"],["이전 상태 확인","Inspect previous states"],["선택한 상태 복원","Restore a selected state"],
["도구 이름을 외우지 않아도 됩니다","No Need to Memorize Tool Names"],["평소 AI와 대화하듯 원하는 작업을 설명하면 AI 클라이언트가 필요한 PageRivet MCP 도구를 선택해 프로젝트를 확인하고 작업합니다.","Describe the task as you normally talk to an AI. The client selects the required PageRivet MCP tools and works with the project."],["“메인 페이지 상단에 다운로드 버튼을 추가하고 전체 디자인에 어울리게 만들어줘.”","“Add a download button to the top of the home page and match the existing design.”"],["“모바일 화면에서 메뉴가 깨지는 원인을 찾아서 수정해줘.”","“Find and fix why the menu breaks on mobile.”"],["“기존 페이지 스타일에 맞춰 새로운 소개 페이지를 만들어줘.”","“Create a new introduction page that matches the existing style.”"],
["AI 변경도 PageRivet의 작업 흐름을 따릅니다","AI Changes Follow PageRivet's Workflow"],["AI는 검증과 히스토리 시스템을 우회하지 않습니다. 사용자는 변경 과정을 확인하고 문제가 생기면 이전 상태로 돌아갈 수 있습니다.","AI does not bypass validation or history. You can review the process and return to an earlier state if needed."],["프로젝트 상태 확인","Review project state"],["변경 작업","Make changes"],["코드 검증","Validate code"],["사용자 승인","User approval"],["히스토리 기록","Record history"],
["로컬에서 연결되는 협업 구조","A Locally Connected Collaboration Model"],["PageRivet MCP 서버는 사용자의 PC에서 실행되며 AI 클라이언트와 활성 프로젝트 사이를 연결합니다.","The PageRivet MCP server runs on your PC and connects the AI client with the active project."],["사용자 · 자연어 요청","User · Natural-language request"],["다양한 MCP 클라이언트와 연결","Connect with a Range of MCP Clients"],["자동 연결 또는 연결 설정을 지원하는 클라이언트입니다. 실제 동작 여부와 지원 범위는 각 클라이언트의 MCP 지원 방식과 버전에 따라 달라질 수 있습니다.","These clients support automatic connection or connection setup. Availability and scope may vary by each client's MCP implementation and version."],["사용 중인 AI와 PageRivet을 연결해보세요.","Connect PageRivet with the AI You Use."],["직접 코드 편집과 AI 협업을 하나의 프로젝트 안에서 이어갈 수 있습니다.","Continue direct code editing and AI collaboration within one project."],["처음 시작하기","Get Started"],["MCP 연결 보기","View MCP Connection"],["PageRivet 다운로드","Download PageRivet"],

["PageRivet 사용 가이드","PageRivet User Guide"],["프로젝트를 시작하고 코드를 편집하는 방법부터 미리보기, 검증, 복구, 내보내기와 MCP 기반 AI 협업까지 작업 순서에 따라 안내합니다.","Follow the workflow from starting a project and editing code through preview, validation, recovery, export, and MCP-based AI collaboration."],["가이드 목차","Guide Contents"],["다운로드 및 실행","Download and Run"],["프로젝트 시작","Start a Project"],["코드 편집과 적용","Edit and Apply Code"],["미리보기","Preview"],["검증과 오류 확인","Validation and Errors"],["외부 파일 변경","External File Changes"],["프로젝트 내보내기","Export Project"],["MCP와 AI 연결","Connect MCP and AI"],["문제 해결","Troubleshooting"],["지원 및 문의","Support and Contact"],
["PageRivet은 Windows에서 실행되는 포터블 데스크톱 애플리케이션입니다. 설치 과정 없이 다운로드한 패키지를 준비해 실행할 수 있습니다.","PageRivet is a portable Windows desktop application. Prepare the downloaded package and run it without installation."],["공식 GitHub Releases에서 최신 PageRivet 패키지를 다운로드합니다.","Download the latest PageRivet package from the official GitHub Releases page."],["파일 준비","Prepare Files"],["다운로드한 압축 파일을 작업하기 편한 위치에 풀어둡니다.","Extract the downloaded archive to a convenient working location."],["실행","Run"],["PageRivet 실행 파일을 열고 시작 화면이 표시되는지 확인합니다.","Open the PageRivet executable and confirm that the start screen appears."],["다운로드 위치","Download Location"],["GitHub Releases에서 PageRivet 다운로드","Download PageRivet from GitHub Releases"],
["새 정적 웹 프로젝트를 만들거나 기존 HTML, CSS, JavaScript 프로젝트를 열어 작업할 수 있습니다.","Create a new static web project or open an existing HTML, CSS, and JavaScript project."],["새 프로젝트","New Project"],["새 프로젝트 만들기를 선택합니다.","Select Create New Project."],["프로젝트 이름과 저장할 위치를 지정합니다.","Choose a project name and save location."],["생성된 기본 파일을 확인하고 작업을 시작합니다.","Review the generated starter files and begin working."],["기존 프로젝트","Existing Project"],["기존 프로젝트 열기를 선택합니다.","Select Open Existing Project."],["HTML, CSS, JavaScript 파일이 있는 프로젝트를 선택합니다.","Choose a project containing HTML, CSS, and JavaScript files."],["파일 목록과 미리보기 페이지를 확인합니다.","Review the file list and preview page."],["파일 관리","File Management"],["여러 HTML, CSS, JavaScript 파일을 생성하고 이름을 변경하거나 삭제할 수 있습니다. 작업 전 현재 선택한 파일을 확인하세요.","You can create, rename, and delete multiple HTML, CSS, and JavaScript files. Check the currently selected file before working."],
["PageRivet은 편집 중인 코드와 프로젝트에 적용된 상태를 구분합니다. 코드를 입력하는 즉시 적용하지 않고 검증을 거쳐 정상 상태를 반영합니다.","PageRivet separates code being edited from the state applied to the project. Changes are validated before entering the valid project state."],["파일 선택","Select File"],["프로젝트 목록에서 편집할 HTML, CSS 또는 JavaScript 파일을 선택합니다.","Choose the HTML, CSS, or JavaScript file to edit from the project list."],["구문 강조, 줄 번호, 검색과 줄 이동 기능을 이용해 코드를 수정합니다.","Edit with syntax highlighting, line numbers, search, and go-to-line."],["변경 상태 확인","Check Change State"],["저장되지 않았거나 아직 적용되지 않은 변경이 있는지 확인합니다.","Check for unsaved or unapplied changes."],["적용 및 검증","Apply and Validate"],["변경을 적용하면 PageRivet이 코드를 검증하고 정상적인 변경을 프로젝트에 반영합니다.","When you apply changes, PageRivet validates the code and updates the project with valid changes."],["결과 확인","Review Results"],["미리보기와 오류·콘솔 영역에서 적용 결과를 확인합니다.","Review applied results in the preview, errors, and console areas."],["적용되지 않은 편집 내용","Unapplied Editor Content"],["에디터에 입력한 내용과 실제 프로젝트 상태가 다를 수 있습니다. 파일을 전환하거나 AI 작업을 시작하기 전에 미적용 변경 여부를 확인하세요.","Editor content can differ from the applied project state. Check for unapplied changes before switching files or starting AI work."],
["웹 페이지 미리보기","Web Page Preview"],["WebView2 기반 미리보기에서 적용된 프로젝트 결과를 확인합니다.","Review the applied project in the WebView2-based preview."],["미리볼 HTML 페이지를 선택합니다.","Choose the HTML page to preview."],["코드를 적용한 뒤 미리보기가 갱신되는지 확인합니다.","After applying code, confirm that the preview refreshes."],["CSS 디자인과 JavaScript 동작을 확인합니다.","Review the CSS design and JavaScript behavior."],["더 넓게 확인하려면 미리보기를 최대화하고 필요할 때 복원합니다.","Maximize the preview for more space and restore it when needed."],["기준 상태","Reference State"],["미리보기는 에디터에 입력만 한 내용이 아니라 프로젝트에 적용된 코드를 기준으로 표시됩니다.","The preview uses applied project code, not content merely typed into the editor."],
["변경사항을 적용하기 전에 HTML, CSS, JavaScript의 구문 문제를 확인하고, 실행 중 발생한 문제는 오류와 콘솔 정보에서 확인합니다.","Check HTML, CSS, and JavaScript syntax before applying changes, and inspect runtime problems through errors and console information."],["HTML 구조 확인","Check HTML structure"],["CSS 구문 오류 확인","Check CSS syntax errors"],["JavaScript 구문 오류 확인","Check JavaScript syntax errors"],["파일·줄·열 기준 문제 위치 확인","Locate issues by file, line, and column"],["실행 진단","Runtime Diagnostics"],["JavaScript 실행 예외 확인","Check JavaScript runtime exceptions"],["브라우저 콘솔 메시지 확인","Review browser console messages"],["관련 파일을 수정한 뒤 다시 적용","Edit related files and apply again"],["미리보기에서 결과 재확인","Review the result again in preview"],["여러 파일 변경","Multiple File Changes"],["관련된 여러 파일은 하나의 변경 단위로 적용됩니다. 일부 파일만 변경된 불완전한 상태가 남지 않도록 검증 결과를 확인하세요.","Related files are applied as one change. Review validation so a partially changed state is not left behind."],
["변경 기록을 확인하고 이전 상태로 돌아갈 수 있습니다. 복원해도 기존 기록은 삭제되지 않으며, 복원 결과 역시 새로운 변경으로 기록됩니다.","Review change history and return to an earlier state. Existing history remains, and restoration is recorded as a new change."],["Undo와 Redo로 최근 편집 흐름을 이동합니다.","Move through recent edits with Undo and Redo."],["히스토리에서 저장된 변경 시점을 확인합니다.","Review saved change points in history."],["필요한 과거 상태를 선택해 현재 프로젝트에 복원합니다.","Select a past state and restore it to the current project."],["복원 후 미리보기와 검증 결과를 다시 확인합니다.","Review the preview and validation after restoration."],["복원 전 확인","Before Restoring"],["현재 에디터에 아직 적용되지 않은 변경이 있다면 먼저 내용을 확인하세요. 복원 대상과 현재 상태를 비교한 뒤 진행하는 것이 안전합니다.","If the editor has unapplied changes, review them first. Compare the restoration target with the current state before proceeding."],
["외부 파일 변경 처리","Handle External File Changes"],["PageRivet 외부의 편집기나 AI 도구가 프로젝트 파일을 변경한 경우에도 변경을 감지하고 검증 흐름 안에서 관리할 수 있습니다.","When an editor or AI tool outside PageRivet modifies project files, the changes can still be detected and managed through validation."],["변경 감지","Detect Changes"],["프로젝트 파일이 외부에서 수정되었는지 확인합니다.","Check whether project files were modified externally."],["재검증","Revalidate"],["변경된 HTML, CSS, JavaScript를 다시 검증합니다.","Revalidate the changed HTML, CSS, and JavaScript."],["상태 반영","Update State"],["정상적인 변경을 프로젝트 상태에 반영합니다.","Apply valid changes to the project state."],["기록 확인","Review History"],["반영된 외부 변경이 히스토리에 기록됐는지 확인합니다.","Confirm that applied external changes appear in history."],
["PageRivet 프로젝트는 일반적인 HTML, CSS, JavaScript 파일로 유지됩니다. 목적에 맞는 방식으로 내보내 다른 도구나 배포 환경에서도 사용할 수 있습니다.","PageRivet projects remain standard HTML, CSS, and JavaScript files. Export them in the format you need for other tools or deployment environments."],["프로젝트 폴더","Project Folder"],["정적 웹 프로젝트의 파일 구조를 폴더 형태로 내보냅니다.","Export the static web project's file structure as a folder."],["프로젝트 전체를 하나의 압축 파일로 내보냅니다.","Export the entire project as one archive."],["코드 복사","Copy Code"],["필요한 코드를 복사해 다른 편집기나 서비스에서 사용합니다.","Copy the required code for use in another editor or service."],
["MCP와 AI 클라이언트 연결","Connect MCP and an AI Client"],["PageRivet의 로컬 MCP 서버를 사용하면 지원되는 AI 클라이언트가 활성 프로젝트를 읽고 분석하며, 검증과 승인 과정을 거쳐 변경을 적용할 수 있습니다.","With PageRivet's local MCP server, supported AI clients can read and analyze the active project and apply changes through validation and approval."],["프로젝트 준비","Prepare the Project"],["AI와 작업할 프로젝트를 PageRivet에서 열고 활성 상태를 확인합니다.","Open the project in PageRivet and confirm it is active."],["MCP 서버 실행","Run the MCP Server"],["PageRivet에서 로컬 MCP 서버를 실행합니다.","Start the local MCP server in PageRivet."],["AI 클라이언트 연결","Connect the AI Client"],["사용 중인 MCP 지원 AI 클라이언트에 PageRivet 연결을 설정합니다.","Configure the PageRivet connection in your MCP-capable AI client."],["자연어로 요청","Request in Natural Language"],["원하는 작업과 대상 페이지를 구체적으로 설명합니다.","Describe the desired work and target page clearly."],["변경 검토","Review Changes"],["AI가 제안한 변경 범위, 검증 결과와 승인 요청을 확인합니다.","Review the AI's proposed scope, validation results, and approval request."],["요청 예시","Example Request"],["“현재 페이지의 모바일 메뉴가 깨지는 원인을 확인하고, 기존 디자인을 유지하면서 수정해줘.”","“Find the cause of the broken mobile menu and fix it while preserving the existing design.”"],["자세한 협업 방식","Detailed Collaboration Workflow"],["MCP & AI 협업 페이지에서 확인","View the MCP & AI Collaboration page"],["사용 가능한 MCP 명령어 보기","View Available MCP Commands"],["명령어 이름을 직접 외울 필요는 없습니다. 원하는 작업을 자연어로 요청하면 AI 클라이언트가 필요한 PageRivet MCP 명령어를 선택합니다.","You do not need to memorize command names. Request the task in natural language and the AI client will select the required PageRivet MCP commands."],["명령어 목록 열기 →","Open Command List →"],
["자주 확인할 문제","Common Issues"],["미리보기가 바뀌지 않아요","The preview does not change"],["편집 내용이 프로젝트에 적용됐는지 확인하고 검증 오류가 없는지 살펴보세요.","Confirm that edits were applied and check for validation errors."],["코드 적용이 실패해요","Code application fails"],["오류 목록에서 파일과 줄 위치를 확인하고 관련 코드를 수정한 뒤 다시 적용하세요.","Check the file and line in the error list, fix the related code, and apply again."],["외부 변경이 보이지 않아요","External changes do not appear"],["외부 변경 감지 상태와 현재 에디터의 미적용 변경 여부를 함께 확인하세요.","Check external-change detection and any unapplied editor changes."],["AI가 프로젝트를 읽지 못해요","AI cannot read the project"],["활성 프로젝트, MCP 서버 실행 상태와 AI 클라이언트의 연결 설정을 확인하세요.","Check the active project, MCP server status, and AI client connection settings."],["이전 상태로 돌아가고 싶어요","I want to return to an earlier state"],["히스토리에서 원하는 시점을 선택하고 현재 상태와 비교한 뒤 복원하세요.","Choose a point in history, compare it with the current state, and restore it."],["JavaScript가 동작하지 않아요","JavaScript does not work"],["구문 검증뿐 아니라 실행 오류와 브라우저 콘솔 메시지도 함께 확인하세요.","Check runtime errors and browser console messages in addition to syntax validation."],
["가이드로 해결되지 않는 문제는 아래 채널에서 프로젝트 정보와 재현 절차를 함께 알려주세요.","If the guide does not resolve the issue, share project information and reproduction steps through one of the channels below."],["GitHub 저장소","GitHub Repository"],["Discord 커뮤니티","Discord Community"],["이메일 문의","Email Support"],["사용 가능한 MCP 명령어","Available MCP Commands"],["아래 명령어는 AI 클라이언트가 PageRivet 프로젝트를 확인하고 작업할 때 사용합니다. 사용자가 직접 입력하거나 기억할 필요는 없습니다.","AI clients use these commands to inspect and work with PageRivet projects. Users do not need to type or remember them."],["애플리케이션 및 프로젝트","Application and Project"],["소스 파일 읽기","Read Source Files"],["코드 변경","Change Code"],["파일 생성·이름 변경·삭제","Create, Rename, and Delete Files"],["검증 및 진단","Validation and Diagnostics"],["변경 기록과 복원","History and Restoration"]
]);
[["PageRivet 업데이트","PageRivet Updates"],["버전별 업데이트","Updates by Version"],["PageRivet의 버전별 업데이트 변경점을 확인하세요.","Review the changes included in each PageRivet release."],["새로운 버전의 주요 변경점을 확인하세요.","Review the key changes in the new release."],["마지막 공개 버전 1.1.1 이후의 기능과 개선 사항을 통합한 PageRivet 2.2.1을 소개합니다.","Meet PageRivet 2.2.1, which brings together every feature and improvement since the last public release, 1.1.1."],["최신버전 다운로드","Download Latest Version"],["사용 가이드","User Guide"],["리소스 관리, 다중 인스턴스 복구와 MCP 연결, 39개 MCP 명령어, 새로운 워크벤치 디자인을 하나의 공개 버전으로 제공합니다.","This public release combines resource management, multi-instance recovery and MCP connections, 39 MCP commands, and a redesigned workbench."],["업데이트 핵심 요약","Update highlights"],["MCP 명령어","MCP commands"],["리소스 분류","resource categories"],["인스턴스 연결","instance connections"],["추가","Added"],["새롭게 사용할 수 있는 기능","New capabilities"],["변경","Changed"],["기존 흐름과 사용성 개선","Workflow and usability improvements"],["수정","Fixed"],["안정성과 화면 표시 문제 해결","Stability and display fixes"],["보안","Security"],["프로젝트와 사용자 정보 보호","Project and user data protection"],["프로그램 시작 화면을 PageRivet 공식 홈페이지와 연결했습니다.","Connected the application start screen to the official PageRivet website."],["공식 홈페이지를 불러오지 못할 때 내장 오프라인 안내 화면을 표시합니다.","Displays the built-in offline guide when the official website cannot be loaded."],["추가 HTML·CSS·JavaScript 파일을 안전한 프로젝트 하위 디렉터리에서 관리할 수 있습니다.","Additional HTML, CSS, and JavaScript files can be managed in safe project subdirectories."],["프로젝트 리소스 탭에서 이미지, 폰트, 동영상, 오디오, 문서, 데이터, 웹 자산과 3D 모델을 가져오고 이름을 변경하거나 삭제할 수 있습니다.","Import, rename, and delete images, fonts, videos, audio, documents, data, web assets, and 3D models from the Project Resources tab."],["리소스를 assets/images, assets/fonts, assets/videos, assets/audio, assets/documents, assets/data, assets/web, assets/models로 자동 분류합니다.","Automatically classifies resources into assets/images, assets/fonts, assets/videos, assets/audio, assets/documents, assets/data, assets/web, and assets/models."],["프로젝트 저장, 다른 이름으로 저장, 미리보기, Web Folder와 ZIP 내보내기에 하위 소스와 관리 리소스를 포함합니다.","Includes nested source files and managed resources when saving, saving as, previewing, and exporting to Web Folder or ZIP."],["MCP 리소스 조회 명령어 get_project_resources를 추가했습니다.","Added the get_project_resources MCP read command."],["MCP 리소스 쓰기 명령어 import_project_resource, rename_project_resource, delete_project_resource를 추가했습니다.","Added the import_project_resource, rename_project_resource, and delete_project_resource MCP write commands."],["내장 MCP 명령어를 총 39개로 확장했습니다.","Expanded the built-in MCP command set to 39 commands."],["PageRivet을 여러 개 실행할 때 각 인스턴스가 순차 MCP 포트와 고유 연결 이름을 사용합니다.","Each PageRivet instance now uses a sequential MCP port and unique connection name when multiple instances are running."],["Codex, Claude Code와 JSON 설정 기반 MCP 클라이언트에서 여러 PageRivet 인스턴스 연결을 함께 등록할 수 있습니다.","Multiple PageRivet instance connections can be registered together in Codex, Claude Code, and JSON-configured MCP clients."],["프로세스별 복구 세션 저장소를 추가했습니다.","Added a process-specific recovery session store."],["프로젝트 파일 경로를 루트 파일명 대신 안전한 프로젝트 상대 경로로 처리하도록 확장했습니다.","Expanded project file handling to use safe project-relative paths instead of root file names only."],["필수 index.html, style.css, script.js는 호환성을 위해 프로젝트 루트에 유지합니다.","The required index.html, style.css, and script.js remain at the project root for compatibility."],["리소스 가져오기는 원본 외부 경로와 대상 경로를 표시하고 항상 명시적 사용자 승인을 받습니다.","Resource imports show the external source and destination paths and always require explicit user approval."],["MCP 연결 창에 현재 전송 방식과 인스턴스별 연결 이름을 표시합니다.","The MCP connection window now shows the active transport and per-instance connection name."],["한국어·영어 UI와 내장 가이드를 리소스 관리 및 39개 MCP 명령어 기준으로 갱신했습니다.","Updated the Korean and English UI and built-in guide for resource management and all 39 MCP commands."],["메인 화면과 대화상자를 어두운 워크벤치 디자인으로 개편하고 미리보기, 코드, 진단 영역을 명확한 색상 톤으로 구분했습니다.","Redesigned the main screen and dialogs as a dark workbench with distinct tones for preview, code, and diagnostics."],["코드 편집기의 글꼴, 배경, 줄 번호와 HTML·CSS·JavaScript 구문 색상을 어두운 작업 환경에 맞게 조정했습니다.","Adjusted the code editor font, background, line numbers, and HTML, CSS, and JavaScript syntax colors for the dark workspace."],["리소스 관리 버튼을 동일한 크기의 2×2 배열로 정리하고 빈 리소스 안내와 미리보기 영역의 가독성을 개선했습니다.","Organized resource actions into an equal 2×2 grid and improved the empty-state and preview readability."],["제품, 어셈블리와 파일 버전을 2.2.1로 통일했습니다.","Unified the product, assembly, and file versions as 2.2.1."],["PageRivet을 두 개 이상 실행할 때 두 번째 프로세스에서 복구 기능을 시작하지 못하던 문제를 수정했습니다.","Fixed recovery failing to start in the second process when multiple PageRivet instances are running."],["MCP 기본 포트가 이미 사용 중이면 두 번째 프로세스부터 MCP 서버를 시작하지 못하던 문제를 수정했습니다.","Fixed the MCP server failing to start for later instances when the default port is already in use."],["하위 디렉터리 소스의 미리보기 URL, 링크 해석, 외부 변경 감지와 내보내기 누락 문제를 방지했습니다.","Prevented missing preview URLs, link resolution, external change detection, and exports for nested source files."],["MCP 리소스 작업 후 에디터의 리소스 목록과 미리보기가 즉시 갱신되도록 했습니다.","The editor resource list and preview now refresh immediately after MCP resource operations."],["코드 및 진단 탭을 더블 버퍼링 방식으로 그려 탭 전환과 코드 입력 중 발생하던 흰색 깜빡임을 줄였습니다.","Reduced white flashes during tab changes and code input by double-buffering code and diagnostic tabs."],["기록과 MCP 로그의 열 뒤에 남던 흰색 네이티브 헤더 영역을 제거했습니다.","Removed the white native header area left after columns in History and MCP Log."],["WinForms 테두리와 불완전한 라운드 클리핑을 제거하고 색상 톤만으로 작업 영역을 구분하도록 수정했습니다.","Removed WinForms borders and incomplete rounded clipping so workspace areas are separated by color tone."],["프로젝트 상대 경로가 프로젝트 루트 밖으로 벗어나지 못하도록 경로 정규화와 Windows 예약 이름 검사를 적용했습니다.","Applied path normalization and Windows reserved-name checks to keep project-relative paths inside the project root."],["관리 리소스 디렉터리의 심볼릭 링크와 재분석 지점 사용을 차단했습니다.","Blocked symbolic links and reparse points in managed resource directories."],["MCP 리소스 요청 적용 전에 프로젝트 Revision, 현재 리소스 목록과 가져오기 원본 상태를 다시 확인합니다.","Rechecks the project revision, current resource list, and import source state before applying MCP resource requests."],["외부 리소스 원본 경로와 MCP 인증 정보를 도구 응답 및 포터블 배포본에 포함하지 않습니다.","External resource source paths and MCP credentials are excluded from tool responses and portable distributions."],["PageRivet 2.2.1 업데이트","PageRivet 2.2.1 Update"],["리소스 관리, 39개 MCP 명령어, 다중 실행 연결과 새로운 워크벤치 디자인을 한 번에 만나보세요.","Discover resource management, 39 MCP commands, multi-instance connections, and the new workbench design."],["안전한 리소스 관리","Safe resource management"],["다중 인스턴스 MCP 연결","Multi-instance MCP connections"],["새로운 다크 워크벤치","New dark workbench"],["업데이트 내용 보기","View update details"],["PageRivet 2.2.1 직접 다운로드","Download PageRivet 2.2.1"]].forEach(([ko, en]) => translations.set(ko, en));

let activeLanguage = "ko";
const originalText = new Map();
const originalAttributes = new Map();

function readPreference(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
}
function savePreference(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
}
function applyTheme(theme, persist) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    document.documentElement.style.backgroundColor = nextTheme === "dark" ? "#080b12" : "#fbfcff";
    const button = document.querySelector("[data-theme-toggle]");
    if (button) {
        const isDark = nextTheme === "dark";
        button.textContent = isDark ? "◐" : "☀";
        button.setAttribute("aria-pressed", String(isDark));
        button.setAttribute("aria-label", activeLanguage === "en" ? (isDark ? "Switch to light mode" : "Switch to dark mode") : (isDark ? "라이트 모드로 전환" : "다크 모드로 전환"));
        button.title = button.getAttribute("aria-label");
    }
    if (persist) savePreference("pagerivet-theme", nextTheme);
}
function translateTextNodes(language) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
        const parent = node.parentElement;
        if (!parent || parent.closest("script,style,code,pre,[data-language]")) return;
        if (!originalText.has(node)) originalText.set(node, node.nodeValue);
        const source = originalText.get(node);
        const key = source.trim();
        if (!key) return;
        const value = language === "en" ? (translations.get(key) || key) : key;
        node.nodeValue = source.replace(key, value);
    });
}
function translateAttributes(language) {
    const attributeMap = new Map([["PageRivet 홈","PageRivet Home"],["가이드 목차","Guide Contents"],["명령어 목록 닫기","Close Command List"],["업데이트 안내 닫기","Close Update Notice"],["업데이트 로그 닫기","Close Update Log"],["메뉴 열기","Open menu"],["메뉴 닫기","Close menu"],["업데이트 핵심 요약","Update Highlights"],["버전별 업데이트","Updates by Version"]]);
    document.querySelectorAll("[aria-label],[title]").forEach((element) => {
        ["aria-label","title"].forEach((name) => {
            if (!element.hasAttribute(name)) return;
            let record = originalAttributes.get(element);
            if (!record) { record = {}; originalAttributes.set(element, record); }
            if (!(name in record)) record[name] = element.getAttribute(name);
            const source = record[name];
            element.setAttribute(name, language === "en" ? (attributeMap.get(source) || source) : source);
        });
    });
}
function applyLanguage(language, persist) {
    activeLanguage = language === "en" ? "en" : "ko";
    document.documentElement.lang = activeLanguage;
    translateTextNodes(activeLanguage);
    translateAttributes(activeLanguage);
    const pageName = location.pathname.split("/").pop() || "index.html";
    const titles = {
        "index.html": ["PageRivet","PageRivet"],
        "about.html": ["PageRivet 소개","About PageRivet"],
        "features.html": ["PageRivet 기능","PageRivet Features"],
        "mcp.html": ["PageRivet MCP & AI 협업","PageRivet MCP & AI Collaboration"],
        "guide.html": ["PageRivet 사용 가이드","PageRivet User Guide"],
        "update.html": ["PageRivet 2.2.1 업데이트","PageRivet 2.2.1 Update"]
    };
    const pageTitles = titles[pageName] || titles["index.html"];
    document.title = pageTitles[activeLanguage === "en" ? 1 : 0];
    document.querySelectorAll("[data-language]").forEach((button) => {
        const isActive = button.dataset.language === activeLanguage;
        button.classList.toggle("on", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
    const selectedDemo = document.querySelector("[data-demo-file].on");
    if (selectedDemo && demoTab && demoCode) {
        const fileName = selectedDemo.dataset.demoFile;
        const content = (activeLanguage === "en" ? demoFilesEn : demoFiles)[fileName];
        if (content) { demoTab.textContent = fileName; demoCode.textContent = content; }
    }
    backToTopButton.setAttribute("aria-label", activeLanguage === "en" ? "Back to top" : "페이지 최상단으로 이동");
    backToTopButton.title = activeLanguage === "en" ? "Back to top" : "맨 위로";
    applyTheme(document.documentElement.dataset.theme || "light", false);
    document.documentElement.classList.remove("i18n-pending");
    if (window.__pagerivetRevealTimer) {
        window.clearTimeout(window.__pagerivetRevealTimer);
        window.__pagerivetRevealTimer = 0;
    }
    if (persist) savePreference("pagerivet-language", activeLanguage);
}
document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true);
});
document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.language, true));
});
const savedTheme = readPreference("pagerivet-theme");
const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(initialTheme, false);
applyLanguage(readPreference("pagerivet-language") || "ko", false);
window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
        document.documentElement.classList.remove("theme-preload");
    });
});

const newTabDestinations = new Set([
    "https://github.com/raneree/PageRivet/releases",
    "https://discord.gg/CFx4Emrxgf"
]);

document.querySelectorAll("a[href]").forEach((link) => {
    if (newTabDestinations.has(link.href.replace(/\/$/, ""))) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    }
});

const updateLogOpenButtons = document.querySelectorAll("[data-open-update-log]");
const updateLogCloseButtons = document.querySelectorAll("[data-close-update-log]");
let activeUpdateLogModal = null;
let updateLogPreviousFocus = null;

function openUpdateLogModal(button) {
    const modalId = button.getAttribute("aria-controls");
    const modal = modalId ? document.getElementById(modalId) : null;
    if (!modal) return;

    activeUpdateLogModal = modal;
    updateLogPreviousFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector(".update-log-close")?.focus();
}

function closeUpdateLogModal() {
    if (!activeUpdateLogModal || activeUpdateLogModal.hidden) return;
    activeUpdateLogModal.hidden = true;
    document.body.classList.remove("modal-open");
    activeUpdateLogModal = null;
    updateLogPreviousFocus?.focus();
}

updateLogOpenButtons.forEach((button) => {
    button.addEventListener("click", () => openUpdateLogModal(button));
});
updateLogCloseButtons.forEach((button) => {
    button.addEventListener("click", closeUpdateLogModal);
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeUpdateLogModal();
});

const releaseUpdateToast = document.querySelector("[data-release-update-toast]");
const releaseUpdateCloseButtons = document.querySelectorAll("[data-close-release-update]");
const releaseUpdateDismissLinks = document.querySelectorAll("[data-dismiss-release-update]");
const releaseUpdateSessionKey = "pagerivet-update-2.2.1-dismissed";
const releaseUpdateDuration = 10000;
let releaseUpdateTimer = 0;

function setReleaseUpdateDismissed() {
    try { sessionStorage.setItem(releaseUpdateSessionKey, "true"); } catch (_) {}
}

function closeReleaseUpdateToast() {
    if (!releaseUpdateToast || releaseUpdateToast.hidden) return;
    window.clearTimeout(releaseUpdateTimer);
    releaseUpdateToast.classList.remove("is-visible");
    setReleaseUpdateDismissed();
    window.setTimeout(() => {
        releaseUpdateToast.hidden = true;
    }, 220);
}

function openReleaseUpdateToast() {
    if (!releaseUpdateToast) return;
    let dismissed = false;
    try { dismissed = sessionStorage.getItem(releaseUpdateSessionKey) === "true"; } catch (_) {}
    if (dismissed) return;
    releaseUpdateToast.hidden = false;
    window.requestAnimationFrame(() => releaseUpdateToast.classList.add("is-visible"));
    releaseUpdateTimer = window.setTimeout(closeReleaseUpdateToast, releaseUpdateDuration);
}

releaseUpdateCloseButtons.forEach((button) => button.addEventListener("click", closeReleaseUpdateToast));
releaseUpdateDismissLinks.forEach((link) => link.addEventListener("click", closeReleaseUpdateToast));
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeReleaseUpdateToast();
});
window.requestAnimationFrame(openReleaseUpdateToast);


const mobileMenuToggle = document.querySelector("[data-mobile-menu-toggle]");
const mobileMenuPanel = document.querySelector("[data-mobile-menu-panel]");

function updateMobileMenuLabel() {
    if (!mobileMenuToggle) return;
    const isOpen = mobileMenuToggle.getAttribute("aria-expanded") === "true";
    const label = activeLanguage === "en"
        ? (isOpen ? "Close menu" : "Open menu")
        : (isOpen ? "메뉴 닫기" : "메뉴 열기");
    mobileMenuToggle.setAttribute("aria-label", label);
}

function setMobileMenuOpen(isOpen) {
    if (!mobileMenuToggle || !mobileMenuPanel) return;
    mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileMenuPanel.classList.toggle("is-open", isOpen);
    updateMobileMenuLabel();
}

mobileMenuToggle?.addEventListener("click", () => {
    setMobileMenuOpen(mobileMenuToggle.getAttribute("aria-expanded") !== "true");
});

mobileMenuPanel?.querySelectorAll(".links a").forEach((link) => {
    link.addEventListener("click", () => setMobileMenuOpen(false));
});

document.addEventListener("click", (event) => {
    const nav = mobileMenuToggle?.closest("nav");
    if (nav && !nav.contains(event.target)) setMobileMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setMobileMenuOpen(false);
        mobileMenuToggle?.focus();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) setMobileMenuOpen(false);
});

document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", updateMobileMenuLabel);
});

updateMobileMenuLabel();
