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

export function TransitionTable() {
  return (
    <Table className="w-full min-w-max border-t">
      <TableHeader>
        <TableRow className="divide-x hover:bg-transparent has-aria-expanded:bg-transparent">
          <TableHead className="p-0 sticky left-0 bg-card border-e-0 after:absolute after:inset-y-0 after:inset-e-0 after:w-px after:bg-border">
            <div className="flex h-full items-center justify-center dark:bg-input/30">
              δ
            </div>
          </TableHead>
          {tokens.map((token) => (
            <TableHead key={token.id} className="p-0">
              <Input
                value={token.name}
                className="h-full w-full border-0 text-center"
              />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {phases.map((phase) => (
          <TableRow
            key={phase.id}
            className="divide-x hover:bg-transparent has-aria-expanded:bg-transparent"
          >
            <TableCell className="p-0 sticky left-0 bg-card border-e-0 after:absolute after:inset-y-0 after:inset-e-0 after:w-px after:bg-border h-10">
              <Input
                value={phase.name}
                className="h-full w-full border-0 text-center"
              />
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
      <CellSelect value={nextPhaseId} label="State" options={phases} />
      <CellSelect value={nextTokenId} label="Symbol" options={tokens} />
      <Button
        variant="ghost"
        className="h-full w-10 border-0 p-2 dark:bg-input/30 hover:bg-transparent dark:hover:bg-transparent active:translate-y-0!"
      >
        {move ?? "S"}
      </Button>
    </div>
  );
}

function CellSelect({
  value,
  label,
  options,
}: {
  value?: ID;
  label: string;
  options: (Phase | Token)[];
}) {
  return (
    <Select value={value}>
      <SelectTrigger className="h-full! w-full min-w-0 border-0 p-2 hover:bg-transparent dark:hover:bg-transparent">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
