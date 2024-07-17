import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "../api-client";
import { LoginBody } from "../generated-api";
import { useAuthStore } from "~/modules/Auth/authStore";
import { toast } from "sonner";
import { AxiosError } from "axios";

type LoginUserOptions = {
  data: LoginBody;
};

export function useLoginUser() {
  const { setLoggedIn } = useAuthStore();
  return useMutation({
    mutationFn: async (options: LoginUserOptions) => {
      const response = await ApiClient.auth.authControllerLogin(options.data);

      return response.data;
    },
    onSuccess: () => {
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
