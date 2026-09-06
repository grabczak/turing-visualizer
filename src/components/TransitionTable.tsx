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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/store/hooks";

export function TransitionTable() {
  const phases = useAppSelector(selectPhases);
  const tokens = useAppSelector(selectTokens);

  return (
    <table className="w-full min-w-max">
      <thead>
        <tr className="h-10">
          <th className="sticky left-0 bg-card">
            <div className="border h-full text-muted-foreground content-center dark:bg-input/30">
              State
            </div>
          </th>
          {tokens.map((token) => (
            <th key={token.id} className="h-full">
              <Input value={token.name} className="h-full text-center" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {phases.map((phase) => (
          <tr key={phase.id} className="h-10">
            <td className="h-full sticky left-0 bg-card">
              <Input value={phase.name} className="h-full text-center" />
            </td>
            {tokens.map((token) => (
              <td key={token.id} className="h-full">
                <TransitionCell phaseId={phase.id} tokenId={token.id} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
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
    <div className="grid h-full grid-cols-[1fr_1fr_auto]">
      <CellSelect value={t?.nextPhaseId} label="State" options={[]} />
      <CellSelect value={t?.nextTokenId} label="Symbol" options={[]} />
      <Button variant="outline" className="h-full w-10">
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
      <SelectTrigger className="h-full! w-full">
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
