# UI Kit

We don't have to write every component ourselves, most likely we don't even should write most of the more common or sophisticated ones.
It let's you focus on the business requirements more and progress faster.

For the majority of app we suggest two approaches:

- [shadcn/ui](https://ui.shadcn.com/) is a stylled with tailwind UI component library that let's you copy-paste components into your code. It uses - [RadixUI Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction) under the hood, which currently is a community favourite, easily extensible and gives us good starting accessibility. It's also used by v0 by vercel so generating components can be another speed benefit.

- [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html) mostly focused on accessiblity and usability between devices uikit developed by Adobe. Offerts superb quiality but has harder API to work with.

- [NOT-TESTED] [JollyUI](https://www.jollyui.dev/) Alternative to `shadcn/ui` but built on top of React Aria Components

- [mui](https://mui.com/)
