const API_BASE = '/api';

export const authService = {
  getToken: () => localStorage.getItem('udaipur_token') || '',
  setToken: (token) => localStorage.setItem('udaipur_token', token),
  removeToken: () => localStorage.removeItem('udaipur_token'),

  async login(token) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (res.ok && data.session_token) {
      this.setToken(data.session_token);
      return true;
    }
    return false;
  },

  async verify() {
    const token = this.getToken();
    try {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    } catch {}
    this.removeToken();
  }
};

async function fetchWithAuth(url) {
  const token = authService.getToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });
  if (res.status === 401) {
    authService.removeToken();
    window.dispatchEvent(new Event('auth:unauthorized'));
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  return res.json();
}

export const dashboardApi = {
  getOverview: () => fetchWithAuth(`${API_BASE}/dashboard/overview`),
  getHostels: () => fetchWithAuth(`${API_BASE}/hostels`),
  getCategories: () => fetchWithAuth(`${API_BASE}/categories`),
  getPrices: () => fetchWithAuth(`${API_BASE}/prices`),
  getTimeSlots: () => fetchWithAuth(`${API_BASE}/timeslots`),
  getHistory: (filter = 'today', start = null, end = null) => {
    let url = `${API_BASE}/history?filter=${filter}`;
    if (start && end) url += `&start_date=${start}&end_date=${end}`;
    return fetchWithAuth(url);
  },
  getWeeklyAvailability: (startDate = null) => {
    let url = `${API_BASE}/weekly-availability`;
    if (startDate) url += `?start_date=${startDate}`;
    return fetchWithAuth(url);
  },
  getMonthlyAnalysis: (month = null) => {
    let url = `${API_BASE}/monthly-analysis`;
    if (month) url += `?month=${month}`;
    return fetchWithAuth(url);
  },
  getMonthlyCsvUrl: (month = null) => {
    const token = authService.getToken();
    let url = `${API_BASE}/export/monthly-csv`;
    if (month) url += `?month=${month}`;
    return url;
  },
  getSystemStatus: () => fetchWithAuth(`${API_BASE}/system-status`),
};
