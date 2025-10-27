# App Architecture

The flexibility of React is both its greatest strength and its biggest pitfall.  
In this chapter, we’ll cover how to organize files, follow conventions, and keep the project structure scalable and consistent.

---

## Folder Organization

**Colocation** is the core principle of this approach — everything that belongs together should live together.

```
app/
├── api/ # All API communication logic (fetchers, clients, endpoints)
├── assets/ # Static files (images, icons, fonts)
├── components/ # Global, highly reusable UI components (Button, Input, Modal)
├── lib/ # Generic utilities, helpers, config functions
├── locales/ # i18n translation files
├── modules/ # Core feature modules
│ ├── auth/
│ │ ├── auth.page.tsx
│ │ ├── auth.layout.tsx
│ │ ├── hooks/
│ │ ├── components/
│ │ └── utils/
│ └── offers/
│ ├── offers.page.tsx
│ ├── offers.layout.tsx
│ ├── hooks/
│ ├── components/
│ └── utils/
└── main.tsx # App entry point
```

### Key Directories

- **`modules/`** — The heart of your app. Each module (e.g., `auth`, `offers`, `dashboard`) contains everything related to that feature: pages, layouts, hooks, components, and utilities.
- **`api/`** — Responsible for data fetching, client setup, and API contracts (e.g., with your NestJS backend).
- **`components/`** — Houses global, reusable UI primitives used across multiple modules.
- **`lib/`** — Contains general-purpose functions, configuration helpers, or adapters that are not module-specific.
- **`assets/` / `locales/`** — Used for static assets and internationalization.

---

## Route Components

Each module should define its own route and layout components:

- **Page component:** `module.page.tsx`  
- **Layout component:** `module.layout.tsx`

This naming convention enables quick fuzzy-search and avoids reliance on file-based routing systems, while keeping semantics and colocation intact.

> Example:  
> `/app/modules/auth/auth.page.tsx` → login/signup route  
> `/app/modules/offers/offers.layout.tsx` → layout wrapper for offers-related pages
