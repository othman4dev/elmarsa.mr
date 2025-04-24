import { createSlice } from "@reduxjs/toolkit";

export const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    isFetching: false,
    error: null,
  },
  reducers: {
    getCategoryStart: (stat) => {
      stat.isFetching = true;
    },
    getCategorySuccuss: (stat, action) => {
      stat.isFetching = false;
      stat.categories = action.payload;
      stat.error = null;
    },
    getCategoryError: (stat, action) => {
      stat.error = action.payload;
    },
    createCategoryStart: (stat) => {
      stat.isFetching = true;
    },
    createCategorySuccuss: (stat, action) => {
      stat.isFetching = false;
      //console.log("action", action.payload);

      stat.categories.push(action.payload);
      stat.error = null;
    },
    createCategoryError: (stat, action) => {
      stat.error = action.payload;
    },
    removeStart: (stat) => {
      stat.isFetching = true;
    },
    removeCategory: (stat, action) => {
      stat.categories = stat.categories.filter(
        (item) => item._id !== action.payload
      );
    },
    removeError: (stat, action) => {
      stat.error = action.payload;
    },
  },
});
export const {
  getCategoryStart,
  getCategorySuccuss,
  getCategoryError,
  createCategoryStart,
  createCategorySuccuss,
  createCategoryError,
  removeStart,
  removeCategory,
  removeError,
} = categorySlice.actions;
export default categorySlice.reducer;
