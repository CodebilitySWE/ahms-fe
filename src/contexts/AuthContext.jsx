import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (credentials) => {
    // For demo purposes, determine role based on email
    let role = 'student';
    if (credentials.email.includes('admin')) {
      role = 'admin';
    } else if (credentials.email.includes('artisan')) {
      role = 'artisan';
    }
    
    const mockUser = {
      name: 'Demo User',
      email: credentials.email,
      role: role,
    };
    
    setUser(mockUser);

    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'artisan') {
      navigate('/artisan');
    } else {
      navigate('/student');
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

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