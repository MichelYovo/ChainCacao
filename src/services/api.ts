import { Stats, Lot, User } from '../types';

const API_URL = '/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

const handleResponse = async (res: Response) => {
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `API Error: ${res.status}`);
    }
    return data;
  }
  
  if (!res.ok) {
    const text = await res.text();
    console.error('Non-JSON Error Response:', text);
    throw new Error(`Server Error: ${res.status} ${res.statusText}`);
  }
  
  return res.text();
};

export const api = {
  login: async (credentials: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(res);
  },

  getUsers: async (): Promise<any[]> => {
    const res = await fetch(`${API_URL}/admin/users`, { headers: getHeaders() });
    return handleResponse(res);
  },

  createUser: async (userData: any): Promise<any> => {
    const res = await fetch(`${API_URL}/admin/users/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  getMe: async (): Promise<User> => {
    const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
    return handleResponse(res);
  },

  getAllLots: async (): Promise<Lot[]> => {
    const res = await fetch(`${API_URL}/cacao/all`, { headers: getHeaders() });
    return handleResponse(res);
  },

  traceLot: async (id: string): Promise<Lot> => {
    const res = await fetch(`${API_URL}/cacao/trace/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  addLot: async (data: any): Promise<Lot> => {
    const res = await fetch(`${API_URL}/cacao/add`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  transitionLot: async (id: string, data: any): Promise<Lot> => {
    const res = await fetch(`${API_URL}/cacao/transition/${id}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  getNotifications: async (): Promise<any[]> => {
    const res = await fetch(`${API_URL}/notifications`, { headers: getHeaders() });
    return handleResponse(res);
  },

  markNotificationsRead: async () => {
    const res = await fetch(`${API_URL}/notifications/read`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getStats: async (): Promise<Stats> => {
    const res = await fetch(`${API_URL}/cacao/stats`, { headers: getHeaders() });
    return handleResponse(res);
  }
};
