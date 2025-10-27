# Styling

TailwindCSS is our GoTo solution for everything related to styling. It offers great flexibility, ease of use, reusability and even simplifies implementing features like darkmode.

## Setup

We can use just regular Vite setup for tailwind https://tailwindcss.com/docs/guides/vite

### Helper setup

To never think about specificity again and avoid duplicating overlapping tailwind classes we can use the following helper method. It has been popularized by shadcn/ui

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```
