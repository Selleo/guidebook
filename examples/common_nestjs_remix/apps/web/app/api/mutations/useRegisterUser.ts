import { useNavigate } from "@remix-run/react";
import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "../api-client";
import { RegisterBody } from "../generated-api";

type RegisterUserOptions = {
  data: RegisterBody;
};

export function useRegisterUser() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (options: RegisterUserOptions) => {
      const response = await ApiClient.auth.authControllerRegister(
        options.data
      );

      return response.data;
    },
    onSuccess: () => {
      navigate("/auth/login");
    },
  });
}
