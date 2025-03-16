import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS } from "../utils/constants";
import axios from "axios";
import { addUpcomingMovies } from "../utils/movieSlice";

const useUpcomingMovies = () => {
  const dispatch = useDispatch();
  const Upcoming = async () => {
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/movie/upcoming?&page=1",
        API_OPTIONS
      );
      dispatch(addUpcomingMovies(response.data.results));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    Upcoming();
  }, []);
};

export default useUpcomingMovies;
