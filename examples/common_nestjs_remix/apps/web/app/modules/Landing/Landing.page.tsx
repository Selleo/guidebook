import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "~/components/ui/sheet";
import { useLandingStore } from "~/modules/Landing/landingStore";

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
  const { isSheetOpen, setIsSheetOpen } = useLandingStore();

  return (
    <div className="px-4">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetDescription>
              <div className="flex flex-col gap-2 px-2">
                <div>
                  <h2 className="text-xl font-semibold">
                    Check out our Pokemons!
                  </h2>
                  <ul className="list-disc">
                    <li>
                      <Link className="text-orange-500" to="/about">
                        Pokemons
                      </Link>
                    </li>
                  </ul>
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
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <div className="relative w-[300px] h-[300px] mx-auto mt-20">
        <img
          src="brand.svg"
          alt="brand"
          className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <img
          src="brand.svg"
          alt="brand"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-110 blur-xl z-10 opacity-40 animate-pulse"
        />
      </div>

      <p className="fixed bottom-4 left-1/2 -translate-x-1/2">
        renderedAt: {data.date.toLocaleString()}
      </p>
    </div>
  );
}
