import { configureStore } from "@reduxjs/toolkit";

import usersReducer from "./userSlice";
import loadersReducer from "./loadersSlice";
import menuReducer from "./menuSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    loaders: loadersReducer,
    menus: menuReducer,
  },
});

export default store;
