import { Route } from 'react-router-dom';
import Dashboard from '../pages/student/Dashboard';
import LodgeComplaint from '../pages/student/LodgeComplaint'; // Make sure the file is named LComplaint.jsx
import Notifications from '../pages/student/Notifications';
import Profile from '../pages/Shared/Profile';
import ProtectedRoute from './ProtectedRoutes';
import MyComplaints from '../pages/student/MyComplaints';

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
      key="student-notifications"
      path="/student/notifications"
      element={
        <ProtectedRoute allowedRoles={['student']}>
          <Notifications />
        </ProtectedRoute>
      }
    />,
  <Route
    key="student-complaints"
    path="/student/complaints"
    element={
      <ProtectedRoute allowedRoles={['student']}>
        <MyComplaints />
      </ProtectedRoute>
    }
  />,
  <Route
    key="student-profile"
    path="/student/profile"
    element={
      <ProtectedRoute allowedRoles={['student']}>
        <Profile />
      </ProtectedRoute>
    }
  />
];

export default StudentRoutes;
