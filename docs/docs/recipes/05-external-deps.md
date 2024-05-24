# Docker compose

Whenever you need a database or any external server stuff you should be using docker compose in the development for the ease of use and project installation.

## How to add Postgres with Docker compose

To add Postgres via Docker Compose you should add `docker-compose.yml` in you desired application with the following content:

```yml
version: "3.9"
services:
  project-db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_PASSWORD: projecthjkl
      POSTGRES_DB: project
    volumes:
      - project-db-data:/var/lib/postgresql/data
    ports:
      - 5438:5432

  project-test-db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_PASSWORD: projecthjkl
      POSTGRES_DB: project
    volumes:
      - project-test-db-data:/var/lib/postgresql/data
    ports:
      - 5439:5432

volumes:
  project-db-data:
    driver: local
  project-test-db-data:
    driver: local
```

This file would setup developmnet postgres instance on port 5438 and a test DB instance on port 5439

// TODO:

- Static server
- Mailhog
