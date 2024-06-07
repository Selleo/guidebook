# Data loading

For the data loading we will combine two technologies. `clientloader`s from Remix and React Query `queries`. It will allow us for easier management of queries and less `undefined` states.

For the setup of React Query check their docs: [Installation](https://tanstack.com/query/latest/docs/framework/react/installation) and [Quickstart](https://tanstack.com/query/latest/docs/framework/react/quick-start). With the configuration of the query client you can go one of few ways:

- No cache - always have fresh data
- Easy Cache - global staleTime (eg. 1 min) + globally marking all queries as stale on each mutation
- Full Cache and granular updates - global staleTime + markking specific queries as stale on specific mutations (preferred in SPA)

## Storing queries

React query is not opinionated how to store the queries but we will use the approach proposed by TKdodo (one of the RQ maintainers).

![Api structure](api.png)

Queries will be separeted into QueryOptions and QueryHooks. That way we're able to use queries easily In & Outisde of react itself.

Let's say we want to have fetch function to get list of the Pokemons. we'd do it this way

`app/api/queries/usePokemons.ts`

```ts
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

type PokemonsResponse = {
  count: number;
  next: string;
  previous: string;
  results: {
    name: string;
    url: string;
  }[];
};

export const pokemonsOptions = queryOptions({
  queryKey: ["pokemons", "list"],
  queryFn: async () => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon");
    return response.json() as Promise<PokemonsResponse>;
  },
});

export function usePokemons() {
  return useQuery(pokemonsOptions);
}

export function usePokemonsSuspense() {
  return useSuspenseQuery(pokemonsOptions);
}
```

With this approach whenever we want to use queries in React component we'll import the Hook.
Whenever we want to prefetch the query outside of react (eg. in Route Loaders) we'll use `queryClient.prefetchQuery(pokemonsOptions)`

PS. We can create functions that will return QueryOptions to create queryOptions for dynamic resources as such:

```ts
export const pokemonOptions = (id: string) =>
  queryOptions({
    queryKey: ["pokemons", id],
    queryFn: async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return response.json() as Promise<PokemonResponse>;
    },
  });

export function usePokemon(id: string) {
  return useQuery(pokemonOptions(id));
}

export function usePokemonSuspense(id: string) {
  return useSuspenseQuery(pokemonOptions(id));
}
```

## Using queries data

Remix has a loaders concept that we'll utilze here. Loaders as a concept allow you to fetch data before the route component loads which solves eg. the `undefined` data issues. We'll combine it with RQ to easily work with data across components. As we're working in SPA environemnt we'll utilze `clientLoader` export in a route component.

```ts
export async function clientLoader() {
  await queryClient.ensureQueryData(pokemonsOptions);

  return {};
}
```

This will prefetch our data and throw an error if it encounteres one. For the error case it's also usefull to export `ErrorBoundary`, which would load instead of the page whenever it encounters a problem.

```ts
export function ErrorBoundary() {
  return (
    <div>
      <h1 className="text-center text-2xl mt-10">
        Sorry we couldnt get the pokemons this time!
      </h1>
    </div>
  );
}
```

After prefetching the data we can safely use the `useSuspense` hooks we've prepared. The advantage is that the data is already typed and we don't expect it to be undefined at all.

```ts
export default function PokemonsPage() {
  const pokemons = usePokemonsSuspense();

  return (
    <main>
      <h1>Pokemons page</h1>
      <p>Here you can see all pokemons</p>
      <ul className="flex flex-col gap-2">
        {pokemons.data.results.map((pokemon, index) => (
          <li key={pokemon.name} className="p-2 border-yellow-400 border">
            <img
              alt={pokemon.name}
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                index + 1
              }.png`}
            />
            {pokemon.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
```

PS: If you need to create a data that has some UI loder for it - you can use `queryClient.prefetchQuery(queryOptions)` and use the regular `useQuery` hook to get it's loading state.

## More detailed route level ErrorBoundary

Whenever you want to create more details version of the error boundary - eg. create a special 404 page that's diffrent than just an error page, you can do it in this way:

```ts
export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
  if (!params.id) throw new Error("No id provided");

  try {
    await queryClient.ensureQueryData(pokemonOptions(params.id));
  } catch (error) {
    throw new Response("Not found", { status: 404 });
  }

  return {};
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div>
        <h1>Pokemon not found!</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Something went wrong</h1>
    </div>
  );
}
```
