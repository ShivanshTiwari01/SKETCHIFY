import axios from 'axios';

const HTTP_BASE = process.env.NEXT_PUBLIC_HTTP_URL || 'http://localhost:4001';

const api = axios.create({
  baseURL: `${HTTP_BASE}/api`,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface SignupPayload {
  email: string;
  username: string;
  password: string;
  name: string;
}

export interface SigninPayload {
  email: string;
  password: string;
}

export const signup = async (payload: SignupPayload) => {
  const res = await api.post('/signup', payload);
  return res.data;
};

export const signin = async (payload: SigninPayload) => {
  const res = await api.post('/signin', payload);
  return res.data;
};

export const createRoom = async (name: string) => {
  const res = await api.post('/room', { name });
  return res.data;
};

export const getRoomBySlug = async (slug: string) => {
  const res = await api.get(`/room/${slug}`);
  return res.data;
};

export const getChats = async (roomId: string) => {
  const res = await api.get(`/chat/${roomId}`);
  return res.data;
};

export default api;
