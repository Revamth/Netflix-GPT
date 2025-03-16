import { useEffect } from "react";
import axios from "axios";
import { API_OPTIONS } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addTrendingMovies } from "../utils/movieSlice";

const useTrendingMovies = () => {
  const dispatch = useDispatch();
  const TrendingMovies = async () => {
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/trending/movie/day?",
        API_OPTIONS
      );
      dispatch(addTrendingMovies(response.data.results));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    TrendingMovies();
  }, []);
};

export default useTrendingMovies;
