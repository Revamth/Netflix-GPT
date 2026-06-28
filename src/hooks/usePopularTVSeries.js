import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS, buildTmdbUrl } from "../utils/constants";
import axios from "axios";
import { addPopularTVSeries } from "../utils/movieSlice";

const usePopularTVSeries = () => {
  const dispatch = useDispatch();
  const fetchPopularTVSeries = useCallback(async () => {
    try {
      const response = await axios.get(
        buildTmdbUrl("/tv/popular", { page: 1 }),
        API_OPTIONS
      );
      dispatch(addPopularTVSeries(response.data.results));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPopularTVSeries();
  }, [fetchPopularTVSeries]);
};

export default usePopularTVSeries;
