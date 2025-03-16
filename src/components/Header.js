import React, { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { NETFLIX_LOGO, USER_IMG } from "../utils/constants";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSignOut = () => {
    signOut(auth).catch(() => navigate("/error"));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          addUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 transition-all duration-500 ${
        isScrolled
          ? "bg-black"
          : "bg-gradient-to-b from-black via-black-opacity-80 to-transparent"
      }`}
    >
      <div className="flex justify-between items-center">
        <img src={NETFLIX_LOGO} alt="Netflix Logo" className="w-24 md:w-32" />
        {user && (
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            >
              <img src={USER_IMG} alt="User" className="w-8 h-8 rounded" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 text-white transition-transform duration-300 ${
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
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-black bg-opacity-90 border border-gray-800 rounded shadow-lg overflow-hidden">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-800">
                    {user.email}
                  </div>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-red-600 transition-colors duration-300"
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
