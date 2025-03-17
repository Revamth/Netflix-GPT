import { configureStore } from "@reduxjs/toolkit";
import useReducer from "./userSlice";
import moviesReducer from "./movieSlice";
import GptSliceReducer from "./gptSlice";

const appStore = configureStore({
  reducer: {
    user: useReducer,
    movies: moviesReducer,
    gptSlice: GptSliceReducer,
  },
});

export default appStore;
