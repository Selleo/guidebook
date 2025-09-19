# Repository Guidelines

## Project Structure & Module Organization
- `apps/api`: NestJS backend; feature folders (e.g., `users`, `common`, `storage`) hold modules, DTOs, and shared helpers. `test/` contains Jest setups and factories for unit/e2e specs.
- `apps/web-app`: React Router 7 frontend; UI primitives in `app/components`, domain logic in `app/modules`, routes and layouts have `name.page.tsx` and `name.layout.tsx` convention in modules and API adapters in `app/api`.
- `apps/reverse-proxy`: Caddy config enabling HTTPS domains during local development.
- `packages/`: `email-templates` builds transactional mails, `eslint-config` centralizes lint rules, and `typescript-config` exposes reusable tsconfig bases.dist/`.

## Build, Test, and Development Commands
- Install deps: `pnpm install` (Node 22+, pnpm 10).
- Start everything: `pnpm dev`; build all workspaces: `pnpm build`.
- Focused dev: `pnpm --filter api dev` for the API, `pnpm --filter guidebook-web-app dev` for the frontend, `pnpm --filter reverse-proxy dev` when reloading Caddy.
- Database: `pnpm db:generate` then rename the migration and sync its `tag` in `apps/api/src/storage/migrations/meta/_journal.json`; apply with `pnpm db:migrate`.
- Tooling extras: `pnpm generate:client` refreshes the Swagger client, `pnpm lint` and `pnpm format` keep standards aligned.

## Coding Style & Naming Conventions
- TypeScript with 2-space indentation everywhere; Prettier governs formatting and ESLint extends `@repo/eslint-config` plus NestJS/React best practices.
- Nest classes (`UsersService`, `AuthModule`) use PascalCase filenames; utilities and constants stay camelCase.
- Frontend components exported from `app/components` and `app/modules` use PascalCase; hooks live under `hooks` with `useX` naming.
- Never commit `.env` files; derive them from each app’s `.env.example`.

## Testing Guidelines
- API unit tests: `pnpm test:api`; coverage: `pnpm --filter api test:cov`. Prefer colocated `*.spec.ts` inside feature folders.
- API e2e: `pnpm test:api:e2e` (uses the Testcontainers helpers in `apps/api/test`).
- Frontend unit tests: `pnpm test:web`; browser-style e2e via `pnpm test:web:e2e`. Snapshot assertions belong under `app/tests`.

## Commit & Pull Request Guidelines
- Commits stay small, imperative, and scoped using conventional commits format (e.g., `feat: add logger transport`); include migration or config notes in the body when relevant.
- Reference tickets with `Refs #123` or link to Notion tasks in the PR description.
- PRs must outline the change, list executed commands, attach UI/API screenshots when behavior shifts, and flag new env vars or migrations.

## Environment & Security Tips
- Initialize services with `docker-compose up -d` before running migrations; seed data through `pnpm --filter api db:seed` when needed.
- Store secrets in untracked `.env.local` files
