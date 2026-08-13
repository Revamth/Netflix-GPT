// Login / sign-up form. Validates input, then calls Firebase Auth; AppLayout's
// listener handles the post-auth redirect.
import { useState, useRef } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const username = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);

  const toggleSignInForm = () => {
    setSignInForm(!isSignInForm);
    setErrorMessage(null);
  };

  const handleButtonClick = () => {
    const emailValue = email.current?.value || "";
    const passwordValue = password.current?.value || "";
    const usernameValue = username.current?.value || "";
    const confirmPasswordValue = confirmPassword.current?.value || "";

    if (!isSignInForm && passwordValue !== confirmPasswordValue) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const message = checkValidity(
      emailValue,
      passwordValue,
      isSignInForm ? null : usernameValue
    );
    setErrorMessage(message);
    if (message) return;

    setSubmitting(true);

    if (isSignInForm) {
      signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .catch((error) => setErrorMessage(`${error.code} - ${error.message}`))
        .finally(() => setSubmitting(false));
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
        .catch((error) => setErrorMessage(`${error.code} - ${error.message}`))
        .finally(() => setSubmitting(false));
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
          className="p-8 md:p-16 bg-black bg-opacity-80 rounded-md shadow-2xl w-full max-w-md animate-[fadeIn_0.4s_ease-out]"
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
              className="p-4 mb-4 w-full bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/40 transition-colors duration-300"
            />
          )}
          <input
            ref={email}
            type="text"
            placeholder="Email Address"
            className="p-4 mb-4 w-full bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/40 transition-colors duration-300"
          />
          <div className="relative mb-4">
            <input
              ref={password}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="p-4 pr-12 w-full bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/40 transition-colors duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
            >
              {showPassword ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 4.24A9.77 9.77 0 0112 4c5 0 9 4 10 8a11.5 11.5 0 01-2.16 3.19M6.1 6.1C3.9 7.5 2.3 9.6 2 12c.86 3.4 4.7 8 10 8 1.2 0 2.35-.2 3.4-.57" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12S5 4 12 4s10 8 10 8-3 8-10 8-10-8-10-8Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6Z" />
                </svg>
              )}
            </button>
          </div>
          {!isSignInForm && (
            <input
              ref={confirmPassword}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="p-4 mb-6 w-full bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/40 transition-colors duration-300"
            />
          )}

          {errorMessage && (
            <p
              role="alert"
              className="text-red-500 text-sm mt-2 font-bold mb-4"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="p-4 my-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white w-full rounded-md font-bold transition-colors duration-300 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {submitting && (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
              </svg>
            )}
            {submitting ? "Please wait..." : isSignInForm ? "Sign In" : "Sign Up"}
          </button>

          <div className="mt-8 text-gray-400 text-sm">
            <p>
              {isSignInForm ? "New to Netflix? " : "Already a user? "}
              <button
                type="button"
                className="text-white hover:underline cursor-pointer font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                onClick={toggleSignInForm}
              >
                {isSignInForm ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
