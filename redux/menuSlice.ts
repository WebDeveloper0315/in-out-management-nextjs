// Redux slice for managing the selected menu item state
import { createSlice } from "@reduxjs/toolkit";

interface MenuState {
  selectedMenuItemKey: string | null;
}

// const initialState = {
//   selectedMenuItemKey: localStorage.getItem("currentMenuKey")
//     ? JSON.parse(localStorage.getItem("currentMenuKey") as string)
//     : null,
// };



const getInitialMenuState = (): MenuState => {
  
  const storedMenuKey = typeof window !== 'undefined' ? localStorage.getItem("currentMenuKey") : null;

  return {
    selectedMenuItemKey: storedMenuKey ? JSON.parse(storedMenuKey) : null,
  };
};

const initialState: MenuState = getInitialMenuState();

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setSelectedMenuItemKey: (state, action) => {
      state.selectedMenuItemKey = action.payload;
      localStorage.setItem("currentMenuKey", JSON.stringify(action.payload));
    },
  },
});

export const { setSelectedMenuItemKey } = menuSlice.actions;

export default menuSlice.reducer;
