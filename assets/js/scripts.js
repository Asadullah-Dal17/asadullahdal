/**
 * Main Portfolio Script
 * Simplified and optimized for GitHub Pages
 */

// ===== Theme Manager =====
class ThemeManager {
  constructor() {
    this.toggleBtn = document.getElementById('darkModeToggle');
    this.icon = document.getElementById('darkModeIcon');
    this.init();
  }

  init() {
    // Use the initial theme set in the head script
    const darkMode = window.initialTheme === 'dark';

    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      if (this.icon) this.icon.className = 'fas fa-sun';
    }

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }

  toggleTheme() {
    document.documentElement.classList.toggle('dark-mode');
    const isDark = document.documentElement.classList.contains('dark-mode');
    if (this.icon) this.icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('darkMode', isDark);
    
    // Show notification
    showNotification(`Switched to ${isDark ? 'dark' : 'light'} mode`, 'info');
  }
}

// ===== Loading Screen Control =====
function setupLoadingScreen() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      loadingScreen.classList.add('hide');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }, 1500);
  });
}

// ===== Mobile Menu =====
function setupMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileMenuToggle?.addEventListener('click', openMobileMenu);
  mobileMenuClose?.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu when clicking outside
  mobileMenuOverlay?.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
      closeMobileMenu();
    }
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });
}

// ===== Smooth Scrolling =====
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
        });
        if (this.classList.contains('nav-link')) {
          this.classList.add('active');
        }
      }
    });
  });
}

// ===== Scroll Animations =====
function setupAnimations() {
  // Intersection Observer for skill bars
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.skill-item').forEach(item => {
    skillObserver.observe(item);
  });

  // Fade-in animations
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.project-card, .skill-category, .service-card, .course-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
  });

  // Active nav link on scroll
  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });
}

// ===== Form Handling =====
function setupContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (!contactForm) return;

  const inputs = contactForm.querySelectorAll('input, textarea');
  
  // Auto-save form data to localStorage
  function autoSaveForm() {
    const formData = {};
    inputs.forEach(input => {
      if (input.name && input.type !== 'submit' && input.name !== 'website') {
        formData[input.name] = input.value;
      }
    });
    localStorage.setItem('contactFormData', JSON.stringify(formData));
  }
  
  // Load saved form data
  function loadSavedForm() {
    const saved = localStorage.getItem('contactFormData');
    if (saved) {
      try {
        const formData = JSON.parse(saved);
        inputs.forEach(input => {
          if (formData[input.name]) {
            input.value = formData[input.name];
          }
        });
      } catch (e) {
        console.error('Error loading saved form data:', e);
      }
    }
  }
  
  // Load saved data on page load
  loadSavedForm();
  
  // Auto-save on input
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      autoSaveForm();
    });
  });
  
  // Real-time validation
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot spam check
    const honeypot = contactForm.querySelector('input[name="website"]');
    if (honeypot && honeypot.value) {
      console.log('Spam detected');
      return; // Silent fail for bots
    }

    // Validate all fields
    let isValid = true;
    inputs.forEach(input => {
      if (input.name !== 'website' && !validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      showNotification('Please fix the errors in the form.', 'error');
      return;
    }

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    try {
      // Prepare form data
      const formData = new FormData(contactForm);

      // Formspree Integration
      // TODO: Replace 'your-formspree-id' with your actual Formspree form ID
      // Get your form ID from: https://formspree.io/
      const formspreeEndpoint = 'https://formspree.io/f/your-formspree-id';
      
      // Send to Formspree
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success - clear saved form data
        localStorage.removeItem('contactFormData');
        
        // Success animation
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        contactForm.reset();
        
        // Clear errors
        inputs.forEach(input => {
          input.classList.remove('error');
          const errorMsg = input.parentNode.querySelector('.error-message');
          if (errorMsg) errorMsg.remove();
        });

        // Confetti animation on success
        triggerConfetti();
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');

        // Reset button
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 3000);
      } else {
        throw new Error('Form submission failed');
      }

    } catch (error) {
      console.error('Form submission error:', error);
      btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed to send';
      showNotification('Failed to send message. Please email me directly at asadullah92c@gmail.com', 'error');
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 3000);
    }
  });
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';

  // Remove existing error message
  const existingError = field.parentNode.querySelector('.error-message');
  if (existingError) existingError.remove();
  field.classList.remove('error');

  switch (field.type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        errorMessage = 'Email is required';
        isValid = false;
      } else if (!emailRegex.test(value)) {
        errorMessage = 'Please enter a valid email address';
        isValid = false;
      }
      break;
    case 'text':
      if (field.name === 'name' && !value) {
        errorMessage = 'Name is required';
        isValid = false;
      }
      break;
    case 'textarea':
      if (!value) {
        errorMessage = 'Message is required';
        isValid = false;
      } else if (value.length < 10) {
        errorMessage = 'Message must be at least 10 characters';
        isValid = false;
      }
      break;
  }

  if (!isValid) {
    field.classList.add('error');
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = errorMessage;
    field.parentNode.appendChild(errorElement);
  }

  return isValid;
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());

  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 
                     type === 'error' ? 'exclamation-triangle' : 
                     type === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(notification);

  // Show
  setTimeout(() => notification.classList.add('show'), 100);

  // Hide after 4 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// ===== Back to Top =====
function setupBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme manager
  const themeManager = new ThemeManager();
  
  // Setup all features
  setupLoadingScreen();
  setupMobileMenu();
  setupSmoothScrolling();
  setupAnimations();
  setupContactForm();
  setupBackToTop();
  
  // New high priority features
  setupProjectFiltering();
  setupSearch();
  setupFAQ();
  setupTypingEffect();
  setupScrollIndicator();
  setupSkillsCollapse();
  setupImageOptimization();

  // Fix any remaining broken links
  fixBrokenLinks();

  console.log('Portfolio website initialized successfully!');
});

// ===== Fix Broken Links =====
function fixBrokenLinks() {
  // GitHub profile link
  const githubBtn = document.querySelector('.btn-primary[href*="github"]');
  if (githubBtn) {
    githubBtn.href = 'https://github.com/Asadullah-Dal17';
    githubBtn.target = '_blank';
  }

  // YouTube channel links
  const youtubeLinks = document.querySelectorAll('a[href*="youtube"]');
  youtubeLinks.forEach(link => {
    link.href = 'https://youtube.com/@asadullah-dal';
    link.target = '_blank';
  });

  // LinkedIn link
  const linkedinLinks = document.querySelectorAll('a[href*="linkedin"]');
  linkedinLinks.forEach(link => {
    link.href = 'https://www.linkedin.com/in/asadullah-dal/';
    link.target = '_blank';
  });

  // Instagram link
  const instagramLinks = document.querySelectorAll('a[href*="instagram"]');
  instagramLinks.forEach(link => {
    link.href = 'https://www.instagram.com/aiphile17';
    link.target = '_blank';
  });

  // Email links
  const emailLinks = document.querySelectorAll('a[href*="mailto"]');
  emailLinks.forEach(link => {
    link.href = 'mailto:asadullah92c@gmail.com';
  });
}

// ===== Network Status =====
window.addEventListener('online', () => {
  showNotification('You are back online!', 'success');
});

window.addEventListener('offline', () => {
  showNotification('You are offline. Some features may not work.', 'warning');
});

// ===== GitHub API Enhancements =====
async function fetchGitHubStats() {
  try {
    const username = 'Asadullah-Dal17';
    const cacheKey = 'github_stats';
    const cacheTime = 1000 * 60 * 10; // 10 minutes
    
    // Check cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < cacheTime) {
        updateGitHubStats(data);
        return;
      }
    }

    // Fetch user data
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!userResponse.ok) throw new Error('GitHub API error');
    
    const userData = await userResponse.json();
    
    // Fetch repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    if (!reposResponse.ok) throw new Error('GitHub API error');
    
    const repos = await reposResponse.json();
    
    // Calculate stats
    const stats = {
      publicRepos: userData.public_repos || repos.length,
      followers: userData.followers || 0,
      following: userData.following || 0,
      totalStars: repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
      languages: getLanguageStats(repos)
    };
    
    // Cache the data
    localStorage.setItem(cacheKey, JSON.stringify({
      data: stats,
      timestamp: Date.now()
    }));
    
    updateGitHubStats(stats);
  } catch (error) {
    console.error('GitHub API error:', error);
    // Use fallback stats
    updateGitHubStats({
      publicRepos: 100,
      followers: 0,
      following: 0,
      totalStars: 0,
      languages: {}
    });
  }
}

function getLanguageStats(repos) {
  const languages = {};
  repos.forEach(repo => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });
  return languages;
}

function updateGitHubStats(stats) {
  // Update stat numbers if elements exist
  const repoCount = document.querySelector('[data-stat="repos"]');
  if (repoCount) {
    repoCount.textContent = `${stats.publicRepos}+`;
  }
  
  // You can add more stat updates here
  console.log('GitHub Stats:', stats);
}

// Fetch GitHub stats on load
fetchGitHubStats();

// ===== Performance Optimizations =====
// Passive event listeners for better scrolling performance
document.addEventListener('touchstart', () => {}, { passive: true });
document.addEventListener('touchmove', () => {}, { passive: true });

// Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
  // Any scroll-based logic here
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// ===== Project Filtering =====
function setupProjectFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');

      const filter = button.getAttribute('data-filter');

      // Filter projects
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-tech').includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// ===== Search Functionality =====
function setupSearch() {
  const searchOverlay = document.getElementById('searchOverlay');
  const searchToggle = document.getElementById('searchToggle');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  // Search content data
  const searchableContent = [
    { title: 'OpenCV Masterclass', description: 'Complete guide to computer vision with OpenCV', type: 'Course', link: '#courses' },
    { title: 'MediaPipe Hands & Pose', description: 'Master Google MediaPipe framework', type: 'Course', link: '#courses' },
    { title: 'YOLO Object Detection', description: 'Real-time object detection with YOLO', type: 'Course', link: '#courses' },
    { title: 'Advanced Face Recognition', description: 'Real-time face recognition system', type: 'Project', link: '#projects' },
    { title: 'Hand Gesture Control', description: 'Interactive gesture-based control system', type: 'Project', link: '#projects' },
    { title: 'Real-time Object Detection', description: 'High-performance object detection system', type: 'Project', link: '#projects' },
    { title: 'Python', description: 'Programming language expertise', type: 'Skill', link: '#skills' },
    { title: 'OpenCV', description: 'Computer vision library', type: 'Skill', link: '#skills' },
    { title: 'MediaPipe', description: 'Google MediaPipe framework', type: 'Skill', link: '#skills' },
    { title: 'YOLO', description: 'Object detection model', type: 'Skill', link: '#skills' },
  ];

  function performSearch(query) {
    if (!query.trim()) {
      searchResults.innerHTML = '';
      return;
    }

    const results = searchableContent.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );

    searchResults.innerHTML = '';
    
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-result-item"><p style="color: rgba(255,255,255,0.7);">No results found</p></div>';
      return;
    }

    results.forEach(result => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <div class="search-result-title">${result.title}</div>
        <div class="search-result-description">${result.description}</div>
        <span class="search-result-type">${result.type}</span>
      `;
      item.addEventListener('click', () => {
        window.location.href = result.link;
        closeSearch();
      });
      searchResults.appendChild(item);
    });
  }

  function openSearch() {
    searchOverlay.classList.add('active');
    searchInput.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
    document.body.style.overflow = '';
  }

  searchToggle?.addEventListener('click', openSearch);
  searchClose?.addEventListener('click', closeSearch);
  
  searchInput?.addEventListener('input', (e) => {
    performSearch(e.target.value);
  });

  searchOverlay?.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      closeSearch();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
      closeSearch();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });
}

// ===== FAQ Accordion =====
function setupFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      const answer = document.getElementById(question.getAttribute('aria-controls'));

      // Close all other FAQs
      faqQuestions.forEach(q => {
        if (q !== question) {
          q.setAttribute('aria-expanded', 'false');
          const otherAnswer = document.getElementById(q.getAttribute('aria-controls'));
          if (otherAnswer) {
            otherAnswer.style.maxHeight = '0';
            otherAnswer.style.padding = '0 1.5rem';
          }
        }
      });

      // Toggle current FAQ
      if (isExpanded) {
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
        answer.style.padding = '0 1.5rem';
      } else {
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.padding = '0 1.5rem 1.5rem';
      }
    });
  });
}

// ===== Typing Effect =====
function setupTypingEffect() {
  const subtitle = document.getElementById('typing-subtitle');
  if (!subtitle) return;

  const text = subtitle.textContent;
  subtitle.textContent = '';
  subtitle.style.borderRight = '2px solid var(--accent)';
  
  let i = 0;
  function type() {
    if (i < text.length) {
      subtitle.textContent += text.charAt(i);
      i++;
      setTimeout(type, 100);
    } else {
      setTimeout(() => {
        subtitle.style.borderRight = 'none';
      }, 1000);
    }
  }
  
  // Start typing after a short delay
  setTimeout(type, 500);
}

// ===== Scroll Indicator =====
function setupScrollIndicator() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (!scrollIndicator) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.pointerEvents = 'none';
    } else {
      scrollIndicator.style.opacity = '1';
      scrollIndicator.style.pointerEvents = 'auto';
    }
  });

  scrollIndicator.addEventListener('click', () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  });
}

// ===== Skills Collapse =====
function setupSkillsCollapse() {
  const skillCategories = document.querySelectorAll('.skill-category[data-collapsible="true"]');
  
  skillCategories.forEach(category => {
    const header = category.querySelector('.skill-category-header');
    const toggle = category.querySelector('.skill-toggle');
    const content = category.querySelector('.skill-category-content');
    
    if (!header || !toggle || !content) return;
    
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.querySelector('i').classList.remove('fa-chevron-down');
        toggle.querySelector('i').classList.add('fa-chevron-up');
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        content.style.overflow = 'hidden';
      } else {
        toggle.setAttribute('aria-expanded', 'true');
        toggle.querySelector('i').classList.remove('fa-chevron-up');
        toggle.querySelector('i').classList.add('fa-chevron-down');
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
      }
    });
  });
}

// ===== Image Optimization =====
function setupImageOptimization() {
  // Lazy load images with Intersection Observer
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    images.forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // Add error handling for images
  images.forEach(img => {
    img.addEventListener('error', function() {
      this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
      this.alt = 'Image failed to load';
    });
  });
}

// ===== Confetti Animation =====
function triggerConfetti() {
  const confettiCount = 50;
  const confetti = [];
  
  for (let i = 0; i < confettiCount; i++) {
    const confettiPiece = document.createElement('div');
    confettiPiece.className = 'confetti';
    confettiPiece.style.left = Math.random() * 100 + '%';
    confettiPiece.style.backgroundColor = ['#4CAF50', '#2E7D32', '#66BB6A', '#81C784'][Math.floor(Math.random() * 4)];
    confettiPiece.style.animationDelay = Math.random() * 0.5 + 's';
    confettiPiece.style.animationDuration = (Math.random() * 2 + 1) + 's';
    document.body.appendChild(confettiPiece);
    
    setTimeout(() => {
      confettiPiece.remove();
    }, 3000);
  }
}