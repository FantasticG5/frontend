// src/components/http.js

const IDENTITY = import.meta.env.VITE_IDENTITY_URL;
const BOOKING  = import.meta.env.VITE_BOOKING_URL;
const EVENT    = import.meta.env.VITE_EVENT_URL;

export const endpoints = { IDENTITY, BOOKING, EVENT };

// --- HTTP helpers ---

export async function apiGet(url) {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include"
  });
  if (!res.ok) {
    throw new Error(`GET ${url} → ${res.status}`);
  }
  return res.json();
}

export async function apiWrite(url, method, body) {
  const headers = { "Content-Type": "application/json" };

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

  try {
    return await res.json();
  } catch {
    return {};
  }
}
