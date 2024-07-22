import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ApiClient } from "../api-client";

export const currentUserQueryOptions = {
  queryKey: ["currentUser"],
  queryFn: async () => {
    const response = await ApiClient.auth.authControllerMe();
    return response.data;
  },
};

export function useCurrentUser() {
  return useQuery(currentUserQueryOptions);
}

export function useCurrentUserSuspense() {
  const { data, ...rest } = useSuspenseQuery(currentUserQueryOptions);

  return { data: data?.data, ...rest };
}
