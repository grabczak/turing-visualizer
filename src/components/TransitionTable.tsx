import {
  selectPhases,
  selectTokens,
  selectTransitionByPhaseIdAndTokenId,
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
import { useAppSelector } from "@/store/hooks";

export function TransitionTable() {
  const phases = useAppSelector(selectPhases);
  const tokens = useAppSelector(selectTokens);

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
            {tokens.map((token) => (
              <TableCell key={token.id} className="p-0 h-10">
                <TransitionCell phaseId={phase.id} tokenId={token.id} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function TransitionCell({
  phaseId,
  tokenId,
}: {
  phaseId: ID;
  tokenId: ID;
}) {
  const t: Transition | undefined = useAppSelector((state) =>
    selectTransitionByPhaseIdAndTokenId(state, phaseId, tokenId),
  );

  return (
    <div className="grid h-full grid-cols-[1fr_1fr_auto] [&>*:not(:last-child)]:border-e">
      <CellSelect value={t?.nextPhaseId} label="State" options={[]} />
      <CellSelect value={t?.nextTokenId} label="Symbol" options={[]} />
      <Button
        variant="ghost"
        className="h-full w-10 border-0 p-2 dark:bg-input/30 hover:bg-transparent dark:hover:bg-transparent active:translate-y-0!"
      >
        {t?.move ?? "S"}
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
