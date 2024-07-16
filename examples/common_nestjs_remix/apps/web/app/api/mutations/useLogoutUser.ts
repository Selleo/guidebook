import { useAuthStore } from "./../../modules/Auth/authStore";
import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "../api-client";

export function useLogoutUser() {
  const { setAuthState } = useAuthStore();
  return useMutation({
    mutationFn: async () => {
      const response = await ApiClient.auth.authControllerLogout();

      return response.data;
    },
    onSuccess: () => {
      setAuthState(false);
    },
  });
}
