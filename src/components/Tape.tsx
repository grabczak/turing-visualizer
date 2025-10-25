import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, FastForward, Play, Pause, RotateCcw, Triangle } from "lucide-react";
import cx from "classnames";

import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { useAppSelector, useAppDispatch, step, store, left, right, set } from "src/store";

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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") {
        dispatch(left());
      } else if (e.code === "ArrowRight") {
        dispatch(right());
      } else {
        const symbol = Object.entries(symbols).find(([, name]) => name === e.key);

        if (symbol) {
          dispatch(set({ symbolId: symbol[0] }));
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [dispatch, symbols]);

  const cellWidth = 48; // w-10 = 2.5rem = 40px, plus gap ≈ 8px
  const offset = (cells.length / 2 - headIndex - 0.5) * cellWidth;

  return (
    <div className="flex w-full flex-col items-center gap-8 py-8">
      <ButtonGroup>
        <Button variant="outline" onClick={() => setRunning(true)} className="cursor-pointer">
          <Play /> Run
        </Button>
        <Button variant="outline" onClick={() => setRunning(false)} className="cursor-pointer">
          <Pause /> Pause
        </Button>
        <Button variant="outline" className="cursor-pointer">
          <FastForward /> Step
        </Button>
        <Button variant="outline" className="cursor-pointer">
          <RotateCcw /> Reset
        </Button>
      </ButtonGroup>
      <div className="relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden border-t border-b p-4">
        <Triangle strokeWidth={1} className="rotate-180 text-gray-300" />
        <motion.div
          className="flex gap-2 font-mono text-lg"
          animate={{ x: offset }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {cells.map((cell) => (
            <div
              key={cell.id}
              className={cx("flex h-10 w-10 items-center justify-center rounded-md border border-gray-300")}
            >
              {symbols[cell.symbolId]}
            </div>
          ))}
        </motion.div>
        <Triangle strokeWidth={1} className="text-gray-300" />
      </div>
      <ButtonGroup>
        <Button variant="outline" onClick={() => dispatch(left())} className="cursor-pointer">
          <ArrowLeft /> Left
        </Button>
        <Button variant="outline" onClick={() => dispatch(right())} className="cursor-pointer">
          <ArrowRight /> Right
        </Button>
      </ButtonGroup>
    </div>
  );
}
