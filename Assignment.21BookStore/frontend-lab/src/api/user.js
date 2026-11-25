const BASE = import.meta.env.VITE_API_URL ?? 'https://jsonplaceholder.typicode.com';

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const fetchUsers = () => request('/users');
export const fetchUser = (id) => request(`/users/${id}`);
export const createUser = (body) => request('/users', { method: 'POST', body: JSON.stringify(body) });