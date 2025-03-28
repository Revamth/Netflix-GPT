import { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { NETFLIX_LOGO } from "../utils/constants";
import { toggleGptSearchView, removeGptResponse } from "../utils/gptSlice";

const Header = () => {
  const navigate = useNavigate();
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
      await signOut(auth);
      dispatch(removeUser());
      navigate("/");
    } catch (error) {
      alert(`Sign-out failed: ${error.message}`);
    }
  };

  const gptSearchHandler = () => {
    if (isGpt) {
      navigate("/browse");
      dispatch(removeGptResponse());
    }
    dispatch(toggleGptSearchView());
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          addUser({
            uid: user.uid,
            email: user.email,
          })
        );
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate]);

  return (
    <div className="fixed top-0 left-0 right-0 px-4 py-3 bg-gradient-to-b from-black to-transparent z-50">
      <div className="flex justify-between items-center">
        <img src={NETFLIX_LOGO} alt="Netflix Logo" className="w-24 md:w-32" />
        {user && (
          <div className="relative">
            <div className="flex items-center gap-4">
              <button
                className="bg-white hover:bg-opacity-80 text-black px-4 py-2 rounded font-semibold flex items-center justify-center transition-all duration-200"
                onClick={gptSearchHandler}
              >
                {isGpt ? "Home Page" : "Show GPT Search"}
              </button>

              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowMenu(!showMenu)}
              >
                <img src={userImg} alt="User" className="w-10 h-10 rounded" />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
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
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-black bg-opacity-90 border border-gray-800 rounded-md shadow-lg">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-800">
                    {user.email}
                  </div>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-red-600"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
