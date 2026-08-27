---
layout: default
title: 공지사항
description: PageRivet의 새로운 소식과 중요한 안내를 확인하는 공간입니다.
nav: notice
body_class: notice-theme
---

<section class="page-hero notice-hero">
  <div class="wrap">
    <p class="eyebrow" data-i18n="notice.eyebrow">NOTICE</p>
    <h1 data-i18n="notice.title">공지사항</h1>
    <p data-i18n="notice.description">PageRivet의 새로운 소식과 중요한 안내를 한곳에서 확인하세요.</p>
  </div>
</section>

<section class="content-section notice-content" aria-labelledby="notice-list-title">
  <div class="wrap">
    <header class="notice-list-heading">
      <div>
        <p class="section-kicker" data-i18n="notice.section_kicker">PAGERIVET NEWS</p>
        <h2 id="notice-list-title" data-i18n="notice.section_title">새로운 소식을 전해드립니다</h2>
        <p data-i18n="notice.section_description">업데이트, 서비스 안내와 꼭 확인해야 할 내용을 순서대로 제공합니다.</p>
      </div>
      <div class="notice-summary" aria-label="공지사항 개수">
        <span class="notice-summary-dot" aria-hidden="true"></span>
        <strong data-notice-count>1</strong>
        <span data-notice-count-label>개의 공지</span>
      </div>
    </header>

    <div class="notice-list">
      {% for notice in site.notices reversed %}
        <details class="notice-card" data-notice-document data-notice-id="{{ notice.notice_id }}" data-notice-language="{{ notice.lang }}">
          <summary class="notice-card-trigger">
            <span class="notice-card-heading">
              <span class="notice-card-meta">
                <span class="badge" data-notice-latest-badge hidden>{% if notice.lang == "ko" %}최신{% endif %}{% if notice.lang == "en" %}Latest{% endif %}</span>
                <span>{{ notice.category }}</span>
                <time datetime="{{ notice.date }}">{{ notice.date | date: "%Y.%m.%d" }}</time>
              </span>
              <span class="notice-card-title">{{ notice.title }}</span>
            </span>
            <span class="notice-card-toggle" aria-hidden="true"></span>
          </summary>
          <div class="notice-card-body" lang="{{ notice.lang }}">
            {{ notice.content }}
          </div>
        </details>
      {% endfor %}
    </div>
  </div>
</section>
