import React, { useState } from "react";
import GenderCheckbox from "./GenderCheckbox";
import { Link } from "react-router-dom";
import useSignup from "../../hooks/useSignup";

const Signup = () => {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const { loading, signup } = useSignup();

  const handleGenderChange = (gender) => {
    setInputs({ ...inputs, gender });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!inputs.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!inputs.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!inputs.password) {
      newErrors.password = "Password is required";
    } else if (inputs.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!inputs.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (inputs.password !== inputs.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!inputs.gender) {
      newErrors.gender = "Please select a gender";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await signup(inputs);
    }
  };

  return (
    <div className="flex w-[480px] max-h-screen items-center justify-center p-8 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0 border border-gray-700 rounded-xl shadow-md">
      <div className="w-full max-w-[480px]">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          <span className="text-blue-500">ChatApp</span> Signup
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className={`w-full px-4 py-3 rounded-lg bg-gray-700 border ${
                errors.fullName ? "border-red-500" : "border-gray-600"
              } text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition duration-200`}
              value={inputs.fullName}
              onChange={(e) =>
                setInputs({ ...inputs, fullName: e.target.value })
              }
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className={`w-full px-4 py-3 rounded-lg bg-gray-700 border ${
                errors.username ? "border-red-500" : "border-gray-600"
              } text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition duration-200`}
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className={`w-full px-4 py-3 rounded-lg bg-gray-700 border ${
                errors.password ? "border-red-500" : "border-gray-600"
              } text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition duration-200`}
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Enter confirm password"
              className={`w-full px-4 py-3 rounded-lg bg-gray-700 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-600"
              } text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition duration-200`}
              value={inputs.confirmPassword}
              onChange={(e) =>
                setInputs({ ...inputs, confirmPassword: e.target.value })
              }
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div>
            <GenderCheckbox
              onCheckboxChange={handleGenderChange}
              selectedGender={inputs.gender}
            />
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Account...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-center text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-400 font-medium transition duration-200"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
