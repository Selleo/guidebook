#Libraries

Here's a list of tested and preferred libraries split into themed categories

## State Management

- [Zustand](https://github.com/pmndrs/zustand) - goto small client state library
- [React Query](https://tanstack.com/query/latest/docs/framework/react/overview) - goto server and async state, caching library

## Validation

- [Typebox](https://github.com/sinclairzx81/typebox) - worse api but faster - preferable on the backend
- [Zod](https://zod.dev/) - better api but slower

## Styling & Animation

- [TailwindCSS](https://tailwindcss.com/docs/guides/vite) - Styling Framework of choice
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) - Removes specificy issues in tailwindcss apps
- [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) - Simple quick animations for taiwlind
- [clsx](https://www.npmjs.com/package/clsx) - Merge classes without hassle - newer, better, smaller alternative to `classnames`
- [class-variance-authority](https://cva.style/docs) - Create components that have multiple variants easier
- [framer motion](https://www.framer.com/motion/introduction/) - The library for animations, although a bit big

## UI Components

- [Shadcn](https://ui.shadcn.com/) - Easy copy-paste library built on top of RadixUI primitives and tailwind
- [RadixUI Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction) - Good set of components that are easy to use and customize
- [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html) - Set of components that are feature-rich and fully accessible
- [react-datepicker](https://www.npmjs.com/package/react-datepicker) - Ultimate datepicker with everything but huge
- [React DayPicker](https://daypicker.dev/) - Less featured packed but also smaller, integrates with date-fns
- [React Select](https://react-select.com/home) - Ultimate select if you need quick customization out of the box
- [@tanstack/react-table](https://tanstack.com/table/latest/docs/introduction) - THE library for hadling complex tables
- [cmdk](https://github.com/pacocoursey/cmdk) - Command Palette component

## Forms & Inputs

- [React Hook Form](https://www.react-hook-form.com/get-started/) - The library for react form handling
- [Typebox resolver](https://www.react-hook-form.com/get-started/#SchemaValidation) - add schema validation to hook form with typebox
- [Zod resolver](https://www.react-hook-form.com/get-started/#SchemaValidation) - add schema validation to hook form with zod
- [react-international-phone](https://www.npmjs.com/package/react-international-phone) - small, good phone input component

## Networking

- [Axios](https://github.com/axios/axios) - better api than fetch
- [Mock Service Worker](https://mswjs.io/) - Library to mock BE responses in dev or in testing

## Charts

- [Recharts](https://recharts.org/en-US/)
- [Highcharts](https://www.highcharts.com/)

## Internationalization

- [react-i18next](https://react.i18next.com/)

## Testing

- [vitest](https://vitest.dev/guide/) - good, new test runner. Works well with vite and react
- [Playwright](https://playwright.dev/) - "the better cypress"

## Drag n drop

- [React DnD](https://react-dnd.github.io/react-dnd/about)

## Dates

- [date-fns](https://date-fns.org/) - built on top of Intl standard
- [date-fns-tz](https://www.npmjs.com/package/date-fns-tz) - Timezone handling

## Other
- [driver.js](https://driverjs.com/docs/installation) - beautiful onboarding library

## Utilities

- [lodash](https://lodash.com/) - preferably install separate modules 
- [ts-pattern](https://github.com/gvergnaud/ts-pattern) - pattern matching
- [ts-result](https://www.npmjs.com/package/ts-results-es) - monads
