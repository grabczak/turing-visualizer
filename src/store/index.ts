import { configureStore } from "@reduxjs/toolkit";
import tableReducer from "./table";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

export const store = configureStore({
  reducer: { table: tableReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export * from "./table";
