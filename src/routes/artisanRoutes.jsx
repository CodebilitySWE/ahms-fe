import { Route } from 'react-router-dom';
import Dashboard from '../pages/artisans/Dashboard';
import Profile from '../pages/Shared/Profile';
import ProtectedRoute from './ProtectedRoutes';

const ArtisanRoutes = () => [
  <Route 
    key="artisan-dashboard" 
    path="/artisan/dashboard" 
    element={
      <ProtectedRoute allowedRoles={['artisan']}>
        <Dashboard />
      </ProtectedRoute>
    } 
  />,
  <Route
    key="artisan-profile"
    path="/artisan/profile"
    element={
      <ProtectedRoute allowedRoles={['artisan']}>
        <Profile />
      </ProtectedRoute>
    }
  />
];

export default ArtisanRoutes;