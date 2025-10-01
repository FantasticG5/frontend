// src/components/http.js
// Bas-URL:er (sätt i .env.development)
// VITE_IDENTITY_URL=https://localhost:7270/api
// VITE_BOOKING_URL=https://localhost:7201/api
// VITE_EVENT_URL=https://localhost:7205/api

const IDENTITY = import.meta.env.VITE_IDENTITY_URL;
const BOOKING  = import.meta.env.VITE_BOOKING_URL;
const EVENT    = import.meta.env.VITE_EVENT_URL;

export const endpoints = { IDENTITY, BOOKING, EVENT };

// ---------------------------------------------------------
// Token store (sessionStorage by default, localStorage vid "remember me")
// ---------------------------------------------------------
const ACCESS_KEY  = "auth.accessToken";
const REFRESH_KEY = "auth.refreshToken";
let accessToken  = sessionStorage.getItem(ACCESS_KEY)  || localStorage.getItem(ACCESS_KEY)  || null;
let refreshToken = sessionStorage.getItem(REFRESH_KEY) || localStorage.getItem(REFRESH_KEY) || null;

function saveTokens(at, rt, remember = false) {
  accessToken  = at ?? null;
  refreshToken = rt ?? null;

  // rensa båda först
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);

  const store = remember ? localStorage : sessionStorage;
  if (accessToken)  store.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) store.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function getAccessToken() { return accessToken; }
export function getRefreshToken() { return refreshToken; }

// ---------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------
/**
 * Logga in mot AuthService och spara tokens.
 * returnerar login-responsen (inkl. expires)
 */
export async function login(email, password, remember = false) {
  const res = await fetch(`${IDENTITY}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "omit",
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(`Login failed: ${res.status} ${msg}`);
  }

  const data = await res.json();
  // förväntat shape:
  // { succeeded: true, data: { accessToken, refreshToken, accessExpiresUtc, refreshExpiresUtc } }
  const payload = data?.data ?? data;
  saveTokens(payload.accessToken, payload.refreshToken, remember);
  return payload;
}

export function logout() {
  clearTokens(); // JWT är stateless – att rensa klientens tokens räcker
}

/**
 * Försök förnya access token med refresh token.
 * Uppdaterar token store eller kastar vid fel.
 */
let refreshInFlight = null;
async function refreshOnce() {
  if (!refreshToken) throw new Error("No refresh token");

  // Debounce parallella 401
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const res = await fetch(`${IDENTITY}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({ refreshToken })
      });

      if (!res.ok) {
        const msg = await safeText(res);
        throw new Error(`Refresh failed: ${res.status} ${msg}`);
      }

      const data = await res.json();
      const payload = data?.data ?? data;
      saveTokens(payload.accessToken, payload.refreshToken, /*remember*/ !!localStorage.getItem(REFRESH_KEY));
      return payload;
    })().finally(() => { refreshInFlight = null; });
  }

  return refreshInFlight;
}

// ---------------------------------------------------------
// Generic fetch helpers (utan credentials)
// ---------------------------------------------------------
async function fetchJson(url, { method = "GET", headers, body } = {}, retryOn401 = true) {
  const h = new Headers(headers || {});
  if (body != null && !h.has("Content-Type")) h.set("Content-Type", "application/json");
  if (accessToken && !h.has("Authorization")) h.set("Authorization", `Bearer ${accessToken}`);

  const init = {
    method,
    headers: h,
    body: body != null ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
    credentials: "omit",   // <-- viktig: inga cookies skickas
    mode: "cors"
  };

  let res = await fetch(url, init);

  if (res.status === 401 && retryOn401 && refreshToken) {
    try {
      await refreshOnce();
      // uppdatera headern med nya accessToken
      h.set("Authorization", `Bearer ${accessToken}`);
      res = await fetch(url, { ...init, headers: h });
    } catch {
      clearTokens();
      // låt 401 bubbla vidare
    }
  }

  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(`${method} ${url} → ${res.status} ${msg}`);
  }

  // Försök tolka JSON, fallback {}
  try { return await res.json(); } catch { return {}; }
}

async function safeText(res) {
  try { return await res.text(); } catch { return res.statusText; }
}

// Publika helpers
export function apiGet(url) {
  return fetchJson(url, { method: "GET" });
}
export function apiWrite(url, method, body) {
  return fetchJson(url, { method, body });
}
