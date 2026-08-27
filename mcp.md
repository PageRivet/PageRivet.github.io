---
layout: default
permalink: /mcp.html
title: MCP & AI 협업
description: PageRivet MCP를 통해 사용자가 선택한 AI와 웹 프로젝트를 연결하는 방식을 소개합니다.
nav: mcp
body_class: mcp-theme
---
<section class="page-hero"><div class="wrap"><div class="eyebrow">MCP & AI Collaboration</div><h1>사용자가 선택한 AI와 함께 작업합니다</h1><p>PageRivet은 특정 AI 사용을 강제하지 않습니다. MCP를 지원하는 클라이언트가 활성 웹 프로젝트를 이해하고 필요한 작업을 수행하도록 연결합니다.</p></div></section>

<section class="content-section"><div class="wrap split-layout"><div class="section-heading"><div class="section-kicker">Why MCP</div><h2>반복적인 복사·붙여넣기 없이</h2><p>AI와 편집기 사이에서 코드를 반복해서 옮기는 대신, 사용자의 자연어 요청과 현재 프로젝트 상태를 연결합니다.</p></div><div class="dark-panel"><div class="connection-flow"><span>사용자</span><i>→</i><span>AI Client</span><i>→</i><span>PageRivet MCP</span><i>→</i><span>Web Project</span></div></div></div></section>

<section class="content-section is-soft"><div class="wrap"><div class="section-heading is-centered"><div class="section-kicker"><span data-mcp-total>—</span> Tools</div><h2>프로젝트부터 애플리케이션 상태까지</h2><p>PageRivet {{ site.data.download.version }}는 <span data-mcp-total>—</span>개의 내장 MCP Tool을 제공합니다.</p></div><div class="card-grid"><article class="card"><div class="card-icon">?</div><h3>프로젝트 이해</h3><ul class="feature-list"><li>활성 프로젝트와 파일 목록</li><li>웹 소스와 리소스 읽기</li><li>검증 및 오류 정보</li></ul></article><article class="card"><div class="card-icon">✎</div><h3>코드 작업</h3><ul class="feature-list"><li>파일 생성·수정·이름 변경</li><li>원자적인 다중 파일 패치</li><li>JSON 리소스 관리</li></ul></article><article class="card"><div class="card-icon">◉</div><h3>애플리케이션 접근</h3><ul class="feature-list"><li>UI·Preview 상태 조회</li><li>안전한 프로젝트 저장</li><li>사용자 승인형 내보내기</li></ul></article></div></div></section>

<section class="content-section"><div class="wrap"><div class="section-heading"><div class="section-kicker">Application Tools</div><h2>새로운 애플리케이션 접근 도구</h2></div><div class="card-grid"><article class="card"><h3>상태 조회</h3><p><code>get_ui_state</code>, <code>get_preview_state</code>, <code>get_recovery_status</code>, <code>get_mcp_status</code>, <code>get_mcp_log</code></p></article><article class="card"><h3>작업 요청</h3><p><code>save_project</code>, <code>refresh_preview</code>, <code>preview_html_page</code></p></article><article class="card"><h3>내보내기</h3><p><code>get_export_presets</code>, <code>export_project</code>와 최종 사용자 승인 흐름</p></article></div></div></section>

<section class="content-section"><div class="wrap split-layout"><div class="dark-panel"><div class="section-kicker">Safety Boundary</div><h3>AI가 사용자 제어 영역을 대신하지 않습니다</h3><ul class="feature-list"><li>프로젝트 전환과 프로그램 종료·재실행 제한</li><li>History 복원과 Recovery 적용·삭제 제한</li><li>보안·승인 설정 변경 제한</li><li>프로젝트 내보내기는 현재 MCP 승인 정책을 따름</li></ul></div><div class="section-heading"><div class="section-kicker">Local Connection</div><h2>로컬 프로젝트를 기준으로 연결합니다</h2><p>인증값과 민감정보는 상태 응답과 로그에서 제외되며, Preview와 저장 요청은 현재 활성 프로젝트 범위 안에서만 수행됩니다.</p><a class="button button-primary" href="{{ '/guide.html#mcp' | relative_url }}">연결 가이드 보기</a></div></div></section>
