import { Input } from "src/components/ui/input";
import { Button } from "./ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "./ui/select";
import { shallowEqual } from "react-redux";

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

import type { TDirection } from "src/types";

export function TuringTable() {
  const { states, symbols } = useAppSelector((state) => state.table, shallowEqual);

  const dispatch = useAppDispatch();

  return (
    <div
      className="grid w-full"
      style={{
        gridTemplateColumns: `repeat(${3 * Object.keys(symbols).length + 3}, minmax(0,max-content))`,
        gridTemplateRows: `repeat(${Object.keys(states).length}, minmax(0,1fr))`,
      }}
    >
      <div className="col-span-2 h-10"></div>
      {Object.keys(symbols).map((symbolId) => (
        <div key={symbolId} className="col-span-3 h-10 border">
          <Button
            variant="outline"
            onClick={() => dispatch(removeSymbol({ symbolId }))}
            className="h-full w-full cursor-pointer rounded-none border-none shadow-none"
          >
            -
          </Button>
        </div>
      ))}
      <div className="h-10"></div>
      <div className="h-10"></div>
      <div className="h-10 border text-center leading-10">δ</div>
      {Object.keys(symbols).map((symbolId) => (
        <div className="col-span-3 h-10 border">
          <SymbolInput symbolId={symbolId} />
        </div>
      ))}
      <div
        className="h-full border"
        style={{ gridRow: `span ${Object.keys(states).length + 1} / span ${Object.keys(states).length + 1}` }}
      >
        <Button
          variant="outline"
          onClick={() => dispatch(addSymbol())}
          className="h-full w-full cursor-pointer rounded-none border-none shadow-none"
        >
          +
        </Button>
      </div>
      {Object.keys(states).map((stateId) => (
        <>
          <div className="h-10 border">
            <Button
              variant="outline"
              onClick={() => dispatch(removeState({ stateId }))}
              className="h-full w-full cursor-pointer rounded-none border-none shadow-none"
            >
              -
            </Button>
          </div>
          <div className="h-10 border">
            <StateInput stateId={stateId} />
          </div>
          {Object.keys(symbols).map((symbolId) => (
            <>
              <div className="h-10 border">
                <StateTransitionInput stateId={stateId} symbolId={symbolId} />
              </div>
              <div className="h-10 border">
                <SymbolTransitionInput stateId={stateId} symbolId={symbolId} />
              </div>
              <div className="h-10 border">
                <DirectionTransitionInput stateId={stateId} symbolId={symbolId} />
              </div>
            </>
          ))}
        </>
      ))}
      <div className="h-10"></div>
      <div
        className="h-10 border"
        style={{
          gridColumn: `span ${3 * Object.keys(symbols).length + 1} / span ${3 * Object.keys(symbols).length + 1}`,
        }}
      >
        <Button
          variant="outline"
          onClick={() => dispatch(addState())}
          className="h-full w-full cursor-pointer rounded-none border-none shadow-none"
        >
          +
        </Button>
      </div>
      <div className="h-10"></div>
    </div>
  );
}

function StateInput({ stateId }: { stateId: string }) {
  const states = useAppSelector((state) => state.table.states);

  const dispatch = useAppDispatch();

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    dispatch(renameState({ stateId, stateName: e.target.value }));
  };

  const stateName = states[stateId] || "";

  return (
    <Input
      key={stateName}
      defaultValue={stateName}
      onBlur={handleBlur}
      className="rounded-none border-none p-0 px-2 text-center shadow-none"
    />
  );
}

function SymbolInput({ symbolId }: { symbolId: string }) {
  const symbols = useAppSelector((state) => state.table.symbols);

  const dispatch = useAppDispatch();

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    dispatch(renameSymbol({ symbolId, symbolName: e.target.value }));
  };

  const symbolName = symbols[symbolId] || "";

  return (
    <Input
      key={symbolName}
      defaultValue={symbolName}
      onBlur={handleBlur}
      className="rounded-none border-none p-0 px-2 text-center shadow-none"
    />
  );
}

function StateTransitionInput({ stateId, symbolId }: { stateId: string; symbolId: string }) {
  const { states, transitions } = useAppSelector((state) => state.table);

  const dispatch = useAppDispatch();

  const handleStateChange = (nextStateId: string) => {
    dispatch(
      setTransition({
        stateId,
        symbolId,
        nextStateId,
      }),
    );
  };

  const t = transitions[stateId]?.[symbolId];

  const [nextStateId, nextSymbolId, direction] = t || ["", "", "S"];

  return (
    <Select value={nextStateId} onValueChange={handleStateChange}>
      <SelectTrigger className="!h-full w-full rounded-none border-none shadow-none">
        <SelectValue placeholder="State" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>States</SelectLabel>
          {Object.entries(states).map(([id, name]) => (
            <SelectItem key={id} value={id}>
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function SymbolTransitionInput({ stateId, symbolId }: { stateId: string; symbolId: string }) {
  const { states, symbols, transitions } = useAppSelector((state) => state.table);

  const dispatch = useAppDispatch();

  const handleSymbolChange = (nextSymbolId: string) => {
    dispatch(
      setTransition({
        stateId,
        symbolId,
        nextSymbolId,
      }),
    );
  };

  const t = transitions[stateId]?.[symbolId];

  const [nextStateId, nextSymbolId, direction] = t || ["", "", "S"];

  return (
    <Select value={nextSymbolId} onValueChange={handleSymbolChange}>
      <SelectTrigger className="!h-full w-full rounded-none border-none shadow-none">
        <SelectValue placeholder="Symbol" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Symbols</SelectLabel>
          {Object.entries(symbols).map(([id, name]) => (
            <SelectItem key={id} value={id}>
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function DirectionTransitionInput({ stateId, symbolId }: { stateId: string; symbolId: string }) {
  const { states, symbols, transitions } = useAppSelector((state) => state.table);

  const dispatch = useAppDispatch();

  const t = transitions[stateId]?.[symbolId];

  const [nextStateId, nextSymbolId, direction] = t || ["", "", "S"];

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
      className="!h-full w-full rounded-none border-none shadow-none"
    >
      {direction}
    </Button>
  );
}
