// ─── Auth State Management ────────────────────────────────────────────────────
const Auth = (() => {
  const TOKEN_KEY = 'cwu_token';
  const USER_KEY  = 'cwu_user';

  function getToken() { return localStorage.getItem(TOKEN_KEY); }
  function getUser()  {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); }
    catch { return null; }
  }
  function isLoggedIn() { return !!getToken(); }

  function setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    updateNavUI();
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    updateNavUI();
  }

  function authHeaders() {
    const token = getToken();
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  }

  // ── Nav UI ──────────────────────────────────────────────────────────────────
  function updateNavUI() {
    const user = getUser();
    const navAuth    = document.getElementById('nav-auth');
    const navUser    = document.getElementById('nav-user');
    const navName    = document.getElementById('nav-user-name');

    if (!navAuth) return;

    if (user && getToken()) {
      navAuth.classList.add('hidden');
      if (navUser) navUser.classList.remove('hidden');
      if (navName) navName.textContent = user.name.split(' ')[0];
    } else {
      navAuth.classList.remove('hidden');
      if (navUser) navUser.classList.add('hidden');
    }
  }

  // ── Register ────────────────────────────────────────────────────────────────
  async function register({ name, email, password, travellerType }) {
    const res = await fetch(`${CONFIG.API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, travellerType })
    });
    const data = await res.json();
    if (data.success) setSession(data.token, data.user);
    return { ok: res.ok, data };
  }

  // ── Login ───────────────────────────────────────────────────────────────────
  async function login({ email, password }) {
    const res = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) setSession(data.token, data.user);
    return { ok: res.ok, data };
  }

  // ── Logout ──────────────────────────────────────────────────────────────────
  function logout() {
    clearSession();
    // Stay on page, just update UI
    showSection('home');
    showToast('Logged out successfully.', 'success');
  }

  return { getToken, getUser, isLoggedIn, authHeaders, updateNavUI, register, login, logout };
})();
