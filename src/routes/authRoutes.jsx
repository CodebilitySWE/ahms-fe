import { Route } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';

const AuthRoutes = () => [
  <Route key="login" path="/login" element={<LoginPage />} />
];

export default AuthRoutes;