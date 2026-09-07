import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  type ID,
  type Phase,
  type Token,
  type Move,
  renamePhase,
  renameToken,
  setTransition,
  selectPhases,
  selectTokens,
  selectNextPhaseByPhaseIdAndTokenId,
  selectNextTokenByPhaseIdAndTokenId,
  selectMoveByPhaseIdAndTokenId,
} from "@/store/tableSlice";

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
              <TokenInput token={token} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {phases.map((phase) => (
          <tr key={phase.id} className="h-10">
            <td className="h-full sticky left-0 bg-card">
              <PhaseInput phase={phase} />
            </td>
            {tokens.map((token) => (
              <td key={token.id} className="h-full">
                <div className="grid h-full grid-cols-[1fr_1fr_auto]">
                  <PhaseSelect phaseId={phase.id} tokenId={token.id} />
                  <TokenSelect phaseId={phase.id} tokenId={token.id} />
                  <MoveButton phaseId={phase.id} tokenId={token.id} />
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TokenInput({ token }: { token: Token }) {
  const dispatch = useAppDispatch();

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    dispatch(renameToken({ id: token.id, name: e.target.value }));
  };

  return (
    <Input
      key={token.name}
      defaultValue={token.name}
      onBlur={handleBlur}
      className="h-full text-center"
    />
  );
}

function PhaseInput({ phase }: { phase: Phase }) {
  const dispatch = useAppDispatch();

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    dispatch(renamePhase({ id: phase.id, name: e.target.value }));
  };

  return (
    <Input
      key={phase.name}
      defaultValue={phase.name}
      onBlur={handleBlur}
      className="h-full text-center"
    />
  );
}

function PhaseSelect({ phaseId, tokenId }: { phaseId: ID; tokenId: ID }) {
  const dispatch = useAppDispatch();

  const nextPhase = useAppSelector((state) =>
    selectNextPhaseByPhaseIdAndTokenId(state, phaseId, tokenId),
  );

  const handleChange = (nextPhaseId: ID | null) => {
    if (!nextPhaseId) {
      return;
    }

    dispatch(setTransition({ phaseId, tokenId, changes: { nextPhaseId } }));
  };

  return (
    <Select value={nextPhase?.id ?? null} onValueChange={handleChange}>
      <SelectTrigger className="h-full! w-full">
        <SelectValue>{nextPhase?.name ?? "State"}</SelectValue>
      </SelectTrigger>
      <SelectMenu label="State" selector={selectPhases} />
    </Select>
  );
}

function TokenSelect({ phaseId, tokenId }: { phaseId: ID; tokenId: ID }) {
  const dispatch = useAppDispatch();

  const nextToken = useAppSelector((state) =>
    selectNextTokenByPhaseIdAndTokenId(state, phaseId, tokenId),
  );

  const handleChange = (nextTokenId: ID | null) => {
    if (!nextTokenId) {
      return;
    }

    dispatch(setTransition({ phaseId, tokenId, changes: { nextTokenId } }));
  };

  return (
    <Select value={nextToken?.id ?? null} onValueChange={handleChange}>
      <SelectTrigger className="h-full! w-full">
        <SelectValue>{nextToken?.name ?? "Symbol"}</SelectValue>
      </SelectTrigger>
      <SelectMenu label="Symbol" selector={selectTokens} />
    </Select>
  );
}

function SelectMenu({
  label,
  selector,
}: {
  label: string;
  selector: typeof selectPhases | typeof selectTokens;
}) {
  const items = useAppSelector(selector);

  return (
    <SelectContent>
      <SelectGroup>
        <SelectLabel>{label}</SelectLabel>
        {items.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.name}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  );
}

function MoveButton({ phaseId, tokenId }: { phaseId: ID; tokenId: ID }) {
  const dispatch = useAppDispatch();

  const move = useAppSelector((state) =>
    selectMoveByPhaseIdAndTokenId(state, phaseId, tokenId),
  );

  const nextMove = (m?: Move) => {
    switch (m) {
      case "L":
        return "S";
      case "S":
        return "R";
      case "R":
        return "L";
      default:
        return "S";
    }
  };

  const handleClick = () => {
    dispatch(
      setTransition({ phaseId, tokenId, changes: { move: nextMove(move) } }),
    );
  };

  return (
    <Button onClick={handleClick} variant="outline" className="h-full w-10">
      {move ?? "S"}
    </Button>
  );
}
