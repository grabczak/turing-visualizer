export type TState = string;

export type TSymbol = string;

export type TDirection = "L" | "R" | "S";

export type TTransition = Record<TState, Record<TSymbol, [TState, TSymbol, TDirection] | null>>;
