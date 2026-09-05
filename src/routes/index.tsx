import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";

const defined = [
  { title: "Untitled machine 1", description: "2 states, 2 symbols" },
];

const examples = [
  { title: "Binary increment", description: "adds 1 to a binary number" },
  { title: "Busy beaver (3)", description: "halts after 14 steps with six 1s" },
  { title: "Palindrome", description: "accepts abba, rejects abab" },
  { title: "Unary double", description: "rewrites n ones as 2n ones" },
];

function Home() {
  return (
    <div className="container p-8">
      <div className="flex justify-between">
        <div>
          <h1 className="font-bold text-xl">Turing Machine Visualizer</h1>
          <h2 className="text-muted-foreground">
            Pick a machine to run, or start one from scratch
          </h2>
        </div>
        <ThemeToggle />
      </div>
      <section className="py-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Your machines</h3>
          <Link to="/machine">
            <Button size="lg">
              <PlusIcon /> New machine
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
          {defined.map((machine, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="font-bold">{machine.title}</CardTitle>
                <CardDescription>{machine.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
      <div className="flex items-center text-muted-foreground text-xs">
        EXAMPLES <Separator className="ml-2 shrink" />
      </div>
      <section className="py-6">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
          {examples.map((example, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="font-bold">{example.title}</CardTitle>
                <CardDescription>{example.description}</CardDescription>
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
