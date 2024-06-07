import { useLayoutEffect, type ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  return <>{children}</>;
}
