# Monorepo

One of the advantages of Full Stack Typescript approach is the ability to easily shared the code between the diffrent parts of the systems we're building. And this part is mostly achieved with monorepo approach.

The proposed approach is to use [PNPM workspaces](https://pnpm.io/workspaces) in combination with [Turborepo](https://turbo.build/repo/docs). It offers great flexibility, speed, caching with minimal setup and overhead.

## Starting point

Turborepo has a really great page to get you started [here](https://turbo.build/repo/docs/getting-started/create-new#quickstart).

## Some useful knowledge about turborepo

- You should run the project (typically BE + FE + Proxy etc.) by using `pnpm dev` in the main project directory. You can achive it by having `dev` script in every package that is needed to be started and setting `turbo.json` config file.
- You can use the `cache` in `turbo.json` for tests and lint scripts to save time
- Whenever you have package that should be built before consuming you can use field `dependsOn` in `turbo.json`
- You should be having consistent package versions between your apps/packages
- To install package in correct apps/package you can navigate to its directory and just `pnpm add` inside it or run `pnpm --filter @appname add package`
