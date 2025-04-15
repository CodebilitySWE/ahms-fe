// src/contexts/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the auth context
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Login function (simplified, no API call)
  const login = (credentials) => {
    // For demo purposes create a mock user
    const mockUser = {
      name: 'Demo User',
      email: credentials.email,
    };
    
    // Set user in state
    setUser(mockUser);
    
    // Redirect to dashboard
    navigate('/');
  };

  // Logout function
  const logout = () => {
    // Clear user state
    setUser(null);
    
    // Redirect to login page
    navigate('/login');
  };

  // Context value
  const contextValue = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/* 
Note: This is a simplified auth context. In a real application, you would
replace the mock authentication with API calls to your backend:

Example of how to implement API calls (commented out for now):

import api from '../utils/api';

// Login with API
const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    setUser(user);
    navigate('/');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
*/