import { useAuthStore } from "~/modules/Auth/authStore";
import { API } from "./generated-api";

export const ApiClient = new API({
  baseURL: import.meta.env.VITE_API_URL,
  secure: true,
  withCredentials: true,
});

ApiClient.instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!isLoggedIn) return;

      try {
        await ApiClient.auth.authControllerRefreshTokens();

        return ApiClient.instance(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
