import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalWishlistItem: 0,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  wishlistItem: (state, action) => {
    state.totalWishlistItem = action.payload;
  },
});

export const { wishlistItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;
