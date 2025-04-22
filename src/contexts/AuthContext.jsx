import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logoutUser } from '../utils/authUtils';

// Create the auth context
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing user session on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        // Check if user is already authenticated
        if (isAuthenticated()) {
          // Try to get user data from localStorage
          const userData = localStorage.getItem('userData');
          if (userData) {
            setUser(JSON.parse(userData));
          } else {
            // If no user data, force re-login
            logoutUser();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logoutUser();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = (userData) => {
    // Save user data to local storage
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);

    // Redirect based on role
    if (userData.role === 'admin') {
      navigate('/admin');
    } else if (userData.role === 'artisan') {
      navigate('/artisan');
    } else {
      navigate('/student');
    }
  };

  // Logout function
  const logout = () => {
    logoutUser();
    setUser(null);
    navigate('/login');
  };

  const contextValue = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};