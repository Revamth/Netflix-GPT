import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTrailerVideo } from "../utils/movieSlice";
import { BASE_URL, API_KEY } from "../utils/constants";

const useMovieTrailer = (movieId) => {
  const dispatch = useDispatch();
  const trailerVideo = useSelector((store) => store.movies.trailerVideo);

  const getMovieVideos = useCallback(async () => {
    try {
      const res = await fetch(
        `${BASE_URL}${movieId}/videos?api_key=${API_KEY}&language=en-US`
      );
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

  useEffect(() => {
    if (!trailerVideo && movieId) getMovieVideos();
  }, [movieId, trailerVideo, getMovieVideos]);
};

export default useMovieTrailer;
