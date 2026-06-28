// Fetches TMDB upcoming movies on mount and stores them in Redux.
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS, buildTmdbUrl } from "../utils/constants";
import axios from "axios";
import { addUpcomingMovies } from "../utils/movieSlice";

const useUpcomingMovies = () => {
  const dispatch = useDispatch();
  const Upcoming = useCallback(async () => {
    try {
      const response = await axios.get(
        buildTmdbUrl("/movie/upcoming", { page: 1 }),
        API_OPTIONS
      );
      dispatch(addUpcomingMovies(response.data.results));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    Upcoming();
  }, [Upcoming]);
};

export default useUpcomingMovies;
