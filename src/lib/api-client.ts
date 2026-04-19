import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Critical for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
