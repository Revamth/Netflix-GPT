import { useState, useCallback } from "react";
import { API_OPTIONS, buildTmdbUrl, AI_SEARCH_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import {
  addGptResponse,
  setGptLoading,
  setGptError,
} from "../utils/gptSlice";

const useGptSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch();

  // Search TMDB for one recommendation, matching by title AND year when the
  // AI provided a year, then returning the most popular matching result.
  const searchMovieTMDB = useCallback(async ({ title, year }) => {
    try {
      const response = await fetch(
        buildTmdbUrl("/search/movie", {
          query: title,
          include_adult: "false",
          language: "en-US",
          page: 1,
          ...(year ? { primary_release_year: year } : {}),
        }),
        API_OPTIONS
      );

      if (!response.ok) {
        throw new Error(`TMDB API returned ${response.status}`);
      }

      const json = await response.json();
      const results = (json.results || []).filter((m) => m.poster_path);
      // Best hit = highest popularity among matches.
      results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      return results;
    } catch (error) {
      console.error(`Error fetching movie "${title}":`, error);
      return [];
    }
  }, []);

  const getResponseForGivenPrompt = async (e) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query) return;

    dispatch(setGptLoading(true));

    try {
      // Server-side proxy (Groq) — keeps the API key off the client bundle.
      const res = await fetch(AI_SEARCH_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || `AI request failed (${res.status})`);
      }

      const moviesList = data.movies || [];

      if (moviesList.length === 0) {
        throw new Error("No recommendations found. Try a different prompt.");
      }

      setInputValue("");
      const moviesResult = await Promise.all(
        moviesList.map((movie) => searchMovieTMDB(movie))
      );

      dispatch(addGptResponse({ moviesList, moviesResult }));
      dispatch(setGptLoading(false));
    } catch (error) {
      console.error("GPT search error:", error);
      dispatch(setGptError(error.message || "Something went wrong."));
    }
  };

  return { inputValue, setInputValue, getResponseForGivenPrompt };
};

export default useGptSearch;
