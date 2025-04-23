import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthRoutes from './routes/authRoutes';
import StudentRoutes from './routes/studentRoutes';
import ArtisanRoutes from './routes/artisanRoutes';
import AdminRoutes from './routes/adminRoutes';
import LoginPage from './pages/auth/LoginPage';
import { setupAuthInterceptors } from './utils/authUtils';
import SignupPage from './pages/auth/SignupPage';

const NotFoundPage = () => <div>Page not found</div>;
const UnauthorizedPage = () => <div>Unauthorized access</div>;

setupAuthInterceptors();

function App() {
  return (
    <Router>
      <ThemeProvider>
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
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;