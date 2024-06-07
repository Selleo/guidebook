import {
  ClientLoaderFunctionArgs,
  isRouteErrorResponse,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { pokemonOptions, usePokemonSuspense } from "~/api/queries/usePokemon";
import { queryClient } from "~/api/queryClient";

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
  if (!params.id) throw new Error("No id provided");

  if (params.id === "manual-throw") {
    try {
      await queryClient.ensureQueryData(pokemonOptions(params.id));
    } catch (error) {
      throw new Response("Not found", { status: 404 });
    }
  }

  await queryClient.ensureQueryData(pokemonOptions(params.id));

  return {};
}

export default function PokemonPage() {
  const params = useParams<{ id: string }>();
  const { data: pokemon } = usePokemonSuspense(params.id!);

  return (
    <main>
      <h1>{pokemon.name} page</h1>
      <p>Here you can see the pokemon details</p>
      <img
        alt={pokemon.name}
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
      />
      <p>Weight: {pokemon.weight}</p>
    </main>
  );
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
