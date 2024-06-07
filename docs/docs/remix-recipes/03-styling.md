# Styling

TailwindCSS is our GoTo solution for everything related to styling. It offers great flexibility, ease of use, reusability and even simplifies implementing features like darkmode.

## Setup

We can use just regular Vite setup for tailwind https://tailwindcss.com/docs/guides/vite

## Semantic vars and dark mode setup

To easier work work with designer files from Figma we recommend common setup that will use semantic variables inside tailiwind. Example `tailwind.config.js` structure

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  // darkMode: "selector",
  theme: {
    extend: {
      colors: {
        brand: {
          100: "var(--brand-100)",
          500: "var(--brand-500)",
          600: "var(--brand-600)",
        },
        foreground: {
          DEFAULT: "var(--foreground)",
          one: "var(--foreground-one)",
          two: "var(--foreground-two)",
        },
        border: {
          DEFAULT: "var(--border)",
          hover: "var(--border-hover)",
        },
        background: {
          DEFAULT: "var(--background)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
```

Following type of config using css variables gives us great flexibility for managing the dark mode and easily connecting them to figma variables. Tailwind dark mode strategy should be class based ref here: https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually

Now we can configure our main `.css` file to handle the darkmode. Whenever `html` tag will have `class="dark"` the whole page will use the darkmode variables automatically.

For each element that you'd like to use totally diffrent colors you can apply classes with `dark:` prefix like `className='color-red-500 dark:color-green-500'

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --brand-100: #fce3de;
    --brand-500: #ec5138;
    --brand-600: #d83b22;

    --moon-50: #fafafa;
    --moon-100: #bfbfc4;
    --moon-200: #92929b;
    --moon-300: #73737d;
    --moon-400: #53535a;
    --moon-500: #38383d;
    --moon-600: #2a2a2d;
    --moon-700: #202022;
    --moon-800: #161618;
    --moon-900: #0a0a0b;
    --moon-950: #020203;

    --background: var(--moon-50);

    --border: var(--moon-500);
    --border-hover: var(--moon-400);

    --foreground-one: var(--moon-800);
    --foreground-two: var(--moon-900);
  }

  .dark {
    --background: var(--moon-800);

    --border: var(--moon-500);
    --border-hover: var(--moon-400);

    --foreground-one: var(--moon-50);
    --foreground-two: var(--moon-100);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  html {
    @apply bg-background;
    @apply text-foreground-one;
  }
  body {
    @apply text-foreground bg-background;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```
