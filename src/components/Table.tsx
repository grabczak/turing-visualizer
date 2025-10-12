import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "src/components/ui/table";

type State = string;

type Symbol = string;

type Direction = "L" | "R" | "S";

type Transition = Record<State, Record<Symbol, [State, Symbol, Direction]>>;

export function TuringTable() {
  const transition: Transition = {
    q0: {
      "0": ["q1", "1", "R"],
      "1": ["q0", "0", "L"],
    },
    q1: {
      "0": ["q2", "1", "R"],
      "1": ["q1", "1", "R"],
    },
    q2: {
      "0": ["q3", "1", "L"],
      "1": ["q2", "0", "R"],
    },
    q3: {
      "0": ["q4", "1", "S"],
      "1": ["q3", "1", "L"],
    },
    q4: {
      "0": ["q4", "0", "S"],
      "1": ["q4", "1", "S"],
    },
  };

  const states = Object.keys(transition);

  const symbols = [...new Set(Object.values(transition).flatMap((value) => Object.keys(value)))];

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
              const t = transition[state][symbol];
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
