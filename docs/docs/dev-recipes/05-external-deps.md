# Infra Dependencies

Whenever you need a database or any external server stuff you should be using docker compose in the development for the ease of use and project installation. In the matter of object storage - ideally you should use real S3 public buket.

## How to add Postgres with Docker compose

To add Postgres via Docker Compose you should add `docker-compose.yml` in you desired application with the following content:

```yml
services:
  project-db:
    image: postgres:17-alpine
    restart: always
    environment:
      POSTGRES_PASSWORD: projecthjkl
      POSTGRES_DB: project
    volumes:
      - project-db-data:/var/lib/postgresql/data
    ports:
      - 5438:5432

volumes:
  project-db-data:
    driver: local
```

This file would setup developmnet postgres instance on port 5438 and a test DB instance on port 5439

## Redis

```yml
services:
  redis:
    image: "redis:alpine"
    ports:
      - "6379:6379"
    volumes:
      - "redis-data:/data"

volumes:
  redis-data:
    driver: local
```

## Mails on localhost

Whenever working with nodemailer you can use Mailhog to inspect the mails you are sending locally.

```yml
services:
  mailhog:
    image: mailhog/mailhog
    ports:
      - 1025:1025
      - 8025:8025
```

With this configuration you're able to inspect the mails on localhost:8025

## How to store files in Local Development

The Primary approach for handling files in development is having a public s3 bucket. By using it
we achieve 100% compatibility and consistency with prod environment.
