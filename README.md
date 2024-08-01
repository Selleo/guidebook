### Apps and Packages

- `api`: a NestJS backend application working as API
- `web`: a Vite React SPA
- `reverse-proxy`: for domains and https during development

### Install

To start with the setup make sure you have the correct NodeJS version stated in `.tool-versions`.
For the node versioning we recommend `asdf`. At the time of writing this readme the version is `20.9.0`

After these steps, run the following command

```
pnpm install
```

Now to configure our reverse proxy we need to install [Caddy](https://caddyserver.com/docs/install#homebrew-mac). You
can do this using `homebrew` on mac. First run has to be run by hand to configure caddy. Later on it will automatically
start with the app start script.

To do that proceed with the following

```
cd ./apps/reverse-proxy
caddy run
```

After running caddy proceed with the on screen instructions.

Last step is to go our NestJS app and configure its environmental variables and docker.
So being in `common_nestjs_remix/apps/api` run the following command

```
cp .env.example .env
docker-compose up -d
```

And in `common_nestjs_remix/apps/api` run the following command

```
cp .env.example .env
```

### Develop

Now in the main directory once you run `pnpm dev` it will run everything in parallel
and you should be abble to acces your app on the following adresses!

[Web app: https://app.guidebook.localhost](https://app.guidebook.localhost)
[Api: https://api.guidebook.localhost](https://api.guidebook.localhost)
[Api Swagger: https://api.guidebook.localhost/api](https://api.guidebook.localhost/api)
