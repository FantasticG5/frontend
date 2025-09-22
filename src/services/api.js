const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5142";

export async function post(path, body) {
  console.log("API URL:", BASE_URL + path);
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      (data && (data.detail || data.title || data.message)) ||
      `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
