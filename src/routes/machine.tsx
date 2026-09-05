import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUp,
  Play,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";
import { Slider } from "@/components/ui/slider";
import { ThemeToggle } from "@/components/ThemeToggle";

function Machine() {
  return (
    <div className="container p-8 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button size="lg" variant="outline">
            <ArrowLeft /> Machines
          </Button>
        </Link>
        <Input value="Untitled Machine 1" />
        <ThemeToggle />
      </div>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Tape</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          <ArrowDown className="stroke-1" />
          <div className="flex gap-2 overflow-x-hidden">
            {Array(100)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="min-w-15 h-12 border flex items-center justify-center"
                >
                  _
                </div>
              ))}
          </div>
          <ArrowUp className="stroke-1" />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex-1">
            <Button variant="outline">
              <RotateCcw />
              Reset
            </Button>
          </div>
          <ButtonGroup className="flex-1 flex justify-center">
            <Button disabled>
              <ArrowLeftToLine /> Back
            </Button>
            <Button>
              Step <ArrowRightToLine />
            </Button>
            <Button variant="outline">
              <Play /> Run
            </Button>
          </ButtonGroup>
          <div className="flex-1 flex justify-end">
            <Slider defaultValue={1} max={10} step={1} className="max-w-32" />
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Transition function</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/machine")({
  component: Machine,
});
