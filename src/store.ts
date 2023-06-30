import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartReducer";
import loaderReducer from "./slices/loaderReducer";
import { persistStore } from "redux-persist";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    loader: loaderReducer,
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
