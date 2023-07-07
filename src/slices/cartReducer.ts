import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartShipping, Product } from "../../typings";
import { RootState } from "src/store";
import { shippingMethods } from "src/constants/bamboo";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

export interface CartState {
  items: CartItem[];
  shipping: CartShipping;
}

const initialState: CartState = {
  items: [],
  shipping: shippingMethods.UY[0],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state: CartState,
      action: PayloadAction<{ quantity: number; product: Product }>
    ) => {
      const index = state.items.findIndex(
        (item) => item.product.id === action.payload.product.id
      );

      const newCart = [...state.items];

      if (index >= 0) {
        //  The item exists
        newCart[index] = {
          ...newCart[index],
          quantity: newCart[index].quantity + action.payload.quantity,
        };

        state.items = newCart;
      } else {
        state.items = [...state.items, action.payload];
      }
    },
    updateQuantity: (
      state: CartState,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const index = state.items.findIndex(
        (item) => item.product.id === action.payload.id
      );

      const newCart = [...state.items];

      if (index >= 0) {
        //  The item exists
        newCart[index] = {
          ...newCart[index],
          quantity: action.payload.quantity,
        };
      } else {
        console.warn(
          `Cannot remove product ${action.payload.id} as it is not in the cart.`
        );
      }

      state.items = newCart;
    },
    removeFromCart: (
      state: CartState,
      action: PayloadAction<{ id: string }>
    ) => {
      const index = state.items.findIndex(
        (item) => item.product.id === action.payload.id
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
    updatedShippingMethod: (
      state: CartState,
      action: PayloadAction<{ shippingMethod: CartShipping }>
    ) => {
      state.shipping = action.payload.shippingMethod;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  updatedShippingMethod,
} = cartSlice.actions;

export const selectItems = (state: RootState) => state.cart.items;
export const selectSubtotal = (state: RootState) =>
  state.cart.items.reduce((acc, item) => {
    acc += item.product.price * item.quantity;

    return acc;
  }, 0);
export const selectQuantity = (state: RootState) =>
  state.cart.items.reduce((acc, item) => {
    acc += item.quantity;

    return acc;
  }, 0);
export const selectShipping = (state: RootState) => state.cart.shipping;
export const selectTotal = (state: RootState) =>
  state.cart.items.reduce((acc, item) => {
    acc += item.product.price * item.quantity;

    return acc;
  }, 0) +
  (typeof state.cart.shipping.price === "number"
    ? state.cart.shipping.price
    : 0);

const persistConfig = {
  key: "root",
  storage,
};

export default persistReducer(persistConfig, cartSlice.reducer);
