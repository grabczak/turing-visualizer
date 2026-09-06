import { configureStore } from "@reduxjs/toolkit";

import tableReducer from "@/store/tableSlice";

export const store = configureStore({
  reducer: {
    table: tableReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
