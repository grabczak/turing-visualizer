import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { TState, TSymbol, TDirection, TTransition } from "src/types";

const initialState: TTransition = {
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

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    addState: (state, action: PayloadAction<TState>) => {
      state[action.payload] = {};
    },
    removeState: (state, action: PayloadAction<TState>) => {
      delete state[action.payload];

      for (const st in state) {
        for (const sym in state[st]) {
          if (state[st][sym]?.[0] === action.payload) {
            state[st][sym] = null;
          }
        }
      }
    },
    addSymbol: (state, action: PayloadAction<TSymbol>) => {
      for (const s in state) {
        state[s][action.payload] = null;
      }
    },
    removeSymbol: (state, action: PayloadAction<TSymbol>) => {
      for (const s in state) {
        delete state[s][action.payload];
      }
    },
    setTransition: (
      state,
      action: PayloadAction<{
        fromState: TState;
        symbol: TSymbol;
        toState: TState;
        writeSymbol: TSymbol;
        direction: TDirection;
      }>,
    ) => {
      const { fromState, symbol, toState, writeSymbol, direction } = action.payload;

      if (state[fromState]) {
        state[fromState][symbol] = [toState, writeSymbol, direction];
      }
    },
    removeTransition: (state, action: PayloadAction<{ fromState: TState; symbol: TSymbol }>) => {
      const { fromState, symbol } = action.payload;

      if (state[fromState]) {
        state[fromState][symbol] = null;
      }
    },
  },
});

export const { addState, removeState, addSymbol, removeSymbol, setTransition, removeTransition } = counterSlice.actions;

export default counterSlice.reducer;
