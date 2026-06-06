const API_URL = import.meta.env.VITE_API_URL;

export function getApiUrl() {
  return API_URL;
}

export async function apiFetch(path, { token, method = "GET", body } = {}) {
  if (!API_URL) throw new Error("Missing VITE_API_URL in client env.");
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data;
}

