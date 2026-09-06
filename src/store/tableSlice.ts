import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";
import type { EntityState, PayloadAction } from "@reduxjs/toolkit";

export type ID = string;

export type Phase = {
  id: ID;
  name: string;
};

export type Token = {
  id: ID;
  name: string;
};

export type Move = "L" | "S" | "R";

export type Transition = {
  nextPhaseId?: ID;
  nextTokenId?: ID;
  move: Move;
};

export type TableState = {
  phases: EntityState<Phase, ID>;
  tokens: EntityState<Token, ID>;
  transitions: Record<ID, Record<ID, Transition>>;
};

const phasesAdapter = createEntityAdapter<Phase>();
const tokensAdapter = createEntityAdapter<Token>();

const initialState: TableState = {
  phases: phasesAdapter.getInitialState(),
  tokens: tokensAdapter.getInitialState(),
  transitions: {},
};

const phaseSelectors = phasesAdapter.getSelectors(
  (state: TableState) => state.phases,
);
const tokenSelectors = tokensAdapter.getSelectors(
  (state: TableState) => state.tokens,
);

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    addPhase: {
      reducer(state, action: PayloadAction<Phase>) {
        phasesAdapter.addOne(state.phases, action.payload);
      },
      prepare(name: string) {
        return { payload: { id: nanoid(), name } };
      },
    },
    renamePhase(state, action: PayloadAction<{ id: ID; name: string }>) {
      const { id, name } = action.payload;

      phasesAdapter.updateOne(state.phases, { id, changes: { name } });
    },
    removePhase(state, action: PayloadAction<ID>) {
      const id = action.payload;

      phasesAdapter.removeOne(state.phases, id);
      delete state.transitions[id];

      for (const row of Object.values(state.transitions)) {
        for (const col of Object.values(row)) {
          if (col.nextPhaseId === id) {
            col.nextPhaseId = undefined;
          }
        }
      }
    },
    addToken: {
      reducer(state, action: PayloadAction<Token>) {
        tokensAdapter.addOne(state.tokens, action.payload);
      },
      prepare(name: string) {
        return { payload: { id: nanoid(), name } };
      },
    },
    renameToken(state, action: PayloadAction<{ id: ID; name: string }>) {
      const { id, name } = action.payload;

      tokensAdapter.updateOne(state.tokens, { id, changes: { name } });
    },
    removeToken(state, action: PayloadAction<ID>) {
      const id = action.payload;

      tokensAdapter.removeOne(state.tokens, id);
      for (const row of Object.values(state.transitions)) {
        delete row[id];

        for (const col of Object.values(row)) {
          if (col.nextTokenId === id) {
            col.nextTokenId = undefined;
          }
        }
      }
    },
    setTransition(
      state,
      action: PayloadAction<{
        phaseId: ID;
        tokenId: ID;
        changes: Partial<Transition>;
      }>,
    ) {
      const { phaseId, tokenId, changes } = action.payload;

      if (!state.transitions[phaseId]) {
        state.transitions[phaseId] = {};
      }

      if (!state.transitions[phaseId][tokenId]) {
        state.transitions[phaseId][tokenId] = {
          nextPhaseId: undefined,
          nextTokenId: undefined,
          move: "S",
        };
      }

      Object.assign(state.transitions[phaseId][tokenId], changes);
    },
  },
  selectors: {
    selectPhases: phaseSelectors.selectAll,
    selectPhaseById: phaseSelectors.selectById,
    selectTokens: tokenSelectors.selectAll,
    selectTokenById: tokenSelectors.selectById,
    selectTransitions: (state) => state.transitions,
  },
});

export const {
  addPhase,
  renamePhase,
  removePhase,
  addToken,
  renameToken,
  removeToken,
  setTransition,
} = tableSlice.actions;

export const {
  selectPhases,
  selectPhaseById,
  selectTokens,
  selectTokenById,
  selectTransitions,
} = tableSlice.selectors;

export default tableSlice.reducer;
