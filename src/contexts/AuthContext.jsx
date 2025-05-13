import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logoutUser } from '../utils/authUtils';

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

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isAuthenticated()) {
          const userData = localStorage.getItem('userData');
          const authToken = localStorage.getItem('authToken');
          
          if (userData && authToken) {
            const parsedUser = JSON.parse(userData);
            
            try {
              // const response = await axios.get('/api/auth/verify', {
              //   headers: { Authorization: `Bearer ${authToken}` }
              // });
              
              setUser(parsedUser);
              
              const currentPath = window.location.pathname;
              if (currentPath === '/login' || currentPath === '/') {
                if (parsedUser.role === 'admin') {
                  navigate('/admin/dashboard', { replace: true });
                } else if (parsedUser.role === 'artisan') {
                  navigate('/artisan/dashboard', { replace: true });
                } else if (parsedUser.role === 'student') {
                  navigate('/student/dashboard', { replace: true });
                }
              }
            } catch (tokenError) {
              console.error('Token validation error:', tokenError);
              logoutUser();
              setUser(null);
            }
          } else {
            logoutUser();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logoutUser();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [navigate]);

  const login = (userData) => {
    try {
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);

      if (userData.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userData.role === 'artisan') {
        navigate('/artisan/dashboard', { replace: true });
      } else if (userData.role === 'student') {
        navigate('/student/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Logout function
  const logout = () => {
    try {
      logoutUser();
      setUser(null);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
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