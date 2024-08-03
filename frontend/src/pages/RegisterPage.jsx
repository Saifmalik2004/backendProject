// src/components/RegisterForm.js

import React, { useState } from 'react';


const RegisterForm = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    name: '',
    avatar: null,
    coverImage: null,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [id]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-lg shadow-lg bg-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name:</label>
          <input
            type="text"
            id="name"
            value={userData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email:</label>
          <input
            type="email"
            id="email"
            value={userData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password:</label>
          <input
            type="password"
            id="password"
            value={userData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="avatar" className="block text-gray-700 font-medium mb-2">Avatar:</label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="coverImage" className="block text-gray-700 font-medium mb-2">Cover Image:</label>
          <input
            type="file"
            id="coverImage"
            accept="image/*"
            onChange={handleChange}
            hidden
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
        >
          Register
        </button>
      </form>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {success && <p className="text-green-500 text-center mt-4">{success}</p>}
    </div>
  );
};

export default RegisterForm;
