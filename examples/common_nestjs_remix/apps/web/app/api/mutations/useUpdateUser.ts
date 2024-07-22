import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "~/modules/Auth/authStore";
import { ApiClient } from "../api-client";
import { UpdateUserBody } from "../generated-api";

type UpdateUserOptions = {
  data: UpdateUserBody;
};

export function useUpdateUser() {
  const { setCurrentUser, currentUser } = useAuthStore();
  if (!currentUser) {
    throw new Error("User is not logged in");
  }

  return useMutation({
    mutationFn: async (options: UpdateUserOptions) => {
      const response = await ApiClient.users.usersControllerUpdateUser(
        currentUser.id,
        options.data
      );

      return response.data;
    },
    onSuccess: (data) => {
      setCurrentUser(data.data);
      toast.success("User updated successfully");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message);
      }
      toast.error(error.message);
    },
  });
}
