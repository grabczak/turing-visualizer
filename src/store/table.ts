import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

import type { TDirection, TTable, TStateId, TSymbolId } from "src/types";

const initialState: TTable = {
  states: {
    q0: "q0",
    q1: "q1",
    q2: "q2",
    q3: "q3",
    q4: "q4",
    q5: "qH",
  },
  symbols: {
    "_": "_",
    "1": "1",
    "X": "X",
  },
  transitions: {
    q0: {
      "1": ["q1", "X", "R"],
      "_": ["q4", "_", "L"],
    },
    q1: {
      "1": ["q1", "1", "R"],
      "_": ["q2", "_", "L"],
    },
    q2: {
      "1": ["q3", "_", "L"],
      "X": ["q4", "_", "L"],
    },
    q3: {
      "1": ["q3", "1", "L"],
      "X": ["q0", "X", "R"],
    },
    q4: {
      X: ["q4", "1", "L"],
      _: ["q5", "_", "R"],
    },
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
    removeState: (table, action: PayloadAction<{ stateId: TStateId }>) => {
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
    },
    removeSymbol: (table, action: PayloadAction<{ symbolId: TSymbolId }>) => {
      const { symbolId } = action.payload;

      delete table.symbols[symbolId];

      for (const _stateId in table.transitions) {
        if (table.transitions[_stateId]) {
          delete table.transitions[_stateId][symbolId];
        }

        for (const _symbolId in table.transitions[_stateId]) {
          if (table.transitions[_stateId][_symbolId]?.[1] === symbolId) {
            table.transitions[_stateId][_symbolId] = ["", "", "S"];
          }
        }
      }
    },
    setTransition: (
      table,
      action: PayloadAction<{
        stateId: TStateId;
        symbolId: TSymbolId;
        nextStateId?: TStateId;
        nextSymbolId?: TSymbolId;
        direction?: TDirection;
      }>,
    ) => {
      const { stateId, symbolId, nextStateId, nextSymbolId, direction } = action.payload;

      if (!table.transitions[stateId]) {
        table.transitions[stateId] = {};
      }

      if (!table.transitions[stateId][symbolId]) {
        table.transitions[stateId][symbolId] = ["", "", "S"];
      }

      const t = table.transitions[stateId][symbolId];

      table.transitions[stateId][symbolId] = [nextStateId || t[0], nextSymbolId || t[1], direction || t[2]];
    },
    renameState: (table, action: PayloadAction<{ stateId: TStateId; stateName: TSymbolId }>) => {
      const { stateId, stateName } = action.payload;

      table.states[stateId] = stateName;
    },
    renameSymbol: (table, action: PayloadAction<{ symbolId: TStateId; symbolName: TSymbolId }>) => {
      const { symbolId, symbolName } = action.payload;

      table.symbols[symbolId] = symbolName;
    },
  },
});

export const { addState, removeState, addSymbol, removeSymbol, setTransition, renameState, renameSymbol } =
  tableSlice.actions;

export default tableSlice.reducer;
