import { Link, Outlet } from "@remix-run/react";
import { Menu } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useLandingStore } from "./landingStore";

export default function LandingLayout() {
  const { setIsSheetOpen } = useLandingStore();
  return (
    <main className="p-4 relative">
      <Button
        variant="outline"
        className="absolute"
        onClick={() => setIsSheetOpen(true)}
      >
        <Menu />
      </Button>
      <h1 className="text-3xl text-center">Welcome to Selleo Remix Template</h1>
      <nav className="flex justify-center gap-4">
        <Link className="text-blue-500" to="/">
          Home
        </Link>
        <Link className="text-orange-500" to="/about">
          About
        </Link>
        <Link className="text-gray-500" to="auth/login">
          Login
        </Link>
        <button
          onClick={() => {
            document.documentElement.classList.toggle("dark");
            localStorage.setItem(
              "theme",
              document.documentElement.classList.contains("dark") ? "dark" : ""
            );
          }}
        >
          🎃
        </button>
      </nav>
      <Outlet />
    </main>
  );
}
