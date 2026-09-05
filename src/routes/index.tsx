import { createFileRoute } from "@tanstack/react-router";

function Home() {
  return (
    <div className="container">
      <h1 className="font-bold">Turing Machine Visualizer</h1>
      <h2>Pick a machine to run, or start one from scratch</h2>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Home,
});
