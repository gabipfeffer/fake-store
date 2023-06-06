import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../typings";
import { RootState } from "src/store";

export interface CartState {
  items: Product[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state: CartState, action: PayloadAction<Product>) => {
      state.items = [...state.items, action.payload];
    },
    removeFromCart: (
      state: CartState,
      action: PayloadAction<{ id: string }>
    ) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      const newCart = [...state.items];

      if (index >= 0) {
        //  The item exists
        newCart.splice(index, 1);
      } else {
        console.warn(
          `Cannot remove product ${action.payload.id} as it is not in the cart.`
        );
      }

      state.items = newCart;
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

export const selectItems = (state: RootState) => state.cart.items;
export const selectTotal = (state: RootState) =>
  state.cart.items.reduce((acc, item) => {
    acc += item.price;

    return acc;
  }, 0);

export default cartSlice.reducer;
