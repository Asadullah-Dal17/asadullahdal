/* =========================================================
   scripts.js — Robust Portfolio Script (GitHub Pages friendly)
   Fixes:
   - Loader never stuck
   - Skill bars animation works (with fallback)
   - Lazy images never stay invisible
   - Dark mode stable
   - Guards for missing elements to avoid JS crashing
   ========================================================= */

'use strict';

/* ---------- Helpers ---------- */
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ---------- Loader (never stuck) ---------- */
function setupLoadingScreen() {
  const loading = qs('#loading-screen');
  if (!loading) return;

  let hidden = false;
  const hide = () => {
    if (hidden) return;
    hidden = true;
    loading.classList.add('hide');
    setTimeout(() => { loading.style.display = 'none'; }, 700);
  };

  // hide ASAP
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(hide, 250), { once: true });
  } else {
    setTimeout(hide, 250);
  }

  // hide on full load too
  window.addEventListener('load', () => setTimeout(hide, 150), { once: true });

  // hard fallback
  setTimeout(hide, 2000);
}

/* ---------- Theme (Dark Mode) ---------- */
class ThemeManager {
  constructor() {
    this.toggleBtn = qs('#darkModeToggle');
    this.icon = qs('#darkModeIcon');
    this.init();
  }

  init() {
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = (window.initialTheme === 'dark') || (saved !== null ? saved === 'true' : prefersDark);

    document.documentElement.classList.toggle('dark-mode', isDark);
    this.updateIcon(isDark);

    this.toggleBtn?.addEventListener('click', () => this.toggleTheme());
  }

  toggleTheme() {
    const isDark = !document.documentElement.classList.contains('dark-mode');
    document.documentElement.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', String(isDark));
    this.updateIcon(isDark);
    showNotification(`Switched to ${isDark ? 'dark' : 'light'} mode`, 'info');
  }

  updateIcon(isDark) {
    if (!this.icon) return;
    this.icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  }
}

/* ---------- Notifications ---------- */
function showNotification(message, type = 'info') {
  qsa('.notification').forEach(n => n.remove());

  const el = document.createElement('div');
  el.className = `notification notification-${type}`;
  el.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle'
      : type === 'error' ? 'exclamation-triangle'
        : type === 'warning' ? 'exclamation-circle'
          : 'info-circle'
    }"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(el);
  setTimeout(() => el.classList.add('show'), 50);
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 250);
  }, 3500);
}

/* ---------- Mobile Menu (Accessible) ---------- */
function setupMobileMenu() {
  const toggle = qs('#mobile-menu-toggle');
  const overlay = qs('#mobile-menu-overlay');
  const closeBtn = qs('#mobile-menu-close');
  const menu = qs('.mobile-menu');

  if (!toggle || !overlay || !menu) return;

  let isOpen = false;

  const open = () => {
    isOpen = true;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
    // Move focus into menu
    setTimeout(() => closeBtn?.focus(), 50);
  };

  const close = () => {
    isOpen = false;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus(); // Return focus to toggle
  };

  toggle.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  qsa('.mobile-nav-link').forEach(link => link.addEventListener('click', close));

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;

    if (e.key === 'Escape') close();

    if (e.key === 'Tab') {
      const focusables = qsa('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', menu);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });
}

/* ---------- Smooth Scrolling ---------- */
function setupSmoothScrolling() {
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = qs(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      qsa('.nav-link').forEach(n => n.classList.remove('active'));
      if (a.classList.contains('nav-link')) a.classList.add('active');
    });
  });
}

/* ---------- Back to Top ---------- */
function setupBackToTop() {
  const btn = qs('#backToTop');
  if (!btn) return;

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const update = () => {
    if (window.scrollY > 300) btn.classList.add('visible');
    else btn.classList.remove('visible');
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ---------- Scroll Animations + Skill Bars ---------- */
function setupAnimations() {
  // Hardcoded class list for backward compat + [data-animate] for any future element
  const fadeEls = qsa('.project-card, .skill-card, .skill-category-card, .service-card, .course-card, .syllabus-card, .testimonial-card, .timeline-content, [data-animate]');
  fadeEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
  });

  const skillItems = qsa('.skill-item');
  const skillProgresses = qsa('.skill-progress');

  // Animate skill bars function
  const animateSkillBar = (progressBar) => {
    const width = progressBar.getAttribute('data-width');
    if (width) {
      progressBar.style.width = width + '%';
      progressBar.style.setProperty('--progress-width', width + '%');
    }
  };

  if (!('IntersectionObserver' in window)) {
    fadeEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
    skillProgresses.forEach(animateSkillBar);
    return;
  }

  const fadeObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => fadeObserver.observe(el));

  const skillObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const skillItem = entry.target;
      const progressBar = qs('.skill-progress', skillItem);
      if (progressBar) {
        setTimeout(() => animateSkillBar(progressBar), 100);
      }
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  skillItems.forEach(item => skillObserver.observe(item));

  // Timeline Animations
  const timelineItems = qsa('.timeline-content');
  const timelineObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  timelineItems.forEach(item => timelineObserver.observe(item));

  const sections = qsa('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    const y = window.scrollY;

    sections.forEach(sec => {
      const top = sec.offsetTop - 250;
      const bottom = top + sec.offsetHeight;
      if (y >= top && y < bottom) current = sec.id;
    });

    if (!current) return;
    qsa('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
}

/* ---------- Image Safety (never invisible) ---------- */
function setupImageSafety() {
  const imgs = qsa('img');
  if (!imgs.length) return;

  const markLoaded = (img) => img.classList.add('loaded');

  imgs.forEach(img => {
    if (img.complete && img.naturalHeight !== 0) markLoaded(img);

    img.addEventListener('load', () => markLoaded(img), { once: true });
    img.addEventListener('error', () => {
      img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="900" height="600"%3E%3Crect width="100%25" height="100%25" fill="%23e0e0e0"/%3E%3Ctext x="50%25" y="50%25" fill="%23999" font-size="28" font-family="sans-serif" text-anchor="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
      img.alt = 'Image failed to load';
      markLoaded(img);
    });
  });

  setTimeout(() => imgs.forEach(img => img.classList.add('loaded')), 1200);
}

/* ---------- Project Filtering (safe) ---------- */
function setupProjectFiltering() {
  const buttons = qsa('.filter-btn');
  const cards = qsa('.project-card');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.getAttribute('data-filter') || 'all';
      cards.forEach(card => {
        const tech = (card.getAttribute('data-tech') || '').toLowerCase();
        const ok = filter === 'all' || tech.includes(filter.toLowerCase());
        card.style.display = ok ? 'block' : 'none';
      });
    });
  });
}

/* ---------- FAQ (safe) ---------- */
function setupFAQ() {
  const questions = qsa('.faq-question');
  if (!questions.length) return;

  questions.forEach(q => {
    q.addEventListener('click', () => {
      const expanded = q.getAttribute('aria-expanded') === 'true';
      const id = q.getAttribute('aria-controls');
      const answer = id ? qs(`#${id}`) : null;

      questions.forEach(other => {
        if (other === q) return;
        other.setAttribute('aria-expanded', 'false');
        const oid = other.getAttribute('aria-controls');
        const oans = oid ? qs(`#${oid}`) : null;
        if (oans) {
          oans.style.maxHeight = '0';
          oans.style.padding = '0 1.5rem';
        }
      });

      q.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      if (!answer) return;

      if (expanded) {
        answer.style.maxHeight = '0';
        answer.style.padding = '0 1.5rem';
      } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.padding = '0 1.5rem 1.5rem';
      }
    });
  });
}

/* ---------- Contact Form (safe) ---------- */
function setupContactForm() {
  const form = qs('#contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const honeypot = qs('input[name="website"]', form);
    if (honeypot && honeypot.value) return;

    const btn = qs('button[type="submit"]', form);
    const original = btn ? btn.innerHTML : '';

    try {
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      }

      // TODO: Replace with your Formspree ID
      const endpoint = 'https://formspree.io/f/your-formspree-id';
      const data = new FormData(form);

      const res = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) throw new Error('Form submission failed');

      form.reset();
      showNotification('Message sent successfully! I’ll get back to you soon.', 'success');

      if (btn) btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      setTimeout(() => { if (btn) { btn.disabled = false; btn.innerHTML = original; } }, 2500);

    } catch (err) {
      console.error(err);
      showNotification('Failed to send. Please email me directly at asadullah92c@gmail.com', 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = original;
      }
    }
  });
}

/* ---------- Global Crash Guard ---------- */
function setupGlobalSafetyNet() {
  window.addEventListener('error', () => {
    const loading = qs('#loading-screen');
    if (loading) {
      loading.classList.add('hide');
      setTimeout(() => { loading.style.display = 'none'; }, 700);
    }
  });
}

/* ---------- Init ---------- */
function init() {
  setupGlobalSafetyNet();
  setupLoadingScreen();
  new ThemeManager();

  setupMobileMenu();
  setupSmoothScrolling();
  setupBackToTop();
  setupAnimations();
  setupImageSafety();

  setupProjectFiltering();
  setupFAQ();
  setupContactForm();

  console.log('✅ Portfolio initialized');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
