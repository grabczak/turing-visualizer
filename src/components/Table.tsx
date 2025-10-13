import { Table, TableBody, TableRow, TableCell } from "src/components/ui/table";
import { Input } from "src/components/ui/input";
import { Button } from "./ui/button";

import { useAppSelector, useAppDispatch, addState, addSymbol, removeState, removeSymbol } from "src/store";

export function TuringTable() {
  const table = useAppSelector((state) => state.table);

  const dispatch = useAppDispatch();

  const states = Object.keys(table);
  const symbols = [...new Set(Object.values(table).flatMap((value) => Object.keys(value)))];

  return (
    <Table>
      <TableBody>
        <TableRow className="h-10 border-none hover:bg-transparent">
          <TableCell />
          <TableCell />
          {symbols.map((symbol) => (
            <TableCell key={symbol} className="relative border p-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="outline"
                  onClick={() => dispatch(removeSymbol(symbol))}
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
          {symbols.map((symbol) => (
            <TableCell key={symbol} className="border p-[2px]">
              <Input value={symbol} className="rounded-none border-none p-0 px-2 text-center shadow-none" />
            </TableCell>
          ))}
          <TableCell rowSpan={states.length + 1} className="relative w-10 border">
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="outline"
                onClick={() => dispatch(addSymbol(""))}
                className="h-full w-full cursor-pointer rounded-none border-none shadow-none"
              >
                +
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {states.map((state) => (
          <TableRow key={state} className="h-10 border-none hover:bg-transparent">
            <TableCell className="relative w-10 border p-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="outline"
                  onClick={() => dispatch(removeState(state))}
                  className="h-full w-full cursor-pointer rounded-none border-none shadow-none"
                >
                  -
                </Button>
              </div>
            </TableCell>
            <TableCell className="border p-[2px]">
              <Input value={state} className="rounded-none border-none p-0 px-2 text-center shadow-none" />
            </TableCell>
            {symbols.map((symbol) => (
              <TableCell key={symbol} className="border p-[2px]">
                <Input
                  value={table[state][symbol]?.join(", ")}
                  className="rounded-none border-none p-0 px-2 text-center shadow-none"
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
        <TableRow className="h-10 border-none hover:bg-transparent">
          <TableCell />
          <TableCell colSpan={symbols.length + 1} className="relative border p-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="outline"
                onClick={() => dispatch(addState(""))}
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
