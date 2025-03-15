import React from "react";
import Header from "./Header";
import { useState } from "react";

const Login = () => {
  const [isSignInForm, setSignInForm] = useState(true);

  const toggleSignInForm = () => {
    setSignInForm(!isSignInForm);
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
        <form className="p-12 bg-black bg-opacity-70 rounded-lg shadow-2xl w-full max-w-md mx-4 backdrop-blur-sm">
          <h1 className="font-bold text-3xl text-white mb-8">
            {isSignInForm ? "Sign In" : "Sign Up"}
          </h1>
          <div className="flex space-x-4">
            {!isSignInForm && (
              <input
                type="text"
                placeholder="First Name"
                className="p-4 mb-4 w-full sm:w-1/2 bg-gray-800 bg-opacity-80 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 relative"
              />
            )}
            {!isSignInForm && (
              <input
                type="text"
                placeholder="Last Name"
                className="p-4 mb-4 w-full sm:w-1/2 bg-gray-800 bg-opacity-80 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 relative"
              />
            )}
          </div>

          <input
            type="text"
            placeholder="Email Address"
            className="p-4 mb-4 w-full bg-gray-800 bg-opacity-80 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          <input
            type="password"
            placeholder="Password"
            className="p-4 mb-4 w-full bg-gray-800 bg-opacity-80 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          {!isSignInForm && (
            <input
              type="password"
              placeholder="ConfirmPassword"
              className="p-4 mb-6 w-full bg-gray-800 bg-opacity-80 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          )}

          <button className="p-4 bg-red-600 hover:bg-red-700 text-white w-full rounded-md font-bold transition-colors duration-200 shadow-lg">
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
