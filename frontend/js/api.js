// ─── Centralized API Service ──────────────────────────────────────────────────
//  All fetch calls go through here.
//  Handles errors consistently — never swallows failures silently.
// ─────────────────────────────────────────────────────────────────────────────
const API = (() => {
  async function request(path, options = {}) {
    const isRetry = options._isRetry || false;
    const url = `${CONFIG.API_BASE_URL}${path}`;
    const timeoutMs = options.timeout || 35000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const opts = {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      signal: controller.signal,
      ...options
    };
    delete opts._isRetry;
    delete opts.timeout;

    try {
      const res = await fetch(url, opts);
      clearTimeout(timeoutId);
      let data;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = { success: false, message: 'Non-JSON response from server.' };
      }

      // Automatically retry once after 3 seconds on 503 or 504
      if (!res.ok && (res.status === 503 || res.status === 504) && !isRetry && data?.errorType !== 'AI_NOT_CONFIGURED') {
        if (typeof showToast === 'function') {
          showToast('Retrying...', 'warning', 3000);
        }
        await new Promise(r => setTimeout(r, 3000));
        return request(path, { ...options, _isRetry: true });
      }

      return { ok: res.ok, status: res.status, data };
    } catch (err) {
      clearTimeout(timeoutId);
      const isTimeout = err.name === 'AbortError';

      // Automatically retry once after 3 seconds on timeout
      if (isTimeout && !isRetry) {
        if (typeof showToast === 'function') {
          showToast('Retrying...', 'warning', 3000);
        }
        await new Promise(r => setTimeout(r, 3000));
        return request(path, { ...options, _isRetry: true });
      }

      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        return { ok: false, status: 0, data: { success: false, message: 'Unable to connect to the tourism server. Please ensure the backend is running.', errorType: 'NETWORK_ERROR' } };
      }
      if (isTimeout) {
        return { ok: false, status: 504, data: { success: false, message: 'Request timed out. Please try again.', errorType: 'TIMEOUT' } };
      }
      return { ok: false, status: 0, data: { success: false, message: err.message, errorType: 'CLIENT_ERROR' } };
    }
  }

  function get(path, headers = {}) {
    return request(path, { method: 'GET', headers });
  }

  function post(path, body, headers = {}) {
    return request(path, { method: 'POST', body: JSON.stringify(body), headers });
  }

  // ── Destinations ─────────────────────────────────────────────────────────────
  const destinations = {
    getAll:  (params = '') => get(`/destinations${params}`),
    search:  (q)           => get(`/destinations/search?q=${encodeURIComponent(q)}`),
    getById: (id)          => get(`/destinations/${id}`)
  };

  // ── Hotels ────────────────────────────────────────────────────────────────────
  const hotels = {
    search: (city, budget, type = '', amenities = '') => {
      let qs = `/hotels/search?city=${encodeURIComponent(city)}`;
      if (budget) qs += `&budget=${budget}`;
      if (type)   qs += `&type=${encodeURIComponent(type)}`;
      if (amenities) qs += `&amenities=${encodeURIComponent(amenities)}`;
      return get(qs);
    },
    getAll:  (city = '') => get(`/hotels${city ? '?city=' + encodeURIComponent(city) : ''}`),
    getById: (id)        => get(`/hotels/${id}`)
  };

  // ── Planner ───────────────────────────────────────────────────────────────────
  const planner = {
    generate: (body) => request('/planner', { method: 'POST', body: JSON.stringify(body), headers: Auth.authHeaders(), timeout: 120000 })
  };

  // ── AI ────────────────────────────────────────────────────────────────────────
  const ai = {
    hotelRecommendations: (body) => request('/ai/hotel-recommendations', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, timeout: 120000 }),
    assistant: (body)            => request('/ai/assistant', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, timeout: 120000 })
  };

  // ── Reviews ───────────────────────────────────────────────────────────────────
  const reviews = {
    getForDestination: (id) => get(`/reviews?destination=${id}`),
    getForHotel:       (id) => get(`/reviews?hotel=${id}`),
    submit: (body)          => post('/reviews', body, Auth.authHeaders())
  };

  // ── Businesses ────────────────────────────────────────────────────────────────
  const businesses = {
    getAll:     (city = '', cat = '') => {
      const qs = [city && `city=${encodeURIComponent(city)}`, cat && `category=${encodeURIComponent(cat)}`].filter(Boolean).join('&');
      return get(`/businesses${qs ? '?' + qs : ''}`);
    }
  };

  // ── Safety ────────────────────────────────────────────────────────────────────
  const safety = {
    getNumbers: () => get('/safety/numbers')
  };

  // ── Health ────────────────────────────────────────────────────────────────────
  const health = {
    test: () => get('/test')
  };

  return { destinations, hotels, planner, ai, reviews, businesses, safety, health };
})();
