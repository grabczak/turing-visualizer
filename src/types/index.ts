export type TStateId = string;

export type TStateName = string;

export type TSymbolId = string;

export type TSymbolName = string;

export type TCellId = string;

export type TStates = Record<TStateId, TStateName>;

export type TSymbols = Record<TSymbolId, TSymbolName>;

export type TDirection = "L" | "R" | "S";

export type TTransition = [TStateId, TSymbolId, TDirection];

export type TTransitions = Record<TStateId, Record<TSymbolId, TTransition | undefined> | undefined>;

export type TStatus = "idle" | "running" | "paused" | "done";

export type TTable = {
  states: TStates;
  symbols: TSymbols;
  transitions: TTransitions;
};

export type TCell = {
  id: TCellId;
  symbolId: TSymbolId;
};

export type TTape = {
  stateId: TStateId;
  status: TStatus;
  left: TCell[];
  head: TCell;
  right: TCell[];
};
