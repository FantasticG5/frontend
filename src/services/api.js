const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5187";

export async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg =
      (data && (data.error || data.detail || data.title || data.message)) ||
      `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  return data; // kan vara null vid 204/empty
}
