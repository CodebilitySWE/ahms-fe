import { Route } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import Complaints from '../pages/admin/Complaints';
import Notifications from '../pages/admin/Notifications';
import Profile from '../pages/admin/Profile';
import Statistics from '../pages/admin/Statistics';
import ManageUsers from '../pages/admin/ManageUsers';
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
    key="admin-complaints"
    path="/admin/complaints"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Complaints />
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
  <Route
    key="admin-notifications"
    path="/admin/notifications"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Notifications />
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-profile"
    path="/admin/profile"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Profile />
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-statistics"
    path="/admin/statistics"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Statistics />
      </ProtectedRoute>
    }
  />
];

export default AdminRoutes;
