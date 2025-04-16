import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthRoutes from './routes/authRoutes';
import StudentRoutes from './routes/studentRoutes';
import ArtisanRoutes from './routes/artisanRoutes';
import AdminRoutes from './routes/adminRoutes';
// import NotFoundPage from './pages/shared/NotFoundPage';
// import UnauthorizedPage from './pages/shared/UnauthorizedPage';

// Temporary placeholder components
const NotFoundPage = () => <div>Page not found</div>;
const UnauthorizedPage = () => <div>Unauthorized access</div>;

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        {AuthRoutes()}
        
        {/* Protected routes */}
        {StudentRoutes()}
        {ArtisanRoutes()}
        {AdminRoutes()}
        
        {/* Special routes */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;