import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "About page" }];
};

export default function AboutPage() {
  return (
    <div>
      <h1>About page</h1>
      <p>Something about the product.</p>
    </div>
  );
}
