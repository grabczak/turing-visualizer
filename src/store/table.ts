import { createSlice } from "@reduxjs/toolkit";
import { type PayloadAction, nanoid } from "@reduxjs/toolkit";

import type { TDirection, TTable } from "src/types";

const initialState: TTable = {
  states: {
    "st-0": "q0", // Start
    "st-1": "qMarkKeep", // Mark 1 to keep
    "st-2": "qSkipOne", // Skip next 1
    "st-3": "qReturn", // Go back to start
    "st-4": "qClean", // Cleanup phase
    "st-5": "qH", // Halt
  },
  symbols: {
    "sym-1": "1",
    "sym-x": "X",
    "sym-y": "Y",
    "sym-b": "_",
  },
  transitions: {
    // q0
    "st-0": {
      "sym-1": ["st-1", "sym-x", "R"],
      "sym-x": ["st-4", "sym-x", "R"],
      "sym-b": ["st-4", "sym-b", "L"],
    },
    // qMarkKeep
    "st-1": {
      "sym-1": ["st-2", "sym-y", "R"],
      "sym-y": ["st-2", "sym-y", "R"],
      "sym-x": ["st-2", "sym-x", "R"],
      "sym-b": ["st-3", "sym-b", "L"],
    },
    // qSkipOne
    "st-2": {
      "sym-1": ["st-3", "sym-1", "L"],
      "sym-y": ["st-3", "sym-y", "L"],
      "sym-b": ["st-3", "sym-b", "L"],
    },
    // qReturn
    "st-3": {
      "sym-1": ["st-3", "sym-1", "L"],
      "sym-y": ["st-3", "sym-y", "L"],
      "sym-x": ["st-0", "sym-x", "R"],
      "sym-b": ["st-0", "sym-b", "R"],
    },
    // qClean
    "st-4": {
      "sym-x": ["st-4", "sym-1", "R"],
      "sym-y": ["st-4", "sym-b", "R"],
      "sym-b": ["st-5", "sym-b", "S"],
    },
    // qH (halt)
    "st-5": {},
  },
};

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    addState: (table) => {
      const stateId = nanoid();

      table.states[stateId] = `q${Object.keys(table.states).length}`;
    },
    removeState: (table, action: PayloadAction<{ stateId: string }>) => {
      const { stateId } = action.payload;

      delete table.states[stateId];

      delete table.transitions[stateId];

      for (const _stateId in table.transitions) {
        for (const _symbolId in table.transitions[_stateId]) {
          if (table.transitions[_stateId][_symbolId]?.[0] === stateId) {
            table.transitions[_stateId][_symbolId] = ["", "", "S"];
          }
        }
      }
    },
    addSymbol: (table) => {
      const symbolId = nanoid();

      table.symbols[symbolId] = `${Object.keys(table.symbols).length}`;

      for (const s in table.transitions) {
        table.transitions[s][nanoid()] = ["", "", "S"];
      }
    },
    removeSymbol: (table, action: PayloadAction<{ symbolId: string }>) => {
      const { symbolId } = action.payload;

      delete table.symbols[symbolId];

      for (const s in table.transitions) {
        delete table.transitions[s][symbolId];
      }
    },
    setTransition: (
      table,
      action: PayloadAction<{
        stateId: string;
        symbolId: string;
        nextStateId?: string;
        nextSymbolId?: string;
        direction?: TDirection;
      }>,
    ) => {
      const { stateId, symbolId, nextStateId, nextSymbolId, direction } = action.payload;

      const row = table.transitions[stateId];

      if (row) {
        const col = row[symbolId];

        if (col) {
          table.transitions[stateId][symbolId] = [nextStateId || col[0], nextSymbolId || col[1], direction || col[2]];
        } else {
          table.transitions[stateId][symbolId] = [nextStateId || "", nextSymbolId || "", direction || "S"];
        }
      }
    },
    removeTransition: (table, action: PayloadAction<{ stateId: string; symbolId: string }>) => {
      const { stateId, symbolId } = action.payload;

      if (table.transitions[stateId]) {
        table.transitions[stateId][symbolId] = ["", "", "S"];
      }
    },
    renameState: (table, action: PayloadAction<{ stateId: string; stateName: string }>) => {
      const { stateId, stateName } = action.payload;

      table.states[stateId] = stateName;
    },
    renameSymbol: (table, action: PayloadAction<{ symbolId: string; symbolName: string }>) => {
      const { symbolId, symbolName } = action.payload;

      table.symbols[symbolId] = symbolName;
    },
  },
});

export const {
  addState,
  removeState,
  addSymbol,
  removeSymbol,
  setTransition,
  removeTransition,
  renameState,
  renameSymbol,
} = tableSlice.actions;

export default tableSlice.reducer;
