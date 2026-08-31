---
layout: default
permalink: /index.html
title: PageRivet | AI와 MCP로 협업하는 웹 에디터
description: 정적 웹 프로젝트의 개발과 AI 협업을 하나로 연결합니다.
nav: home
body_class: home-theme
show_release_toast: true
---
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <div class="eyebrow">MCP-integrated Web Editor</div>
      <h1>PageRivet</h1>
      <h2 data-i18n="home.hero.title">정적 웹 프로젝트의<br>개발과 AI 협업을 하나로</h2>
      <p data-i18n="home.hero.description">HTML, CSS, JavaScript 편집부터 실시간 미리보기, 검증, 히스토리 관리, MCP 기반 AI 협업까지 하나의 작업 공간으로 연결합니다.</p>
      <div class="actions">
        <a class="btn primary" href="{{ site.data.download.url }}" data-download-link data-i18n="home.download">지금 다운로드</a>
        <a class="btn secondary" href="{{ '/guide.html' | relative_url }}" data-i18n="home.guide">시작 가이드 보기</a>
      </div>
      <div class="version platform-note" role="note">
        <span class="status-pulse" aria-hidden="true"></span>
        <strong data-i18n="home.platform.title">지원 환경</strong>
        <span data-i18n="home.platform.description">현재 PageRivet은 Windows x64 전용으로 제공됩니다. macOS와 Linux는 지원하지 않습니다.</span>
      </div>
    </div>
    <div class="mock-column">
      <div class="mock" data-demo-editor>
      <div class="titlebar"><span>PageRivet — My Web Project</span><span>— □ ×</span></div>
      <div class="menubar"><span data-i18n="mock.file">파일</span><span data-i18n="mock.edit">편집</span><span data-i18n="mock.view">보기</span><span data-i18n="mock.project">프로젝트</span><span data-i18n="mock.help">도움말</span></div>
      <div class="workspace">
        <aside class="files">
          <div><b data-i18n="mock.project">프로젝트</b></div>
          <div class="file">▾ My Web Project</div>
          <button class="file on is-active" type="button" data-demo-file="index.html" aria-pressed="true">▧ index.html</button>
          <button class="file" type="button" data-demo-file="about.html" aria-pressed="false">▧ about.html</button>
          <button class="file" type="button" data-demo-file="style.css" aria-pressed="false">▧ style.css</button>
          <button class="file" type="button" data-demo-file="main.js" aria-pressed="false">▧ main.js</button>
          <div class="file">▸ images</div>
        </aside>
        <div class="editor">
          <div class="tabs" data-demo-tab>index.html</div>
          <pre class="code-view" data-demo-code aria-live="polite">&lt;!doctype html&gt;
&lt;html lang="ko"&gt;
  &lt;head&gt;
    &lt;link rel="stylesheet" href="style.css"&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;PageRivet&lt;/h1&gt;
    &lt;p&gt;AI와 함께 만드는 웹 프로젝트&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
        </div>
        <aside class="preview">
          <div class="url">preview.pagerivet.local</div>
          <div class="mini"><small>PageRivet</small><h3 data-i18n="mock.preview.title">웹 제작과 AI 협업을 하나로</h3><p data-i18n="mock.preview.description">정적 웹 프로젝트를 더 빠르고 안전하게 구성하세요.</p><span class="btn primary mini-button" data-i18n="mock.preview.start">시작하기</span></div>
        </aside>
      </div>
      <div class="bottom"><span data-i18n="mock.history">기록</span><span data-i18n="mock.errors">오류</span><span data-i18n="mock.mcp_log">MCP 로그</span><span data-i18n="mock.console">콘솔</span></div>
      </div>
      <div class="mock-example-card" role="note"><span class="status-pulse" aria-hidden="true"></span><strong data-i18n="mock.example.label">화면 예시:</strong><span data-i18n="mock.example.description">제품을 설명하기 위한 예시 입니다. 화면의 코드, 시작하기 버튼 등은 실제로 작동하지 않습니다.</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="head"><div class="eyebrow">Features</div><h2 data-i18n="home.features.title">주요 기능</h2><p data-i18n="home.features.description">웹 프로젝트 제작과 안전한 AI 협업을 위한 핵심 기능</p></div>
    <div class="cards">
      <article class="card"><div class="icon">&lt;/&gt;</div><h3 data-i18n="home.feature.editor.title">직관적인 코드 편집</h3><p data-i18n="home.feature.editor.description">HTML, CSS, JavaScript를 파일 단위로 편집하고 빠르게 적용합니다.</p></article>
      <article class="card"><div class="icon">◉</div><h3 data-i18n="home.feature.preview.title">실시간 미리보기</h3><p data-i18n="home.feature.preview.description">NativeWebView 기반 통합 미리보기에서 HTML과 YAML 결과를 즉시 확인합니다.</p></article>
      <article class="card"><div class="icon">↶</div><h3 data-i18n="home.feature.history.title">히스토리 & 복구</h3><p data-i18n="home.feature.history.description">변경 기록을 저장하고 원하는 시점으로 복원합니다.</p></article>
      <article class="card"><div class="icon">✓</div><h3 data-i18n="home.feature.validation.title">검증 & 안전한 저장</h3><p data-i18n="home.feature.validation.description">코드 검증과 트랜잭션 기반 저장으로 변경 안정성을 높입니다.</p></article>
      <article class="card"><div class="icon">⌘</div><h3 data-i18n="home.feature.mcp.title">MCP 기반 AI 협업</h3><p data-i18n="home.feature.mcp.description">외부 AI 클라이언트가 프로젝트를 읽고 수정할 수 있도록 연결합니다.</p></article>
      <article class="card"><div class="icon">▣</div><h3 data-i18n="home.feature.files.title">다중 파일 지원</h3><p data-i18n="home.feature.files.description">여러 HTML, CSS, JavaScript 파일을 하나의 프로젝트에서 관리합니다.</p></article>
    </div>
  </div>
</section>

<section class="mcp">
  <div class="wrap mcp-grid">
    <div>
      <div class="eyebrow">MCP & AI Collaboration</div>
      <h2 data-i18n="home.mcp.title">AI와 함께 더 나은 결과를</h2>
      <p data-i18n="home.mcp.description">PageRivet은 특정 AI를 강제하지 않습니다. MCP를 통해 사용자가 사용하는 AI 클라이언트와 프로젝트를 연결하고, 검증과 히스토리 흐름 안에서 변경을 관리합니다.</p>
      <div class="checks"><div data-i18n="home.mcp.check.read">프로젝트 읽기 및 분석</div><div data-i18n="home.mcp.check.propose">코드 수정 제안 및 적용</div><div data-i18n="home.mcp.check.track">히스토리 기반 변경 추적</div><div data-i18n="home.mcp.check.approval">사용자 승인 기반 안전한 변경</div></div>
    </div>
    <div class="flow" aria-label="AI Client에서 PageRivet을 거쳐 프로젝트로 연결되는 흐름">
      <div class="flow-box"><b>AI Client</b><span>Codex</span><span>Claude</span><span>Cursor</span><span>VS Code</span></div>
      <div class="arrow" aria-hidden="true">→</div>
      <div class="flow-box"><b>PageRivet MCP Server</b><span data-i18n="home.mcp.flow.read">프로젝트 읽기</span><span data-i18n="home.mcp.flow.propose">수정 제안</span><span data-i18n="home.mcp.flow.apply">변경 적용</span><span data-i18n="home.mcp.flow.history">히스토리 관리</span></div>
      <div class="arrow" aria-hidden="true">→</div>
      <div class="flow-box"><b>Project</b><span>index.html</span><span>style.css</span><span>main.js</span><span>assets/...</span></div>
    </div>
  </div>
</section>

<section class="quick">
  <div class="wrap">
    <div class="eyebrow">Quick Start</div>
    <h2 data-i18n="home.quick.title">빠르게 시작하기</h2>
    <div class="steps">
      <div class="step"><small>01</small><h3 data-i18n="home.quick.download.title">다운로드</h3><p data-i18n="home.quick.download.description">공식 GitHub Releases에서 최신 버전을 다운로드합니다.</p></div>
      <div class="step"><small>02</small><h3 data-i18n="home.quick.open.title">프로젝트 열기</h3><p data-i18n="home.quick.open.description">새 프로젝트를 만들거나 기존 프로젝트를 불러옵니다.</p></div>
      <div class="step"><small>03</small><h3 data-i18n="home.quick.edit.title">코드 편집</h3><p data-i18n="home.quick.edit.description">코드를 수정하고 미리보기로 결과를 확인합니다.</p></div>
      <div class="step"><small>04</small><h3 data-i18n="home.quick.ai.title">AI와 협업</h3><p data-i18n="home.quick.ai.description">MCP 클라이언트를 연결하고 자연어로 작업을 요청합니다.</p></div>
    </div>
    <div class="cta"><div><strong data-i18n="home.cta">PageRivet을 다운로드하고 시작해보세요.</strong></div><div class="actions cta-actions"><a class="btn primary" href="{{ site.data.download.url }}" data-download-link data-i18n="home.download">지금 다운로드</a></div></div>
  </div>
</section>

<section class="thanks-section" aria-labelledby="thanks-title">
  <div class="wrap">
    <div class="thanks-layout">
      <div class="thanks-copy"><div class="eyebrow">Thanks To</div><h2 id="thanks-title" data-i18n="home.thanks.title">감사합니다</h2><p data-i18n="home.thanks.description">PageRivet이 세상과 만날 수 있도록 크고 작은 계기와 영감을 건네주신 모든 분께 감사드립니다.</p></div>
      <p class="thanks-principle" data-i18n="home.thanks.principle">이 목록은 제휴, 후원, 광고 또는 특정한 관계를 의미하지 않습니다.<br>PageRivet의 여정에 계기와 영감을 더해준 모든 만남을 기억하기 위한 순수한 감사의 인사입니다.</p>
    </div>
    <div class="thanks-grid">
      <a class="thanks-card" href="{{ site.data.site.cozit_url }}" target="_blank" rel="noopener noreferrer"><small>Platform</small><strong>Cozit</strong><p data-i18n="home.thanks.platform">PageRivet을 소개할 수 있는 공간을 마련해준 데 감사드립니다.</p><em data-i18n="home.thanks.visit">방문하기 →</em></a>
      <a class="thanks-card" href="{{ site.data.site.disquiet_url }}" target="_blank" rel="noopener noreferrer"><small>Platform</small><strong>Disquiet</strong><p data-i18n="home.thanks.platform">PageRivet을 소개할 수 있는 공간을 마련해준 데 감사드립니다.</p><em data-i18n="home.thanks.visit">방문하기 →</em></a>
      <a class="thanks-card" href="{{ site.data.site.sidedock_url }}" target="_blank" rel="noopener noreferrer"><small>Platform</small><strong>Sidedock</strong><p data-i18n="home.thanks.platform">PageRivet을 소개할 수 있는 공간을 마련해준 데 감사드립니다.</p><em data-i18n="home.thanks.visit">방문하기 →</em></a>
    </div>
  </div>
</section>
