import { createFileRoute } from "@tanstack/react-router";

function Machine() {
  return null;
}

export const Route = createFileRoute("/machine")({
  component: Machine,
});
