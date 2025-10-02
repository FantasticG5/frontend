// src/services/authService.js
const ID_BASE = import.meta.env.VITE_IDENTITY_URL || "https://localhost:7270";

function join(base, path) {
  const b = (base || "").replace(/\/+$/, "");
  const p = (path || "").replace(/^\/+/, "");
  return `${b}/${p}`;
}

const AUTH_API = join(ID_BASE, "/api");

export async function registerUser(userData) {
  const res = await fetch(join(AUTH_API, "/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "omit",                 // ⬅️ inga cookies → inga CORS-credentials
    body: JSON.stringify(userData),
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg =
      (data && (data.detail || data.title || data.message || data.error)) ||
      `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
