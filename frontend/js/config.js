// ─────────────────────────────────────────────────────────────────────────────
//  Camp With Us — Centralized API Configuration
//  ALL frontend API calls must use API_BASE_URL from this file.
//  NEVER hardcode http://localhost:5000 anywhere else.
// ─────────────────────────────────────────────────────────────────────────────

// Detect environment:
//  - Local dev  → localhost → use local backend
//  - Production → any other host → use the Railway backend URL
const _isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const CONFIG = {
  // ✅ After deploying backend to Railway, replace the URL below with your
  //    Railway backend URL, e.g: https://campwithus-backend.up.railway.app
  API_BASE_URL: _isLocal
    ? 'http://localhost:5000/api'
    : 'https://camp-with-us-production.up.railway.app/api',
  APP_NAME: 'Camp With Us',
  TAGLINE: 'Travel Smart • Travel Safe'
};

// Prevent accidental mutation
Object.freeze(CONFIG);
