const IDENTITY = import.meta.env.VITE_IDENTITY_URL;
const BOOKING  = import.meta.env.VITE_BOOKING_URL;
const EVENT    = import.meta.env.VITE_EVENT_URL;

export async function apiGet(url) {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.json();
}

export async function apiWrite(url, method, body) {
  const res = await fetch(url, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${url} → ${res.status}`);
  try { return await res.json(); } catch { return {}; }
}

export const endpoints = { IDENTITY, BOOKING, EVENT };
