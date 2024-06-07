import {
  DefineRouteFunction,
  RouteManifest,
} from "@remix-run/dev/dist/config/routes";

export const routes: (
  defineRoutes: (
    callback: (defineRoute: DefineRouteFunction) => void
  ) => RouteManifest
) => RouteManifest | Promise<RouteManifest> = (defineRoutes) => {
  return defineRoutes((route) => {
    route("", "modules/Landing/Landing.layout.tsx", () => {
      route("", "modules/Landing/Landing.page.tsx", {
        index: true,
      });
      route("/about", "modules/Landing/About.page.tsx");
      route("/pokemons", "modules/Landing/Pokemons.page.tsx");
      route("/pokemons/:id", "modules/Landing/Pokemon.page.tsx");
    });
    route("dashboard", "modules/Dashboard/Dashboard.layout.tsx", () => {
      route("", "modules/Dashboard/Dashboard.page.tsx", {
        index: true,
      });
    });
  });
};
