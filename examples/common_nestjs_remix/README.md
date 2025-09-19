### Apps and Packages

- apps
  - `api`: a NestJS backend application working as API
  - `web`: React Router SPA on Vite
  - `reverse-proxy`: for domains and https during development
- packages
  - `email-templates`: a package for email templates
  - `eslint-config`: a package for eslint configuration
  - `typescript-config`: a package for typescript configuration

### Install

To start with the setup make sure you have the correct NodeJS version stated in [.tool-versions](./.tool-versions).
For the node versioning we recommend [asdf](https://asdf-vm.com/). At the time of writing this readme the version is `24.8.0`

After these steps, run the following command

```sh
pnpm install
```

Now to configure our reverse proxy we need to install [Caddy](https://caddyserver.com/docs/install#homebrew-mac). You
can do this using `homebrew` on mac.

> [!IMPORTANT]  
> First run has to be run by hand to configure caddy. Later on it will automatically
> start with the app start script.

To do that proceed with the following

```sh
cd ./apps/reverse-proxy
caddy run
```

After running caddy proceed with the on screen instructions.

The final setup step is to configure both the `api` and `web` applications.

To set up the backend envs and database:

```sh
cp ./apps/api/.env.example ./apps/api/.env
docker-compose up
```

Next, setup the env variables for frontend:

```sh
cp ./apps/web/.env.example ./apps/web/.env
```

### Migrations

Once the docker is up and running we need to run the migrations. To do that run the following command

```sh
pnpm db:migrate
```

### Develop

Now, from the root of the `examples/common_nestjs_remix` directory, run `pnpm dev` to start all applications in parallel.
You should be able to access your app at the following addresses:

| Service | URL                                                                          |
| ------- | ---------------------------------------------------------------------------- |
| Web app | [`https://app.guidebook.localhost`](https://app.guidebook.localhost)         |
| Api     | [`https://api.guidebook.localhost`](https://api.guidebook.localhost)          |
| Swagger | [`https://api.guidebook.localhost/api`](https://api.guidebook.localhost/api) |

### Commands

- #### Database

  - generate migration

    ```sh
    pnpm db:generate -- --name your_migration_name
    ```

  - run migrations

    ```sh
    pnpm db:migrate
    ```

- #### HTTP Client

  To generate the http client run the following command.

  ```sh
  pnpm generate:client
  ```

  This command automates the process of creating a TypeScript client for the API based on the Swagger specification.

- #### Email Templates

  Email templates are generated on every start of turborepo. To generate them manually run the following command in `packages/email-templates`.

  ```sh
  pnpm build
  ```

  The mailhog service is available at [mailbox.guidebook.localhost](https://mailbox.guidebook.localhost)

- #### Testing
  - **Frontend**:
    ```sh
    pnpm test:web
    ```
    ```sh
    pnpm test:web:e2e
    ```
  - **Backend**:
    ```sh
    pnpm test:api
    ```
    ```sh
    pnpm test:api:e2e
    ```

## Legal notice

This project was generated using [Selleo Guidebook](https://github.com/Selleo/guidebook) which is licensed under the MIT license.
