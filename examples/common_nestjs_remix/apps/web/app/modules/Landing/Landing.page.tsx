import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Selleo Remix" },
    { name: "description", content: "Welcome to the Selleo!" },
  ];
};

export const clientLoader = async () => {
  return { date: new Date() };
};

export default function LandingPage() {
  const data = useLoaderData<typeof clientLoader>();

  return (
    <div className="px-4">
      <div>
        <h2>Check out our Pokemons!</h2>
        <Link className="text-orange-500" to="/about">
          Pokemons
        </Link>
      </div>
      <h2 className="text-xl font-semibold">Usefull Remix Sources</h2>
      <ul className="list-disc">
        <li>
          <a
            className="underline"
            target="_blank"
            href="https://remix.run/docs/en/main/discussion/routes#route-configuration"
            rel="noreferrer"
          >
            Layout routing
          </a>
        </li>
        <li>
          <a
            className="underline"
            target="_blank"
            href="https://remix.run/docs/en/main/guides/spa-mode"
            rel="noreferrer"
          >
            SPA Mode resources
          </a>
        </li>
        <li>
          <a
            className="underline"
            target="_blank"
            href="https://remix.run/docs/en/main/guides/client-data"
            rel="noreferrer"
          >
            Client data
          </a>
        </li>
        <li>
          <a
            className="underline"
            target="_blank"
            href="https://remix.run/docs/en/main/route/client-action#arguments"
            rel="noreferrer"
          >
            Client action
          </a>
        </li>
        <li>
          <a
            className="underline"
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
          >
            Remix Docs
          </a>
        </li>
      </ul>
      <p className="fixed bottom-4 left-1/2 -translate-x-1/2">
        renderedAt: {data.date.toLocaleString()}
      </p>
    </div>
  );
}
