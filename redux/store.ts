"use client";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authSlice from "./auth/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

const initializeApp = async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refreshResult: any = await store.dispatch(
    apiSlice.endpoints.refreshToken.initiate(undefined, { forceRefetch: true })
  );

  if (refreshResult?.data) {
    await store.dispatch(
      apiSlice.endpoints.loadUser.initiate(undefined, { forceRefetch: true })
    );
  }
};

initializeApp();

export default store;