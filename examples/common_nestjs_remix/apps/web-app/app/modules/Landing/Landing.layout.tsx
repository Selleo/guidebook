import { Link, Outlet } from "react-router";
import { Button } from "~/components/ui/button";
import ThemeToggle from "~/components/ThemeToggle/ThemeToggle";

const SECTIONS = [
  { label: "Product", to: "#product" },
  { label: "Features", to: "#features" },
  { label: "Pricing", to: "#pricing" },
  { label: "About", to: "/about" },
];

export default function LandingLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/brand.svg" alt="Guidebook logo" className="size-8" />
            <span className="text-lg font-semibold">Guidebook</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            {SECTIONS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-muted-foreground transition hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard">Open dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <img src="/brand.svg" alt="Guidebook logo" className="size-8" />
            <p>Made with ❤️ by the Selleo team.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <Link to="#product" className="transition hover:text-foreground">
              Product
            </Link>
            <Link to="#features" className="transition hover:text-foreground">
              Features
            </Link>
            <Link to="#pricing" className="transition hover:text-foreground">
              Pricing
            </Link>
            <Link to="/about" className="transition hover:text-foreground">
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
