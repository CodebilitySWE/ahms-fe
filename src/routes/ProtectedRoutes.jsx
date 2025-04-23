import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  // First check if user is authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Then check if user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

export default ProtectedRoute;