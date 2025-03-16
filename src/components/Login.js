import React, { useState, useRef } from "react";
import { checkValidity } from "../utils/validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { NETFLIX_BACKGROUND } from "../utils/constants";
import Header from "./Header";

const Login = () => {
  const dispatch = useDispatch();
  const [isSignInForm, setSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const username = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);

  const toggleSignInForm = () => setSignInForm(!isSignInForm);

  const handleButtonClick = () => {
    const emailValue = email.current?.value || "";
    const passwordValue = password.current?.value || "";
    const usernameValue = username.current?.value || "";

    const message = checkValidity(
      emailValue,
      passwordValue,
      isSignInForm ? null : usernameValue
    );
    setErrorMessage(message);
    if (message) return;

    if (isSignInForm) {
      signInWithEmailAndPassword(auth, emailValue, passwordValue).catch(
        (error) => setErrorMessage(`${error.code} - ${error.message}`)
      );
    } else {
      createUserWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, { displayName: usernameValue })
            .then(() =>
              dispatch(
                addUser({
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                })
              )
            )
            .catch((error) =>
              setErrorMessage(`${error.code} - ${error.message}`)
            );
        })
        .catch((error) => setErrorMessage(`${error.code} - ${error.message}`));
    }
  };

  return (
    <div className="min-h-screen relative">
      <Header />
      <div className="absolute inset-0 w-full">
        <img
          className="w-full h-full object-cover"
          src={NETFLIX_BACKGROUND}
          alt="Netflix Background"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-10 px-4">
        <form
          className="p-8 md:p-16 bg-black bg-opacity-80 rounded-md shadow-2xl w-full max-w-md"
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
              className="p-4 mb-4 w-full bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300"
            />
          )}
          <input
            ref={email}
            type="text"
            placeholder="Email Address"
            className="p-4 mb-4 w-full bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300"
          />
          <input
            ref={password}
            type="password"
            placeholder="Password"
            className="p-4 mb-4 w-full bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300"
          />
          {!isSignInForm && (
            <input
              ref={confirmPassword}
              type="password"
              placeholder="Confirm Password"
              className="p-4 mb-6 w-full bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300"
            />
          )}

          {errorMessage && (
            <p className="text-red-500 text-sm mt-2 font-bold mb-4">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="p-4 my-4 bg-red-600 hover:bg-red-700 text-white w-full rounded-md font-bold transition-colors duration-300"
          >
            {isSignInForm ? "Sign In" : "Sign Up"}
          </button>

          <div className="mt-8 text-gray-400 text-sm">
            <p>
              {isSignInForm ? "New to Netflix? " : "Already a user? "}
              <span
                className="text-white hover:underline cursor-pointer font-semibold"
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
