import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalCart: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    totalCartItem: (state, action) => {
      state.totalCart = action.payload;
    },
  },
});

export const { totalCartItem } = cartSlice.actions;

export default cartSlice.reducer;