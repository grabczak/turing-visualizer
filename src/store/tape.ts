import { createSlice } from "@reduxjs/toolkit";
import { type PayloadAction, nanoid } from "@reduxjs/toolkit";

import type { TTape, TDirection, TCell } from "src/types";

const createCell = (symbolId: string): TCell => ({ id: nanoid(), symbolId });

const write = (tape: TTape, stateId: string, symbolId: string): TTape => {
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
  },
});

export const { step } = tapeSlice.actions;

export default tapeSlice.reducer;
