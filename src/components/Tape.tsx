import { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, FastForward, Play, Pause, RotateCcw, Triangle } from "lucide-react";
import cx from "classnames";

import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { Slider } from "./ui/slider";
import {
  useAppSelector,
  useAppDispatch,
  useAppStore,
  step,
  left,
  right,
  set,
  restore,
  setStatus,
  setSpeed,
} from "src/store";

export function Tape() {
  const tape = useAppSelector((state) => state.tape);

  const symbols = useAppSelector((state) => state.table.symbols);

  const speed = useAppSelector((state) => state.tape.speed);

  const dispatch = useAppDispatch();

  const status = tape.status;

  const store = useAppStore();

  const next = useCallback(() => {
    const { tape, table } = store.getState();

    const {
      stateId,
      head: { symbolId },
    } = tape;

    const rule = table.transitions[stateId]?.[symbolId];

    if (rule) {
      const [newState, newSymbol, direction] = rule;

      dispatch(step({ stateName: newState, symbolName: newSymbol, direction }));
    } else {
      dispatch(setStatus({ status: "done" }));
    }
  }, [dispatch, store]);

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    next();

    const interval = setInterval(next, speed);

    return () => clearInterval(interval);
  }, [status, next, speed]);

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

  const handleRun = () => {
    if (status === "idle") {
      localStorage.setItem("tape", JSON.stringify(tape));
    }

    dispatch(setStatus({ status: "running" }));
  };

  const handlePause = () => {
    dispatch(setStatus({ status: "paused" }));
  };

  const handleStep = () => {
    if (status === "idle") {
      localStorage.setItem("tape", JSON.stringify(tape));
    }

    dispatch(setStatus({ status: "paused" }));

    next();
  };

  const handleReset = () => {
    const _tape = localStorage.getItem("tape");

    if (_tape) {
      dispatch(setStatus({ status: "idle" }));

      dispatch(restore({ tape: JSON.parse(_tape) }));
    }
  };

  const [cellWidth, setCellWidth] = useState<number>(48);

  const cellRef = useRef<HTMLDivElement | null>(null);

  const handleResize = () => {
    if (cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();

      setCellWidth(rect.width);
    }
  };

  useLayoutEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cells = [...tape.left, tape.head, ...tape.right];
  const headIndex = tape.left.length;

  const offset = (cells.length / 2 - headIndex - 0.5) * cellWidth;

  return (
    <div className="flex w-full flex-col items-center gap-8 py-8">
      <div className="flex min-w-100 flex-col items-center gap-4">
        <ButtonGroup className="flex w-full">
          <Button
            variant="outline"
            onClick={handleRun}
            disabled={["running", "done"].includes(status)}
            className="flex-1 cursor-pointer"
          >
            <Play /> Run
          </Button>
          <Button
            variant="outline"
            onClick={handlePause}
            disabled={["idle", "paused", "done"].includes(status)}
            className="flex-1 cursor-pointer"
          >
            <Pause /> Pause
          </Button>
          <Button
            variant="outline"
            onClick={handleStep}
            disabled={["running", "done"].includes(status)}
            className="flex-1 cursor-pointer"
          >
            <FastForward /> Step
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={["idle", "running"].includes(status)}
            className="flex-1 cursor-pointer"
          >
            <RotateCcw /> Reset
          </Button>
        </ButtonGroup>
        <div className="flex w-full flex-col gap-2">
          <div className="text-sm">Speed</div>
          <Slider
            value={[1000 - speed]}
            min={0}
            max={1000}
            step={100}
            onValueChange={(value) => dispatch(setSpeed({ speed: 1000 - value[0] }))}
            className="flex-4 cursor-pointer"
          />
          <div className="flex justify-between">
            <div className="text-muted-foreground text-xs">Slow</div>
            <div className="text-muted-foreground text-xs">Medium</div>
            <div className="text-muted-foreground text-xs">Fast</div>
          </div>
        </div>
        <ButtonGroup className="flex w-1/2">
          <Button
            variant="outline"
            onClick={() => dispatch(left())}
            disabled={status === "running"}
            className="flex-1 cursor-pointer"
          >
            <ArrowLeft /> Left
          </Button>
          <Button
            variant="outline"
            onClick={() => dispatch(right())}
            disabled={status === "running"}
            className="flex-1 cursor-pointer"
          >
            <ArrowRight /> Right
          </Button>
        </ButtonGroup>
      </div>
      <div className="relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden border-t border-b p-4">
        <Triangle strokeWidth={1} className="rotate-180 text-gray-300" />
        <motion.div
          className="flex font-mono text-lg"
          animate={{ x: offset }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {cells.map((cell, i) => (
            <div key={cell.id} ref={i === headIndex ? cellRef : null} className={cx("h-12 w-12 p-1")}>
              <div className={cx("flex h-full w-full items-center justify-center rounded-md border border-gray-300")}>
                {symbols[cell.symbolId]}
              </div>
            </div>
          ))}
        </motion.div>
        <Triangle strokeWidth={1} className="text-gray-300" />
      </div>
    </div>
  );
}
