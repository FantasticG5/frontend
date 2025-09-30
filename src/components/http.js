// src/components/http.js
const IDENTITY = import.meta.env.VITE_IDENTITY_URL;
const BOOKING  = import.meta.env.VITE_BOOKING_URL;
const EVENT    = import.meta.env.VITE_EVENT_URL;

export const endpoints = { IDENTITY, BOOKING, EVENT };

// --- XSRF helpers (Booking) ---
let csrfFetched = false;

function readCookie(name) {
  return document.cookie
    .split("; ")
    .find(r => r.startsWith(name + "="))
    ?.split("=")[1];
}

async function ensureXsrfForBooking() {
  if (csrfFetched) return;
  // /csrf sätter XSRF-TOKEN-cookie
  const res = await fetch(`${BOOKING}/csrf`, { credentials: "include" });
  if (!res.ok) throw new Error("Kunde inte hämta CSRF-token");
  csrfFetched = true;
}

// --- HTTP helpers ---
export async function apiGet(url) {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.json();
}

export async function apiWrite(url, method, body) {
  const isWrite = /^(POST|PUT|PATCH|DELETE)$/i.test(method);

  const headers = { "Content-Type": "application/json" };

  // Endast Booking kräver XSRF (skrivande anrop)
  if (isWrite && url.startsWith(BOOKING)) {
    await ensureXsrfForBooking();
    const xsrf = readCookie("XSRF-TOKEN-BOOKING") || "";
    headers["X-XSRF-TOKEN"] = xsrf;
  }

  const res = await fetch(url, {
    method,
    credentials: "include",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`${method} ${url} → ${res.status} ${msg}`);
  }

  try { return await res.json(); } catch { return {}; }
}
