import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS } from "../utils/constants";
import axios from "axios";
import { addTopRatedMovies } from "../utils/movieSlice";

const useTopRated = () => {
  const dispatch = useDispatch();
  const TopRated = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/movie/top_rated?&page=1",
        API_OPTIONS
      );
      dispatch(addTopRatedMovies(response.data.results));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    TopRated();
  }, [TopRated]);
};

export default useTopRated;
