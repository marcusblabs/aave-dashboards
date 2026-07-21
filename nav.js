/* Aave v4 Dashboards — shared top nav, injected into every page in this repo.
   Self-hosted at <site-root>/nav.js so it works on GitHub Pages project pages
   (marcusblabs.github.io/aave-dashboards/), on a local static server, and over file://.

   Add a page once to ITEMS below and every page picks it up.
   Progressive enhancement: if this script fails to load, the pages work unchanged.

   Theming: the host pages define the Balancer Toolkit custom properties
   (--bg-elev, --border, --text-dim, --primary, ...) and flip them via
   :root[data-theme="light"]. This nav reads those with dark-mode fallbacks, so it
   follows the page's theme toggle without any extra wiring. */
(function () {
 try {
  if (document.getElementById('ad-nav')) return;

  /* ---- base path: derive from this script's own URL, never hard-code "/" ----
     nav.js lives at the site root, so dirname(src) IS the site root. This is what
     makes the nav correct under the /aave-dashboards/ project-page prefix, where
     absolute "/..." hrefs would escape to the user site root. */
  var self = document.currentScript ||
    (function () {
      var s = document.querySelectorAll('script[src]');
      for (var i = s.length - 1; i >= 0; i--) if (/(^|\/)nav\.js(\?|$)/.test(s[i].getAttribute('src') || '')) return s[i];
      return null;
    })();
  var BASE = self ? self.src.replace(/[^/]*$/, '') : './';

  var ICONS = {
    home:   '<path d="M4 10.5 12 4l8 6.5"/><path d="M6 9.5V19h12V9.5"/><path d="M10 19v-5h4v5"/>',
    gauge:  '<path d="M12 14a2 2 0 0 0 1.4-3.4L18 6"/><path d="M4.5 18a9 9 0 1 1 15 0"/>',
    layers: '<path d="m12 4 8 4-8 4-8-4 8-4z"/><path d="m4 12 8 4 8-4"/><path d="m4 16 8 4 8-4"/>',
    ext:    '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'
  };
  function icon(name, size) {
    return '<svg width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      ICONS[name] + '</svg>';
  }

  /* href is relative to the site root (BASE). '' == the index page. */
  var ITEMS = [
    { label: 'Overview',       href: '',                     icon: 'home'   },
    { label: 'Spoke Caps',     href: 'spoke-caps/',          icon: 'gauge'  },
    { label: 'Loop Economics', href: 'vault-economics.html', icon: 'layers' }
  ];

  /* ---- active state: compare resolved URLs, not raw strings ---- */
  function resolve(href) { return new URL(href || '.', BASE).pathname.replace(/index\.html$/, ''); }
  var here = location.pathname.replace(/index\.html$/, '');
  var ROOT = resolve('');
  function isActive(href) {
    var p = resolve(href);
    if (p === ROOT) return here === ROOT;                          // Overview: exact match only
    return here === p || here.indexOf(p.replace(/\/$/, '') + '/') === 0;  // boundary-safe prefix
  }

  var css = '' +
    '#ad-nav{position:sticky;top:10px;z-index:99999;display:flex;justify-content:center;padding:10px 12px 0;margin:0 0 -4px;' +
      'font-family:"Satoshi",-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased;pointer-events:none;}' +
    '#ad-nav .ad-bar{display:flex;align-items:center;gap:4px;flex-wrap:wrap;pointer-events:auto;' +
      'background:color-mix(in srgb, var(--bg-elev,#3f4650) 92%, transparent);backdrop-filter:blur(8px);' +
      'border:1px solid var(--border-strong,rgba(255,255,255,.16));border-radius:14px;padding:6px 10px;' +
      'box-shadow:0 6px 24px rgba(0,0,0,.28);max-width:100%;}' +
    '#ad-nav .ad-brand{display:flex;align-items:center;gap:8px;padding:5px 10px 5px 4px;margin-right:2px;' +
      'text-decoration:none;border-right:1px solid var(--border,rgba(255,255,255,.1));}' +
    '#ad-nav .ad-mark{width:20px;height:20px;flex:none;display:block;}' +
    '#ad-nav .ad-name{color:var(--text,rgba(255,255,255,.92));font-size:13px;font-weight:700;letter-spacing:-.01em;white-space:nowrap;}' +
    '#ad-nav a.ad-item{display:inline-flex;align-items:center;gap:6px;color:var(--text-dim,#c2cbd8);font-size:12.5px;' +
      'font-weight:500;text-decoration:none;padding:6px 11px;border-radius:9px;white-space:nowrap;' +
      'transition:background .12s,color .12s;}' +
    '#ad-nav a.ad-item:hover{background:var(--primary-soft,rgba(255,255,255,.07));color:var(--text,#fff);}' +
    '#ad-nav a.ad-item:focus-visible{outline:2px solid var(--primary,#7f6ae8);outline-offset:2px;}' +
    '#ad-nav a.ad-item.ad-active{background:var(--primary,#7f6ae8);color:#fff;}' +
    '#ad-nav a.ad-out{color:var(--text-mute,#a0aec0);font-size:12px;border-left:1px solid var(--border,rgba(255,255,255,.1));' +
      'margin-left:2px;padding-left:11px;}' +
    '@media(max-width:640px){#ad-nav{position:static;padding:8px 8px 0;margin:0;}#ad-nav .ad-name{display:none;}' +
      '#ad-nav a.ad-item{padding:6px 8px;}#ad-nav a.ad-out{display:none;}}' +
    '@media(prefers-reduced-motion:reduce){#ad-nav a.ad-item{transition:none;}}';

  var style = document.createElement('style');
  style.id = 'ad-nav-css';
  style.textContent = css;
  document.head.appendChild(style);

  /* Aave-ghost favicon for any page that doesn't define its own. */
  var FAVICON = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
    '<rect width="32" height="32" rx="7" fill="#383e47"/>' +
    '<circle cx="16" cy="16" r="8.5" fill="none" stroke="#b3aef5" stroke-width="2.4"/>' +
    '<path d="M16 9.5 20 22M16 9.5 12 22M13.4 17.6h5.2" stroke="#eaa879" stroke-width="2.1" ' +
    'stroke-linecap="round" fill="none"/></svg>');
  if (!document.querySelector('link[rel~="icon"]')) {
    var fav = document.createElement('link');
    fav.rel = 'icon'; fav.type = 'image/svg+xml'; fav.href = FAVICON;
    document.head.appendChild(fav);
  }

  var nav = document.createElement('nav');
  nav.id = 'ad-nav';
  nav.setAttribute('aria-label', 'Aave v4 Dashboards');

  var bar = '<div class="ad-bar">';
  bar += '<a class="ad-brand" href="' + resolve('') + '">' +
    '<img class="ad-mark" src="' + FAVICON + '" alt="" />' +
    '<span class="ad-name">Aave v4 Dashboards</span></a>';
  ITEMS.forEach(function (it) {
    var on = isActive(it.href);
    bar += '<a class="ad-item' + (on ? ' ad-active' : '') + '" href="' + resolve(it.href) + '"' +
      (on ? ' aria-current="page"' : '') + '>' + icon(it.icon) + it.label + '</a>';
  });
  bar += '<a class="ad-item ad-out" href="https://marcusblabs.github.io/" ' +
    'title="Balancer Toolkit">' + icon('ext', 13) + 'Balancer Toolkit</a>';
  bar += '</div>';
  nav.innerHTML = bar;

  /* Prepend to document.body, NEVER into .app — .app is a z-index:1 stacking
     context and the nav must sit above the fixed body::before glow. */
  function insert() { document.body.prepend(nav); }
  if (document.body) insert();
  else document.addEventListener('DOMContentLoaded', insert);

  /* Theme toggle lives here so all pages share one implementation. Delegated, so it
     works whether the button is in a page .topbar or injected below. The bootstrap
     that sets the attribute before first paint is a blocking inline script in each
     page's <head> — it must not move here, or light-theme users get a dark flash. */
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('#themebtn')) return;
    var light = document.documentElement.dataset.theme === 'light';
    try {
      if (light) { delete document.documentElement.dataset.theme; localStorage.setItem('le-theme', 'dark'); }
      else { document.documentElement.dataset.theme = 'light'; localStorage.setItem('le-theme', 'light'); }
    } catch (err) {
      /* private browsing: still flip the theme, just don't persist it */
      if (light) delete document.documentElement.dataset.theme;
      else document.documentElement.dataset.theme = 'light';
    }
  });
 } catch (err) {
   /* Progressive enhancement: a nav failure must never take a dashboard down. */
   if (window.console) console.warn('nav.js failed to initialise:', err);
 }
})();
