import { Route } from 'react-router-dom';
// import Dashboard from '../pages/student/Dashboard';
// import Profile from '../pages/student/Profile';
import ProtectedRoute from './ProtectedRoutes';

const StudentRoutes = () => [
  <Route 
    key="student-dashboard" 
    path="/student" 
    element={
      <ProtectedRoute allowedRoles={['student']}>
        {/* <Dashboard /> */}
      </ProtectedRoute>
    } 
  />
];

export default StudentRoutes;