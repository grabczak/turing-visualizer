import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "src/components/ui/table";

import { useAppDispatch, useAppSelector } from "src/store";

export function TuringTable() {
  const table = useAppSelector((state) => state.table);

  const states = Object.keys(table);
  const symbols = [...new Set(Object.values(table).flatMap((value) => Object.keys(value)))];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="border px-4 py-2">δ</TableHead>
          {symbols.map((symbol) => (
            <TableHead key={symbol} className="border px-4 py-2">
              {symbol}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {states.map((state) => (
          <TableRow key={state}>
            <TableCell className="border px-4 py-2 font-bold">{state}</TableCell>
            {symbols.map((symbol) => {
              const t = table[state][symbol];
              return (
                <TableCell key={symbol} className="border px-4 py-2">
                  {t ? `(${t.join(", ")})` : "-"}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
