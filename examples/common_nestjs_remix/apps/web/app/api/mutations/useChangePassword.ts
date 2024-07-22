import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "~/modules/Auth/authStore";
import { ApiClient } from "../api-client";
import { ChangePasswordBody } from "../generated-api";

type ChangePasswordOptions = {
  data: ChangePasswordBody;
};

export function useChangePassword() {
  const { currentUser } = useAuthStore();
  if (!currentUser) {
    throw new Error("User is not logged in");
  }

  return useMutation({
    mutationFn: async (options: ChangePasswordOptions) => {
      const response = await ApiClient.users.usersControllerChangePassword(
        currentUser.id,
        options.data
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message);
      }
      toast.error(error.message);
    },
  });
}
