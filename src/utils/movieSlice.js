import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    nowPlayingMovies: null,
    trailerVideo: null,
    popularMovies: null,
    topRatedMovies: null,
    upcomingMovies: null,
    trendingMovies: null,
    popularTVSeries: null,
    topRatedTVSeries: null,
  },
  reducers: {
    addNowPlayingMovie: (state, action) => {
      state.nowPlayingMovies = action.payload;
    },
    addTrailerVideo: (state, action) => {
      state.trailerVideo = action.payload;
    },
    addPopularMovies: (state, action) => {
      state.popularMovies = action.payload;
    },
    addTopRatedMovies: (state, action) => {
      state.topRatedMovies = action.payload;
    },
    addUpcomingMovies: (state, action) => {
      state.upcomingMovies = action.payload;
    },
    addTrendingMovies: (state, action) => {
      state.trendingMovies = action.payload;
    },
    addPopularTVSeries: (state, action) => {
      state.popularTVSeries = action.payload;
    },
    addTopRatedTVSeries: (state, action) => {
      state.topRatedTVSeries = action.payload;
    },
  },
});

export const {
  addNowPlayingMovie,
  addTrailerVideo,
  addPopularMovies,
  addTopRatedMovies,
  addUpcomingMovies,
  addTrendingMovies,
  addPopularTVSeries,
  addTopRatedTVSeries,
} = movieSlice.actions;

export default movieSlice.reducer;
