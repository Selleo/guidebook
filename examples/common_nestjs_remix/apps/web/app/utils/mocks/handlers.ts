import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("https://api.guidebook.localhost/auth/login", () => {
    return HttpResponse.json({ data: "" }, { status: 200 });
  }),
  http.post("https://api.guidebook.localhost/auth/login", async () => {
    return HttpResponse.json({ data: "" }, { status: 200 });
  }),
];
