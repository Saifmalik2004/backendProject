// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaFire, FaPlayCircle, FaListAlt, FaHistory, FaVideo, FaClock, FaThumbsUp, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <aside className="bg-black text-white w-64 min-h-screen py-4 px-2 sticky top-0">
      <nav className="flex flex-row space-y-2">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-lg ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-700 text-gray-400'}`
          }
          end
        >
          <FaHome className="mr-3" /> Home
        </NavLink>
        <NavLink 
          to="/trending" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-lg ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-700 text-gray-400'}`
          }
        >
          <FaFire className="mr-3" /> Trending
        </NavLink>
        <NavLink 
          to="/subscriptions" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-lg ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-700 text-gray-400'}`
          }
        >
          <FaPlayCircle className="mr-3" /> Subscriptions
        </NavLink>
        <NavLink 
          to="/library" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-lg ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-700 text-gray-400'}`
          }
        >
          <FaListAlt className="mr-3" /> Library
        </NavLink>
        <NavLink 
          to="/history" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-lg ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-700 text-gray-400'}`
          }
        >
          <FaHistory className="mr-3" /> History
        </NavLink>
        <NavLink 
          to="/your-videos" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-lg ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-700 text-gray-400'}`
          }
        >
          <FaVideo className="mr-3" /> Your Videos
        </NavLink>
        <NavLink 
          to="/watch-later" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-lg ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-700 text-gray-400'}`
          }
        >
          <FaClock className="mr-3" /> Watch Later
        </NavLink>
        <NavLink 
          to="/liked-videos" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-lg ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-700 text-gray-400'}`
          }
        >
          <FaThumbsUp className="mr-3" /> Liked Videos
        </NavLink>
        <NavLink 
          to="/settings" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-lg ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-700 text-gray-400'}`
          }
        >
          <FaCog className="mr-3" /> Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
