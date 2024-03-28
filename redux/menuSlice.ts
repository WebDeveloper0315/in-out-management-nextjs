// Redux slice for managing the selected menu item state
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedMenuItemKey: null,
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setSelectedMenuItemKey: (state, action) => {
      state.selectedMenuItemKey = action.payload;
    },
  },
});

export const { setSelectedMenuItemKey } = menuSlice.actions;

export default menuSlice.reducer;
