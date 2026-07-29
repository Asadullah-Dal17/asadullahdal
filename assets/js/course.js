/**
 * course.js — MediaPipe Course Page Logic
 * Extracted from inline <script> in mediapipe-course.html.
 * Handles the launch countdown timer.
 */
(function () {
  'use strict';

  var COURSE_LAUNCH_ISO = '2026-08-15T20:00:00+05:00';

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function formatLaunchDate(isoString) {
    var date = new Date(isoString);
    if (isNaN(date.getTime())) return 'TBA';
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit'
    });
  }

  function updateCountdown() {
    var target = new Date(COURSE_LAUNCH_ISO).getTime();
    var now    = Date.now();
    var diff   = target - now;

    var daysEl    = document.getElementById('cd-days');
    var hoursEl   = document.getElementById('cd-hours');
    var minsEl    = document.getElementById('cd-mins');
    var secsEl    = document.getElementById('cd-secs');
    var dateDisplay = document.getElementById('launchDateDisplay');

    if (dateDisplay) dateDisplay.textContent = formatLaunchDate(COURSE_LAUNCH_ISO);
    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    if (isNaN(target)) {
      daysEl.textContent = '--';
      hoursEl.textContent = '--';
      minsEl.textContent = '--';
      secsEl.textContent = '--';
      return;
    }

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      if (dateDisplay) dateDisplay.textContent = 'Course is Live!';
      return;
    }

    daysEl.textContent  = String(Math.floor(diff / (1000 * 60 * 60 * 24)));
    hoursEl.textContent = pad2(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    minsEl.textContent  = pad2(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    secsEl.textContent  = pad2(Math.floor((diff % (1000 * 60)) / 1000));
  }

  function init() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
