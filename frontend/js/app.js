// ─── Camp With Us — Main Application ─────────────────────────────────────────
//  Initializes all modules, binds events, orchestrates sections.
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // ── Init ────────────────────────────────────────────────────────────────────
  Auth.updateNavUI();
  showSection('home');
  loadFeaturedDestinations();

  // ── Wake up Render backend (free tier spins down after inactivity) ──────────
  fetch(`${CONFIG.API_BASE_URL}/test`).catch(() => {});
  // Ping every 10 minutes to keep it alive during a session
  setInterval(() => fetch(`${CONFIG.API_BASE_URL}/test`).catch(() => {}), 600000);

  // ── Nav Links ──────────────────────────────────────────────────────────────
  document.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const section = link.dataset.section;
      showSection(section);
      if (section === 'destinations') loadAllDestinations();
      if (section === 'safety')       loadSafetyNumbers();
      if (section === 'businesses')   loadBusinesses();
    });
  });

  // ── Mobile Nav Toggle ───────────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');
  if (hamburger) hamburger.addEventListener('click', () => navMenu?.classList.toggle('open'));

  // ── Hero Search ─────────────────────────────────────────────────────────────
  const heroSearchBtn  = document.getElementById('hero-search-btn');
  const heroSearchInput = document.getElementById('hero-search');
  if (heroSearchBtn) {
    heroSearchBtn.addEventListener('click', () => {
      const q = heroSearchInput?.value.trim();
      if (q) searchAndShowDestination(q);
      else showToast('Please enter a destination name.', 'warning');
    });
  }
  if (heroSearchInput) {
    heroSearchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') heroSearchBtn?.click();
    });
  }

  // ── Destination Search (explore section) ────────────────────────────────────
  const destSearchBtn   = document.getElementById('dest-search-btn');
  const destSearchInput = document.getElementById('dest-search-input');
  if (destSearchBtn) {
    destSearchBtn.addEventListener('click', () => {
      const q = destSearchInput?.value.trim();
      if (q) searchAndShowDestination(q);
      else loadAllDestinations();
    });
  }
  if (destSearchInput) {
    destSearchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') destSearchBtn?.click();
    });
    destSearchInput.addEventListener('input', debounce(() => {
      const q = destSearchInput.value.trim();
      if (q.length >= 2) searchAndShowDestination(q, true);
      else if (q.length === 0) loadAllDestinations();
    }, 400));
  }

  // ── Category Filter Buttons ──────────────────────────────────────────────────
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      if (cat === 'All') loadAllDestinations();
      else loadAllDestinations(cat);
    });
  });

  // ── Plan Trip Button ─────────────────────────────────────────────────────────
  const planBtns = document.querySelectorAll('[data-action="plan-trip"]');
  planBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const dest = btn.dataset.destination || '';
      showSection('planner');
      if (dest) {
        const inp = document.getElementById('planner-destination');
        if (inp) inp.value = dest;
      }
    });
  });

  // ── Planner Form ─────────────────────────────────────────────────────────────
  const plannerForm = document.getElementById('planner-form');
  if (plannerForm) plannerForm.addEventListener('submit', handlePlannerSubmit);

  // ── Hotel Form & AI Match ───────────────────────────────────────────────────
  const hotelForm = document.getElementById('hotel-search-form');
  if (hotelForm) hotelForm.addEventListener('submit', handleHotelSearch);

  const hotelAiMatchBtn = document.getElementById('hotel-ai-match-btn');
  if (hotelAiMatchBtn) hotelAiMatchBtn.addEventListener('click', handleAiHotelMatch);

  // ── Hotel city quick-chips ────────────────────────────────────────────────────
  document.querySelectorAll('.hotel-city-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const city = chip.dataset.city;
      const inp  = document.getElementById('hotel-city');
      if (inp) inp.value = city;
      performHotelSearch(city, '', '');
      // scroll to results
      document.getElementById('hotel-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Auth Forms ────────────────────────────────────────────────────────────────
  const loginForm    = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm)    loginForm.addEventListener('submit', handleLogin);
  if (registerForm) registerForm.addEventListener('submit', handleRegister);

  // ── Logout Button ─────────────────────────────────────────────────────────────
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', Auth.logout);

  // ── Auth Tab Switchers ────────────────────────────────────────────────────────
  document.getElementById('show-register')?.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('login-panel').classList.add('hidden');
    document.getElementById('register-panel').classList.remove('hidden');
  });
  document.getElementById('show-login')?.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('register-panel').classList.add('hidden');
    document.getElementById('login-panel').classList.remove('hidden');
  });

  // ── AI Assistant Chat ─────────────────────────────────────────────────────────
  const chatForm = document.getElementById('assistant-chat-form') || document.getElementById('assistant-form');
  if (chatForm) chatForm.addEventListener('submit', handleAssistantChatSubmit);

  document.querySelectorAll('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.dataset.prompt;
      const input = document.getElementById('assistant-input') || document.getElementById('assistant-question');
      if (input && prompt) {
        input.value = prompt;
        input.focus();
        // Directly call handler instead of dispatching submit event (avoids empty-body race)
        handleAssistantChatSubmit(null);
      }
    });
  });

  // ── Review Form ───────────────────────────────────────────────────────────────
  const reviewForm = document.getElementById('review-form');
  if (reviewForm) reviewForm.addEventListener('submit', handleReviewSubmit);

  // ── Route Planner ─────────────────────────────────────────────────────────────
  const routeBtn = document.getElementById('route-plan-btn');
  if (routeBtn) routeBtn.addEventListener('click', handleRoutePlanner);

  // ── Map Search ────────────────────────────────────────────────────────────────
  const mapSearchBtn = document.getElementById('map-search-btn');
  if (mapSearchBtn) mapSearchBtn.addEventListener('click', handleMapSearch);

  // ── Businesses Filter ─────────────────────────────────────────────────────────
  const bizFilterBtn = document.getElementById('biz-filter-btn');
  if (bizFilterBtn) {
    bizFilterBtn.addEventListener('click', () => {
      const city = document.getElementById('biz-city')?.value.trim();
      const cat  = document.getElementById('biz-category')?.value;
      loadBusinesses(city, cat);
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DESTINATIONS
// ─────────────────────────────────────────────────────────────────────────────

// In-memory cache so onclick can reference by index safely (avoids JSON-in-HTML quoting issues)
const _destCache = {};

async function loadFeaturedDestinations() {
  const container = document.getElementById('featured-destinations');
  if (!container) return;
  setSkeletonLoading('featured-destinations', 4);

  const { ok, data } = await API.destinations.getAll('?limit=6');
  if (!ok || !data.success) {
    container.innerHTML = `<p class="error-msg">Could not load featured destinations. Please ensure the backend is running.</p>`;
    return;
  }
  renderDestinationCards(container, data.destinations);
}

async function loadAllDestinations(category = '') {
  const container = document.getElementById('all-destinations');
  if (!container) return;
  setSkeletonLoading('all-destinations', 6);

  const qs = category ? `?category=${encodeURIComponent(category)}` : '';
  const { ok, data } = await API.destinations.getAll(qs);
  if (!ok || !data.success) {
    setError('all-destinations', data.message || 'Failed to load destinations.', () => loadAllDestinations(category));
    return;
  }
  if (!data.destinations.length) {
    setEmpty('all-destinations', 'No destinations found.', '🗺️');
    return;
  }
  renderDestinationCards(container, data.destinations);
}

async function searchAndShowDestination(q, inline = false) {
  if (!inline) showSection('destinations');
  const container = document.getElementById('all-destinations');
  if (!container) return;
  setSkeletonLoading('all-destinations', 4);

  const { ok, data } = await API.destinations.search(q);
  if (!ok) {
    if (data.errorType === 'NETWORK_ERROR') {
      setError('all-destinations', 'Unable to connect to the tourism server. Is the backend running?');
    } else {
      setError('all-destinations', data.message || 'Search failed.');
    }
    return;
  }
  if (!data.destinations || !data.destinations.length) {
    setEmpty('all-destinations', `No destinations found for "${q}". Try: Warangal, Goa, Jaipur...`, '🔍');
    return;
  }
  renderDestinationCards(container, data.destinations);

  // Auto-open single result
  if (data.destinations.length === 1) {
    setTimeout(() => openDestination(data.destinations[0]), 300);
  }
}

function renderDestinationCards(container, destinations) {
  // Cache destinations by _id so onclick can look them up safely
  destinations.forEach(d => { _destCache[d._id] = d; });

  container.innerHTML = destinations.map(d => `
    <div class="card destination-card" data-destid="${d._id}" style="cursor:pointer">
      <div class="card-img-wrap">
        <img src="${d.image || 'https://placehold.co/400x220?text=' + encodeURIComponent(d.name)}"
             alt="${escapeHtml(d.name)}"
             loading="lazy"
             onerror="this.src='https://placehold.co/400x220?text=${encodeURIComponent(d.name)}'">
        <span class="card-badge">${escapeHtml(d.category)}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(d.name)}</h3>
        <p class="card-subtitle">📍 ${escapeHtml(d.city)}, ${escapeHtml(d.state)}</p>
        <p class="card-desc">${escapeHtml(d.shortDescription || d.description.substring(0, 90) + '...')}</p>
        <div class="card-meta">
          <span class="rating">★ ${d.rating.toFixed(1)}</span>
          <span class="best-time">🗓 ${escapeHtml(d.bestTimeToVisit || 'Year-round')}</span>
        </div>
        <div class="card-actions">
          <button class="btn btn-primary btn-sm" data-action="open-dest" data-destid="${d._id}">Explore</button>
          <button class="btn btn-outline btn-sm" data-action="plan-dest" data-destname="${escapeHtml(d.name)}">Plan Trip</button>
        </div>
      </div>
    </div>
  `).join('');

  // Attach click handlers via event delegation (no inline JS — safe against quote issues)
  container.querySelectorAll('[data-action="open-dest"]').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openDestination(_destCache[btn.dataset.destid]); });
  });
  container.querySelectorAll('[data-action="plan-dest"]').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); planTrip(btn.dataset.destname); });
  });
  container.querySelectorAll('.destination-card').forEach(card => {
    card.addEventListener('click', () => {
      const dest = _destCache[card.dataset.destid];
      if (dest) openDestination(dest);
    });
  });
}

function openDestination(dest) {
  if (typeof dest === 'string') {
    // fetch by ID
    API.destinations.getById(dest).then(({ ok, data }) => {
      if (ok && data.success) openDestination(data.destination);
    });
    return;
  }
  // Render destination detail
  const panel = document.getElementById('destination-detail');
  if (!panel) return;

  panel.innerHTML = `
    <div class="dest-detail">
      <button class="btn btn-outline btn-sm mb-2" onclick="showSection('destinations')">← Back to Destinations</button>
      <div class="dest-hero">
        <img src="${dest.image || 'https://placehold.co/800x300?text=' + encodeURIComponent(dest.name)}"
             alt="${escapeHtml(dest.name)}"
             onerror="this.src='https://placehold.co/800x300/2e7d32/white?text=${encodeURIComponent(dest.name)}'">
        <div class="dest-hero-overlay">
          <h2>${escapeHtml(dest.name)}</h2>
          <p>📍 ${escapeHtml(dest.city)}, ${escapeHtml(dest.state)}</p>
          <span class="card-badge">${escapeHtml(dest.category)}</span>
        </div>
      </div>
      <div class="dest-content">
        <div class="dest-overview">
          <p>${escapeHtml(dest.description)}</p>
          <div class="dest-meta-grid">
            <div><strong>🗓 Best Time</strong><span>${escapeHtml(dest.bestTimeToVisit || 'Year-round')}</span></div>
            <div><strong>🌡️ Climate</strong><span>${escapeHtml(dest.climate || 'Varies')}</span></div>
            <div><strong>🗣️ Language</strong><span>${escapeHtml(dest.language || 'Hindi')}</span></div>
            <div><strong>💰 Avg Budget/Day</strong><span>₹${dest.averageBudgetPerDay || 'Varies'}</span></div>
            <div><strong>⭐ Rating</strong><span>${dest.rating.toFixed(1)} / 5</span></div>
          </div>
        </div>

        ${dest.attractions && dest.attractions.length ? `
        <div class="dest-section">
          <h3>🏛️ Top Attractions</h3>
          <div class="attractions-grid">
            ${dest.attractions.map(a => `
              <div class="attraction-card">
                <h4>${escapeHtml(a.name)}</h4>
                <p>${escapeHtml(a.description || '')}</p>
                <div class="attraction-meta">
                  <span>🎫 ${escapeHtml(a.entryFee || 'Free')}</span>
                  <span>🕐 ${escapeHtml(a.timings || '')}</span>
                </div>
                <a href="${mapsLink(a.name + ' ' + dest.city)}" target="_blank" class="map-link">📍 View on Map</a>
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${dest.travelTips && dest.travelTips.length ? `
        <div class="dest-section">
          <h3>💡 Travel Tips</h3>
          <ul class="tips-list">
            ${dest.travelTips.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
          </ul>
        </div>` : ''}

        <div class="dest-actions">
          <button class="btn btn-primary"   id="dest-plan-btn"   >🗓️ Plan My Trip</button>
          <button class="btn btn-secondary" id="dest-hotels-btn" >🏨 Find Hotels</button>
          <a href="${mapsLink(dest.name + ', ' + dest.state + ', India')}" target="_blank" class="btn btn-outline">🗺️ View on Map</a>
        </div>
      </div>
    </div>
  `;

  // Attach event listeners after innerHTML is set (avoids inline JS quoting issues)
  document.getElementById('dest-plan-btn')?.addEventListener('click', () => planTrip(dest.name));
  document.getElementById('dest-hotels-btn')?.addEventListener('click', () => loadHotelsForCity(dest.city));

  showSection('destination-detail');

  // Load reviews for this destination
  if (dest._id) loadReviewsForDestination(dest._id);
}

function planTrip(destinationName) {
  showSection('planner');
  const inp = document.getElementById('planner-destination');
  if (inp) inp.value = destinationName;
}

function loadHotelsForCity(city) {
  showSection('hotels');
  const inp = document.getElementById('hotel-city');
  if (inp) inp.value = city;
  performHotelSearch(city, '', '');
}

// ─────────────────────────────────────────────────────────────────────────────
// PLANNER
// ─────────────────────────────────────────────────────────────────────────────
async function handlePlannerSubmit(e) {
  e.preventDefault();
  const btn    = document.getElementById('planner-submit-btn');
  const result = document.getElementById('planner-result');

  const destination  = document.getElementById('planner-destination')?.value.trim();
  const days         = document.getElementById('planner-days')?.value;
  const budget       = document.getElementById('planner-budget')?.value;
  const travellerType = document.getElementById('planner-traveller')?.value;
  const foodPref     = document.getElementById('planner-food')?.value;
  const interests    = Array.from(document.querySelectorAll('.interest-check:checked')).map(c => c.value);
  const roamingTimes = Array.from(document.querySelectorAll('.roaming-check:checked')).map(c => c.value);

  if (!destination) { showToast('Please enter a destination.', 'warning'); return; }
  if (!days || days < 1) { showToast('Please select number of days.', 'warning'); return; }
  if (!budget || budget < 100) { showToast('Please enter a valid budget.', 'warning'); return; }
  if (!travellerType) { showToast('Please select traveller type.', 'warning'); return; }
  if (interests.length === 0) { showToast('Please select at least one interest.', 'warning'); return; }

  if (btn) { btn.disabled = true; btn.textContent = '⏳ Generating your trip...'; }

  // Show animated loading with step messages
  if (result) {
    result.innerHTML = `
      <div class="form-card" style="text-align:center; padding:2rem">
        <div style="font-size:3rem; margin-bottom:1rem">🤖</div>
        <h3 style="color:var(--green-primary); margin-bottom:0.5rem">Generating Your Itinerary</h3>
        <p id="planner-loading-msg" style="color:var(--gray-400); margin-bottom:1.5rem">Connecting to AI...</p>
        <div class="spinner" style="margin:0 auto 1rem"></div>
        <p style="font-size:0.8rem; color:var(--gray-400)">This may take 30–60 seconds. Gemini AI is crafting your personalised plan.</p>
      </div>`;

    // Cycle through status messages so user knows it's working
    const messages = [
      'Connecting to AI...', 'Analysing your destination...', 'Planning day-by-day activities...',
      'Calculating budget breakdown...', 'Adding local food recommendations...', 'Almost ready...'
    ];
    let msgIdx = 0;
    const msgEl = document.getElementById('planner-loading-msg');
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      if (msgEl) msgEl.textContent = messages[msgIdx];
    }, 5000);

    const { ok, data } = await API.planner.generate({
      destination, days: parseInt(days), budget: parseFloat(budget),
      travellerType, foodPreference: foodPref,
      interests, roamingTimes
    });

    clearInterval(msgInterval);
    stopPlannerLoading();
    if (btn) { btn.disabled = false; btn.textContent = '🗓️ Generate My Itinerary'; }

    if (!ok) {
      if (data.errorType === 'NETWORK_ERROR') {
        setError('planner-result', 'Unable to connect to the server. Please ensure the backend is running.');
      } else if (data.errorType === 'AI_NOT_CONFIGURED') {
        setError('planner-result', 'AI planner is not configured. Please add your GEMINI_API_KEY to backend/.env and restart the server.');
      } else if (data.errorType === 'TIMEOUT') {
        setError('planner-result', 'The server is waking up (free tier). Please wait 30 seconds and try again.');
      } else {
        setError('planner-result', data.message || 'Planner failed. Please try again.');
      }
      return;
    }

    renderItinerary(data);
  }

  if (btn) { btn.disabled = false; btn.textContent = '🗓️ Generate My Itinerary'; }
}

function renderItinerary(data) {
  const result = document.getElementById('planner-result');
  if (!result) return;

  const plan = data.itinerary;
  const days = plan.days || [];
  const destName = escapeHtml(plan.destination || data.destination);

  const periodIcon = { morning: '🌅', afternoon: '☀️', evening: '🌆', night: '🌙' };
  const categoryIcon = { heritage: '🏛️', beach: '🏖️', food: '🍽️', nature: '🌿', shopping: '🛍️', temples: '🛕', adventure: '🧗', wildlife: '🐘', photography: '📸' };

  function getCatIcon(cat) {
    if (!cat) return '📍';
    const key = cat.toLowerCase().split('/')[0].trim();
    return categoryIcon[key] || '📍';
  }

  // Expand to full width when result is shown
  result.style.flex = '0 0 100%';
  result.style.maxWidth = '100%';

  result.innerHTML = `
    <div class="itin-page">

      <!-- ── HERO BANNER ── -->
      <div class="itin-hero">
        <div class="itin-hero-content">
          <div class="itin-hero-badge">🤖 AI-Generated Itinerary</div>
          <h2 class="itin-hero-title">🗺️ ${destName}</h2>
          <div class="itin-hero-chips">
            <span class="itin-chip">📅 ${escapeHtml(String(plan.duration || data.days))} Day${days.length > 1 ? 's' : ''}</span>
            <span class="itin-chip">💰 ${escapeHtml(plan.totalEstimatedCost || 'Budget plan')}</span>
            <span class="itin-chip">👤 ${escapeHtml(data.travellerType || '')}</span>
            ${plan.bestTimeToVisit ? `<span class="itin-chip">🗓️ ${escapeHtml(plan.bestTimeToVisit)}</span>` : ''}
          </div>
          ${plan.summary ? `<p class="itin-hero-summary">${escapeHtml(plan.summary)}</p>` : ''}
        </div>
      </div>

      <!-- ── DAY TABS ── -->
      ${days.length > 1 ? `
      <div class="itin-day-tabs" role="tablist" aria-label="Day tabs">
        ${days.map((day, i) => `
          <button class="itin-day-tab ${i === 0 ? 'active' : ''}"
                  role="tab" aria-selected="${i === 0}"
                  onclick="switchItinDay(${day.day})">
            Day ${day.day}
            ${day.theme ? `<span class="itin-tab-theme">${escapeHtml(day.theme)}</span>` : ''}
          </button>
        `).join('')}
      </div>` : ''}

      <!-- ── DAYS ── -->
      <div class="itin-days-wrap">
        ${days.map((day, i) => `
          <div class="itin-day-panel ${i === 0 ? 'active' : ''}" data-day="${day.day}">

            <div class="itin-day-meta-bar">
              <div class="itin-day-title">
                <span class="itin-day-num">Day ${day.day}</span>
                ${day.theme ? `<span class="itin-day-theme">${escapeHtml(day.theme)}</span>` : ''}
              </div>
              ${day.estimatedDayCost ? `<span class="itin-day-cost">💰 ${escapeHtml(day.estimatedDayCost)}</span>` : ''}
            </div>

            <div class="itin-timeline">
              ${(day.activities || []).map((act, idx) => `
                <div class="itin-activity period-${(act.period || 'morning').toLowerCase()}">
                  <div class="itin-timeline-dot">
                    <span>${periodIcon[(act.period || 'morning').toLowerCase()] || '📍'}</span>
                  </div>
                  <div class="itin-activity-card">
                    <div class="itin-activity-header">
                      <div>
                        <span class="itin-time">${act.time ? escapeHtml(act.time) : ''}</span>
                        <span class="itin-period-label">${escapeHtml(act.period || '')}</span>
                      </div>
                      ${act.estimatedCost ? `<span class="itin-cost-badge">💰 ${escapeHtml(act.estimatedCost)}</span>` : ''}
                    </div>
                    <h4 class="itin-place">${getCatIcon(act.category)} ${escapeHtml(act.place || '')}</h4>
                    <p class="itin-desc">${escapeHtml(act.description || '')}</p>
                    <div class="itin-activity-footer">
                      ${act.category ? `<span class="itin-tag">${escapeHtml(act.category)}</span>` : ''}
                      ${act.travelNote ? `<span class="itin-note">💡 ${escapeHtml(act.travelNote)}</span>` : ''}
                      <a class="itin-map-link" href="${mapsLink(act.place + ', ' + destName)}" target="_blank" rel="noopener">📍 View on Map</a>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            ${day.notes ? `
            <div class="itin-day-notes">
              <span>📌</span> ${escapeHtml(day.notes)}
            </div>` : ''}
          </div>
        `).join('')}
      </div>

      <!-- ── TIPS ── -->
      ${plan.generalTips && plan.generalTips.length ? `
      <div class="itin-tips-grid">
        <h3 class="itin-section-title">💡 General Travel Tips</h3>
        <div class="itin-tips-list">
          ${plan.generalTips.map(t => `<div class="itin-tip-item">✅ ${escapeHtml(t)}</div>`).join('')}
        </div>
      </div>` : ''}

      <!-- ── ACTION BAR ── -->
      <div class="itin-action-bar">
        <div class="itin-emergency">🚨 Emergency: <strong>${escapeHtml(plan.emergencyNumber || '112')}</strong></div>
        <div class="itin-actions">
          <button class="btn btn-outline btn-sm" onclick="showSection('planner')">← Edit Trip</button>
          <button class="btn btn-secondary btn-sm" id="itin-hotels-btn">🏨 Find Hotels</button>
          <button class="btn btn-outline btn-sm" onclick="window.print()">🖨️ Print</button>
        </div>
      </div>

    </div>
  `;

  // Safe event binding (avoids inline onclick with special chars in destination name)
  document.getElementById('itin-hotels-btn')?.addEventListener('click', () => {
    loadHotelsForCity(plan.destination || data.destination);
  });
}

function switchItinDay(dayNum) {
  document.querySelectorAll('.itin-day-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.itin-day-tab').forEach(t => {
    const isActive = parseInt(t.textContent) === dayNum || t.onclick?.toString().includes(`(${dayNum})`);
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  const panel = document.querySelector(`.itin-day-panel[data-day="${dayNum}"]`);
  if (panel) panel.classList.add('active');
  // find and activate the right tab
  document.querySelectorAll('.itin-day-tab').forEach(t => {
    if (t.getAttribute('onclick')?.includes(`(${dayNum})`)) {
      t.classList.add('active');
      t.setAttribute('aria-selected', 'true');
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// HOTELS
// ─────────────────────────────────────────────────────────────────────────────
async function handleHotelSearch(e) {
  e.preventDefault();
  const city    = document.getElementById('hotel-city')?.value.trim();
  const budget  = document.getElementById('hotel-budget')?.value;
  const type    = document.getElementById('hotel-type')?.value;
  const amenityBoxes = Array.from(document.querySelectorAll('.amenity-check:checked')).map(c => c.value);

  if (!city) { showToast('Please enter a destination city.', 'warning'); return; }
  performHotelSearch(city, budget, type, amenityBoxes.join(','));
}

async function performHotelSearch(city, budget = '', type = '', amenities = '') {
  setSkeletonLoading('hotel-results', 4, 'hotel');

  const { ok, data } = await API.hotels.search(city, budget, type, amenities);

  if (!ok) {
    if (data.errorType === 'NETWORK_ERROR') {
      setError('hotel-results', 'Unable to load hotel data. Please ensure the backend is running.');
    } else {
      setError('hotel-results', data.message || 'Unable to load hotel data.');
    }
    return;
  }

  if (!data.hotels || !data.hotels.length) {
    setEmpty('hotel-results', `No stays matched your selection for "${city}". Try a larger budget or remove filters.`, '🏨');
    return;
  }

  renderHotelCards(data.hotels);
}

// ─── AI Hotel Recommendations (Smart Match) ──────────────────────────────────
async function handleAiHotelMatch() {
  const city = document.getElementById('hotel-city')?.value.trim();
  const budgetVal = document.getElementById('hotel-budget')?.value;
  const budget = (budgetVal && !isNaN(parseFloat(budgetVal))) ? parseFloat(budgetVal) : 2500;
  const type = document.getElementById('hotel-type')?.value;
  const amenityBoxes = Array.from(document.querySelectorAll('.amenity-check:checked')).map(c => c.value);

  if (!city) {
    showToast('Please enter a destination city for AI matching.', 'warning');
    document.getElementById('hotel-city')?.focus();
    return;
  }

  const matchBtn = document.getElementById('hotel-ai-match-btn');
  if (matchBtn) {
    matchBtn.disabled = true;
    matchBtn.textContent = '✨ AI is matching stays...';
  }

  setSkeletonLoading('hotel-results', 4, 'hotel');

  const { ok, data } = await API.ai.hotelRecommendations({
    destination: city,
    budget,
    travellerType: 'Solo',
    interests: amenityBoxes
  });

  if (matchBtn) {
    matchBtn.disabled = false;
    matchBtn.textContent = '✨ AI Smart Match';
  }

  if (!ok) {
    if (data.errorType === 'NETWORK_ERROR') {
      setError('hotel-results', 'Unable to connect to server. Please verify backend is running.');
    } else {
      setError('hotel-results', data.message || 'AI hotel recommendation failed. Please try again.');
    }
    return;
  }

  const container = document.getElementById('hotel-results');
  if (!container) return;

  const pref = data.preferences || {};
  const hotels = data.hotels || [];

  container.innerHTML = `
    <!-- AI Smart Match Reasoning Card -->
    <div class="ai-hotel-reasoning-card">
      <div class="ai-reasoning-header">
        <div class="ai-reasoning-badge">🤖 AI Smart Match Recommendation</div>
        <span class="ai-destination-chip">📍 ${escapeHtml(data.destination || city)}</span>
      </div>
      <p class="ai-reasoning-text">
        ${escapeHtml(pref.reasoning || `Gemini AI analyzed traveller needs and identified optimal curated stays in ${city}.`)}
      </p>
      <div class="ai-criteria-chips">
        <span class="ai-criterion">💰 Max Budget: ₹${escapeHtml(String(pref.maxBudget || budget))}</span>
        ${pref.preferredTypes && pref.preferredTypes.length ? `<span class="ai-criterion">🏷️ Preferred Types: ${escapeHtml(pref.preferredTypes.join(', '))}</span>` : ''}
        ${pref.mustHaveAmenities && pref.mustHaveAmenities.length ? `<span class="ai-criterion">✨ Must-Haves: ${escapeHtml(pref.mustHaveAmenities.join(', '))}</span>` : ''}
      </div>
    </div>

    ${hotels.length ? `
      <p class="results-count" style="margin-top:1.25rem">Matched ${hotels.length} hotel(s) matching AI criteria — <span class="demo-label">Curated Demo Data</span></p>
      <div class="hotels-grid">
        ${hotels.map(h => `
          <div class="card hotel-card ai-matched-hotel-card">
            <div class="card-img-wrap">
              <img src="${h.image || 'https://placehold.co/400x220/2e7d32/white?text=' + encodeURIComponent(h.name)}"
                   alt="${escapeHtml(h.name)}"
                   loading="lazy"
                   onerror="this.src='https://placehold.co/400x220/2e7d32/white?text=Hotel'">
              <span class="card-badge ai-match-badge">✨ AI Pick • ${escapeHtml(h.type)}</span>
            </div>
            <div class="card-body">
              <h3 class="card-title">${escapeHtml(h.name)}</h3>
              <p class="card-subtitle">📍 ${escapeHtml(h.city)}, ${escapeHtml(h.state)}</p>
              <div class="hotel-price-row">
                <span class="hotel-price">₹${h.pricePerNight.toLocaleString()}<small>/night</small></span>
                <span class="rating">★ ${h.rating.toFixed(1)}</span>
              </div>
              <p class="card-desc">${escapeHtml(h.description || '')}</p>
              <div class="amenities-row">${renderAmenities(h.amenities || [])}</div>
              <div class="card-actions">
                <a href="${mapsLink(h.name + ', ' + h.city)}" target="_blank" class="btn btn-outline btn-sm">📍 Map</a>
                <span class="demo-label">⭐ Curated Data</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : `
      <div class="empty-state" style="margin-top:1.5rem">
        <div class="empty-icon">🏨</div>
        <p>No stays in ${escapeHtml(city)} met the criteria under ₹${budget}. Try increasing the budget or adjusting preferences.</p>
      </div>
    `}
  `;
}

function renderHotelCards(hotels) {
  const container = document.getElementById('hotel-results');
  if (!container) return;

  container.innerHTML = `
    <p class="results-count">Found ${hotels.length} stay(s) — <span class="demo-label">Curated Demo Data</span></p>
    <div class="hotels-grid">
      ${hotels.map(h => `
        <div class="card hotel-card">
          <div class="card-img-wrap">
            <img src="${h.image || 'https://placehold.co/400x220/2e7d32/white?text=' + encodeURIComponent(h.name)}"
                 alt="${escapeHtml(h.name)}"
                 loading="lazy"
                 onerror="this.src='https://placehold.co/400x220/2e7d32/white?text=Hotel'">
            <span class="card-badge">${escapeHtml(h.type)}</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">${escapeHtml(h.name)}</h3>
            <p class="card-subtitle">📍 ${escapeHtml(h.city)}, ${escapeHtml(h.state)}</p>
            <div class="hotel-price-row">
              <span class="hotel-price">₹${h.pricePerNight.toLocaleString()}<small>/night</small></span>
              <span class="rating">★ ${h.rating.toFixed(1)}</span>
            </div>
            <p class="card-desc">${escapeHtml(h.description || '')}</p>
            <div class="amenities-row">${renderAmenities(h.amenities || [])}</div>
            <div class="card-actions">
              <a href="${mapsLink(h.name + ', ' + h.city)}" target="_blank" class="btn btn-outline btn-sm">📍 Map</a>
              <span class="demo-label">⭐ Demo Data</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────
async function handleLogin(e) {
  e.preventDefault();
  const btn      = e.target.querySelector('[type=submit]');
  const email    = document.getElementById('login-email')?.value.trim();
  const password = document.getElementById('login-password')?.value;
  const errEl    = document.getElementById('login-error');

  if (errEl) errEl.textContent = '';
  if (btn) { btn.disabled = true; btn.textContent = 'Signing in...'; }

  const { ok, data } = await Auth.login({ email, password });

  if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; }

  if (!ok) {
    if (errEl) errEl.textContent = data.message || 'Login failed.';
    return;
  }
  showToast(`Welcome back, ${data.user.name.split(' ')[0]}! 🎉`, 'success');
  showSection('home');
}

async function handleRegister(e) {
  e.preventDefault();
  const btn    = e.target.querySelector('[type=submit]');
  const name   = document.getElementById('reg-name')?.value.trim();
  const email  = document.getElementById('reg-email')?.value.trim();
  const pass   = document.getElementById('reg-password')?.value;
  const type   = document.getElementById('reg-traveller')?.value;
  const errEl  = document.getElementById('register-error');

  if (errEl) errEl.textContent = '';
  if (btn) { btn.disabled = true; btn.textContent = 'Creating account...'; }

  const { ok, data } = await Auth.register({ name, email, password: pass, travellerType: type });

  if (btn) { btn.disabled = false; btn.textContent = 'Create Account'; }

  if (!ok) {
    if (errEl) errEl.textContent = data.message || 'Registration failed.';
    return;
  }
  showToast(`Welcome to Camp With Us, ${data.user.name.split(' ')[0]}! 🎉`, 'success');
  showSection('home');
}

// ─────────────────────────────────────────────────────────────────────────────
// SAFETY
// ─────────────────────────────────────────────────────────────────────────────
async function loadSafetyNumbers() {
  setLoading('safety-numbers', 'Loading emergency information...');
  const { ok, data } = await API.safety.getNumbers();

  if (!ok) {
    setError('safety-numbers', 'Failed to load safety information.');
    return;
  }

  const container = document.getElementById('safety-numbers');
  container.innerHTML = `
    <div class="safety-note">${escapeHtml(data.note || '')}</div>
    <div class="emergency-grid">
      ${data.emergency.map(e => `
        <div class="emergency-card">
          <div class="emergency-icon">${e.icon}</div>
          <h3>${escapeHtml(e.service)}</h3>
          <a href="tel:${escapeHtml(e.number)}" class="emergency-number">${escapeHtml(e.number)}</a>
          <p>${escapeHtml(e.description)}</p>
        </div>
      `).join('')}
    </div>

    <div class="safety-tips-section">
      <h3>🛡️ Safety Tips for Travellers</h3>
      <ul class="tips-list">
        ${data.safetyTips.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
      </ul>
    </div>

    <div class="location-share-section">
      <h3>📍 Share Your Location</h3>
      <p>Share your current GPS location with emergency contacts.</p>
      <button class="btn btn-danger" onclick="shareLocation()">📍 Get My Location</button>
      <div id="location-result" class="mt-1"></div>
    </div>
  `;
}

function shareLocation() {
  const result = document.getElementById('location-result');
  if (!navigator.geolocation) {
    if (result) result.innerHTML = `<p class="error-msg">Geolocation is not supported by your browser.</p>`;
    return;
  }
  if (result) result.innerHTML = `<p>📡 Getting your location...</p>`;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      if (result) result.innerHTML = `
        <div class="location-result">
          <p>✅ Location found: <strong>${latitude.toFixed(5)}, ${longitude.toFixed(5)}</strong></p>
          <a href="${mapsUrl}" target="_blank" class="btn btn-outline btn-sm">📍 View on Google Maps</a>
          <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${mapsUrl}').then(() => showToast('Location link copied!', 'success'))">📋 Copy Link</button>
        </div>
      `;
    },
    (err) => {
      let msg = 'Location access denied.';
      if (err.code === 1) msg = 'Location permission denied. Please allow location access in your browser settings.';
      else if (err.code === 2) msg = 'Location unavailable. Please try again.';
      if (result) result.innerHTML = `<p class="error-msg">${msg}</p>`;
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL BUSINESSES
// ─────────────────────────────────────────────────────────────────────────────
async function loadBusinesses(city = '', category = '') {
  setSkeletonLoading('businesses-grid', 4, 'business');
  const { ok, data } = await API.businesses.getAll(city, category);

  if (!ok) {
    setError('businesses-grid', data.message || 'Failed to load businesses.');
    return;
  }
  if (!data.businesses.length) {
    setEmpty('businesses-grid', 'No businesses found.', '🏪');
    return;
  }

  const container = document.getElementById('businesses-grid');
  container.innerHTML = data.businesses.map(b => `
    <div class="card business-card">
      <div class="card-img-wrap">
        <img src="${b.image || 'https://placehold.co/400x200/2e7d32/white?text=' + encodeURIComponent(b.name)}"
             alt="${escapeHtml(b.name)}"
             loading="lazy"
             onerror="this.src='https://placehold.co/400x200/2e7d32/white?text=Business'">
        <span class="card-badge">${escapeHtml(b.category)}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(b.name)}</h3>
        <p class="card-subtitle">📍 ${escapeHtml(b.city)}, ${escapeHtml(b.state)}</p>
        <p class="card-desc">${escapeHtml(b.description || '')}</p>
        ${b.products && b.products.length ? `
          <div class="products-list">
            ${b.products.slice(0, 3).map(p => `<span class="amenity-badge">${escapeHtml(p)}</span>`).join('')}
          </div>` : ''}
        <div class="card-meta">
          <span class="rating">★ ${(b.rating || 4).toFixed(1)}</span>
          ${b.contactPhone ? `<a href="tel:${escapeHtml(b.contactPhone)}" class="contact-link">📞 Call</a>` : ''}
        </div>
        <a href="${mapsLink(b.name + ', ' + b.city)}" target="_blank" class="btn btn-outline btn-sm mt-1">📍 View on Map</a>
      </div>
    </div>
  `).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────────────────────────────────────
let reviewTargetId = null;
let reviewTargetType = null;

async function loadReviewsForDestination(id) {
  reviewTargetId   = id;
  reviewTargetType = 'destination';
  const container  = document.getElementById('reviews-list');
  if (!container) return;

  setLoading('reviews-list', 'Loading reviews...');
  const { ok, data } = await API.reviews.getForDestination(id);

  if (!ok) { setError('reviews-list', 'Failed to load reviews.'); return; }
  if (!data.reviews.length) { setEmpty('reviews-list', 'No reviews yet. Be the first!', '⭐'); return; }

  container.innerHTML = data.reviews.map(r => `
    <div class="review-card">
      <div class="review-header">
        <strong>${escapeHtml(r.userName || (r.user && r.user.name) || 'Traveller')}</strong>
        <span class="review-rating">${renderStars(r.rating)}</span>
        <span class="review-date">${new Date(r.createdAt).toLocaleDateString()}</span>
      </div>
      ${r.title ? `<h4 class="review-title">${escapeHtml(r.title)}</h4>` : ''}
      <p class="review-comment">${escapeHtml(r.comment)}</p>
    </div>
  `).join('');
}

async function handleReviewSubmit(e) {
  e.preventDefault();
  if (!Auth.isLoggedIn()) {
    showToast('Please sign in to submit a review.', 'warning');
    showSection('auth');
    return;
  }
  const rating  = parseInt(document.getElementById('review-rating')?.value);
  const title   = document.getElementById('review-title')?.value.trim();
  const comment = document.getElementById('review-comment')?.value.trim();
  const errEl   = document.getElementById('review-error');
  if (errEl) errEl.textContent = '';

  if (!rating || rating < 1) { if (errEl) errEl.textContent = 'Please select a rating.'; return; }
  if (!comment || comment.length < 10) { if (errEl) errEl.textContent = 'Review must be at least 10 characters.'; return; }

  const body = { rating, title, comment };
  if (reviewTargetType === 'destination') body.destinationId = reviewTargetId;
  else                                    body.hotelId       = reviewTargetId;

  const { ok, data } = await API.reviews.submit(body);
  if (!ok) {
    if (errEl) errEl.textContent = data.message || 'Failed to submit review.';
    return;
  }
  showToast('Review submitted successfully!', 'success');
  e.target.reset();
  if (reviewTargetId && reviewTargetType === 'destination') loadReviewsForDestination(reviewTargetId);
}

// ─────────────────────────────────────────────────────────────────────────────
// AI ASSISTANT CHAT
// ─────────────────────────────────────────────────────────────────────────────
const LANG_BADGES = {
  English: '🇬🇧 English',
  Hindi: '🇮🇳 हिंदी (Hindi)',
  Telugu: 'తెలుగు (Telugu)',
  Tamil: 'தமிழ் (Tamil)',
  Kannada: 'ಕನ್ನಡ (Kannada)'
};

async function handleAssistantChatSubmit(e) {
  if (e) e.preventDefault();
  const inputEl         = document.getElementById('assistant-input') || document.getElementById('assistant-question');
  const langEl          = document.getElementById('assistant-language');
  const destEl          = document.getElementById('assistant-destination');
  const chatMessages    = document.getElementById('assistant-chat-messages');
  const typingIndicator = document.getElementById('assistant-typing-indicator');
  const sendBtn         = document.getElementById('assistant-send-btn') || e?.target?.querySelector('[type=submit]');

  const question    = inputEl?.value.trim();
  const language    = langEl?.value || 'English';
  const destination = destEl?.value.trim() || '';

  if (!question) {
    showToast('Please type your travel question.', 'warning');
    inputEl?.focus();
    return;
  }

  // Clear input field immediately
  if (inputEl) inputEl.value = '';

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Append User Message Bubble
  if (chatMessages) {
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble-wrap user-wrap';
    userBubble.innerHTML = `
      <div class="chat-bubble user-bubble">
        <div class="bubble-meta">
          <span class="bubble-sender">You</span>
          ${destination ? `<span class="assistant-lang-badge">📍 ${escapeHtml(destination)}</span>` : ''}
        </div>
        <div class="bubble-content">${escapeHtml(question).replace(/\n/g, '<br>')}</div>
        <span class="bubble-time">${currentTime}</span>
      </div>
      <div class="chat-bubble-avatar user-avatar">👤</div>
    `;
    chatMessages.appendChild(userBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 2. Show Typing Indicator
  if (typingIndicator) typingIndicator.classList.remove('hidden');
  if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
  if (sendBtn) sendBtn.disabled = true;

  // 3. Call AI Assistant endpoint
  const { ok, data } = await API.ai.assistant({ question, language, destination });

  if (typingIndicator) typingIndicator.classList.add('hidden');
  if (sendBtn) sendBtn.disabled = false;

  const badgeLabel = LANG_BADGES[data?.language || language] || escapeHtml(data?.language || language);
  const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 4. Append Bot Response Bubble
  if (chatMessages) {
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble-wrap bot-wrap';

    if (!ok) {
      botBubble.innerHTML = `
        <div class="chat-bubble-avatar">🤖</div>
        <div class="chat-bubble bot-bubble error-bubble">
          <div class="bubble-meta">
            <span class="bubble-sender">AI Assistant</span>
            <span class="assistant-lang-badge error-badge">⚠️ Notice</span>
          </div>
          <div class="bubble-content">${escapeHtml(data?.message || 'The AI assistant is temporarily unavailable. Please try again.')}</div>
          <span class="bubble-time">${responseTime}</span>
        </div>
      `;
    } else {
      botBubble.innerHTML = `
        <div class="chat-bubble-avatar">🤖</div>
        <div class="chat-bubble bot-bubble">
          <div class="bubble-meta">
            <span class="bubble-sender">AI Assistant</span>
            <span class="assistant-lang-badge">${badgeLabel}</span>
          </div>
          <div class="bubble-content">${escapeHtml(data.answer).replace(/\n/g, '<br>')}</div>
          <span class="bubble-time">${responseTime}</span>
        </div>
      `;
    }

    chatMessages.appendChild(botBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE PLANNER
// ─────────────────────────────────────────────────────────────────────────────
function handleRoutePlanner() {
  const from  = document.getElementById('route-from')?.value.trim();
  const to    = document.getElementById('route-to')?.value.trim();
  const stops = document.getElementById('route-stops')?.value.trim();
  const resultEl = document.getElementById('route-result');

  if (!from || !to) { showToast('Please enter start and destination.', 'warning'); return; }

  let query = from + ' to ' + to;
  if (stops) query += ' via ' + stops;

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}${stops ? '&waypoints=' + encodeURIComponent(stops) : ''}`;

  if (resultEl) resultEl.innerHTML = `
    <div class="route-result">
      <p>✅ Route planned: <strong>${escapeHtml(from)}</strong> → <strong>${escapeHtml(to)}</strong>${stops ? ` via ${escapeHtml(stops)}` : ''}</p>
      <a href="${mapsUrl}" target="_blank" class="btn btn-primary">🗺️ Open in Google Maps</a>
      <p class="route-note">Route guidance is provided via Google Maps. Actual travel times depend on traffic and mode of transport.</p>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAP SEARCH
// ─────────────────────────────────────────────────────────────────────────────
function handleMapSearch() {
  const q = document.getElementById('map-search-input')?.value.trim();
  const type = document.getElementById('map-type')?.value || '';
  const resultEl = document.getElementById('map-result');

  if (!q) { showToast('Please enter a location.', 'warning'); return; }

  const searchQuery = type ? `${type} near ${q}, India` : `${q}, India`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;

  if (resultEl) resultEl.innerHTML = `
    <div class="map-result">
      <p>Searching for <strong>${escapeHtml(searchQuery)}</strong></p>
      <a href="${mapsUrl}" target="_blank" class="btn btn-primary">🗺️ Open in Google Maps</a>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUSINESSES FILTER — handled in main DOMContentLoaded above
// ─────────────────────────────────────────────────────────────────────────────
