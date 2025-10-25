import { Fragment } from "react";
import { shallowEqual } from "react-redux";

import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "src/components/ui/select";
import { cn } from "src/lib/utils";
import {
  useAppSelector,
  useAppDispatch,
  addState,
  addSymbol,
  removeState,
  removeSymbol,
  renameState,
  renameSymbol,
  setTransition,
} from "src/store";
import type { TDirection, TStateId, TSymbolId } from "src/types";

export function Table() {
  const { states, symbols } = useAppSelector((state) => state.table, shallowEqual);

  const currentStateId = useAppSelector((state) => state.tape.stateId);
  const currentSymbolId = useAppSelector((state) => state.tape.head.symbolId);

  const stateIds = Object.keys(states);
  const symbolIds = Object.keys(symbols);

  const stateCount = stateIds.length;
  const symbolCount = symbolIds.length;

  return (
    <Grid stateCount={stateCount} symbolCount={symbolCount}>
      <Cell className="col-span-2" border={false} />
      {symbolIds.map((symbolId) => (
        <Cell key={symbolId} className="col-span-3 min-w-60">
          <RemoveSymbolButton symbolId={symbolId} disabled={symbolCount <= 1} />
        </Cell>
      ))}
      <Cell border={false} />
      <Cell border={false} />
      <Cell className="text-center leading-10">δ</Cell>
      {symbolIds.map((symbolId) => (
        <Cell
          key={symbolId}
          className={cn("col-span-3", symbolId === currentSymbolId ? "bg-emerald-100" : "bg-transparent")}
        >
          <SymbolInput symbolId={symbolId} />
        </Cell>
      ))}
      <Cell className="h-full" style={{ gridRow: `span ${stateCount + 1}` }}>
        <AddSymbolButton />
      </Cell>
      {stateIds.map((stateId) => (
        <Fragment key={stateId}>
          <Cell>
            <RemoveStateButton stateId={stateId} disabled={stateCount <= 1} />
          </Cell>
          <Cell className={cn(stateId === currentStateId ? "bg-emerald-100" : "bg-transparent")}>
            <StateInput stateId={stateId} />
          </Cell>
          {symbolIds.map((symbolId) => (
            <Fragment key={symbolId}>
              <Cell>
                <StateTransitionInput stateId={stateId} symbolId={symbolId} />
              </Cell>
              <Cell>
                <SymbolTransitionInput stateId={stateId} symbolId={symbolId} />
              </Cell>
              <Cell>
                <DirectionTransitionInput stateId={stateId} symbolId={symbolId} />
              </Cell>
            </Fragment>
          ))}
        </Fragment>
      ))}
      <Cell border={false} />
      <Cell style={{ gridColumn: `span ${3 * symbolCount + 1}` }}>
        <AddStateButton />
      </Cell>
      <Cell border={false} />
    </Grid>
  );
}

function Grid({
  children,
  stateCount,
  symbolCount,
}: {
  children: React.ReactNode;
  stateCount: number;
  symbolCount: number;
}) {
  return (
    <div className="mt-8 flex justify-center border-t border-b">
      <div
        className="grid overflow-scroll p-8"
        style={{
          gridTemplateColumns: `repeat(${3 * symbolCount + 3}, max-content)`,
          gridTemplateRows: `repeat(${stateCount}, 1fr)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Cell({
  children,
  className,
  style,
  border = true,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  border?: boolean;
}) {
  return (
    <div className={cn("h-10", className, border && "border")} style={style}>
      {children}
    </div>
  );
}

function AddStateButton() {
  const dispatch = useAppDispatch();

  return (
    <Button
      variant="outline"
      onClick={() => dispatch(addState())}
      className="h-full w-full cursor-pointer rounded-none border-none shadow-none"
    >
      +
    </Button>
  );
}

function RemoveStateButton({ stateId, disabled }: { stateId: TStateId; disabled?: boolean }) {
  const dispatch = useAppDispatch();

  return (
    <Button
      variant="outline"
      onClick={() => dispatch(removeState({ stateId }))}
      disabled={disabled}
      className="h-full w-full cursor-pointer rounded-none border-none shadow-none"
    >
      -
    </Button>
  );
}

function AddSymbolButton() {
  const dispatch = useAppDispatch();

  return (
    <Button
      variant="outline"
      onClick={() => dispatch(addSymbol())}
      className="h-full w-full cursor-pointer rounded-none border-none shadow-none"
    >
      +
    </Button>
  );
}

function RemoveSymbolButton({ symbolId, disabled }: { symbolId: TSymbolId; disabled?: boolean }) {
  const dispatch = useAppDispatch();

  return (
    <Button
      variant="outline"
      onClick={() => dispatch(removeSymbol({ symbolId }))}
      disabled={disabled}
      className="h-full w-full cursor-pointer rounded-none border-none shadow-none"
    >
      -
    </Button>
  );
}

function StateInput({ stateId }: { stateId: TStateId }) {
  const states = useAppSelector((state) => state.table.states);

  const dispatch = useAppDispatch();

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    dispatch(renameState({ stateId, stateName: e.target.value }));
  };

  const stateName = states[stateId];

  return (
    <Input
      key={stateName}
      defaultValue={stateName}
      onBlur={handleBlur}
      className="rounded-none border-none p-0 px-2 text-center shadow-none"
    />
  );
}

function SymbolInput({ symbolId }: { symbolId: TSymbolId }) {
  const symbols = useAppSelector((state) => state.table.symbols);

  const dispatch = useAppDispatch();

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    dispatch(renameSymbol({ symbolId, symbolName: e.target.value }));
  };

  const symbolName = symbols[symbolId];

  return (
    <Input
      key={symbolName}
      defaultValue={symbolName}
      onBlur={handleBlur}
      maxLength={1}
      className="rounded-none border-none p-0 px-2 text-center shadow-none"
    />
  );
}

function StateTransitionInput({ stateId, symbolId }: { stateId: TStateId; symbolId: TSymbolId }) {
  const states = useAppSelector((state) => state.table.states);

  const transition = useAppSelector((state) => state.table.transitions[stateId]?.[symbolId]);

  const dispatch = useAppDispatch();

  const handleStateChange = (nextStateId: TStateId) => {
    dispatch(
      setTransition({
        stateId,
        symbolId,
        nextStateId,
      }),
    );
  };

  const nextStateId = (transition || ["", "", "S"])[0];

  return (
    <Select value={nextStateId} onValueChange={handleStateChange}>
      <SelectTrigger className="hover:bg-accent/90 !h-full w-full cursor-pointer rounded-none border-none shadow-none transition-all">
        <SelectValue placeholder="State" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>States</SelectLabel>
          {Object.entries(states).map(([id, name]) => (
            <SelectItem key={id} value={id} className="cursor-pointer">
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function SymbolTransitionInput({ stateId, symbolId }: { stateId: TStateId; symbolId: TSymbolId }) {
  const symbols = useAppSelector((state) => state.table.symbols);

  const transition = useAppSelector((state) => state.table.transitions[stateId]?.[symbolId]);

  const dispatch = useAppDispatch();

  const handleSymbolChange = (nextSymbolId: TSymbolId) => {
    dispatch(
      setTransition({
        stateId,
        symbolId,
        nextSymbolId,
      }),
    );
  };

  const nextSymbolId = (transition || ["", "", "S"])[1];

  return (
    <Select value={nextSymbolId} onValueChange={handleSymbolChange}>
      <SelectTrigger className="hover:bg-accent/90 !h-full w-full cursor-pointer rounded-none border-none shadow-none transition-all">
        <SelectValue placeholder="Symbol" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Symbols</SelectLabel>
          {Object.entries(symbols).map(([id, name]) => (
            <SelectItem key={id} value={id} className="cursor-pointer">
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function DirectionTransitionInput({ stateId, symbolId }: { stateId: TStateId; symbolId: TSymbolId }) {
  const transition = useAppSelector((state) => state.table.transitions[stateId]?.[symbolId]);

  const dispatch = useAppDispatch();

  const direction = (transition || ["", "", "S"])[2];

  const handleDirectionChange = () => {
    const dir = ["L", "R", "S"];

    dispatch(
      setTransition({
        stateId,
        symbolId,
        direction: dir[(dir.indexOf(direction) + 1) % dir.length] as TDirection,
      }),
    );
  };

  return (
    <Button
      variant="outline"
      onClick={handleDirectionChange}
      className="!h-full w-full cursor-pointer rounded-none border-none shadow-none"
    >
      {direction}
    </Button>
  );
}
