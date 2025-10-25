import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

import type { TTape, TDirection, TCell, TSymbolId, TStateId } from "src/types";

const createCell = (symbolId: TSymbolId): TCell => ({ id: nanoid(), symbolId });

const write = (tape: TTape, stateId: TStateId, symbolId: TSymbolId): TTape => {
  return { ...tape, stateId, head: { ...tape.head, symbolId } };
};

const moveLeft = (tape: TTape): TTape => {
  const newHead = tape.left.length ? tape.left[tape.left.length - 1] : createCell("_");
  const newLeft = tape.left.slice(0, -1);
  const newRight = [tape.head, ...tape.right];
  return { ...tape, left: newLeft, head: newHead, right: newRight };
};

const moveRight = (tape: TTape): TTape => {
  const newHead = tape.right.length ? tape.right[0] : createCell("_");
  const newRight = tape.right.slice(1);
  const newLeft = [...tape.left, tape.head];
  return { ...tape, left: newLeft, head: newHead, right: newRight };
};

const initialState: TTape = {
  stateId: "q0",
  left: Array(100).fill("_").map(createCell),
  head: createCell("1"),
  right: [...Array(6).fill("1").map(createCell), ...Array(94).fill("_").map(createCell)],
};

export const tapeSlice = createSlice({
  name: "tape",
  initialState,
  reducers: {
    left: (tape) => {
      return moveLeft(tape);
    },
    right: (tape) => {
      return moveRight(tape);
    },
    set: (tape, action: PayloadAction<{ symbolId: TSymbolId }>) => {
      tape.head.symbolId = action.payload.symbolId;
    },
    step: (
      tape,
      action: PayloadAction<{
        stateName: string;
        symbolName: string;
        direction: TDirection;
      }>,
    ) => {
      const { stateName, symbolName, direction } = action.payload;

      const _tape = write(tape, stateName, symbolName);

      switch (direction) {
        case "L":
          return moveLeft(_tape);
        case "R":
          return moveRight(_tape);
        case "S":
          return _tape;
      }
    },
    restore: (_, action: PayloadAction<{ tape: TTape }>) => {
      return action.payload.tape;
    },
  },
});

export const { left, right, step, set, restore } = tapeSlice.actions;

export default tapeSlice.reducer;
