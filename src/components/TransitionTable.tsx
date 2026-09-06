import {
  type ID,
  type Phase,
  type Token,
  type Transition,
} from "@/store/tableSlice";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "cn";

const phases: Phase[] = [
  { id: "q0", name: "q0" },
  { id: "q1", name: "q1" },
  { id: "q2", name: "q2" },
  { id: "q3", name: "q3" },
  { id: "q4", name: "q4" },
  { id: "q5", name: "q5" },
  { id: "qA", name: "qA" },
  { id: "qR", name: "qR" },
];

const tokens: Token[] = [
  { id: "_", name: "_" },
  { id: "0", name: "0" },
  { id: "1", name: "1" },
  { id: "X", name: "X" },
];

const transitions: Record<ID, Record<ID, Transition>> = {
  q0: {
    _: { nextPhaseId: "qA", nextTokenId: "_", move: "S" },
    0: { nextPhaseId: "q1", nextTokenId: "X", move: "R" },
    1: { nextPhaseId: "q2", nextTokenId: "X", move: "R" },
    X: { nextPhaseId: "qA", nextTokenId: "X", move: "S" },
  },
  q1: {
    _: { nextPhaseId: "q3", nextTokenId: "_", move: "L" },
    0: { nextPhaseId: "q1", nextTokenId: "0", move: "R" },
    1: { nextPhaseId: "q1", nextTokenId: "1", move: "R" },
    X: { nextPhaseId: "q3", nextTokenId: "X", move: "L" },
  },
  q2: {
    _: { nextPhaseId: "q4", nextTokenId: "_", move: "L" },
    0: { nextPhaseId: "q2", nextTokenId: "0", move: "R" },
    1: { nextPhaseId: "q2", nextTokenId: "1", move: "R" },
    X: { nextPhaseId: "q4", nextTokenId: "X", move: "L" },
  },
  q3: {
    _: { nextPhaseId: "qA", nextTokenId: "_", move: "S" },
    0: { nextPhaseId: "q5", nextTokenId: "X", move: "L" },
    1: { nextPhaseId: "qR", nextTokenId: "1", move: "S" },
    X: { nextPhaseId: "qA", nextTokenId: "X", move: "S" },
  },
  q4: {
    _: { nextPhaseId: "qA", nextTokenId: "_", move: "S" },
    0: { nextPhaseId: "qR", nextTokenId: "0", move: "S" },
    1: { nextPhaseId: "q5", nextTokenId: "X", move: "L" },
    X: { nextPhaseId: "qA", nextTokenId: "X", move: "S" },
  },
  q5: {
    _: { nextPhaseId: "q0", nextTokenId: "_", move: "R" },
    0: { nextPhaseId: "q5", nextTokenId: "0", move: "L" },
    1: { nextPhaseId: "q5", nextTokenId: "1", move: "L" },
    X: { nextPhaseId: "q0", nextTokenId: "X", move: "R" },
  },
  qA: {},
  qR: {},
};

const cellControl = "h-full! w-full border-0";
const cellSurface = "dark:bg-input/30";
const cellHover = "hover:bg-input/50 dark:hover:bg-input/50";

const cellInput = cn(cellControl, "text-center");
const cellTrigger = cn(cellControl, "min-w-0 p-2", cellHover);
const cellButton = cn(
  cellControl,
  "w-10 p-2",
  cellSurface,
  cellHover,
  "active:translate-y-0!",
);
const cellLabel = cn("flex h-full items-center justify-center", cellSurface);

const stickyColumn = cn(
  "sticky left-0 bg-card",
  "before:absolute before:inset-0 before:-z-10 before:bg-muted/50 before:opacity-0 before:transition-opacity group-hover/row:before:opacity-100",
  "border-e-0 after:absolute after:inset-y-0 after:end-0 after:w-px after:bg-border",
);

export function TransitionTable() {
  return (
    <Table className="w-full min-w-max border-t">
      <TableHeader>
        <TableRow className="divide-x group/row">
          <TableHead className={cn("p-0", stickyColumn)}>
            <div className={cellLabel}>δ</div>
          </TableHead>
          {tokens.map((token) => (
            <TableHead key={token.id} className="p-0">
              <Input value={token.name} className={cellInput} />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {phases.map((phase) => (
          <TableRow key={phase.id} className="divide-x group/row">
            <TableCell className={cn("p-0 h-10", stickyColumn)}>
              <Input value={phase.name} className={cellInput} />
            </TableCell>
            {tokens.map((token) => {
              const t: Transition | undefined = transitions[phase.id][token.id];
              return (
                <TableCell key={token.id} className="p-0 h-10">
                  <TransitionCell
                    nextPhaseId={t?.nextPhaseId}
                    nextTokenId={t?.nextTokenId}
                    move={t?.move}
                  />
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function TransitionCell({
  nextPhaseId,
  nextTokenId,
  move,
}: Partial<Transition>) {
  return (
    <div className="grid h-full grid-cols-[1fr_1fr_auto] [&>*:not(:last-child)]:border-e">
      <Select value={nextPhaseId}>
        <SelectTrigger className={cellTrigger}>
          <SelectValue placeholder="State" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>State</SelectLabel>
            {phases.map((phase) => (
              <SelectItem key={phase.id} value={phase.id}>
                {phase.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select value={nextTokenId}>
        <SelectTrigger className={cellTrigger}>
          <SelectValue placeholder="Symbol" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Symbol</SelectLabel>
            {tokens.map((token) => (
              <SelectItem key={token.id} value={token.id}>
                {token.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button variant="ghost" className={cellButton}>
        {move ?? "S"}
      </Button>
    </div>
  );
}
