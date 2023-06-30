import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/store";

export interface LoaderState {
  loading: boolean;
}

const initialState: LoaderState = {
  loading: false,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    setLoader: (state: LoaderState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoader } = loaderSlice.actions;

export const selectLoading = (state: RootState) => state.loader.loading;

export default loaderSlice.reducer;
