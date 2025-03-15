import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { addUser, removeUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { NETFLIX_LOGO, USER_IMG } from "../utils/constants";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        navigate("/error");
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName } = user;
        dispatch(addUser({ uid, email, displayName }));
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="fixed top-0 left-0 right-0 px-4 md:px-8 py-3 bg-gradient-to-b from-black to-transparent z-10 w-full">
      <div className="flex justify-between items-center">
        <img src={NETFLIX_LOGO} alt="Netflix Logo" className="w-24 md:w-32" />

        {user && (
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            >
              <img
                src={USER_IMG}
                alt="User"
                className="w-8 h-8 md:w-10 md:h-10 rounded"
              />
              <span className="hidden md:inline text-sm text-white">
                {user.displayName}
              </span>
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

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-black bg-opacity-90 border border-gray-800 rounded-md shadow-lg">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-800">
                    {user.email}
                  </div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-red-600"
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
