const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Validates if a token exists and is properly formatted
 * @param {string} token - JWT token to validate
 * @returns {boolean} True if token is valid format
 */
const isValidToken = (token) => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  // Basic JWT format check (three parts separated by dots)
  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * Get authentication token from localStorage
 * @returns {string|null} Token or null if not found
 */
const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error('No authentication token found');
    return null;
  }
  if (!isValidToken(token)) {
    console.error('Invalid token format');
    localStorage.removeItem('authToken'); // Clear invalid token
    return null;
  }
  return token;
};

/**
 * Handle API errors consistently
 * @param {Response} response - Fetch response
 * @param {Object} data - Response data
 * @returns {void}
 * @throws {Error} Formatted error
 */
const handleApiError = (response, data) => {
  // Handle 401 Unauthorized - token expired or invalid
  if (response.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    throw new Error('Session expired. Please login again.');
  }
  
  // Handle 403 Forbidden
  if (response.status === 403) {
    throw new Error('Access denied. You do not have permission to perform this action.');
  }
  
  // Handle 404 Not Found
  if (response.status === 404) {
    throw new Error('Resource not found.');
  }
  
  // Handle 500 Server Error
  if (response.status >= 500) {
    throw new Error('Server error. Please try again later.');
  }
  
  // Default error message
  throw new Error(data.message || `Request failed with status ${response.status}`);
};

/**
 * Get user profile information
 * @param {string} [token] - Optional token, will use localStorage if not provided
 * @returns {Promise<Object>} Profile data
 */
export const getProfile = async (token = null) => {
  try {
    const authToken = token || getAuthToken();
    
    if (!authToken) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      handleApiError(response, data);
    }

    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

/**
 * Update user profile information
 * @param {Object} profileData - Profile data to update
 * @param {string} [token] - Optional token, will use localStorage if not provided
 * @returns {Promise<Object>} Updated profile data
 */
export const updateProfile = async (profileData, token = null) => {
  try {
    const authToken = token || getAuthToken();
    
    if (!authToken) {
      throw new Error('Authentication required. Please login.');
    }

    // Validate profile data
    if (!profileData || typeof profileData !== 'object') {
      throw new Error('Invalid profile data');
    }

    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      handleApiError(response, data);
    }

    // Update user in localStorage if update successful
    if (data.success && data.data) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...data.data }));
    }

    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Update user password
 * @param {Object} passwordData - Password data {currentPassword, newPassword}
 * @param {string} [token] - Optional token, will use localStorage if not provided
 * @returns {Promise<Object>} Response data
 */
export const updatePassword = async (passwordData, token = null) => {
  try {
    const authToken = token || getAuthToken();
    
    if (!authToken) {
      throw new Error('Authentication required. Please login.');
    }

    // Validate password data
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      throw new Error('Current password and new password are required');
    }

    if (passwordData.newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long');
    }

    const response = await fetch(`${API_BASE_URL}/api/profile/password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();

    if (!response.ok) {
      handleApiError(response, data);
    }

    return data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

/**
 * Update profile picture
 * @param {File} profilePicture - Profile picture file
 * @param {string} [token] - Optional token, will use localStorage if not provided
 * @returns {Promise<Object>} Response data with new picture URL
 */
export const updateProfilePicture = async (profilePicture, token = null) => {
  try {
    const authToken = token || getAuthToken();
    
    if (!authToken) {
      throw new Error('Authentication required. Please login.');
    }

    // Validate file
    if (!profilePicture || !(profilePicture instanceof File)) {
      throw new Error('Valid profile picture file is required');
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (profilePicture.size > maxSize) {
      throw new Error('Profile picture must be less than 5MB');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(profilePicture.type)) {
      throw new Error('Profile picture must be a JPEG, PNG, or GIF image');
    }

    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    const response = await fetch(`${API_BASE_URL}/api/profile/picture`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      handleApiError(response, data);
    }

    // Update user in localStorage if update successful
    if (data.success && data.data?.profilePicture) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      currentUser.profilePicture = data.data.profilePicture;
      localStorage.setItem('user', JSON.stringify(currentUser));
    }

    return data;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
};

/**
 * Update role-specific details (student room, block, etc.)
 * @param {Object} roleData - Role-specific data to update
 * @param {string} [token] - Optional token, will use localStorage if not provided
 * @returns {Promise<Object>} Updated role data
 */
export const updateRoleDetails = async (roleData, token = null) => {
  try {
    const authToken = token || getAuthToken();
    
    if (!authToken) {
      throw new Error('Authentication required. Please login.');
    }

    // Validate role data
    if (!roleData || typeof roleData !== 'object') {
      throw new Error('Invalid role data');
    }

    const response = await fetch(`${API_BASE_URL}/api/profile/role-details`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    });

    const data = await response.json();

    if (!response.ok) {
      handleApiError(response, data);
    }

    // Update user in localStorage if update successful
    if (data.success && data.data) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...data.data }));
    }

    return data;
  } catch (error) {
    console.error('Error updating role details:', error);
    throw error;
  }
};

/**
 * Delete user profile picture
 * @param {string} [token] - Optional token, will use localStorage if not provided
 * @returns {Promise<Object>} Response data
 */
export const deleteProfilePicture = async (token = null) => {
  try {
    const authToken = token || getAuthToken();
    
    if (!authToken) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await fetch(`${API_BASE_URL}/api/profile/picture`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      handleApiError(response, data);
    }

    // Update user in localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    delete currentUser.profilePicture;
    localStorage.setItem('user', JSON.stringify(currentUser));

    return data;
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    throw error;
  }
};

/**
 * Get user activity/stats
 * @param {string} [token] - Optional token, will use localStorage if not provided
 * @returns {Promise<Object>} User activity data
 */
export const getUserActivity = async (token = null) => {
  try {
    const authToken = token || getAuthToken();
    
    if (!authToken) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await fetch(`${API_BASE_URL}/api/profile/activity`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      handleApiError(response, data);
    }

    return data;
  } catch (error) {
    console.error('Error fetching user activity:', error);
    throw error;
  }
};

/**
 * Verify current password before sensitive operations
 * @param {string} password - Password to verify
 * @param {string} [token] - Optional token, will use localStorage if not provided
 * @returns {Promise<Object>} Verification result
 */
export const verifyPassword = async (password, token = null) => {
  try {
    const authToken = token || getAuthToken();
    
    if (!authToken) {
      throw new Error('Authentication required. Please login.');
    }

    if (!password) {
      throw new Error('Password is required');
    }

    const response = await fetch(`${API_BASE_URL}/api/profile/verify-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (!response.ok) {
      handleApiError(response, data);
    }

    return data;
  } catch (error) {
    console.error('Error verifying password:', error);
    throw error;
  }
};