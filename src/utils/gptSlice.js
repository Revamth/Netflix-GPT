import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gptSlice",
  initialState: {
    showGptSearch: false,
    moviesList: null, // array of { title, year, reason }
    moviesResult: null, // array of TMDB result arrays, aligned by index
    gptLoading: false,
    gptError: null,
  },
  reducers: {
    toggleGptSearchView: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    addGptResponse: (state, action) => {
      const { moviesList, moviesResult } = action.payload;
      state.moviesList = moviesList;
      state.moviesResult = moviesResult;
      state.gptError = null;
    },
    // Explicit set (not a toggle) so rapid double-submits can't desync it.
    setGptLoading: (state, action) => {
      state.gptLoading = action.payload;
    },
    setGptError: (state, action) => {
      state.gptError = action.payload;
      state.gptLoading = false;
    },
    removeGptResponse: (state) => {
      state.moviesList = null;
      state.moviesResult = null;
      state.gptError = null;
    },
  },
});

export const {
  toggleGptSearchView,
  addGptResponse,
  setGptLoading,
  setGptError,
  removeGptResponse,
} = gptSlice.actions;
export default gptSlice.reducer;
