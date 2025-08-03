
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ahms-be-obre.onrender.com/api';

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
      'Content-Type': photoFile ? 'multipart/form-data' : 'application/json',
    };
    const endpoint = `${API_BASE_URL}/api/auth/artisans`;
    const data = {
      name: userData.name,
      email: userData.email,
      work_type_id: userData.work_type_id,
    };
    const formData = photoFile ? new FormData() : data;
    if (photoFile) {
      Object.keys(data).forEach((key) => formData.append(key, data[key]));
      formData.append('profile_picture', photoFile);
    }
    const response = await axios.post(endpoint, formData, { headers });
    return response.data;
  } catch (error) {
    console.error("Error creating artisan:", error);
    throw error;
  }
};

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