import axios from "axios";

// Remove trailing /api from base URL to prevent double /api/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ahms-be-obre.onrender.com';

// Hardcoded work type options for dropdown
export const WORK_TYPE_OPTIONS = [
  { id: 1, name: "Plumbing" },
  { id: 2, name: "Electrical" },
  { id: 3, name: "Carpentry" },
  { id: 4, name: "Masonry" },
  { id: 5, name: "Painting" },
  { id: 6, name: "Cleaning" },
  { id: 7, name: "ICT" },
];

export const fetchUsers = async (token) => {
  try {
    const headers = { Authorization: `Bearer ${token}` };
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

export const fetchUserById = async (token, userId, role) => {
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const endpoint = role === "student"
      ? `${API_BASE_URL}/api/admin/manage_users/students/${userId}`
      : `${API_BASE_URL}/api/admin/manage_users/artisans/${userId}`;
    const response = await axios.get(endpoint, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${role} with ID ${userId}:`, error);
    throw error;
  }
};

export const createUser = async (token, userData, photoFile) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      // Content-Type will be set by Axios if FormData is used
    };
    const endpoint = `${API_BASE_URL}/api/auth/artisans`;
    const data = {
      name: userData.name,
      email: userData.email,
      work_type_id: userData.work_type_id, // Submit ID, not name
    };
    let payload = data;
    if (photoFile) {
      payload = new FormData();
      Object.keys(data).forEach((key) => payload.append(key, data[key]));
      payload.append('profile_picture', photoFile);
    }
    const response = await axios.post(endpoint, payload, { headers });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Backend error response:", error.response.data);
      throw new Error(error.response.data.message || 'Failed to create artisan');
    }
    console.error("Error creating artisan:", error);
    throw error;
  }
};

// Optionally fetch work types from API if available
export const fetchWorkTypes = async (token) => {
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.get(`${API_BASE_URL}/api/work_types`, { headers });
    return response.data.work_types || response.data || [];
  } catch (error) {
    console.error("Error fetching work types:", error);
    throw error;
  }
};