<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div><a class="brand" href="{{ '/' | relative_url }}"><span class="mark" aria-hidden="true"></span><span>PageRivet</span></a><p data-i18n="footer.tagline">{{ site.data.site.tagline }}.</p></div>
      <div><h4 data-i18n="footer.links">링크</h4>{% for item in site.data.navigation.items %}<div><a href="{{ item.url | relative_url }}" data-i18n="navigation.{{ item.id }}">{{ item.label_ko }}</a></div>{% endfor %}</div>
      <div><h4 data-i18n="footer.support">지원</h4><div><a href="{{ site.data.site.repository_url }}" target="_blank" rel="noopener noreferrer">GitHub</a></div><div><a href="{{ site.data.site.community_url }}" target="_blank" rel="noopener noreferrer">Discord</a></div><div><a href="{{ site.data.site.support_email }}" data-i18n="footer.contact">문의하기</a></div></div>
      <div><h4 data-i18n="footer.thanks">고마운 플랫폼</h4><div><a href="{{ site.data.site.cozit_url }}" target="_blank" rel="noopener noreferrer">Cozit</a></div><div><a href="{{ site.data.site.disquiet_url }}" target="_blank" rel="noopener noreferrer">Disquiet</a></div></div>
    </div>
    <div class="copy">© {{ 'now' | date: '%Y' }} PageRivet · <span data-i18n="footer.contact_label">문의:</span> <a href="{{ site.data.site.support_email }}">pagerivet.support@gmail.com</a></div>
  </div>
</footer>
<button class="back-to-top" type="button" data-back-to-top aria-label="맨 위로 이동">↑</button>
