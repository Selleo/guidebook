import { Boxes, CheckCircle2, Gauge, Sparkles } from "lucide-react";
import type { MetaFunction } from "react-router";
import { Link, useLoaderData } from "react-router";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Guidebook | Remix + NestJS starter" },
    {
      name: "description",
      content:
        "Launch your next SaaS faster with a production-ready Remix + NestJS starter from Selleo.",
    },
  ];
};

export const clientLoader = async () => {
  return { date: new Date() };
};

const FEATURES = [
  {
    title: "Auth & security done",
    description:
      "Email login, passwordless, Google OAuth, roles and permissions already wired up.",
    icon: CheckCircle2,
  },
  {
    title: "Dashboard foundation",
    description:
      "Responsive layout, data fetching patterns, and UI primitives to build from day one.",
    icon: Gauge,
  },
  {
    title: "Developer ergonomics",
    description:
      "Clean architecture, typed APIs, testing setup and DX improvements baked in.",
    icon: Boxes,
  },
];

export default function LandingPage() {
  const data = useLoaderData<typeof clientLoader>();

  return (
    <div className="flex flex-col gap-24 pb-24">
      <section
        id="product"
        className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/5 via-background to-background"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-12 px-4 pb-24 pt-20 md:flex-row md:gap-20 md:px-6 md:pt-24">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              <Sparkles className="size-4" />
              Launch faster with confidence
            </span>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
              A production-ready fullstack template, crafted by Selleo
            </h1>
            <p className="text-pretty text-base text-muted-foreground sm:text-lg md:text-xl">
              Guidebook gives your team a modern front-end, a secure backend, and opinionated patterns so you can focus on building your product, not wiring boilerplate.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
              <Button size="lg" asChild>
                <Link to="/auth">Create your account</Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link to="/dashboard">Explore the demo</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground md:justify-start">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Auth, dashboard & CLI-ready
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Typesafe Remix + NestJS stack
              </span>
            </div>
          </div>
          <div className="relative flex h-72 w-full flex-1 items-center justify-center md:h-96">
            <div className="absolute inset-0 scale-105 rounded-3xl bg-gradient-to-tr from-primary/10 via-primary/40 to-primary/10 opacity-60 blur-3xl" />
            <div className="relative flex size-52 items-center justify-center rounded-3xl border border-primary/30 bg-background/80 shadow-2xl backdrop-blur md:size-64">
              <img
                src="/brand.svg"
                alt="Guidebook brand"
                className="h-24 w-24 md:h-28 md:w-28"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 md:px-6">
        <div className="space-y-4 text-center md:max-w-2xl md:self-center md:text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">Everything teams need to start shipping</h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Build on a stack that scales. We ship production decisions, so your team can focus on customer value from day one.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-6" />
              </div>
              <div className="space-y-2 text-left">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="pricing"
        className="mx-auto w-full max-w-6xl px-4 md:px-6"
      >
        <div className="flex flex-col gap-6 rounded-3xl border border-dashed border-primary/40 bg-primary/5 px-6 py-12 text-center shadow-sm sm:px-12">
          <h2 className="text-3xl font-semibold sm:text-4xl">Simple pricing to get started</h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            The starter template is open source. Self-host for free or work with Selleo for implementation support, custom features, and product strategy.
          </p>
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-4xl font-semibold">
              $0 <span className="text-base font-normal text-muted-foreground">for the template</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Need a dedicated team? Reach out to tailor the stack for your next product.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <a href="mailto:hello@selleo.com">Talk to Selleo</a>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <a
                href="https://github.com/Selleo/guidebook/examples/common_nestjs_remix"
                target="_blank"
                rel="noreferrer"
              >
                Browse the codebase
              </a>
            </Button>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-muted-foreground">
        Last rendered at {data.date.toLocaleString()}
      </p>
    </div>
  );
}
