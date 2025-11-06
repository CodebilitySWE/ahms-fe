import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import AuthRoutes from './routes/authRoutes';
import StudentRoutes from './routes/studentRoutes';
import ArtisanRoutes from './routes/artisanRoutes';
import AdminRoutes from './routes/adminRoutes';
import LoginPage from './pages/auth/LoginPage';
import { setupAuthInterceptors } from './utils/authUtils';
import SignupPage from './pages/auth/SignupPage';
import Notification from './components/Reusable/Notification'
const NotFoundPage = () => <div>Page not found</div>;
const UnauthorizedPage = () => <div>Unauthorized access</div>;

const AppRoutes = () => {
  useEffect(() => {
    setupAuthInterceptors();
  }, []);

  return (
    <Routes>
      Public routes
      {AuthRoutes()}
      
      {/* Protected routes */}
      {StudentRoutes()}
      {/* {ArtisanRoutes()} */}
      {AdminRoutes()}
      
      {/* Special routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;