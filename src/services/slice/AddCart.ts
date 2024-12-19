import { createSlice } from "@reduxjs/toolkit";

const initialCartState = {
    items: [],
  };

  
const cartSlice = createSlice({
    name: 'cart',
    initialState:initialCartState,
    reducers: {
      addToCart(state, action) {
        const item = action.payload;
        state.items.push(item);
      },
      // Add more reducers as needed
    },
  });
  
  export const { addToCart } = cartSlice.actions;
  
  export default cartSlice.reducer;