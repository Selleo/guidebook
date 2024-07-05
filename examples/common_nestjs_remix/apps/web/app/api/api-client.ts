import { API } from "./generated-api";

export const ApiClient = new API({
  baseURL: import.meta.env.API_URL,
  secure: true,
});
