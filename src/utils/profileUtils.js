const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Get user profile information
 * @param {string} token - User authentication token
 * @returns {Promise<Object>} Profile data
 */
export const getProfile = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

/**
 * Update user profile information
 * @param {string} token - User authentication token
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} Updated profile data
 */
export const updateProfile = async (token, profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Update user password
 * @param {string} token - User authentication token
 * @param {Object} passwordData - Password data
 * @returns {Promise<Object>} Response data
 */
export const updatePassword = async (token, passwordData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profile/password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update password');
    }

    return data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

/**
 * Update profile picture
 * @param {string} token - User authentication token
 * @param {File} profilePicture - Profile picture file
 * @returns {Promise<Object>} Response data with new picture URL
 */
export const updateProfilePicture = async (token, profilePicture) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    const response = await fetch(`${API_BASE_URL}/api/profile/picture`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile picture');
    }

    return data;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
};

/**
 * Update role-specific details
 * @param {string} token - User authentication token
 * @param {Object} roleData - Role-specific data to update
 * @returns {Promise<Object>} Updated role data
 */
export const updateRoleDetails = async (token, roleData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profile/role-details`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update role details');
    }

    return data;
  } catch (error) {
    console.error('Error updating role details:', error);
    throw error;
  }
}; 