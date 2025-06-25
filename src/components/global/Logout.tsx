"use client";

import React from "react";
import Cookies from "js-cookie";

const Logout = () => {
  const handleLogout = () => {
    // Clear the authentication token from cookies
    Cookies.remove("auth_token");
    Cookies.remove("role");
    // Optionally, redirect to the login page or home page
    window.location.href = "/login"; // Adjust the path as needed
  };
  return (
    <button
      onClick={handleLogout}
      className="bg-brand hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
    >
      Logout
    </button>
  );
};

export default Logout;
