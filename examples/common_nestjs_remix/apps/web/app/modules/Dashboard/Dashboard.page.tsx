import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Welcome to Dashboard!" },
  ];
};

export default function DashboardPage() {
  return (
    <ul>
      <li>This is our page</li>
    </ul>
  );
}
