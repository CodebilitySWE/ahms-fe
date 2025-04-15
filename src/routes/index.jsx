import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

// const LoginPage = lazy(() => import('../pages/LoginPage'));
// const Dashboard = lazy(() => import('../pages/Dashboard'));
// const ComplaintsList = lazy(() => import('../pages/ComplaintsList'));
// const ComplaintDetails = lazy(() => import('../pages/ComplaintDetails'));
// const CreateComplaint = lazy(() => import('../pages/CreateComplaint'));
// const UsersList = lazy(() => import('../pages/UsersList'));
// const UserProfile = lazy(() => import('../pages/UserProfile'));
// const Settings = lazy(() => import('../pages/Settings'));
// const NotFound = lazy(() => import('../pages/NotFound'));

// Loading component
const LoadingPage = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public route - redirects to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main router component
const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          
          {/* Complaints routes */}
          <Route path="complaints">
            <Route index element={<ComplaintsList />} />
            <Route path="create" element={<CreateComplaint />} />
            <Route path=":id" element={<ComplaintDetails />} />
          </Route>
          
          {/* Users routes */}
          <Route path="users">
            <Route index element={<UsersList />} />
            <Route path=":id" element={<UserProfile />} />
          </Route>
          
          {/* Settings route */}
          <Route path="settings" element={<Settings />} />
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;