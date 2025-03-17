import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gptSlice",
  initialState: {
    showGptSearch: false,
    moviesList: null,
    moviesResult: null,
    gptInputBtn: false,
  },
  reducers: {
    toggleGptSearchView: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    addGptResponse: (state, action) => {
      const { moviesList, moviesResult } = action.payload;
      state.moviesList = moviesList;
      state.moviesResult = moviesResult;
    },
    toggleGptInputButton: (state) => {
      state.gptInputBtn = !state.gptInputBtn;
    },
    removeGptResponse: (state) => {
      state.moviesList = null;
      state.moviesResult = null;
    },
  },
});

export const {
  toggleGptSearchView,
  addGptResponse,
  toggleGptInputButton,
  removeGptResponse,
} = gptSlice.actions;
export default gptSlice.reducer;
