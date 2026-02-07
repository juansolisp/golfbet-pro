const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/api/v1${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `API Error: ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  auth: {
    register: (data: { email: string; name: string; password: string; handicap?: number }) =>
      fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    refresh: (refreshToken: string) =>
      fetchApi('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
    me: (token: string) => fetchApi('/auth/me', { token }),
  },

  // Users
  users: {
    profile: (token: string) => fetchApi('/users/profile', { token }),
    updateProfile: (token: string, data: any) =>
      fetchApi('/users/profile', { method: 'PUT', body: JSON.stringify(data), token }),
    stats: (token: string) => fetchApi('/users/stats', { token }),
  },

  // Groups
  groups: {
    list: (token: string) => fetchApi('/groups', { token }),
    create: (token: string, data: { name: string; description?: string }) =>
      fetchApi('/groups', { method: 'POST', body: JSON.stringify(data), token }),
    get: (token: string, id: string) => fetchApi(`/groups/${id}`, { token }),
    join: (token: string, inviteCode: string) =>
      fetchApi('/groups/join', { method: 'POST', body: JSON.stringify({ inviteCode }), token }),
    leave: (token: string, id: string) =>
      fetchApi(`/groups/${id}/leave`, { method: 'DELETE', token }),
  },

  // Courses
  courses: {
    list: (token: string, page?: number) => fetchApi(`/courses?page=${page || 1}`, { token }),
    search: (token: string, query: string) => fetchApi(`/courses/search?q=${encodeURIComponent(query)}`, { token }),
    get: (token: string, id: string) => fetchApi(`/courses/${id}`, { token }),
  },

  // Rounds
  rounds: {
    list: (token: string, page?: number) => fetchApi(`/rounds?page=${page || 1}`, { token }),
    create: (token: string, data: any) =>
      fetchApi('/rounds', { method: 'POST', body: JSON.stringify(data), token }),
    get: (token: string, id: string) => fetchApi(`/rounds/${id}`, { token }),
    start: (token: string, id: string) =>
      fetchApi(`/rounds/${id}/start`, { method: 'POST', token }),
    complete: (token: string, id: string) =>
      fetchApi(`/rounds/${id}/complete`, { method: 'POST', token }),
    leaderboard: (token: string, id: string) => fetchApi(`/rounds/${id}/leaderboard`, { token }),
  },

  // Scores
  scores: {
    submit: (token: string, data: any) =>
      fetchApi('/scores', { method: 'POST', body: JSON.stringify(data), token }),
    sync: (token: string, data: any) =>
      fetchApi('/scores/sync', { method: 'POST', body: JSON.stringify(data), token }),
    scorecard: (token: string, roundId: string) => fetchApi(`/scores/round/${roundId}`, { token }),
  },

  // Bets
  bets: {
    forRound: (token: string, roundId: string) => fetchApi(`/bets/round/${roundId}`, { token }),
    state: (token: string, betId: string) => fetchApi(`/bets/${betId}/state`, { token }),
    press: (token: string, betId: string, startHole: number) =>
      fetchApi(`/bets/${betId}/press`, { method: 'POST', body: JSON.stringify({ startHole }), token }),
  },

  // Settlements
  settlements: {
    forRound: (token: string, roundId: string) => fetchApi(`/settlements/round/${roundId}`, { token }),
    confirm: (token: string, id: string) =>
      fetchApi(`/settlements/${id}/confirm`, { method: 'POST', token }),
    balance: (token: string) => fetchApi('/settlements/balance', { token }),
  },
};
