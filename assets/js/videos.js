/**
 * videos.js — Video Gallery Page Logic
 * Extracted from inline <script> in videos.html.
 * Handles loading, rendering, and playing YouTube videos.
 */
(function () {
  'use strict';

  var allVideos = [];
  var currentVideoId = null;

  async function loadChannelContent() {
    try {
      var response = await fetch('data/recent-videos.json');
      if (!response.ok) throw new Error('Failed to load video data');

      var data = await response.json();

      // Parse data — supports both array and {videos, stats} shapes
      var stats = { subscribers: '4K+', videos: '50+' };
      if (Array.isArray(data)) {
        allVideos = data;
      } else {
        allVideos = data.videos || [];
        if (data.stats) stats = data.stats;
      }

      // Update channel stats
      var subsEl   = document.getElementById('stat-subs');
      var videosEl = document.getElementById('stat-videos');
      if (subsEl)   subsEl.textContent   = stats.subscribers || 'N/A';
      if (videosEl) videosEl.textContent = stats.videos      || 'N/A';

      // Limit to 6 most recent
      allVideos = allVideos.slice(0, 6);

      if (allVideos.length > 0) {
        loadVideo(allVideos[0], 0, true);
      } else {
        var title = document.getElementById('current-title');
        if (title) title.textContent = 'No videos found.';
      }

    } catch (error) {
      console.error('Error loading content:', error);
      var title = document.getElementById('current-title');
      if (title) title.textContent = 'Could not load content.';
    }
  }

  function loadVideo(video, index, isInitial) {
    currentVideoId = video.videoId;

    // 1. Render facade (thumbnail click-to-play for performance)
    var container = document.getElementById('embed-container');
    if (container) {
      var thumb = video.thumbnail.replace('default', 'maxresdefault');
      container.innerHTML =
        '<div class="video-facade"' +
        ' style="background-image: url(\'' + thumb + '\');"' +
        ' onclick="window.playCurrentVideo(\'' + video.videoId + '\')"' +
        ' role="button" aria-label="Play Video" tabindex="0"' +
        ' onkeypress="if(event.key===\'Enter\') window.playCurrentVideo(\'' + video.videoId + '\')">' +
        '<div class="facade-play-btn"><i class="fas fa-play" style="margin-left:6px;"></i></div>' +
        '</div>';
    }

    // 2. Update info panel
    var titleEl = document.getElementById('current-title');
    var dateEl  = document.getElementById('current-date');
    var ytBtn   = document.getElementById('btn-watch-yt');

    if (titleEl) titleEl.textContent = video.title;
    if (dateEl) {
      var d = new Date(video.published);
      dateEl.innerHTML = '<i class="far fa-clock"></i> ' +
        d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }
    if (ytBtn) ytBtn.href = 'https://www.youtube.com/watch?v=' + video.videoId;

    // 3. Re-render grid with new active card
    renderGrid(index);

    // 4. Scroll to player (skip on first load)
    if (!isInitial) {
      var playerWrapper = document.querySelector('.player-wrapper');
      if (playerWrapper) {
        var offset = 100;
        var bodyRect    = document.body.getBoundingClientRect().top;
        var elementRect = playerWrapper.getBoundingClientRect().top;
        window.scrollTo({ top: (elementRect - bodyRect) - offset, behavior: 'smooth' });
      }
    }
  }

  // Exposed globally so facade onclick attributes can reach it
  window.playCurrentVideo = function (videoId) {
    var container = document.getElementById('embed-container');
    if (!container) return;
    container.innerHTML =
      '<iframe src="https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0"' +
      ' title="YouTube video player"' +
      ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"' +
      ' allowfullscreen></iframe>';
  };

  function renderGrid(activeIndex) {
    var grid = document.getElementById('video-grid');
    if (!grid) return;
    grid.innerHTML = '';

    allVideos.forEach(function (video, index) {
      var isActive       = index === activeIndex;
      var d              = new Date(video.published);
      var formattedDate  = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

      var card       = document.createElement('article');
      card.className = 'video-card' + (isActive ? ' active-playing' : '');
      card.tabIndex  = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Play ' + video.title);

      card.onclick = function () { loadVideo(video, index); };
      card.onkeypress = function (e) { if (e.key === 'Enter') loadVideo(video, index); };

      card.innerHTML =
        '<div class="card-thumb-container">' +
          '<img src="' + video.thumbnail + '" alt="" class="card-thumb" loading="lazy">' +
          '<div class="now-playing-badge"><i class="fas fa-chart-bar"></i> PLAYING</div>' +
          '<div class="play-overlay-icon"><i class="fas fa-play"></i></div>' +
        '</div>' +
        '<div class="card-content">' +
          '<div class="card-meta"><i class="far fa-calendar"></i> ' + formattedDate + '</div>' +
          '<h3 class="card-title">' + video.title + '</h3>' +
          '<div class="card-footer"><span>Watch Now</span><i class="fas fa-arrow-right" style="font-size:0.8em;"></i></div>' +
        '</div>';

      grid.appendChild(card);
    });
  }

  document.addEventListener('DOMContentLoaded', loadChannelContent);
})();
