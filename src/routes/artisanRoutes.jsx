import { Route } from 'react-router-dom';
// import Dashboard from '../pages/artisans/Dashboard';
import ProtectedRoute from './ProtectedRoutes';

const ArtisanRoutes = () => [
  <Route 
    key="artisan-dashboard" 
    path="/artisan" 
    element={
      <ProtectedRoute allowedRoles={['artisan']}>
        {/* <Dashboard /> */}
      </ProtectedRoute>
    } 
  />
];

export default ArtisanRoutes;