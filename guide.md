---
layout: default
permalink: /guide.html
title: 사용 가이드
description: PageRivet 다운로드부터 프로젝트 편집, 미리보기, MCP 연결까지 안내합니다.
nav: guide
body_class: guide-theme
---
<div class="guide-page">
  <section class="page-hero">
    <div class="wrap about-narrow">
      <div class="eyebrow">PageRivet User Guide</div>
      <h1>PageRivet 사용 가이드</h1>
      <p class="page-lead">다운로드와 프로젝트 시작부터 편집, 미리보기, 검증, 내보내기와 MCP 기반 AI 협업까지 작업 순서에 따라 안내합니다.</p>
      <div class="guide-hero-actions">
        <a class="btn primary" href="#getting-started">처음 시작하기</a>
        <a class="btn secondary" href="#mcp">MCP 연결 보기</a>
      </div>
    </div>
  </section>

  <div class="wrap guide-shell">
    <aside class="guide-toc" aria-label="가이드 목차" data-guide-toc>
      <strong>가이드 목차</strong>
      <a href="#getting-started">다운로드 및 실행</a>
      <a href="#project">프로젝트 시작</a>
      <a href="#editing">코드 편집과 적용</a>
      <a href="#preview">웹 페이지 미리보기</a>
      <a href="#validation">검증과 오류 확인</a>
      <a href="#mcp">MCP와 AI 연결</a>
      <a href="#export">프로젝트 내보내기</a>
      <a href="#troubleshooting">문제 해결</a>
      <a href="#support">지원 및 문의</a>
    </aside>

    <div class="guide-doc">
      <section class="guide-section" id="getting-started">
        <div class="section-kicker">01 · Getting Started</div>
        <h2>다운로드 및 실행</h2>
        <p class="guide-intro">PageRivet은 Windows x64에서 실행되는 포터블 데스크톱 애플리케이션입니다. 설치 과정 없이 공식 패키지를 내려받아 시작할 수 있습니다.</p>
        <div class="guide-steps">
          <a class="guide-step guide-step-link" href="{{ '/download.html' | relative_url }}" aria-label="PageRivet 다운로드 페이지">
            <span>1</span><h3>다운로드</h3><p>다운로드를 눌러 PageRivet 패키지를 내려받습니다.</p>
          </a>
          <article class="guide-step"><span>2</span><h3>파일 준비</h3><p>다운로드한 ZIP 파일을 작업하기 편한 위치에 풀어둡니다.</p></article>
          <article class="guide-step"><span>3</span><h3>실행</h3><p>PageRivet 실행 파일을 열고 시작 화면이 표시되는지 확인합니다.</p></article>
        </div>
      </section>

      <section class="guide-section" id="project">
        <div class="section-kicker">02 · Project</div>
        <h2>프로젝트 시작</h2>
        <p class="guide-intro">새 정적 웹 프로젝트를 만들거나 기존 HTML, CSS, JavaScript 프로젝트를 열어 작업할 수 있습니다.</p>
        <div class="guide-columns">
          <article>
            <h3>새 프로젝트</h3>
            <ol>
              <li>상단의 "프로젝트" 버튼을 누른 뒤 "새 프로젝트"를 선택합니다.</li>
              <li>프로젝트를 저장할 위치를 선택하고 이름을 설정합니다. 지정한 위치에 프로젝트 이름의 폴더가 생성됩니다.</li>
              <li>생성된 기본 파일을 확인하고 작업을 시작합니다.</li>
            </ol>
          </article>
          <article>
            <h3>기존 프로젝트</h3>
            <ol>
              <li>상단의 "프로젝트" 버튼을 누른 뒤 "프로젝트 열기"를 선택합니다.</li>
              <li>웹 소스가 있는 프로젝트 폴더를 선택합니다.</li>
              <li>파일 목록과 미리보기 페이지를 확인합니다.</li>
            </ol>
          </article>
        </div>
        <div class="guide-note"><strong>파일 관리</strong><span>페이지, 스타일, 스크립트와 관리 리소스는 프로젝트 상대 경로를 기준으로 관리합니다. 작업 전 현재 선택한 파일을 확인하세요.</span></div>
      </section>

      <section class="guide-section" id="editing">
        <div class="section-kicker">03 · Editing</div>
        <h2>코드 편집과 적용</h2>
        <p class="guide-intro">PageRivet은 에디터에서 수정 중인 내용과 프로젝트에 적용된 상태를 구분합니다. 변경 범위를 확인하고 검증을 거쳐 정상 상태를 반영합니다.</p>
        <ol class="guide-flow-list">
          <li><b>파일 선택</b><span>프로젝트 목록에서 편집할 HTML, CSS 또는 JavaScript 파일을 선택합니다.</span></li>
          <li><b>코드 편집</b><span>필요한 내용을 편집기에서 수정하고 파일의 변경 범위를 함께 확인합니다.</span></li>
          <li><b>변경 상태 확인</b><span>아직 적용되지 않은 편집 내용이 있는지 확인합니다.</span></li>
          <li><b>검증 및 적용</b><span>HTML, CSS, JavaScript 검증 결과를 확인하고 유효한 변경을 프로젝트에 적용합니다.</span></li>
          <li><b>결과 확인</b><span>미리보기와 오류·콘솔 영역에서 적용 결과를 확인합니다.</span></li>
        </ol>
        <div class="guide-warning"><strong>미적용 편집 내용</strong><p>에디터에 입력한 내용과 실제 프로젝트 상태가 다를 수 있습니다. 파일을 전환하거나 AI 작업을 시작하기 전에 미적용 변경 여부를 확인하세요.</p></div>
      </section>

      <section class="guide-section" id="preview">
        <div class="section-kicker">04 · Preview</div>
        <h2>웹 페이지 미리보기</h2>
        <p class="guide-intro">프로젝트에 존재하는 HTML 페이지를 미리보기에 표시하고, 적용된 결과를 기준으로 화면과 동작을 확인합니다.</p>
        <ul class="guide-checklist">
          <li>미리볼 HTML 페이지를 선택합니다.</li>
          <li>코드를 적용한 뒤 미리보기를 새로고침합니다.</li>
          <li>CSS 디자인과 JavaScript 동작을 확인합니다.</li>
          <li>오류가 있으면 콘솔 정보와 관련 파일을 함께 확인합니다.</li>
        </ul>
        <div class="guide-note"><strong>표시 기준</strong><span>미리보기는 현재 활성 프로젝트에 존재하며 프로젝트에 적용된 HTML 페이지를 기준으로 표시됩니다.</span></div>
      </section>

      <section class="guide-section" id="validation">
        <div class="section-kicker">05 · Validation</div>
        <h2>검증과 오류 확인</h2>
        <p class="guide-intro">변경사항을 적용하기 전에 정적 구문 문제를 확인하고, 실행 중 발생한 문제는 미리보기 오류와 콘솔 정보에서 구분해 확인합니다.</p>
        <div class="guide-columns">
          <article>
            <h3>코드 검증</h3>
            <ul>
              <li>HTML 구조 확인</li>
              <li>CSS 구문 오류 확인</li>
              <li>JavaScript 구문 오류 확인</li>
              <li>파일·줄·열 기준 문제 위치 확인</li>
            </ul>
          </article>
          <article>
            <h3>실행 진단</h3>
            <ul>
              <li>JavaScript 실행 예외 확인</li>
              <li>브라우저 콘솔 메시지 확인</li>
              <li>관련 파일 수정 후 다시 적용</li>
              <li>미리보기에서 결과 재확인</li>
            </ul>
          </article>
        </div>
        <div class="guide-note"><strong>여러 파일 변경</strong><span>서로 관련된 파일은 하나의 변경 단위로 검토하고, 전체 검증 결과를 확인한 뒤 적용하세요.</span></div>
      </section>

      <section class="guide-section" id="mcp">
        <div class="section-kicker">06 · MCP &amp; AI</div>
        <h2>MCP와 AI 클라이언트 연결</h2>
        <p class="guide-intro">PageRivet의 로컬 MCP 서버를 사용하면 지원되는 AI 클라이언트가 활성 프로젝트를 읽고 분석하며, 현재 승인 정책과 검증 절차에 따라 허용된 변경을 요청할 수 있습니다.</p>
        <ol class="guide-flow-list">
          <li><b>프로젝트 준비</b><span>AI와 작업할 프로젝트를 PageRivet에서 열고 활성 상태를 확인합니다.</span></li>
          <li><b>MCP 서버 실행</b><span>상단의 "설정" 버튼을 누른 뒤 "MCP 설정"을 선택합니다.</span></li>
          <li><b>AI 클라이언트 연결</b><span>사용자 PC에 설치된 AI 클라이언트 목록을 확인하고, 사용할 클라이언트의 [연결] 버튼을 눌러 PageRivet과 연결합니다.</span></li>
          <li><b>AI 클라이언트와 연결 확인</b><span>AI클라이언트와 연결을 확인합니다. "PageRivet MCP 핸드셰이크 확인해줘"</span></li>
          <li><b>자연어로 요청</b><span>원하는 웹 작업과 대상 페이지를 구체적으로 설명합니다.</span></li>
          <li><b>변경 검토</b><span>제안된 변경 범위와 검증 결과를 확인하고, 현재 승인 정책에 따라 적용합니다.</span></li>
        </ol>
        <div class="guide-prompt"><small>요청 예시</small><p>“현재 페이지의 모바일 메뉴가 깨지는 원인을 확인하고, 기존 디자인을 유지하면서 수정해줘.”</p></div>
        <div class="guide-note"><strong>자세한 협업 방식</strong><a href="{{ '/mcp.html' | relative_url }}">MCP &amp; AI 협업 페이지에서 확인</a></div>
        <button class="guide-command-card" type="button" data-open-mcp-commands aria-haspopup="dialog">
          <span class="section-kicker">MCP Command Reference</span>
          <strong>사용 가능한 MCP 명령어 보기</strong>
          <p>현재 PageRivet {{ site.data.download.version }}에서 사용할 수 있는 <span data-mcp-total>56</span>개 명령어를 제공합니다. 원하는 작업을 자연어로 요청하면 AI 클라이언트가 필요한 명령어를 선택합니다.</p>
          <span class="guide-command-action">명령어 목록 열기 →</span>
        </button>
      </section>

      <section class="guide-section" id="export">
        <div class="section-kicker">07 · Export</div>
        <h2>프로젝트 내보내기</h2>
        <p class="guide-intro">출력 형식과 위치를 지정해 프로젝트를 배포하거나 전달할 수 있는 결과물로 내보냅니다.</p>
        <ol class="guide-flow-list">
          <li><b>내보내기 열기</b><span>상단의 "프로젝트" 버튼을 누른 뒤 "내보내기"를 선택하거나, 상단 메뉴의 "내보내기" 버튼을 누릅니다.</span></li>
          <li><b>프리셋 선택</b><span>내보내기 프리셋을 선택합니다. 기본 프리셋은 "General Web"이며, 필요하면 다른 프리셋으로 변경할 수 있습니다.</span></li>
          <li><b>출력 형식 선택</b><span>프로젝트에 필요한 출력 형식을 선택합니다.</span></li>
          <li><b>내보내기 실행</b><span>출력 위치를 지정한 뒤 "내보내기" 버튼을 누릅니다. 선택한 폴더 아래에 프로젝트 이름의 폴더가 생성되고 내보내기가 완료됩니다.</span></li>
        </ol>
        <div class="guide-warning"><strong>검증 오류</strong><p>검증 오류가 있는 작업은 자동 적용 정책에서도 실행되지 않습니다. 오류를 해결한 뒤 다시 요청하세요.</p></div>
      </section>

      <section class="guide-section" id="troubleshooting">
        <div class="section-kicker">08 · Troubleshooting</div>
        <h2>자주 확인할 문제</h2>
        <div class="trouble-grid">
          <article><h3>미리보기가 바뀌지 않아요</h3><p>편집 내용이 프로젝트에 적용됐는지 확인하고 현재 페이지를 새로고침하세요.</p></article>
          <article><h3>코드 적용이 실패해요</h3><p>오류 목록에서 파일과 줄 위치를 확인하고 관련 코드를 수정한 뒤 다시 적용하세요.</p></article>
          <article><h3>AI가 프로젝트를 읽지 못해요</h3><p>활성 프로젝트, MCP 서버 상태와 AI 클라이언트 연결 설정을 확인하세요.</p></article>
          <article><h3>JavaScript가 동작하지 않아요</h3><p>구문 검증뿐 아니라 실행 오류와 브라우저 콘솔 메시지도 함께 확인하세요.</p></article>
        </div>
      </section>

      <section class="guide-section guide-support" id="support">
        <div class="section-kicker">09 · Support</div>
        <h2>지원 및 문의</h2>
        <p class="guide-intro">가이드로 해결되지 않는 문의 사항이나 건의 사항은 Discord 또는 이메일로 남겨 주세요. Discord를 이용하면 더 빠르게 지원받을 수 있습니다.</p>
        <div class="support-links">
          <a href="{{ site.data.site.repository_url }}" target="_blank" rel="noopener noreferrer">GitHub 저장소</a>
          <a href="{{ site.data.site.community_url }}" target="_blank" rel="noopener noreferrer">Discord 커뮤니티</a>
          <a href="{{ site.data.site.support_email }}">이메일 문의</a>
        </div>
      </section>
    </div>
  </div>
</div>

<div class="mcp-command-modal" data-mcp-command-modal hidden>
  <div class="mcp-command-backdrop" data-close-mcp-commands></div>
  <section class="mcp-command-panel" role="dialog" aria-modal="true" aria-labelledby="mcp-command-title" tabindex="-1">
    <div class="mcp-command-header">
      <div><div class="section-kicker">PageRivet MCP</div><h2 id="mcp-command-title">사용 가능한 MCP 명령어</h2></div>
      <button type="button" class="mcp-command-close" data-close-mcp-commands aria-label="명령어 목록 닫기">×</button>
    </div>
    <p class="mcp-command-intro">현재 PageRivet {{ site.data.download.version }}에서 실제 제공되는 <span data-mcp-total>56</span>개 MCP 명령어입니다. 사용자가 직접 입력하거나 기억할 필요는 없습니다.</p>
    <div class="mcp-command-groups" data-mcp-command-groups aria-live="polite">
      <p class="data-status">MCP 명령어 목록을 불러오는 중입니다.</p>
    </div>
  </section>
</div>
