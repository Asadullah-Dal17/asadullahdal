// Popular GitHub Repos: Purely Static Stats Card Renderer (no API!)
(() => {
  const OWNER = "Asadullah-Dal17";
  const FEATURED = [
    "Distance_measurement_using_single_camera",
    "Eyes-Position-Estimator-Mediapipe",
    "Yolov4-Detector-and-Distance-Estimator",
    "Basic-Augmented-reality-course-opencv",
    "Eyes-Tracking-Opencv-and-Dlib",
    "AiPhile-Mediapipe-Course"
  ];
  const DESC = {
    "Distance_measurement_using_single_camera": "Measure distance using a single camera (OpenCV).",
    "Eyes-Position-Estimator-Mediapipe": "Eye tracking and position estimation with MediaPipe.",
    "Yolov4-Detector-and-Distance-Estimator": "YOLOv4 detection + distance estimation.",
    "Basic-Augmented-reality-course-opencv": "Intro AR course + OpenCV projects.",
    "Eyes-Tracking-Opencv-and-Dlib": "Eye tracking using OpenCV & dlib.",
    "AiPhile-Mediapipe-Course": "MediaPipe course repo with examples."
  };
  const SNAPSHOT = {
    "Distance_measurement_using_single_camera": {stars:301, forks:91, lang:"Python", pct:100, updated:"2023-11-14T07:34:16Z"},
    "Eyes-Position-Estimator-Mediapipe": {stars:174, forks:40, lang:"Python", pct:100, updated:"2023-03-27T12:12:57Z"},
    "Yolov4-Detector-and-Distance-Estimator": {stars:98, forks:28, lang:"Python", pct:100, updated:"2023-06-01T15:23:12Z"},
    "Basic-Augmented-reality-course-opencv": {stars:81, forks:38, lang:"Python", pct:100, updated:"2022-09-07T21:02:33Z"},
    "Eyes-Tracking-Opencv-and-Dlib": {stars:46, forks:16, lang:"Python", pct:100, updated:"2021-08-31T08:41:10Z"},
    "AiPhile-Mediapipe-Course": {stars:16, forks:3, lang:"Python", pct:100, updated:"2021-03-02T10:11:41Z"},
  };
  const LANG_COLORS = {"Python":"#3776ab"};
  const grid = document.getElementById("repo-grid");
  const note = document.getElementById("repo-note");
  const sortSel = document.getElementById("sortSelect");
  const filterInput = document.getElementById("filterInput");
  let REPO_DATA = FEATURED.map(slug => ({
    slug,
    name: slug,
    description: DESC[slug],
    stargazers_count: SNAPSHOT[slug].stars,
    forks_count: SNAPSHOT[slug].forks,
    language: SNAPSHOT[slug].lang,
    langPercent: SNAPSHOT[slug].pct,
    updated_at: SNAPSHOT[slug].updated,
    url: `https://github.com/${OWNER}/${slug}`
  }));

  function formatDate(dt) {
    if (!dt) return "—";
    try {
      return new Intl.DateTimeFormat("en", {year:'numeric',month:'short',day:'numeric'}).format(new Date(dt));
    } catch { return dt; }
  }
  function renderGrid(data) {
    grid.setAttribute('aria-busy','false');
    grid.innerHTML = data.map(repo => `
      <article class="repo-card" tabindex="0" aria-label="${repo.name}">
        <a class="repo-title" href="${repo.url}" target="_blank" rel="noopener">
          ${repo.name}
        </a>
        <span class="repo-chip" aria-label="Primary language: ${repo.language}">
          <span class="dot" style="background:${LANG_COLORS[repo.language]||'#4caf50'}"></span>
          ${repo.language}${repo.langPercent ? ` <span class="percent">${repo.langPercent}%</span>` : ""}
        </span>
        <div class="repo-desc">${repo.description}</div>
        <div class="repo-meta">
          <span class="repo-stat star-badge" aria-label="Stars"><span class="icon">⭐</span> ${repo.stargazers_count}</span>
          <span class="repo-stat" aria-label="Forks"><span class="icon">🍴</span> ${repo.forks_count}</span>
          <span class="repo-stat repo-updated" aria-label="Last updated"><span class="icon">🗓</span> ${formatDate(repo.updated_at)}</span>
        </div>
        <div class="badges-row">
          <img src="https://img.shields.io/github/stars/${OWNER}/${repo.slug}?style=social" alt="GitHub stars badge for ${repo.name}" loading="lazy" height="22" />
          <img src="https://img.shields.io/github/forks/${OWNER}/${repo.slug}?style=social" alt="GitHub forks badge for ${repo.name}" loading="lazy" height="22" />
        </div>
      </article>
    `).join('');
  }
  // Sorting/filter logic as before
  function sortRepos(data, key, asc) {
    return data.slice().sort((a,b) => {
      let va = a[key] ?? 0, vb = b[key] ?? 0;
      if (key === "updated_at") { va = new Date(va); vb = new Date(vb); }
      if (va === vb) return 0;
      return asc ? (va < vb ? -1 : 1) : (va > vb ? -1 : 1);
    });
  }
  function filterRepos(data, val) {
    return !val ? data : data.filter(r=> (r.name||r.slug).toLowerCase().includes(val.trim().toLowerCase()));
  }
  function applyUI(data) {
    let v = sortSel.value, [field,dir] = v.split('-');
    let mapped = field==="stars" ? "stargazers_count" : (field==="forks"?"forks_count":"updated_at");
    let rows = sortRepos(data, mapped, dir==="asc");
    rows = filterRepos(rows, filterInput.value);
    renderGrid(rows);
  }
  sortSel && sortSel.addEventListener("change", ()=>applyUI(REPO_DATA));
  filterInput && filterInput.addEventListener("input", ()=>applyUI(REPO_DATA));
  // Initial render (now instant):
  document.addEventListener('DOMContentLoaded', function() {
    note.hidden = true;
    applyUI(REPO_DATA);
  });
})();
