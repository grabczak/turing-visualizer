import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { TState, TSymbol, TDirection } from "src/types";

interface TTapeCell {
  id: number;
  value: TSymbol;
}

interface TTape {
  state: TState;
  left: TTapeCell[];
  head: TTapeCell;
  right: TTapeCell[];
}

let nextId = 0;
const createCell = (value: TSymbol): TTapeCell => ({ id: nextId++, value });

const write = (tape: TTape, state: TState, symbol: TSymbol): TTape => {
  return { ...tape, state, head: { ...tape.head, value: symbol } };
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
  state: "q0",
  left: [createCell("1"), createCell("0")],
  head: createCell("1"),
  right: [createCell("0"), createCell("1")],
};

export const tapeSlice = createSlice({
  name: "tape",
  initialState,
  reducers: {
    step: (
      tape,
      action: PayloadAction<{
        state: TState;
        symbol: TSymbol;
        direction: TDirection;
      }>,
    ) => {
      const { state, symbol, direction } = action.payload;

      const _tape = write(tape, state, symbol);

      switch (direction) {
        case "L":
          return moveLeft(_tape);
        case "R":
          return moveRight(_tape);
        case "S":
          return _tape;
      }
    },
  },
});

export const { step } = tapeSlice.actions;

export default tapeSlice.reducer;
