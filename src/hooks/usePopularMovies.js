import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS } from "../utils/constants";
import axios from "axios";
import { addPopularMovies } from "../utils/movieSlice";

const usePopularMovies = () => {
  const dispatch = useDispatch();
  const fetchPopularMovies = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/movie/popular?&page=1",
        API_OPTIONS
      );
      dispatch(addPopularMovies(response.data.results));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPopularMovies();
  }, [fetchPopularMovies]);
};

export default usePopularMovies;
