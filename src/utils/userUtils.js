// src/utils/userUtils.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetch students and artisans with pagination support
 * @param {string} token - JWT auth token
 * @param {number} artisanOffset - pagination offset for artisans
 * @param {number} studentOffset - pagination offset for students
 * @param {number} artisanLimit - (optional) number of artisans per page
 * @param {number} studentLimit - (optional) number of students per page
 */
export const fetchUsers = async (
  token,
  artisanOffset = 0,
  studentOffset = 0,
  artisanLimit = 5,
  studentLimit = 20
) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const [studentRes, artisanRes] = await Promise.all([
      axios.get(
        `${API_BASE_URL}/api/admin/manage_users/students?limit=${studentLimit}&offset=${studentOffset}`,
        { headers }
      ),

      axios.get(
        `${API_BASE_URL}/api/admin/manage_users/artisans?limit=${artisanLimit}&offset=${artisanOffset}`,
        { headers }
      ),
    ]);

    return {
      students: studentRes.data.students || [],
      studentPage: studentRes.data.pagination || {
        total: 0,
        limit: studentLimit,
        offset: studentOffset
      },

      artisans: artisanRes.data.artisans || [],
      artisanPage: artisanRes.data.pagination || {
        total: 0,
        limit: artisanLimit,
        offset: artisanOffset
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
