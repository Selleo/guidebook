import { Link, Outlet } from "@remix-run/react";

export default function LandingLayout() {
  return (
    <main className="p-4">
      <h1 className="text-3xl text-center">Welcome to Selleo Remix Template</h1>
      <nav className="flex justify-center gap-4">
        <Link className="text-blue-500" to="/">
          Home
        </Link>
        <Link className="text-orange-500" to="/about">
          About
        </Link>
        <Link
          aria-disabled={true}
          className="text-gray-500 line-through"
          to="#"
        >
          Login
        </Link>
      </nav>
      <Outlet />
    </main>
  );
}
