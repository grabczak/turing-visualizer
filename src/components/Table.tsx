import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "src/components/ui/table";
import { Input } from "src/components/ui/input";
import { Button } from "./ui/button";

import { useAppSelector } from "src/store";

export function TuringTable() {
  const table = useAppSelector((state) => state.table);

  const states = Object.keys(table);
  const symbols = [...new Set(Object.values(table).flatMap((value) => Object.keys(value)))];

  const renderEditableCell = (state: string, symbol: string) => {
    const t = table[state][symbol];

    return (
      <TableCell key={symbol} className="p-[2px] border">
        <Input value={t?.join(", ")} className="border-none rounded-none shadow-none" />
      </TableCell>
    );
  };

  return (
    <div className="grid grid-cols-[1fr_auto] grid-rows-[1fr_auto]">
      <Table>
        <TableHeader>
          <TableRow className="border-none">
            <TableHead className="border">δ</TableHead>
            {symbols.map((symbol) => (
              <TableHead key={symbol} className="border">
                {symbol}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {states.map((state) => (
            <TableRow key={state} className="border-none">
              <TableCell className="border">{state}</TableCell>
              {symbols.map((symbol) => renderEditableCell(state, symbol))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="outline" className="h-full border-l-0 rounded-none shadow-none">
        +
      </Button>
      <Button variant="outline" className="border-t-0 rounded-none shadow-none">
        +
      </Button>
    </div>
  );
}
