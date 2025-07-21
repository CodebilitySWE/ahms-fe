import { Route } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import ManageUsers from '../pages/admin/ManageUsers';  // <-- import your component
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
  />,
  <Route
    key="admin-manage-users"
    path="/admin/manage-users"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <ManageUsers />
      </ProtectedRoute>
    }
  />,
];

export default AdminRoutes;
