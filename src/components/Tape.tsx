import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import cx from "classnames";

import { useAppSelector, useAppDispatch, step, store } from "src/store";

export function Tape() {
  const tape = useAppSelector((state) => state.tape);

  const symbols = useAppSelector((state) => state.table.symbols);

  const dispatch = useAppDispatch();

  const [running, setRunning] = useState(false);

  const cells = [...tape.left, tape.head, ...tape.right];
  const headIndex = tape.left.length;

  useEffect(() => {
    if (!running) return;

    const next = () => {
      const { tape, table } = store.getState();

      const { stateId, head } = tape;

      const rule = table.transitions[stateId]?.[head.symbolId];

      if (rule) {
        const [newState, newSymbol, direction] = rule;
        dispatch(step({ stateName: newState, symbolName: newSymbol, direction }));
      }
    };

    next();

    const interval = setInterval(next, 500);

    return () => clearInterval(interval);
  }, [dispatch, running]);

  const cellWidth = 48; // w-10 = 2.5rem = 40px, plus gap ≈ 8px
  const offset = (cells.length / 2 - headIndex - 0.5) * cellWidth;

  return (
    <div className="mt-10 flex w-full flex-col items-center gap-4">
      <div className="my-4">
        <button onClick={() => setRunning(true)} className="border px-4 py-2">
          ⏵ Run
        </button>
        <button onClick={() => setRunning(false)} className="border px-4 py-2">
          ⏸ Pause
        </button>
        <button className="border px-4 py-2">⟳ Reset</button>
        <button className="border px-4 py-2">◀ Left</button>
        <button className="border px-4 py-2">▶ Right</button>
      </div>
      <div className="relative flex w-full justify-center overflow-hidden">
        <motion.div
          className="flex gap-2 font-mono text-lg"
          animate={{ x: offset }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {cells.map((cell, i) => (
            <motion.div
              key={cell.id}
              layout
              animate={{
                backgroundColor: i === headIndex ? "rgb(255,0,0)" : "rgba(0,0,0,0)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cx("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border")}
            >
              {symbols[cell.symbolId]}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
