/* Popular GitHub Repositories (Curated)
   - Renders a consistent set of repos with real stars/forks
   - Prevents duplication by clearing the grid before rendering
   - Keeps styling consistent with the site theme
*/

(function(){
  const REPOS = [
    {
      name: 'Distance_measurement_using_single_camera',
      url: 'https://github.com/Asadullah-Dal17/Distance_measurement_using_single_camera',
      desc: 'Estimate distance using a single webcam with Triangle Similarity (OpenCV).',
      stars: 301,
      forks: 91,
      lang: 'Python'
    },
    {
      name: 'Eyes-Position-Estimator-Mediapipe',
      url: 'https://github.com/Asadullah-Dal17/Eyes-Position-Estimator-Mediapipe',
      desc: 'Eye tracking & gaze direction estimation with MediaPipe face landmarks.',
      stars: 174,
      forks: 40,
      lang: 'Python'
    },
    {
      name: 'Yolov4-Detector-and-Distance-Estimator',
      url: 'https://github.com/Asadullah-Dal17/Yolov4-Detector-and-Distance-Estimator',
      desc: 'YOLOv4 object detection + distance estimation pipeline (OpenCV).',
      stars: 98,
      forks: 28,
      lang: 'Python'
    },
    {
      name: 'Basic-Augmented-reality-course-opencv',
      url: 'https://github.com/Asadullah-Dal17/Basic-Augmented-reality-course-opencv',
      desc: 'Free AR course projects using OpenCV (ArUco, pose, calibration).',
      stars: 81,
      forks: 38,
      lang: 'Python'
    },
    {
      name: 'AiPhile-Mediapipe-Course',
      url: 'https://github.com/Asadullah-Dal17/AiPhile-Mediapipe-Course',
      desc: 'MediaPipe Course repo with structured lessons & example projects.',
      stars: 16,
      forks: 3,
      lang: 'Python'
    },
    {
      name: 'Eyes-Tracking-Opencv-and-Dlib',
      url: 'https://github.com/Asadullah-Dal17/Eyes-Tracking-Opencv-and-Dlib',
      desc: 'Eye tracking using OpenCV + dlib landmarks.',
      stars: 46,
      forks: 16,
      lang: 'Python'
    }
  ];

  function cardHTML(r){
    return `
      <article class="repo-card" tabindex="0" role="listitem" aria-label="${r.name}" data-repo-url="${r.url}">
        <a class="repo-name" href="${r.url}" target="_blank" rel="noopener">${r.name}</a>
        <p class="repo-description">${r.desc}</p>
        <div class="repo-meta">
          <span class="repo-stars" aria-label="Stars">⭐ ${r.stars}</span>
          <span class="repo-forks" aria-label="Forks">🍴 ${r.forks}</span>
          <span class="repo-updated" aria-label="Language">${r.lang}</span>
        </div>
      </article>`;
  }

  function makeCardClickable(container){
    container.querySelectorAll('.repo-card').forEach(card => {
      const url = card.getAttribute('data-repo-url');
      if(!url) return;
      card.addEventListener('click', (e) => {
        if(e.target && e.target.closest && e.target.closest('a')) return;
        window.open(url, '_blank', 'noopener');
      });
      card.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.open(url, '_blank', 'noopener');
        }
      });
    });
  }

  function init(){
    const grid = document.getElementById('popularReposGrid');
    if(!grid) return;

    // Prevent duplication
    grid.innerHTML = '';

    // Render curated repos
    grid.insertAdjacentHTML('beforeend', REPOS.map(cardHTML).join(''));

    // Make whole card clickable
    makeCardClickable(grid);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
