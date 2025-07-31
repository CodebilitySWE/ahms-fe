// src/utils/userUtils.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ahms-be-obre.onrender.com/api';

/**
 * Fetch students and artisans for admin dashboard
 * @param {string} token - JWT auth token
 * @returns {Promise<{students: Array, artisans: Array}>}
 */
export const fetchUsers = async (token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const [studentRes, artisanRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/api/admin/manage_users/students`, { headers }),
      axios.get(`${API_BASE_URL}/api/admin/manage_users/artisans`, { headers }),
    ]);

    return {
      students: studentRes.data.students || [],
      artisans: artisanRes.data.artisans || [],
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
