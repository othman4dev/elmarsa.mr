import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isFetching: false,
    error: null,
  },
  reducers: {
    loginStart: (stat) => {
      stat.isFetching = true;
    },
    loginSuccuss: (stat, action) => {
      stat.isFetching = false;
      stat.currentUser = action.payload;
      stat.error = null;
    },
    loginError: (stat, action) => {
      stat.error = action.payload;
    },

    updateStart: (stat) => {
      stat.isFetching = true;
    },
    updateSuccuss: (stat, action) => {
      stat.isFetching = false;
      stat.currentUser = action.payload.user;
      stat.error = null;
    },
    updateError: (stat, action) => {
      stat.error = action.payload;
    },
    setUser: (state, action) => {
      state.currentUser = action.payload;  // On met directement l'utilisateur dans le state
    },
    logOut: (stat) => {
      stat.currentUser = null;
    },
    removeFavorite: (stat, action) => {
      stat.currentUser.favorites = stat.currentUser.favorites.filter(
        (item) => item !== action.payload
      );
    },
    addFavorite: (stat, action) => {
      stat.currentUser.favorites.push(action.payload);
    },
    updateUserRole: (state, action) => {
      if (state.currentUser) {
        state.currentUser.role = action.payload;
      }
    },
  },
});
export const {
  loginStart,
  loginSuccuss,
  loginError,
  addFavorite,
  removeFavorite,
  updateStart,
  updateSuccuss,
  updateError,
  logOut,
  setUser,
  updateUserRole
} = userSlice.actions;
export default userSlice.reducer;
