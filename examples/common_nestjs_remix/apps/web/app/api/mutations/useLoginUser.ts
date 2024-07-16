import { useNavigate } from "@remix-run/react";
import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "../api-client";
import { LoginBody } from "../generated-api";
import { useAuthStore } from "~/modules/Auth/authStore";

type LoginUserOptions = {
  data: LoginBody;
};

export function useLoginUser() {
  const navigate = useNavigate();
  const { setAuthState } = useAuthStore();
  return useMutation({
    mutationFn: async (options: LoginUserOptions) => {
      const response = await ApiClient.auth.authControllerLogin(options.data);

      return response.data;
    },
    onSuccess: () => {
      navigate("/dashboard");
      setAuthState(true);
    },
  });
}
