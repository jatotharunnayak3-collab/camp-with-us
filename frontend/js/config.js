// ─────────────────────────────────────────────────────────────────────────────
//  Camp With Us — Centralized API Configuration
//  ALL frontend API calls must use API_BASE_URL from this file.
//  NEVER hardcode http://localhost:5000 anywhere else.
// ─────────────────────────────────────────────────────────────────────────────

// Local dev  → localhost:5000
// Production → Render backend
const _isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const CONFIG = {
  API_BASE_URL: _isLocal
    ? 'http://localhost:5000/api'
    : 'https://camp-with-us-vl6w.onrender.com/api',
  APP_NAME: 'Camp With Us',
  TAGLINE: 'Travel Smart • Travel Safe'
};

// Prevent accidental mutation
Object.freeze(CONFIG);
