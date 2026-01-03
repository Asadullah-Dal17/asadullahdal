/* =========================================================
   Animated Background Grid Generator
   Creates moving grid lines and gradient animations
   ========================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initializeAnimatedBackground();
});

function initializeAnimatedBackground() {
  // Create animated gradient overlay
  const gradientOverlay = document.createElement('div');
  gradientOverlay.className = 'animated-gradient-overlay';
  document.body.insertBefore(gradientOverlay, document.body.firstChild);

  // Create animated grid container
  const gridContainer = document.createElement('div');
  gridContainer.className = 'animated-grid';
  document.body.insertBefore(gridContainer, document.body.firstChild);

  // Generate horizontal grid lines
  generateHorizontalLines(gridContainer);

  // Generate vertical grid lines
  generateVerticalLines(gridContainer);
}

function generateHorizontalLines(container) {
  const lineCount = 6; // Number of horizontal lines
  const spacing = window.innerHeight / (lineCount + 1);

  for (let i = 0; i < lineCount; i++) {
    const line = document.createElement('div');
    line.className = 'grid-line horizontal';
    line.style.top = (spacing * (i + 1)) + 'px';
    line.style.animationDelay = (i * 0.3) + 's';
    line.style.animationDuration = (12 + i * 0.5) + 's';
    container.appendChild(line);
  }
}

function generateVerticalLines(container) {
  const lineCount = 8; // Number of vertical lines
  const spacing = window.innerWidth / (lineCount + 1);

  for (let i = 0; i < lineCount; i++) {
    const line = document.createElement('div');
    line.className = 'grid-line vertical';
    line.style.left = (spacing * (i + 1)) + 'px';
    line.style.animationDelay = (i * 0.2) + 's';
    line.style.animationDuration = (12 + i * 0.4) + 's';
    container.appendChild(line);
  }
}

// Regenerate grid on window resize
window.addEventListener('resize', () => {
  const existingGrid = document.querySelector('.animated-grid');
  if (existingGrid) {
    existingGrid.remove();
  }
  
  const gridContainer = document.createElement('div');
  gridContainer.className = 'animated-grid';
  document.body.insertBefore(gridContainer, document.body.firstChild);
  
  generateHorizontalLines(gridContainer);
  generateVerticalLines(gridContainer);
});
