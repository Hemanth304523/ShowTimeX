import axios from 'axios';

const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (username: string, email: string, password: string, role: string = 'user') =>
    api.post('/auth/signup', { 
      username, 
      email, 
      password, 
      role,
      first_name: username.split(' ')[0] || username,
      last_name: username.split(' ')[1] || ''
    }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

export const moviesAPI = {
  getAll: () => api.get('/movies'),
  getById: (id: number) => api.get(`/movies/${id}`),
  create: (data: any) => api.post('/admin/movies', data),
  update: (id: number, data: any) => api.put(`/admin/movies/${id}`, data),
  delete: (id: number) => api.delete(`/admin/movies/${id}`),
};

export const bookingsAPI = {
  getAll: () => api.get('/user/bookings'),
  create: (movieId: number, numberOfTickets: number) =>
    api.post('/user/bookings', { Movies_id: movieId, tickets_booked: numberOfTickets }),
  getById: (id: number) => api.get(`/user/bookings/${id}`),
};

export default api;
