// Presentational top bar: logo, GPT-search toggle, user avatar + sign-out menu.
// Auth state comes from Redux; the auth listener lives in AppLayout.
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useSelector, useDispatch } from "react-redux";
import { NETFLIX_LOGO } from "../utils/constants";
import { toggleGptSearchView, removeGptResponse } from "../utils/gptSlice";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isGpt = useSelector((state) => state.gptSlice.showGptSearch);
  const [showMenu, setShowMenu] = useState(false);

  const userImg = user?.email
    ? `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(
        user.email
      )}`
    : `https://api.dicebear.com/7.x/fun-emoji/svg?seed=Guest`;

  const handleSignOut = async () => {
    try {
      // AppLayout's auth listener clears the user and redirects on sign-out.
      await signOut(auth);
    } catch (error) {
      alert(`Sign-out failed: ${error.message}`);
    }
  };

  const gptSearchHandler = () => {
    // Toggle between the GPT view and the normal Browse view (same route).
    if (isGpt) {
      dispatch(removeGptResponse());
    }
    dispatch(toggleGptSearchView());
  };

  return (
    <div className="fixed top-0 left-0 right-0 px-4 py-3 bg-gradient-to-b from-black/90 via-black/40 to-transparent z-50">
      <div className="flex justify-between items-center">
        <img src={NETFLIX_LOGO} alt="CineStream" className="w-32 md:w-40" />
        {user && (
          <div className="relative">
            <div className="flex items-center gap-3 md:gap-4">
              <button
                className="bg-white hover:bg-white/80 text-black px-3 md:px-4 py-2 rounded font-semibold flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                onClick={gptSearchHandler}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isGpt
                        ? "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        : "M11 4a7 7 0 104.9 12.32l4.39 4.39 1.41-1.41-4.39-4.39A7 7 0 0011 4z"
                    }
                  />
                </svg>
                <span className="hidden sm:inline">
                  {isGpt ? "Home Page" : "Show GPT Search"}
                </span>
              </button>

              <div
                className="relative flex items-center gap-2 cursor-pointer group"
                onClick={() => setShowMenu(!showMenu)}
              >
                <img
                  src={userImg}
                  alt="User"
                  className="w-10 h-10 rounded ring-2 ring-transparent group-hover:ring-white/60 transition-all duration-200"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 text-white transition-transform duration-200 ${
                    showMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <div
              className={`absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm border border-gray-800 rounded-md shadow-lg origin-top-right transition-all duration-150 ${
                showMenu
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-800 truncate">
                  {user.email}
                </div>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-red-600 transition-colors duration-150 focus:outline-none focus-visible:bg-red-600"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
