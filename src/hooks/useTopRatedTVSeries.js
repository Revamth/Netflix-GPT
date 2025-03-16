import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS } from "../utils/constants";
import axios from "axios";
import { addTopRatedTVSeries } from "../utils/movieSlice";

const useTopRatedTVSeries = () => {
  const dispatch = useDispatch();
  const TopRatedTVSeries = async () => {
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/tv/top_rated?&page=1",
        API_OPTIONS
      );
      dispatch(addTopRatedTVSeries(response.data.results));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    TopRatedTVSeries();
  }, []);
};

export default useTopRatedTVSeries;
