import { Route } from 'react-router-dom';
import Dashboard from '../pages/student/Dashboard';
import LodgeComplaint from '../pages/student/LodgeComplaint'; // Make sure the file is named LComplaint.jsx
import ProtectedRoute from './ProtectedRoutes';

const StudentRoutes = () => [
  <Route
    key="student-dashboard"
    path="/student/dashboard"
    element={
      <ProtectedRoute allowedRoles={['student']}>
        <Dashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    key="student-lodge-complaint"
    path="/student/lodge-complaint"
    element={
      <ProtectedRoute allowedRoles={['student']}>
        <LodgeComplaint />
      </ProtectedRoute>
    }
  />,
  <Route
    key="student-complaints"
    path="/student/complaints"
    element={
      <ProtectedRoute allowedRoles={['student']}>
        <div>My Complaints Page - Coming Soon</div>
      </ProtectedRoute>
    }
  />,
  <Route
    key="student-notifications"
    path="/student/notifications"
    element={
      <ProtectedRoute allowedRoles={['student']}>
        <div>Notifications Page - Coming Soon</div>
      </ProtectedRoute>
    }
  />,
  <Route
    key="student-profile"
    path="/student/profile"
    element={
      <ProtectedRoute allowedRoles={['student']}>
        <div>Profile Page - Coming Soon</div>
      </ProtectedRoute>
    }
  />
];

export default StudentRoutes;
