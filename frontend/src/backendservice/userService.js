import axios from 'axios';

class UserService {
  constructor() {
    // Set up axios instance with default configurations
    this.apiClient = axios.create({
      baseURL: process.env.VITE_APP_BACKEND_URL + '/users',
      withCredentials: true, // for sending cookies with requests
    });
  }

  // Register a new user
  async registerUser(userData) {
    try {
      const response = await this.apiClient.post('/register', userData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Login a user
  async loginUser(loginData) {
    try {
      const response = await this.apiClient.post('/login', loginData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Logout a user
  async logoutUser() {
    try {
      const response = await this.apiClient.post('/logout');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get the current user
  async getCurrentUser() {
    try {
      const response = await this.apiClient.get('/current-user');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update account details
  async updateAccountDetails(updateData) {
    try {
      const response = await this.apiClient.patch('/update-account', updateData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await this.apiClient.patch('/change-password', passwordData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update user avatar
  async updateUserAvatar(avatarFile) {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await this.apiClient.patch('/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update user cover image
  async updateUserCoverImage(coverImageFile) {
    try {
      const formData = new FormData();
      formData.append('coverImage', coverImageFile);

      const response = await this.apiClient.patch('/coverImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Fetch user channel profile
  async getUserChannelProfile(username) {
    try {
      const response = await this.apiClient.get(`/c/${username}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Fetch user's watch history
  async getWatchHistory() {
    try {
      const response = await this.apiClient.get('/history');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Handle errors
  handleError(error) {
    // Customize error handling here
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('Server Error:', error.response.data);
      throw new Error(error.response.data.message || 'Server error occurred');
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
      throw new Error('Network error occurred');
    } else {
      // Something else happened
      console.error('Error:', error.message);
      throw new Error(error.message);
    }
  }
}

export default UserService;
