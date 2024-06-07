# App architecture

Flexibility of React is a great strength and great pitfall. In this chapter we will cover how to store the files, what conventions to use etc.

## Folder organization

Colocation is gonna be the the theme in the described approach.

- Your code should be inside `app` folder in the Remix app.
- `modules` is the most important folder inside where most of your UI and business logic is gonna be living. For example we can have `Auth` module that should have everything related to auth inside of it - from compoents to pages, layout, hooks, it's "util functions".
- `api` folder where we'll be storing all data related to the API communication.
- `components` folder should consist of highly reusable components used throughout the whole app - Button, Input
- `lib` for highly reusable utilities
- `assets` / `locales` are other commonly used folders

## Route components

Route and Layout components should be living in their corresponding modules. Their names should be `module.page.tsx` & `module.layout.tsx` respectively.
It allows for easy fuzzy search while not introducing any specific, not semantic file based syntax.


