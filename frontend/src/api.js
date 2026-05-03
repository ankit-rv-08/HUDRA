import axios from 'axios';

const API = axios.create({
  baseURL: 'https://cuddly-happiness-7vpx69pgv4wg2pgvw-8000.app.github.dev',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh');
      if (refresh) {
        try {
          const { data } = await axios.post(
            'https://cuddly-happiness-7vpx69pgv4wg2pgvw-8000.app.github.dev/auth/token/refresh/',
            { refresh }
          );
          localStorage.setItem('access', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return API(original);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

export default API;
