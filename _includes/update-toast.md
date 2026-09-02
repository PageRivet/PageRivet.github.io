{% if page.show_release_toast %}
<aside class="release-toast release-update-toast" data-release-toast data-release-version="{{ site.data.download.version }}" data-release-expires-at="{{ site.data.download.toast_expires_at }}" hidden role="region" aria-live="polite" aria-labelledby="release-update-title">
  <button class="release-update-close" type="button" data-close-release-toast aria-label="업데이트 안내 닫기">×</button>
  <div class="release-update-copy"><span class="badge update-badge">New Update</span><strong id="release-update-title">PageRivet {{ site.data.download.version }} <span data-i18n="release.update_label">업데이트</span></strong><p data-i18n="release.message">새로운 버전의 주요 변경점을 확인하세요.</p></div>
  <div class="release-update-actions"><label class="release-update-preference"><input type="checkbox" data-release-hide-version><span data-i18n="release.hide_version">더 이상 표시하지 않음</span></label><div class="release-update-links"><a href="{{ '/update.html' | relative_url }}" data-dismiss-release-toast data-i18n="release.view">업데이트 내용 보기</a><a class="release-update-download" href="{{ '/download.html' | relative_url }}" data-dismiss-release-toast data-i18n="release.download">다운로드</a></div></div>
</aside>
{% endif %}
