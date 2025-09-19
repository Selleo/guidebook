import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "About page" }];
};

export default function AboutPage() {
  return (
    <div>
      <h1>About page</h1>
    </div>
  );
}
