# Data loading and mutations

For the data loading we will combine two technologies. `clientloader`s from Remix(React Router 7) and React Query `queries`. It will allow us for easier management of queries and less `undefined` states.


`app/api/queries/usePokemons.ts`

```ts

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

## Using queries data

You can eiter prefetch (without wait) - to improve the data loading speed because you start loading the data when the components are not even mouting yet.

or ensureQueryData, with await - which fetches / takes from cache the data - but blocks rendering (useful for auth data 
or crucial data on the page)

```ts
export async function clientLoader() {
  await queryClient.ensureQueryData(pokemonsOptions);
  queryClient.prefetchQuery(pokemonsOptions);

  return {};
}
```

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


## Data mutations and refetches

## Data revalidation

With the queryOptions approach for queries data refetches are pretty simple. You simply import necesary queryOptions and refetch on them like:

```tsx
    mutate(
      {
        data: parsedValues,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: currentUserQueryOptions.queryKey,
          });
        },
      }
    );
```

or

```tsx
 mutate(
      {
        data: parsedValues,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(currentUserQueryOptions);
        },
      }
    );
```
