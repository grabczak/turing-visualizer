import { Table, TableBody, TableRow, TableCell } from "src/components/ui/table";
import { Input } from "src/components/ui/input";
import { Button } from "./ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "./ui/select";

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
  const { states, symbols } = useAppSelector((state) => state.table);

  const dispatch = useAppDispatch();

  return (
    <Table>
      <TableBody>
        <TableRow className="h-10 border-none hover:bg-transparent">
          <TableCell />
          <TableCell />
          {Object.keys(symbols).map((id) => (
            <TableCell key={id} className="relative border p-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="outline"
                  onClick={() => dispatch(removeSymbol({ symbolId: id }))}
                  className="h-full w-full cursor-pointer rounded-none border-none shadow-none"
                >
                  -
                </Button>
              </div>
            </TableCell>
          ))}
        </TableRow>
        <TableRow className="h-10 border-none hover:bg-transparent">
          <TableCell />
          <TableCell className="w-24 border text-center">δ</TableCell>
          {Object.keys(symbols).map((id) => (
            <TableCell key={id} className="border p-[2px]">
              <SymbolInput symbolId={id} />
            </TableCell>
          ))}
          <TableCell rowSpan={Object.keys(states).length + 1} className="relative w-10 border">
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="outline"
                onClick={() => dispatch(addSymbol())}
                className="h-full w-full cursor-pointer rounded-none border-none shadow-none"
              >
                +
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {Object.keys(states).map((stateId) => (
          <TableRow key={stateId} className="h-10 border-none hover:bg-transparent">
            <TableCell className="relative w-10 border p-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="outline"
                  onClick={() => dispatch(removeState({ stateId }))}
                  className="h-full w-full cursor-pointer rounded-none border-none shadow-none"
                >
                  -
                </Button>
              </div>
            </TableCell>
            <TableCell className="border p-[2px]">
              <StateInput stateId={stateId} />
            </TableCell>
            {Object.keys(symbols).map((symbolId) => (
              <TableCell key={symbolId} className="h-full border p-0">
                <TransitionInput stateId={stateId} symbolId={symbolId} />
              </TableCell>
            ))}
          </TableRow>
        ))}
        <TableRow className="h-10 border-none hover:bg-transparent">
          <TableCell />
          <TableCell colSpan={Object.keys(symbols).length + 1} className="relative border p-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="outline"
                onClick={() => dispatch(addState())}
                className="h-full w-full cursor-pointer rounded-none border-none shadow-none"
              >
                +
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
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

function TransitionInput({ stateId, symbolId }: { stateId: string; symbolId: string }) {
  const { states, symbols, transitions } = useAppSelector((state) => state.table);

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
    <div className="flex h-full">
      <Select value={nextStateId} onValueChange={handleStateChange}>
        <SelectTrigger className="!h-full flex-1 rounded-none border-none shadow-none">
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
      <Select value={nextSymbolId} onValueChange={handleSymbolChange}>
        <SelectTrigger className="!h-full flex-1 rounded-none border-none shadow-none">
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
      <Button
        variant="outline"
        onClick={handleDirectionChange}
        className="!h-full rounded-none border-none shadow-none"
      >
        {direction}
      </Button>
    </div>
  );
}
