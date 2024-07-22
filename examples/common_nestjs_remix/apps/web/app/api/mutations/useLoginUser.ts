import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "~/modules/Auth/authStore";
import { ApiClient } from "../api-client";
import { LoginBody } from "../generated-api";

type LoginUserOptions = {
  data: LoginBody;
};

export function useLoginUser() {
  const setLoggedIn = useAuthStore.getState().setLoggedIn;

  return useMutation({
    mutationFn: async (options: LoginUserOptions) => {
      const response = await ApiClient.auth.authControllerLogin(options.data);

      if (!response) {
        throw new Error("Invalid username or password");
      }

      return response.data;
    },
    onSuccess: (data) => {
      setCurrentUser(data.data);
      setLoggedIn(true);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message);
      }
      toast.error(error.message);
    },
  });
}
