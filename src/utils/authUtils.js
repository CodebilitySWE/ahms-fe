import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ahms-be-obre.onrender.com/api';

/**
 * Authenticates a user with the backend API
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @param {string} credentials.role - User role (Admin, Student, Artisan)
 * @returns {Promise<Object>} User data on successful login
 * @throws {Error} If login fails
 */
export const loginUser = async (credentials) => {
  try {
    // Basic validation before making the API call
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    
    // Make the API call to authenticate the user
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: credentials.email,
      password: credentials.password,
      role: credentials.role.toLowerCase()
    });
    
    // Store JWT token in localStorage for subsequent API calls
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || 'Authentication failed');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw error;
    }
  }
};

/**
 * Registers a new student
 * @param {Object} userData - User registration data
 * @param {File} photoFile - User profile photo
 * @returns {Promise<Object>} User data on successful registration
 * @throws {Error} If registration fails
 */
export const registerUser = async (userData, photoFile) => {
  try {
    const formData = new FormData();
    
    // Add user data to form data
    Object.keys(userData).forEach(key => {
      formData.append(key, userData[key]);
    });
    
    // Add photo if available
    if (photoFile) {
      formData.append('profile_picture', photoFile);
    }
    
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    // Store JWT token in localStorage for subsequent API calls
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw error;
    }
  }
};

/**
 * Logs out the current user
 */
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
};

/**
 * Checks if the user is authenticated
 * @returns {boolean} True if the user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

export const setupAuthInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        logoutUser();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};