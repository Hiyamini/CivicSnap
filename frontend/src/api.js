// Backend tho matladadaniki okka chota. Token localStorage lo (fail ayithe app inka pani chestundi).
const KEY = 'civic_token';

export const getToken = () => {
  try { return localStorage.getItem(KEY); } catch { return null; }
};
export const setToken = (t) => {
  try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY); } catch { /* ignore */ }
};

async function req(path, { method = 'GET', json, form } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = 'Bearer ' + token;
  let body;
  if (json) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(json);
  } else if (form) {
    body = form; // browser multipart boundary tane pedtundi
  }
  const res = await fetch(path, { method, headers, body });
  if (!res.ok) {
    let msg = res.statusText || 'Request failed';
    try {
      const d = await res.json();
      msg = d.message || d.error || msg;
    } catch { /* body JSON kaadu */ }
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  login: (email, password) => req('/api/auth/login', { method: 'POST', json: { email, password } }),
  register: (name, email, password) => req('/api/auth/register', { method: 'POST', json: { name, email, password } }),
  me: () => req('/api/me'),
  departments: () => req('/api/departments'),
  dashboard: () => req('/api/dashboard'),
  issues: (departmentId, status) => {
    const q = new URLSearchParams();
    if (departmentId) q.set('departmentId', departmentId);
    if (status) q.set('status', status);
    return req('/api/issues?' + q.toString());
  },
  issue: (id) => req('/api/issues/' + id),
  nearby: (departmentId, lat, lng) =>
    req(`/api/issues/nearby?departmentId=${departmentId}&lat=${lat}&lng=${lng}`),
  createIssue: (form) => req('/api/issues', { method: 'POST', form }),
  upvote: (id) => req(`/api/issues/${id}/upvote`, { method: 'POST' }),
  setStatus: (id, status) => req(`/api/issues/${id}/status`, { method: 'PATCH', json: { status } }),
  profile: (id) => req('/api/users/' + id),
  updateProfile: (name, bio) => req('/api/users/me', { method: 'PUT', json: { name, bio } }),
};
