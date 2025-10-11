import { useState } from "react";
import { motion } from "framer-motion";
import cx from "classnames";

type Symbol = string;

interface TapeCell {
  id: number;
  value: Symbol;
}

interface Tape {
  left: TapeCell[];
  head: TapeCell;
  right: TapeCell[];
}

let nextId = 0;
function makeCell(value: Symbol): TapeCell {
  return { id: nextId++, value };
}

function moveLeft(tape: Tape, blank: Symbol = "_"): Tape {
  const newHead = tape.left.length ? tape.left[tape.left.length - 1] : makeCell(blank);
  const newLeft = tape.left.slice(0, -1);
  const newRight = [tape.head, ...tape.right];
  return { left: newLeft, head: newHead, right: newRight };
}

function moveRight(tape: Tape, blank: Symbol = "_"): Tape {
  const newHead = tape.right.length ? tape.right[0] : makeCell(blank);
  const newRight = tape.right.slice(1);
  const newLeft = [...tape.left, tape.head];
  return { left: newLeft, head: newHead, right: newRight };
}

function write(tape: Tape, sym: Symbol): Tape {
  return { ...tape, head: { ...tape.head, value: sym } };
}

export function Tape() {
  const [tape, setTape] = useState<Tape>({
    left: [makeCell("1"), makeCell("0")],
    head: makeCell("1"),
    right: [makeCell("0"), makeCell("1")],
  });

  const handleMoveLeft = () => {
    setTape((t) => moveLeft(t));
  };

  const handleMoveRight = () => {
    setTape((t) => moveRight(t));
  };

  const handleWrite = (sym: Symbol) => {
    setTape((t) => write(t, sym));
  };

  const cells = [...tape.left, tape.head, ...tape.right];
  const headIndex = tape.left.length;

  const cellWidth = 48; // w-10 = 2.5rem = 40px, plus gap ≈ 8px
  const offset = (cells.length / 2 - headIndex - 0.5) * cellWidth;

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <div className="my-4">
        <button className="border px-4 py-2 mr-2" onClick={handleMoveLeft}>
          Move Left
        </button>
        <button className="border px-4 py-2 mr-2" onClick={handleMoveRight}>
          Move Right
        </button>
        <button className="border px-4 py-2 mr-2" onClick={() => handleWrite("0")}>
          Write 0
        </button>
        <button className="border px-4 py-2" onClick={() => handleWrite("1")}>
          Write 1
        </button>
      </div>
      <div className="relative w-full flex justify-center overflow-hidden">
        <motion.div
          className="flex gap-2 font-mono text-lg"
          animate={{ x: offset }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {cells.map((cell, i) => {
            const isHead = i === headIndex;

            return (
              <motion.div
                key={cell.id}
                layout
                animate={{
                  backgroundColor: isHead ? "red" : "transparent",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={cx("w-10 h-10 border flex justify-center items-center rounded-md flex-shrink-0", {
                  "border-red-500": isHead,
                })}
              >
                {cell.value}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
