import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addTrailerVideo } from "../utils/movieSlice";
import { API_OPTIONS, buildTmdbUrl } from "../utils/constants";

const useMovieTrailer = (movieId) => {
  const dispatch = useDispatch();

  const getMovieVideos = useCallback(async () => {
    try {
      const res = await fetch(
        buildTmdbUrl(`/movie/${movieId}/videos`, { language: "en-US" }),
        API_OPTIONS
      );

      if (!res.ok) {
        throw new Error(`TMDB API returned ${res.status}`);
      }

      const data = await res.json();

      if (!data.results) {
        console.error("No results found");
        return;
      }

      const filteredData = data.results.filter(
        (video) => video.type === "Trailer"
      );
      const trailer = filteredData.length ? filteredData[0] : data.results[0];

      if (trailer) {
        dispatch(addTrailerVideo(trailer));
      }
    } catch (error) {
      console.error("Error fetching movie videos:", error);
    }
  }, [dispatch, movieId]);

  // Refetch whenever the movieId changes (previously gated on a cached trailer,
  // which froze the hero to the first trailer ever fetched).
  useEffect(() => {
    if (movieId) getMovieVideos();
  }, [movieId, getMovieVideos]);
};

export default useMovieTrailer;
