import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/recommendations")({
  component: Recommendations,
});

function Recommendations() {
  return <div className="p-2">Hello from About!</div>;
}
