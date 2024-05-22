import React from "react";
import circleLogo from "../components/Footer/assets/circle.png";
import Image from "next/image";

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-white-500 text-white">
      <div className="p-8 rounded-lg shadow-2xl w-full max-w-md transform hover:scale-105 transition-transform duration-300 ease-in-out bg-opacity-80 bg-gray-900">
        <div className="flex justify-center mb-6">
          <Image
            src={circleLogo}
            alt="Custom Logo"
            className="h-15 w-12 animate-bounce"
          />
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/Therapistlogin" className="text-blue-400 hover:underline">
            Sign In
          </a>
        </p>
      </div>
      <style jsx>{`
        body {
          font-family: "Comic Sans MS", "Comic Sans", cursive;
        }

        input[type="email"],
        input[type="password"] {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s ease-in-out;
        }

        input[type="email"]:focus,
        input[type="password"]:focus {
          transform: translateY(-2px);
        }

        button {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s ease-in-out;
        }

        button:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default SignupPage;
