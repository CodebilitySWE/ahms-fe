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
  />
];

export default StudentRoutes;
