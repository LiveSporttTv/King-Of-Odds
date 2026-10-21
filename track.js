/* King of Odds click tracking (GA4).
   Counts Play Store and Telegram clicks, including middle-clicks and
   taps, and ignores accidental double-fires within 1.5 seconds. */
(function () {
  var last = {};

  function track(e) {
    if (e.type === 'auxclick' && e.button !== 1) return; // only middle-click
    var link = e.target.closest && e.target.closest('a[href]');
    if (!link || typeof window.gtag !== 'function') return;

    var href = link.getAttribute('href') || '';
    var place = link.getAttribute('data-location') || 'unknown';
    var name = null;

    if (href.indexOf('play.google.com') !== -1) name = 'download_click';
    else if (href.indexOf('t.me') !== -1) name = 'telegram_click';
    if (!name) return;

    var key = name + place, now = Date.now();
    if (last[key] && now - last[key] < 1500) return; // de-duplicate
    last[key] = now;

    window.gtag('event', name, {
      button_location: place,
      link_url: href,
      page_path: location.pathname,
      transport_type: 'beacon'
    });
  }

  document.addEventListener('click', track, true);
  document.addEventListener('auxclick', track, true);
})();