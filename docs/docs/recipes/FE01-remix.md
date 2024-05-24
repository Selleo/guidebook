# FE - Remix aka React Router 7

Vite community is huge and Remix intergration with it was the milestone we were waiting for. Now merging the Remix into React Router 7 let's us migrate older projects easier, and have great `framework` environment with patterns for the new apps.

## Steps for migrating old apps to Remix

- If you're not using vite yet - do the migration sooner than later 🤓
- Upgrade React Router to version 6
- Install remix and use its vite plugin with SSR off
- Voila you're able to use Remix

## How to create new app

The app should be a part of our monorepo, so in the `apps` folder you should run `pnpm dlx create-remix@latest`. It should create a Remix app with SPA mode ready to use with eslint and other stuff setup.

