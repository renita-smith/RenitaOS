/* Standardization Pass 3 — the ONE nav-rail implementation shared by every
   screen: index.html's shell (Today + every profile's .dmn-rail, plus the
   old-shell Home/Inbox mount) and capture.html's reduced footer nav. Loaded
   as a plain classic <script src> (not an ES module) on purpose — index.html
   stays a single self-contained classic script (see its own comment) and
   capture.html can read window.RenitaNavRail from its module script just as
   easily as from a classic one. Markup/CSS classes match .dmn-rail exactly
   (see css/nav-rail.css) so every consumer renders pixel-identical chrome. */
(function (global) {
  var ICONS = {
    home: '<svg class="dmn-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 11l9-8 9 8M5 9v11h14V9"/></svg>',
    today: '<svg class="dmn-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>',
    inbox: '<svg class="dmn-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12h5l2 3h4l2-3h5M4 5h16v14H4z"/></svg>',
    explore: '<svg class="dmn-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M11 6l2.5 5L11 11l-5 2.5z" fill="currentColor" stroke="none"/></svg>',
    search: '<svg class="dmn-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    capture: '<svg class="dmn-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 5v14M5 12h14"/></svg>',
  };

  // Addendum 2's rail set — the full five-item rail every framed screen
  // (Today, every profile) and the old-shell Home/Inbox mount render.
  var FULL_NAV_ITEMS = [
    { route: 'home', href: '#/home', icon: ICONS.home, label: 'Home' },
    { route: 'today', href: '#/today', icon: ICONS.today, label: 'Today' },
    { route: 'inbox', href: '#/inbox', icon: ICONS.inbox, label: 'Inbox', countAttr: 'data-nav-inbox-count' },
    { route: 'explore', href: '#/explore', icon: ICONS.explore, label: 'Explore' },
    { route: 'search', href: '#/search', icon: ICONS.search, label: 'Search' },
  ];

  // Capture's own reduced set (unchanged from what it already showed —
  // only the visual treatment unifies with the rest of the app per this
  // pass's item 7).
  var CAPTURE_NAV_ITEMS = [
    { route: 'home', href: './index.html#/home', icon: ICONS.home, label: 'Home' },
    { route: 'capture', href: './capture.html', icon: ICONS.capture, label: 'Capture' },
    { route: 'inbox', href: './index.html#/inbox', icon: ICONS.inbox, label: 'Inbox' },
  ];

  // opts.activeRoute bakes an initial .active class onto the matching item
  // (capture.html, which has no router to toggle it after the fact); leave
  // it unset (index.html's usage) to match the original behavior of adding
  // .active purely via a later classList pass keyed on [data-route].
  // opts.includeBrand: false suppresses the RenitaOS wordmark block (used
  // for Capture's bottom bar, which keeps its own existing header instead).
  function renderNavRailHTML(items, opts) {
    opts = opts || {};
    var includeBrand = opts.includeBrand !== false;
    var activeRoute = opts.activeRoute;
    var brandHtml = includeBrand
      ? '<div class="dmn-brand">RenitaOS<span class="build-stamp" data-nav-build-stamp></span></div>'
      : '';
    var itemsHtml = items.map(function (item) {
      var classAttr = activeRoute && item.route === activeRoute ? ' class="active"' : '';
      var countHtml = item.countAttr
        ? ' <span class="dmn-n" ' + item.countAttr + '>(…)</span>'
        : '';
      return '<a href="' + item.href + '" data-route="' + item.route + '"' + classAttr + '>' + item.icon + item.label + countHtml + '</a>';
    }).join('\n        ');
    return brandHtml + '\n      <nav aria-label="Primary">\n        ' + itemsHtml + '\n      </nav>\n    ';
  }

  global.RenitaNavRail = {
    FULL_NAV_ITEMS: FULL_NAV_ITEMS,
    CAPTURE_NAV_ITEMS: CAPTURE_NAV_ITEMS,
    renderNavRailHTML: renderNavRailHTML,
  };
})(window);
