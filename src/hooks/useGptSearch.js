import { useState, useCallback } from "react";
import { API_OPTIONS, buildTmdbUrl, AI_SEARCH_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addGptResponse, toggleGptInputButton } from "../utils/gptSlice";

const useGptSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch();

  const searchMovieTMDB = useCallback(async (movie) => {
    try {
      const response = await fetch(
        buildTmdbUrl("/search/movie", {
          query: movie,
          include_adult: "false",
          language: "en-US",
          page: 1,
        }),
        API_OPTIONS
      );

      if (!response.ok) {
        throw new Error(`TMDB API returned ${response.status}`);
      }

      const json = await response.json();
      return json.results || [];
    } catch (error) {
      console.error(`Error fetching movie "${movie}":`, error);
      return [];
    }
  }, []);

  const getResponseForGivenPrompt = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    dispatch(toggleGptInputButton());

    try {
      // Call our server-side proxy so the API key stays off the client bundle
      // (see api/ai-search.js, backed by Groq).
      const res = await fetch(AI_SEARCH_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: inputValue }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || `Gemini API returned ${res.status}`);
      }

      const moviesList = data.movies || [];

      if (moviesList.length > 0) {
        setInputValue("");
        const promiseArray = moviesList.map((movie) => searchMovieTMDB(movie));
        const moviesResult = await Promise.all(promiseArray);

        dispatch(addGptResponse({ moviesList, moviesResult }));
        dispatch(toggleGptInputButton());
      } else {
        throw new Error("No movie recommendations received");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Something went wrong. Please try again.");
      dispatch(toggleGptInputButton());
    }
  };

  return { inputValue, setInputValue, getResponseForGivenPrompt };
};

export default useGptSearch;
