// ─── UI Utilities ─────────────────────────────────────────────────────────────

// Active section tracking
let currentSection = 'home';

function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  const target = document.getElementById(`section-${name}`);
  if (target) {
    target.classList.remove('hidden');
    currentSection = name;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Close mobile menu if open
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) navMenu.classList.remove('open');
    // Update mobile bottom bar active state
    document.querySelectorAll('.mobile-bottom-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mobileSection === name);
    });
  }
}

// ─── Toast Notifications ──────────────────────────────────────────────────────
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container') || (() => {
    const el = document.createElement('div');
    el.id = 'toast-container';
    document.body.appendChild(el);
    return el;
  })();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
    <span class="toast-msg">${escapeHtml(message)}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ─── Planner Rotating Loading State ──────────────────────────────────────────
let _plannerInterval = null;

function startPlannerLoading(containerId = 'planner-result') {
  const container = document.getElementById(containerId);
  if (!container) return;

  stopPlannerLoading();

  const tips = [
    '🤖 Crafting your itinerary...',
    '📍 Mapping the best spots...',
    '💰 Calculating your budget...',
    '🏨 Finding optimal accommodations...',
    '🎒 Tailoring to your traveller style...',
    '🌿 Discovering hidden local gems...',
    '🌟 Putting on the finishing touches...'
  ];

  let currentTipIndex = 0;

  container.innerHTML = `
    <div class="planner-loading-card">
      <div class="planner-loading-icon-wrap">
        <div class="planner-loading-pulse"></div>
        <span class="planner-loading-icon">🏕️</span>
      </div>
      <h3 class="planner-loading-title">Gemini AI is at Work</h3>
      <div class="planner-tip-box">
        <p id="planner-rotating-tip" class="planner-rotating-tip">${escapeHtml(tips[0])}</p>
      </div>
      <div class="planner-progress-bar">
        <div class="planner-progress-fill"></div>
      </div>
      <p class="planner-loading-sub">Crafting a personalised day-by-day plan. Usually takes 8–12 seconds.</p>
    </div>
  `;

  const tipEl = document.getElementById('planner-rotating-tip');
  _plannerInterval = setInterval(() => {
    currentTipIndex = (currentTipIndex + 1) % tips.length;
    if (tipEl) {
      tipEl.classList.remove('tip-fade');
      void tipEl.offsetWidth; // Trigger reflow for animation restart
      tipEl.textContent = tips[currentTipIndex];
      tipEl.classList.add('tip-fade');
    }
  }, 2000);
}

function stopPlannerLoading() {
  if (_plannerInterval) {
    clearInterval(_plannerInterval);
    _plannerInterval = null;
  }
}

// ─── Skeleton Loading State ───────────────────────────────────────────────────
function setSkeletonLoading(containerId, count = 6, type = 'card') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const cardsHtml = Array.from({ length: count }).map(() => `
    <div class="skeleton-card ${type === 'hotel' ? 'skeleton-hotel-card' : ''}">
      <div class="skeleton-shimmer skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-shimmer skeleton-badge"></div>
        <div class="skeleton-shimmer skeleton-title"></div>
        <div class="skeleton-shimmer skeleton-line skeleton-line-sub"></div>
        <div class="skeleton-shimmer skeleton-line"></div>
        <div class="skeleton-shimmer skeleton-line skeleton-line-short"></div>
        <div class="skeleton-footer">
          <div class="skeleton-shimmer skeleton-btn"></div>
          <div class="skeleton-shimmer skeleton-meta"></div>
        </div>
      </div>
    </div>
  `).join('');

  if (type === 'hotel') {
    container.innerHTML = `<div class="hotels-grid">${cardsHtml}</div>`;
  } else if (type === 'business') {
    container.innerHTML = `<div class="businesses-grid-inner">${cardsHtml}</div>`;
  } else {
    container.innerHTML = cardsHtml;
  }
}

// ─── Generic Loading State ────────────────────────────────────────────────────
function setLoading(containerId, message = 'Loading...', show = true) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (show) {
    container.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>${escapeHtml(message)}</p>
      </div>`;
  }
}

// ─── Error State ─────────────────────────────────────────────────────────────
function setError(containerId, message, retryFn = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <p class="error-msg">${escapeHtml(message)}</p>
      ${retryFn ? `<button class="btn btn-secondary" onclick="(${retryFn.toString()})()">Try Again</button>` : ''}
    </div>`;
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function setEmpty(containerId, message, icon = '🔍') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">${icon}</div>
      <p>${escapeHtml(message)}</p>
    </div>`;
}

// ─── HTML Escaper ─────────────────────────────────────────────────────────────
function escapeHtml(str) {
  if (typeof str !== 'string') return String(str || '');
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// ─── Map Link Generator ───────────────────────────────────────────────────────
function mapsLink(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// ─── Amenity Badges ───────────────────────────────────────────────────────────
function renderAmenities(amenities = []) {
  return amenities.map(a => `<span class="amenity-badge">${escapeHtml(a)}</span>`).join('');
}

// ─── Debounce ─────────────────────────────────────────────────────────────────
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}
