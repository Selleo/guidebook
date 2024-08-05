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
    const originalRequest = error.config;
    const isLoggedIn = useAuthStore.getState().isLoggedIn;

    if (!isLoggedIn) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await ApiClient.auth.authControllerRefreshTokens();
        if (!originalRequest.url.includes("/login")) {
          return ApiClient.instance(originalRequest);
        }
      } catch (error) {
        useAuthStore.getState().setLoggedIn(false);
      }
    }

    return Promise.reject(error);
  }
);
