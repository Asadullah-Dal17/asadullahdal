/**
 * nav.js — Shared Navigation + Loading Screen Component
 * Populates .nav-links and .mobile-nav on every page from a single config.
 * Also injects the shared loading screen and registers its failsafe hide logic.
 * Zero visual change: generates identical HTML that was previously hardcoded.
 */
(function () {
  'use strict';

  // =====================================================================
  // Loading Screen — inject before anything else so it shows immediately
  // =====================================================================
  function injectLoader() {
    var existing = document.getElementById('loading-screen');
    if (existing) return; // already in HTML (legacy pages) — don't double-inject

    // Allow per-page text override via <body data-loader-text="Loading Blog...">
    var text = (document.body && document.body.dataset.loaderText) || 'Loading...';

    var el = document.createElement('div');
    el.className = 'loading-screen';
    el.id = 'loading-screen';
    el.innerHTML =
      '<div class="loading-container">' +
        '<div class="loading-logo"><div class="logo-text">AD</div></div>' +
        '<div class="loading-progress"><div class="progress-bar"><div class="progress-fill"></div></div></div>' +
        '<div class="loading-text">' + text + '</div>' +
      '</div>';

    // Insert as first child of bg-animated wrapper, or fallback to body
    var wrapper = document.querySelector('.bg-animated') || document.body;
    wrapper.insertBefore(el, wrapper.firstChild);
  }

  // Failsafe — never let the site get stuck on the loading screen
  function registerLoaderHide() {
    var loading = document.getElementById('loading-screen');
    if (!loading) return;
    var done = false;
    var hide = function () {
      if (done) return;
      done = true;
      loading.classList.add('hide');
      setTimeout(function () { loading.style.display = 'none'; }, 700);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { setTimeout(hide, 200); });
    } else {
      setTimeout(hide, 200);
    }
    window.addEventListener('load', function () { setTimeout(hide, 100); });
    setTimeout(hide, 2000); // hard fallback
  }

  // =====================================================================
  // Navigation Links
  // =====================================================================

  // Detect if we are on index.html so same-page hash links work with scripts.js smooth scroll
  var path = window.location.pathname;
  var isIndex = path === '/' || path.endsWith('/') || path.endsWith('index.html');
  var base = isIndex ? '' : 'index.html';

  // Single source of truth for all navigation links
  var NAV_LINKS = [
    { href: base + '#about',    label: 'About' },
    { href: base + '#skills',   label: 'Skills' },
    { href: base + '#projects', label: 'Projects' },
    { href: base + '#courses',  label: 'Courses' },
    { href: 'videos.html',      label: 'YouTube' },
    { href: 'blog.html',        label: 'Blog' },
    { href: base + '#services', label: 'Services' },
    { href: base + '#contact',  label: 'Contact' },
  ];

  // Determine which page is active for highlighting
  var currentPage = path.split('/').pop() || 'index.html';

  function isActive(href) {
    if (href === 'videos.html') return currentPage === 'videos.html';
    if (href === 'blog.html') return currentPage === 'blog.html';
    if (href.includes('mediapipe-course')) return currentPage === 'mediapipe-course.html';
    return false;
  }

  function buildLinks(baseClass) {
    return NAV_LINKS.map(function (l) {
      var active = isActive(l.href) ? ' active' : '';
      return '<a class="' + baseClass + active + '" href="' + l.href + '">' + l.label + '</a>';
    }).join('');
  }

  function populateNav() {
    var navLinks   = document.querySelector('.nav-links');
    var mobileNav  = document.querySelector('.mobile-nav');

    if (navLinks)  navLinks.innerHTML  = buildLinks('nav-link');
    if (mobileNav) mobileNav.innerHTML = buildLinks('mobile-nav-link');
  }

  // =====================================================================
  // Init — run immediately for loader, defer nav population to DOM ready
  // =====================================================================
  injectLoader();
  registerLoaderHide();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', populateNav);
  } else {
    populateNav();
  }
})();

