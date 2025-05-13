import { Route } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import ProtectedRoute from './ProtectedRoutes';

const AdminRoutes = () => [
  <Route 
    key="admin-dashboard" 
    path="/admin/dashboard" 
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Dashboard />
      </ProtectedRoute>
    } 
  />
];

export default AdminRoutes;