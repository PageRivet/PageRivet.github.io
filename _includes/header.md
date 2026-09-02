<header class="site-header" data-site-header>
  <div class="wrap">
    <nav class="site-nav" aria-label="주요 메뉴">
      <button class="mobile-menu-toggle" type="button" data-mobile-menu-toggle aria-expanded="false" aria-controls="site-navigation"><span></span><span></span><span></span><span class="sr-only" data-mobile-menu-label>메뉴 열기</span></button>
      <a class="brand" href="{{ '/' | relative_url }}" data-nav-id="home"{% if page.nav == "home" %} aria-current="page" aria-disabled="true" tabindex="-1"{% endif %} aria-label="PageRivet 홈"><span class="mark" aria-hidden="true"></span><span>PageRivet</span></a>
      <div class="mobile-menu-panel" id="site-navigation" data-mobile-menu-panel>
        <div class="links">
          {% for item in site.data.navigation.items %}
            <a href="{{ item.url | relative_url }}" data-nav-id="{{ item.id }}"{% if page.nav == item.id %} aria-current="page" aria-disabled="true" tabindex="-1"{% endif %} data-i18n="navigation.{{ item.id }}">{{ item.label_ko }}</a>
          {% endfor %}
          <a href="{{ '/download.html' | relative_url }}" data-nav-id="download"{% if page.nav == "download" %} aria-current="page" aria-disabled="true" tabindex="-1"{% endif %} data-i18n="navigation.download">다운로드</a>
          <a href="{{ site.data.site.community_url }}" target="_blank" rel="noopener noreferrer" data-i18n="navigation.community">커뮤니티</a>
        </div>
        <div class="tools">
          <button class="chip theme-toggle" type="button" data-theme-toggle aria-pressed="false"><span aria-hidden="true">◐</span><span class="sr-only">테마 전환</span></button>
          <button class="chip is-active" type="button" data-language="ko" aria-pressed="true">한국어</button>
          <button class="chip" type="button" data-language="en" aria-pressed="false">ENG</button>
        </div>
      </div>
    </nav>
  </div>
</header>
