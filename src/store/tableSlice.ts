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

const initialPhases: Phase[] = [
  { id: "q0", name: "q0" },
  { id: "q1", name: "q1" },
  { id: "q2", name: "q2" },
  { id: "q3", name: "q3" },
  { id: "q4", name: "q4" },
  { id: "q5", name: "q5" },
  { id: "qa", name: "qa" },
  { id: "qr", name: "qr" },
];

const initialTokens: Token[] = [
  { id: "t0", name: "0" },
  { id: "t1", name: "1" },
  { id: "tx", name: "X" },
  { id: "tb", name: "\u2423" },
];

const initialTransitions: Record<ID, Record<ID, Transition>> = {
  q0: {
    t0: { nextPhaseId: "q1", nextTokenId: "tx", move: "R" },
    t1: { nextPhaseId: "q2", nextTokenId: "tx", move: "R" },
    tx: { nextPhaseId: "qa", nextTokenId: "tx", move: "S" },
    tb: { nextPhaseId: "qa", nextTokenId: "tb", move: "S" },
  },
  q1: {
    t0: { nextPhaseId: "q1", nextTokenId: "t0", move: "R" },
    t1: { nextPhaseId: "q1", nextTokenId: "t1", move: "R" },
    tx: { nextPhaseId: "q3", nextTokenId: "tx", move: "L" },
    tb: { nextPhaseId: "q3", nextTokenId: "tb", move: "L" },
  },
  q2: {
    t0: { nextPhaseId: "q2", nextTokenId: "t0", move: "R" },
    t1: { nextPhaseId: "q2", nextTokenId: "t1", move: "R" },
    tx: { nextPhaseId: "q4", nextTokenId: "tx", move: "L" },
    tb: { nextPhaseId: "q4", nextTokenId: "tb", move: "L" },
  },
  q3: {
    t0: { nextPhaseId: "q5", nextTokenId: "tx", move: "L" },
    t1: { nextPhaseId: "qr", nextTokenId: "t1", move: "S" },
    tx: { nextPhaseId: "qa", nextTokenId: "tx", move: "S" },
    tb: { nextPhaseId: "qa", nextTokenId: "tb", move: "S" },
  },
  q4: {
    t0: { nextPhaseId: "qr", nextTokenId: "t0", move: "S" },
    t1: { nextPhaseId: "q5", nextTokenId: "tx", move: "L" },
    tx: { nextPhaseId: "qa", nextTokenId: "tx", move: "S" },
    tb: { nextPhaseId: "qa", nextTokenId: "tb", move: "S" },
  },
  q5: {
    t0: { nextPhaseId: "q5", nextTokenId: "t0", move: "L" },
    t1: { nextPhaseId: "q5", nextTokenId: "t1", move: "L" },
    tx: { nextPhaseId: "q0", nextTokenId: "tx", move: "R" },
    tb: { nextPhaseId: "q0", nextTokenId: "tb", move: "R" },
  },
};

const initialState: TableState = {
  phases: phasesAdapter.setAll(phasesAdapter.getInitialState(), initialPhases),
  tokens: tokensAdapter.setAll(tokensAdapter.getInitialState(), initialTokens),
  transitions: initialTransitions,
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
    selectTransitionByPhaseIdAndTokenId: (state, phaseId: ID, tokenId: ID) =>
      state.transitions[phaseId]?.[tokenId],
    selectNextPhaseByPhaseIdAndTokenId: (state, phaseId: ID, tokenId: ID) => {
      const nextPhaseId = state.transitions[phaseId]?.[tokenId]?.nextPhaseId;
      return nextPhaseId
        ? phaseSelectors.selectById(state, nextPhaseId)
        : undefined;
    },
    selectNextTokenByPhaseIdAndTokenId: (state, phaseId: ID, tokenId: ID) => {
      const nextTokenId = state.transitions[phaseId]?.[tokenId]?.nextTokenId;
      return nextTokenId
        ? tokenSelectors.selectById(state, nextTokenId)
        : undefined;
    },
    selectMoveByPhaseIdAndTokenId: (state, phaseId: ID, tokenId: ID) => {
      return state.transitions[phaseId]?.[tokenId]?.move;
    },
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
  selectTransitionByPhaseIdAndTokenId,
  selectNextPhaseByPhaseIdAndTokenId,
  selectNextTokenByPhaseIdAndTokenId,
  selectMoveByPhaseIdAndTokenId,
} = tableSlice.selectors;

export default tableSlice.reducer;
