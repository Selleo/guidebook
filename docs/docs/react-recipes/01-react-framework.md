# React Intro + Setup

Vite community is huge and Remix intergration with it was the milestone we were waiting for. Now merging the Remix into React Router 7 let's us migrate older projects easier, and have great `framework` environment with patterns for the new apps.

## How to create new apps with remix

The app should be a part of our monorepo, so in the `apps` folder you should run `pnpm dlx create-remix@latest --template remix-run/remix/templates/express`. During creation DO NOT initialize new git repository.
Why are we creating it with Express Template? If we ever want to switch to the SSR it'll be few clicks away already configured.

## Enable SPA mode

This step is optional but recommended for recommended for the Nest + Remix setup. Without it you'll be server rendering your application which we'll be focusing on later.

- in `vite.config.ts` add `ssr: false` to the remix plugin
- in `package.json` replace the dev script with `vite dev`

You should be good to go! You're now able to use remix features such as client loaders, client actions, automatic page code splitting and more!

## Routing

By default Remix uses [flat file based routing](https://remix.run/docs/en/main/discussion/routes#route-configuration). It's not the best convention and we mostly believe in the config based routing as it's easier to work with and provides more flexibility.

To set it up we'd like to create a `routes.ts` file at the top level of remix app with the following content (adjusted with proper file paths):

<i>update sidenote - Remix 3 and React Router 7 will both use the routes.ts syntax as standard</i>

```typescript
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
    });
    route("dashboard", "modules/Dashboard/Dashboard.layout.tsx", () => {
      route("", "modules/Dashboard/Dashboard.page.tsx", {
        index: true,
      });
    });
  });
};
```

It uses our modules strategy with `.page.tsx` extension for pages and `.layout.tsx` for layouts.

Disclaimer: If you really wanna use file based routing check out [remix-flat-routes](https://github.com/kiliman/remix-flat-routes) package that improves on the basic approaches
