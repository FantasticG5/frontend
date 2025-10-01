// src/components/auth/authProvider.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const ACCESS_KEY  = "auth.accessToken";
const REFRESH_KEY = "auth.refreshToken";

// ✅ Använd VITE_IDENTITY_URL (t.ex. https://localhost:7270)
const IDENTITY_URL = import.meta.env.VITE_IDENTITY_URL;

// Liten helper för att snyggt joina bas + path (undvik //)
function join(base, path) {
  const b = (base || "").replace(/\/+$/, "");
  const p = (path || "").replace(/^\/+/, "");
  return `${b}/${p}`;
}

// Våra auth-endpoints börjar på /api
const AUTH_BASE = join(IDENTITY_URL, "/api");

// ---------- token store ----------
function loadToken(key) {
  return sessionStorage.getItem(key) || localStorage.getItem(key) || null;
}
function saveTokens(accessToken, refreshToken, remember = false) {
  [sessionStorage, localStorage].forEach(s => { s.removeItem(ACCESS_KEY); s.removeItem(REFRESH_KEY); });
  const store = remember ? localStorage : sessionStorage;
  if (accessToken)  store.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) store.setItem(REFRESH_KEY, refreshToken);
}
function clearTokens() {
  [sessionStorage, localStorage].forEach(s => { s.removeItem(ACCESS_KEY); s.removeItem(REFRESH_KEY); });
}

// ---------- fetch helper m. auto-refresh ----------
let refreshPromise = null;

async function tryRefresh() {
  const rt = loadToken(REFRESH_KEY);
  if (!rt) return false;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const res = await fetch(join(AUTH_BASE, "/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({ refreshToken: rt }),
      });
      if (!res.ok) { clearTokens(); return false; }
      const data = await res.json();
      const payload = data?.data ?? data;
      const remembered = !!localStorage.getItem(REFRESH_KEY);
      saveTokens(payload.accessToken, payload.refreshToken, remembered);
      return true;
    })().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

async function authFetch(path, { method = "GET", headers = {}, body, retryOn401 = true } = {}) {
  const h = new Headers(headers);
  const at = loadToken(ACCESS_KEY);
  if (at) h.set("Authorization", `Bearer ${at}`);
  if (body != null && !h.has("Content-Type")) h.set("Content-Type", "application/json");

  const url = join(AUTH_BASE, path);
  let res = await fetch(url, { method, headers: h, body: body ? JSON.stringify(body) : undefined, credentials: "omit", mode: "cors" });

  if (res.status === 401 && retryOn401) {
    const ok = await tryRefresh();
    if (ok) {
      const h2 = new Headers(headers);
      const newAt = loadToken(ACCESS_KEY);
      if (newAt) h2.set("Authorization", `Bearer ${newAt}`);
      if (body != null && !h2.has("Content-Type")) h2.set("Content-Type", "application/json");
      res = await fetch(url, { method, headers: h2, body: body ? JSON.stringify(body) : undefined, credentials: "omit", mode: "cors" });
    }
  }
  return res;
}

// ---------- Provider ----------
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch("/auth/me");
        if (res.ok) setUser(await res.json());
        else setUser(null);
      } catch { setUser(null); }
      finally { setLoading(false); }
    })();
  }, []);

  const login = async (email, password, remember = false) => {
    const res = await fetch(join(AUTH_BASE, "/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "omit",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(`Fel vid inloggning: ${res.status}`);

    const data = await res.json();
    const payload = data?.data ?? data;
    saveTokens(payload.accessToken, payload.refreshToken, remember);

    const meRes = await authFetch("/auth/me", { retryOn401: false });
    setUser(meRes.ok ? await meRes.json() : null);
  };

  const logout = async () => {
    clearTokens(); // JWT: rensa lokalt räcker
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    getAccessToken: () => loadToken(ACCESS_KEY),
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
