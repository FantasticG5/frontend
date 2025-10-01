// src/components/http.js

// ---------- Bas-URL:er ----------
// .env ska INTE ha "/api" på slutet
// VITE_IDENTITY_URL=https://authsystem.orangegrass-89d57cf8.swedencentral.azurecontainerapps.io
// VITE_BOOKING_URL=https://bookingsystem.orangegrass-89d57cf8.swedencentral.azurecontainerapps.io
// VITE_EVENT_URL=https://eventsystem.orangegrass-89d57cf8.swedencentral.azurecontainerapps.io

function withApi(base) {
  const b = (base || "").replace(/\/+$/, "");
  return `${b}/api`;
}

const IDENTITY_API = withApi(import.meta.env.VITE_IDENTITY_URL);
const BOOKING_API  = withApi(import.meta.env.VITE_BOOKING_URL);
const EVENT_API    = withApi(import.meta.env.VITE_EVENT_URL);

export const endpoints = {
  IDENTITY: IDENTITY_API,
  BOOKING : BOOKING_API,
  EVENT   : EVENT_API
};

// ---------- Token store keys ----------
const ACCESS_KEY  = "auth.accessToken";
const REFRESH_KEY = "auth.refreshToken";

// Läs ALLTID från storage (ingen modul-cache)
export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_KEY) || localStorage.getItem(ACCESS_KEY) || null;
}
export function getRefreshToken() {
  return sessionStorage.getItem(REFRESH_KEY) || localStorage.getItem(REFRESH_KEY) || null;
}

export function saveTokens(at, rt, remember = false) {
  // rensa båda först
  [sessionStorage, localStorage].forEach(s => {
    s.removeItem(ACCESS_KEY);
    s.removeItem(REFRESH_KEY);
  });

  const store = remember ? localStorage : sessionStorage;
  if (at) store.setItem(ACCESS_KEY, at);
  if (rt) store.setItem(REFRESH_KEY, rt);
}

export function clearTokens() {
  [sessionStorage, localStorage].forEach(s => {
    s.removeItem(ACCESS_KEY);
    s.removeItem(REFRESH_KEY);
  });
}

// ---------- Auth helpers ----------
export async function login(email, password, remember = false) {
  // OBS: endpoints.IDENTITY slutar redan med /api
  const res = await fetch(`${endpoints.IDENTITY}/auth/login`, {
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
  const payload = data?.data ?? data;
  saveTokens(payload.accessToken, payload.refreshToken, remember);
  return payload;
}

export function logout() {
  clearTokens(); // JWT: stateless
}

let refreshInFlight = null;
async function refreshOnce() {
  const rt = getRefreshToken();
  if (!rt) throw new Error("No refresh token");

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const res = await fetch(`${endpoints.IDENTITY}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({ refreshToken: rt })
      });
      if (!res.ok) {
        const msg = await safeText(res);
        throw new Error(`Refresh failed: ${res.status} ${msg}`);
      }
      const data = await res.json();
      const payload = data?.data ?? data;
      const remembered = !!localStorage.getItem(REFRESH_KEY);
      saveTokens(payload.accessToken, payload.refreshToken, remembered);
      return payload;
    })().finally(() => { refreshInFlight = null; });
  }
  return refreshInFlight;
}

// ---------- Generic fetch helpers ----------
async function fetchJson(url, { method = "GET", headers, body } = {}, retryOn401 = true) {
  const h = new Headers(headers || {});
  const at = getAccessToken(); // <-- läs färsk token
  if (at && !h.has("Authorization")) h.set("Authorization", `Bearer ${at}`);
  if (body != null && !h.has("Content-Type")) h.set("Content-Type", "application/json");

  const init = {
    method,
    headers: h,
    body: body != null ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
    credentials: "omit", // inga cookies
    mode: "cors"
  };

  let res = await fetch(url, init);

  if (res.status === 401 && retryOn401 && getRefreshToken()) {
    try {
      await refreshOnce();
      const at2 = getAccessToken();
      if (at2) h.set("Authorization", `Bearer ${at2}`);
      res = await fetch(url, { ...init, headers: h });
    } catch {
      clearTokens();
    }
  }

  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(`${method} ${url} → ${res.status} ${msg}`);
  }

  try { return await res.json(); } catch { return {}; }
}

async function safeText(res) {
  try { return await res.text(); } catch { return res.statusText; }
}

export function apiGet(url) {
  return fetchJson(url, { method: "GET" });
}
export function apiWrite(url, method, body) {
  return fetchJson(url, { method, body });
}
