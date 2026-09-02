---
layout: default
permalink: /download.html
title: 다운로드
description: PageRivet과 PageRivet 진단기 다운로드를 한곳에서 제공합니다.
nav: download
body_class: download-theme
---
<div class="download-page">
  <section class="page-hero download-hero">
    <div class="wrap about-narrow">
      <div class="eyebrow">PageRivet Downloads</div>
      <h1 data-i18n="download.page.title">PageRivet 다운로드</h1>
      <p class="page-lead" data-i18n="download.page.description">필요한 도구를 선택해 바로 다운로드하세요.</p>
    </div>
  </section>

  <section class="content-section download-content" aria-labelledby="download-options-title">
    <div class="wrap">
      <div class="download-section-heading">
        <div>
          <div class="section-kicker">Choose a download</div>
          <h2 id="download-options-title" data-i18n="download.options.title">다운로드 항목</h2>
        </div>
        <p data-i18n="download.options.description">사용 목적에 맞는 항목을 선택하면 공식 GitHub Releases 파일을 내려받습니다.</p>
      </div>

      <div class="download-options">
        <article class="download-card is-primary">
          <div class="download-card-top">
            <div class="download-product-mark" aria-hidden="true">PR</div>
            <span class="badge">Web Editor</span>
          </div>
          <div class="download-card-copy">
            <h3>PageRivet</h3>
            <p data-i18n="download.pagerivet.description">웹 프로젝트 편집, 미리보기, 검증과 MCP 기반 AI 협업을 위한 데스크톱 애플리케이션입니다.</p>
          </div>
          <ul class="download-details" aria-label="PageRivet package information">
            <li><span data-i18n="download.detail.version">버전</span><strong>{{ site.data.download.version }}</strong></li>
            <li><span data-i18n="download.detail.platform">지원 환경</span><strong>{{ site.data.download.platform }} {{ site.data.download.architecture }}</strong></li>
            <li><span data-i18n="download.detail.package">패키지</span><strong>{{ site.data.download.package_type }}</strong></li>
          </ul>
          <a class="button button-primary download-button" href="{{ site.data.download.url }}" data-download-link data-i18n="download.pagerivet.button">PageRivet 다운로드</a>
        </article>

        <article class="download-card">
          <div class="download-card-top">
            <div class="download-product-mark is-diagnostic" aria-hidden="true">DX</div>
            <span class="badge">Diagnostic Tool</span>
          </div>
          <div class="download-card-copy">
            <h3 data-i18n="download.diagnostic.title">PageRivet 진단기</h3>
            <p data-i18n="download.diagnostic.description">PageRivet 사용 중 발생한 문제를 확인하고 진단 정보를 준비하는 보조 도구입니다.</p>
          </div>
          <ul class="download-details" aria-label="PageRivet diagnostic tool information">
            <li><span data-i18n="download.detail.platform">지원 환경</span><strong>{{ site.data.download.platform }} {{ site.data.download.architecture }}</strong></li>
            <li><span data-i18n="download.detail.package">패키지</span><strong>{{ site.data.download.diagnostic_package_type }}</strong></li>
          </ul>
          <a class="button button-secondary download-button" href="{{ site.data.download.diagnostic_url }}" data-download-link data-i18n="download.diagnostic.button">PageRivet-진단기 다운로드</a>
        </article>
      </div>

    </div>
  </section>
</div>
