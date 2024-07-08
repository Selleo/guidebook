import { useMutation } from "@tanstack/react-query";
import { CreatePropertyBody } from "../generated-api";
import { ApiClient } from "../api-client";

type CreatePropertyOptions = {
  data: CreatePropertyBody;
  // id: string
};

export function useCreateProperty() {
  return useMutation({
    mutationFn: async (options: CreatePropertyOptions) => {
      const response =
        await ApiClient.properties.propertiesControllerCreateProperty(
          options.data
        );

      return response.data;
    },
  });
}
