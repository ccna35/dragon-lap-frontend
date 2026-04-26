import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Critical for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Silent Refresh Interceptor ──────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (token expired)
    // We also check !originalRequest._retry to avoid infinite loops
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      // Skip refresh/redirect for guest endpoints or if already on a public path
      const isGuestEndpoint = originalRequest.url?.includes('/guest');
      
      if (isGuestEndpoint) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, wait for it to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        isRefreshing = false;
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);

        // Only redirect if we're on the client side and NOT on a public path
        if (typeof window !== 'undefined') {
          const pathname = window.location.pathname;
          const publicPaths = ['/', '/laptops', '/cart', '/checkout'];
          const isPublicPath = publicPaths.some(path => 
            pathname === path || pathname === `${path}/` || pathname.startsWith(`${path}/`)
          );

          if (!pathname.startsWith('/auth/login') && !isPublicPath) {
            window.location.href = `/auth/login?expired=true&callbackUrl=${encodeURIComponent(pathname + window.location.search)}`;
          }
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
