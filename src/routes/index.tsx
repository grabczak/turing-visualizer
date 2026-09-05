import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function Home() {
  return (
    <div className="container">
      <h1 className="font-bold">Turing Machine Visualizer</h1>
      <h2>Pick a machine to run, or start one from scratch</h2>
      <section>
        <div className="flex justify-between">
          <h3>Your machines</h3>
          <Button>New machine</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="w-full max-w-sm">
                <CardHeader>
                  <CardTitle className="font-bold">My machine {i}</CardTitle>
                  <CardDescription>My description {i}</CardDescription>
                </CardHeader>
              </Card>
            ))}
        </div>
      </section>
      <section>
        <div className="flex items-center">
          EXAMPLES
          <Separator />
        </div>
        <div className="flex flex-wrap gap-4">
          {Array(20)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="w-full max-w-sm">
                <CardHeader>
                  <CardTitle className="font-bold">
                    Example machine {i}
                  </CardTitle>
                  <CardDescription>Example description {i}</CardDescription>
                </CardHeader>
              </Card>
            ))}
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Home,
});
