import { useState } from "react";
import { API_OPTIONS } from "../utils/constants";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useDispatch } from "react-redux";
import { addGptResponse, toggleGptInputButton } from "../utils/gptSlice";
import { GEMINI_KEY } from "../utils/constants";

const useGptSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch();

  const genAI = new GoogleGenerativeAI(GEMINI_KEY);

  const searchMovieTMDB = async (movie) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&language=en-US&page=1`,
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
  };

  const getResponseForGivenPrompt = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    dispatch(toggleGptInputButton());

    try {
      const model = await genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      const prompt = `Act as a Movie Recommendation system and suggest some movies for the query: "${inputValue}". 
      Only give me names of 5 movies, comma-separated like this example: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya.`;

      const result = await model.generateContent([prompt]);
      const response = result?.response?.text();

      if (!response) {
        throw new Error("Empty response from Gemini API");
      }

      const moviesList = response
        .split(",")
        .map((movie) => movie.trim())
        .filter((movie) => movie);

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
