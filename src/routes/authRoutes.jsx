import { Route } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
// import SignupPage from '../pages/auth/SignupPage';

const AuthRoutes = () => [
  <Route key="login" path="/login" element={<LoginPage />} />,
//   <Route key="signup" path="/signup" element={<SignupPage />} />
];

export default AuthRoutes;