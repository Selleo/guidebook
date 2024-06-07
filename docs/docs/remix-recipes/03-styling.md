# Styling

TailwindCSS is our GoTo solution for everything related to styling. It offers great flexibility, ease of use, reusability and even simplifies implementing features like darkmode.

## Setup

We can use just regular Vite setup for tailwind https://tailwindcss.com/docs/guides/vite


## Semantic vars and dark mode setup

To easier work work with designer files from Figma we recommend common setup that will use semantic variables inside tailiwind. Example `tailwind.config.js` structure

```js
/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        brand: {
          100: "var(--brand-100)",
          500: "var(--brand-500)",
          600: "var(--brand-600)",
        },
        moon: {
          50: "var(--moon-50)",
          100: "var(--moon-100)",
          200: "var(--moon-200)",
          300: "var(--moon-300)",
          400: "var(--moon-400)",
          500: "var(--moon-500)",
          600: "var(--moon-600)",
          700: "var(--moon-700)",
          800: "var(--moon-800)",
          900: "var(--moon-900)",
          950: "var(--moon-950)",
        },
        success: {
          DEFAULT: "var(--success)",
          hover: "var(--success-hover)",
          surface: "var(--success-surface)",
        },
        error: {
          DEFAULT: "var(--error)",
          hover: "var(--error-hover)",
          surface: "var(--error-surface)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          hover: "var(--warning-hover)",
          surface: "var(--warning-surface)",
        },
        info: {
          DEFAULT: "var(--info)",
          hover: "var(--info-hover)",
          surface: "var(--info-surface)",
        },
        surface: {
          one: "var(--surface-one)",
          two: "var(--surface-two)",
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
};
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
    --brand-100: #FCE3DE;
    --brand-400: #E96C58;
    --brand-500: #EC5138;
    --brand-600: #D83B22;
    --brand-950: #160603;

    --moon-50: #FAFAFA;
    --moon-100: #BFBFC4;
    --moon-200: #92929B;
    --moon-300: #73737D;
    --moon-400: #53535A;
    --moon-500: #38383D;
    --moon-600: #2A2A2D;
    --moon-700: #202022;
    --moon-800: #161618;
    --moon-900: #0A0A0B;
    --moon-950: #020203;


    --primary: var(--brand-500);
    --primary-hover: var(--brand-600);
    --primary-surface: var(--brand-950);

    --success: theme(colors.green.500);
    --success-hover: theme(colors.green.600);
    --success-surface: theme(colors.green.950);

    --error: theme(colors.red.500);
    --error-hover: theme(colors.red.600);
    --error-surface: theme(colors.red.950);

    --warning: theme(colors.yellow.500);
    --warning-hover: theme(colors.yellow.600);
    --warning-surface: theme(colors.yellow.950);

    --info: theme(colors.blue.500);
    --info-hover: theme(colors.blue.600);
    --info-surface: theme(colors.blue.950);

    --background: var(--moon-50);
    --surface-one: var(--moon-700);
    --surface-two: var(--moon-600);

    --border: var(--moon-500);
    --border-hover: var(--moon-400);

    --foreground-one: var(--moon-50);
    --foreground-two: var(--moon-100);
 
    --radius: 0.5rem;
  }
 
  .dark {

    --primary: var(--brand-500);
    --primary-hover: var(--brand-600);
    --primary-surface: var(--brand-950);

    --success: theme(colors.green.500);
    --success-hover: theme(colors.green.600);
    --success-surface: theme(colors.green.950);

    --error: theme(colors.red.500);
    --error-hover: theme(colors.red.600);
    --error-surface: theme(colors.red.950);

    --warning: theme(colors.yellow.500);
    --warning-hover: theme(colors.yellow.600);
    --warning-surface: theme(colors.yellow.950);

    --info: theme(colors.blue.500);
    --info-hover: theme(colors.blue.600);
    --info-surface: theme(colors.blue.950);

    --background: var(--moon-800);
    --surface-one: var(--moon-700);
    --surface-two: var(--moon-600);

    --border: var(--moon-500);
    --border-hover: var(--moon-400);

    --foreground-one: var(--moon-50);
    --foreground-two: var(--moon-100);

    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  html {
    @apply bg-background;
  }
  body {
    @apply text-foreground bg-background;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

