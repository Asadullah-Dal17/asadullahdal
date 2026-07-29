/**
 * footer.js — Shared Footer Component
 * Replaces the hardcoded footer HTML that was duplicated in index.html,
 * videos.html, and blog.html. Renders identical HTML to what was there before.
 * mediapipe-course.html keeps its own stripped-down footer (copyright only).
 */
(function () {
  'use strict';

  var FOOTER_HTML =
    '<div class="container">' +
      '<div class="footer-content">' +
        '<div class="footer-about">' +
          '<h3>Asadullah Dal</h3>' +
          '<p>Computer Vision Developer &amp; AI Educator</p>' +
          '<p>Creating innovative AI solutions and educating the next generation of developers through practical computer vision applications.</p>' +
        '</div>' +
        '<div class="footer-links">' +
          '<h4>Quick Links</h4>' +
          '<div class="footer-link-grid">' +
            '<a href="index.html#about">About</a>' +
            '<a href="index.html#skills">Skills</a>' +
            '<a href="index.html#projects">Projects</a>' +
            '<a href="index.html#courses">Courses</a>' +
            '<a href="videos.html">YouTube</a>' +
            '<a href="blog.html">Blog</a>' +
            '<a href="index.html#services">Services</a>' +
            '<a href="index.html#contact">Contact</a>' +
          '</div>' +
        '</div>' +
        '<div class="footer-social">' +
          '<h4>Connect With Me</h4>' +
          '<div class="social-links">' +
            '<a aria-label="GitHub" class="social-link" href="https://github.com/Asadullah-Dal17" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>' +
            '<a aria-label="LinkedIn" class="social-link" href="https://www.linkedin.com/in/asadullah-dal/" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin"></i></a>' +
            '<a aria-label="YouTube" class="social-link" href="https://youtube.com/@asadullah-dal" target="_blank" rel="noopener noreferrer"><i class="fab fa-youtube"></i></a>' +
            '<a aria-label="Instagram" class="social-link" href="https://www.instagram.com/aiphile17" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<p>&copy; <span id="footer-year"></span> Asadullah Dal. All rights reserved.</p>' +
      '</div>' +
    '</div>';

  function buildFooter() {
    var footer = document.querySelector('.footer[data-shared-footer]');
    if (!footer) return;

    footer.innerHTML = FOOTER_HTML;

    // Set current year
    var yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // On index.html, rewrite quick links to hash-only hrefs so smooth scroll works
    var path = window.location.pathname;
    var isIndex = path === '/' || path.endsWith('/') || path.endsWith('index.html');
    if (isIndex) {
      footer.querySelectorAll('.footer-link-grid a').forEach(function (a) {
        var href = a.getAttribute('href');
        if (href && href.startsWith('index.html#')) {
          a.setAttribute('href', href.replace('index.html', ''));
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildFooter);
  } else {
    buildFooter();
  }
})();
