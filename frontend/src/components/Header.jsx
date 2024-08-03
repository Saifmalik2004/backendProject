// src/components/Header.jsx

import React from "react";
import { FaBell, FaSearch, FaVideo, FaTh } from "react-icons/fa";

function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-8 w-auto"
          />
          <span className="text-xl font-bold text-gray-800">MyTube</span>
        </div>

        {/* Search Bar */}
        <div className="flex items-center w-full max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button className="px-4 h-[43px] py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200 focus:outline-none">
            <FaSearch className="text-gray-600" />
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaVideo className="text-gray-700" size={20} />
          </button>
         
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaBell className="text-gray-700" size={20} />
          </button>

          {/* Profile Picture */}
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="h-8 w-8 rounded-full"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
