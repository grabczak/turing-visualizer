type State = string;

type Symbol = string;

type Direction = "L" | "R" | "S";

type Transition = Record<State, Record<Symbol, [State, Symbol, Direction]>>;

export function Table() {
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
    <table>
      <thead>
        <tr>
          <th className="border px-4 py-2">δ</th>
          {symbols.map((symbol) => (
            <th key={symbol} className="border px-4 py-2">
              {symbol}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {states.map((state) => (
          <tr key={state}>
            <td className="border px-4 py-2 font-bold">{state}</td>
            {symbols.map((symbol) => {
              const t = transition[state][symbol];
              return (
                <td key={symbol} className="border px-4 py-2">
                  {t ? `(${t.join(", ")})` : "-"}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
