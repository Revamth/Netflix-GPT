import { useEffect, useCallback } from "react";
import axios from "axios";
import { API_OPTIONS, buildTmdbUrl } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addNowPlayingMovie } from "../utils/movieSlice";

const useNowPlayingMovies = () => {
  const dispatch = useDispatch();

  const getNowPlayingMovies = useCallback(async () => {
    try {
      const response = await axios.get(
        buildTmdbUrl("/movie/now_playing", { page: 1 }),
        API_OPTIONS
      );
      dispatch(addNowPlayingMovie(response.data.results));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    getNowPlayingMovies();
  }, [getNowPlayingMovies]);
};

export default useNowPlayingMovies;
