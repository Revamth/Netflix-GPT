import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { checkValidity } from "../utils/validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSignInForm, setSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const toggleSignInForm = () => {
    setSignInForm(!isSignInForm);
  };

  const username = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const handleButtonClick = () => {
    const emailValue = email.current ? email.current.value : "";
    const passwordValue = password.current ? password.current.value : "";
    const usernameValue = username.current ? username.current.value : "";

    const message = checkValidity(
      emailValue,
      passwordValue,
      isSignInForm ? null : usernameValue
    );
    setErrorMessage(message);
    if (message) return;

    if (!isSignInForm) {
      createUserWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: usernameValue,
          })
            .then(() => {
              const { uid, email, displayName } = auth.currentUser;
              dispatch(addUser({ uid, email, displayName }));
              navigate("/browse");
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              setErrorMessage(errorCode + "-" + errorMessage);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    } else {
      signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCredential) => {
          const user = userCredential.user;
          navigate("/browse");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    }
  };

  return (
    <div className="min-h-screen relative">
      <Header />

      <div className="absolute inset-0 w-full">
        <img
          className="w-full h-full object-cover"
          src="https://assets.nflxext.com/ffe/siteui/vlv3/50fcc930-ba3f-4cae-9257-9f920e30a998/web/IN-en-20250310-TRIFECTA-perspective_739387a0-ff14-44ed-a5af-36e5aa4d236e_large.jpg"
          alt="Netflix Background"
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <form
          className="p-12 bg-black bg-opacity-70 rounded-lg shadow-2xl w-full max-w-md mx-4 backdrop-blur-sm"
          onSubmit={(e) => {
            e.preventDefault();
            handleButtonClick();
          }}
        >
          <h1 className="font-bold text-3xl text-white mb-8">
            {isSignInForm ? "Sign In" : "Sign Up"}
          </h1>

          {!isSignInForm && (
            <input
              ref={username}
              type="text"
              placeholder="Username"
              className="p-4 mb-4 w-full  bg-gray-800 bg-opacity-80 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          )}

          <input
            ref={email}
            type="text"
            placeholder="Email Address"
            className="p-4 mb-4 w-full bg-gray-800 bg-opacity-80 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          <input
            ref={password}
            type="password"
            placeholder="Password"
            className="p-4 mb-4 w-full bg-gray-800 bg-opacity-80 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          {!isSignInForm && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="p-4 mb-6 w-full bg-gray-800 bg-opacity-80 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          )}

          {errorMessage && (
            <p className="text-red-500 text-sm mt-2 font-bold">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="p-4 my-4 bg-red-600 hover:bg-red-700 text-white w-full rounded-md font-bold transition-colors duration-200 shadow-lg"
          >
            {isSignInForm ? "Sign In" : "Sign Up"}
          </button>

          <div className="flex justify-between items-center mt-4 text-gray-300 text-sm">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-1" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <span className="cursor-pointer hover:underline">Need help?</span>
          </div>

          <div className="mt-12 text-gray-300">
            <p>
              {isSignInForm ? "New to Netflix? " : "Already a user? "}
              <span
                className="text-white hover:underline cursor-pointer"
                onClick={toggleSignInForm}
              >
                {isSignInForm ? "Sign Up" : "Sign In"}
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
