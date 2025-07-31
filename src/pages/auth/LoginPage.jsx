
// 




import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Link,
  useMediaQuery,
  Alert,
  Paper,
  Radio,
  RadioGroup
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser } from '../../utils/authUtils';
import LoaderComponent from '../../components/loaders/AdvancedLoaders';

const greenPalette = {
  darkGreen: '#055519',
  mediumDarkGreen: '#24873D',
  mediumGreen: '#2DA94B',
  green: '#2B8C43',
  lightGreen: '#2BA148',
  lightestGreen: '#1C7B34'
};

const LoginPage = () => {
  // Access theme and auth contexts
  let themeContext;
  let authContext;
  
  try {
    themeContext = useThemeContext();
  } catch (error) {
    themeContext = { mode: 'light', toggleTheme: () => {} };
  }
  
  try {
    authContext = useAuth();
  } catch (error) {
    authContext = { login: () => {} };
  }
  
  const { mode, toggleTheme } = themeContext;
  const { login, user, loading: authLoading } = authContext;
  const isMobile = useMediaQuery('(max-width:768px)');
  const navigate = useNavigate();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    role: 'Student'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Update body background color
  useEffect(() => {
    document.body.style.backgroundColor = mode === 'dark' ? '#121212' : '#f5f5f5';
  }, [mode]);

  // Security: Disable password managers and clear sensitive data on unmount
  useEffect(() => {
    const passwordField = document.querySelector('input[name="password"]');
    if (passwordField) {
      passwordField.setAttribute('autocomplete', 'new-password');
      passwordField.setAttribute('data-lpignore', 'true');
      passwordField.setAttribute('data-form-type', 'other');
    }
    
    return () => {
      // Clear sensitive data on component unmount
      setCredentials(prev => ({ ...prev, password: '' }));
    };
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'artisan') {
        navigate('/artisan/dashboard', { replace: true });
      } else if (user.role === 'student') {
        navigate('/student/dashboard', { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleRoleChange = (e) => {
    setCredentials({
      ...credentials,
      role: e.target.value
    });
    // Clear error when user changes role
    if (error) {
      setError('');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await loginUser(credentials);
      
      // Check for role mismatch
      const backendRole = (result.user?.role || '').toLowerCase();
      const selectedRole = (credentials.role || '').toLowerCase();
      
      if (backendRole && backendRole !== selectedRole) {
        const errorMessage = `Role mismatch: You tried to log in as ${selectedRole}, but your account is ${backendRole}.`;
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setLoading(false);
        return;
      }
      
      // Successful login
      toast.success('Login successful!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      login({
        ...result.user,
        token: result.token,
        role: backendRole
      });
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Show advanced loader during auth check or login process
  if (authLoading) {
    return (
      <LoaderComponent
        isLoading={true}
        loadingText="Checking authentication"
        primaryColor={greenPalette.mediumGreen}
        secondaryColor={greenPalette.lightGreen}
      />
    );
  }

  // Show loader during login
  if (loading) {
    return (
      <LoaderComponent
        isLoading={true}
        loadingText="Signing In"
        primaryColor={greenPalette.mediumGreen}
        secondaryColor={greenPalette.lightGreen}
      />
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: mode === 'dark' ? '#121212' : '#f5f5f5',
        color: mode === 'dark' ? '#ffffff' : '#000000',
      }}
    >
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop 
        closeOnClick 
        rtl={false}
        pauseOnFocusLoss 
        draggable 
        pauseOnHover
        theme={mode === 'dark' ? 'dark' : 'light'}
      />
      
      {/* Ash/Gray background at the top - more visible */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '30%',
          bgcolor: mode === 'dark' ? '#4a4a4a' : '#a0a0a0',
          zIndex: 1
        }}
      />
      
      {/* Top right corner - ACMS badge and theme toggle with more rounded borders */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          zIndex: 10
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            bgcolor: greenPalette.mediumGreen,
            px: 2,
            py: 1,
            borderRadius: '20px',
            fontWeight: 'bold',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            fontSize: '0.9rem'
          }}
        >
          ACMS
        </Typography>
        
        <IconButton
          onClick={toggleTheme}
          sx={{ 
            color: mode === 'dark' ? '#ffffff' : '#666666',
            bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            '&:hover': {
              bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </IconButton>
      </Box>

      {/* Main centered container with everything in one box */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '500px', md: '650px' },
          zIndex: 5
        }}
      >
        {/* Single Paper container for everything */}
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            bgcolor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
            borderRadius: '8px',
            p: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: { xs: 3, sm: 10 },
            border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
          }}
        >
          {/* ACMS Logo on the left side - more compact */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: { xs: 'auto', sm: '60px', md: '70px' },
              flexShrink: 0
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.4rem', sm: '1.6rem', md: '2rem' },
                fontWeight: 'bold',
                color: greenPalette.mediumGreen,
                opacity: 0.9,
                letterSpacing: '0.0em',
                lineHeight: 1,
                fontFamily: 'Arial, sans-serif',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                borderRadius: '6px',
                padding: '2px 4px'
              }}
            >
              ACMS
            </Typography>
          </Box>

          {/* Right side - Login form */}
          <Box
            sx={{
              flex: 1,
              width: '100%',
              maxWidth: { xs: '100%', sm: '350px' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {/* Welcome text */}
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 'bold',
                color: mode === 'dark' ? '#ffffff' : '#333333',
                textAlign: 'center',
                fontSize: { xs: '1.3rem', sm: '1.5rem' }
              }}
            >
              Welcome Back!
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                color: mode === 'dark' ? '#cccccc' : '#666666',
                textAlign: 'center',
                fontSize: '0.9rem'
              }}
            >
              Enter details to sign in
            </Typography>

            {/* Role Selection */}
            <Box sx={{ mb: 3, width: '100%' }}>
              <RadioGroup
                row
                value={credentials.role}
                onChange={handleRoleChange}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: { xs: 1, sm: 2 }
                }}
              >
                <FormControlLabel
                  value="Admin"
                  control={
                    <Radio
                      sx={{
                        color: mode === 'dark' ? '#cccccc' : '#666666',
                        '&.Mui-checked': {
                          color: greenPalette.mediumGreen
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.1rem'
                        }
                      }}
                    />
                  }
                  label={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: mode === 'dark' ? '#cccccc' : '#666666',
                        fontSize: '0.85rem'
                      }}
                    >
                      Admin
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="Student"
                  control={
                    <Radio
                      sx={{
                        color: mode === 'dark' ? '#cccccc' : '#666666',
                        '&.Mui-checked': {
                          color: greenPalette.mediumGreen
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.1rem'
                        }
                      }}
                    />
                  }
                  label={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: mode === 'dark' ? '#cccccc' : '#666666',
                        fontSize: '0.85rem'
                      }}
                    >
                      Student
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="Artisan"
                  control={
                    <Radio
                      sx={{
                        color: mode === 'dark' ? '#cccccc' : '#666666',
                        '&.Mui-checked': {
                          color: greenPalette.mediumGreen
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.1rem'
                        }
                      }}
                    />
                  }
                  label={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: mode === 'dark' ? '#cccccc' : '#666666',
                        fontSize: '0.85rem'
                      }}
                    >
                      Artisan
                    </Typography>
                  }
                />
              </RadioGroup>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                {error}
              </Alert>
            )}

            <form 
              onSubmit={handleSubmit} 
              style={{ width: '100%' }}
              autoComplete="off"
              spellCheck="false"
            >
              {/* Email field */}
              <TextField
                fullWidth
                placeholder="Email"
                name="email"
                type="email"
                variant="outlined"
                value={credentials.email}
                onChange={handleChange}
                required
                autoComplete="username"
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : '#e0e0e0'
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '12px',
                    color: mode === 'dark' ? '#ffffff' : 'inherit'
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                    opacity: 1
                  },
                }}
              />

              {/* Password field - SECURED */}
              <TextField
                fullWidth
                placeholder="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={credentials.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                inputProps={{
                  autoComplete: "current-password",
                  'data-lpignore': 'true',
                  'data-form-type': 'other',
                  spellCheck: 'false'
                }}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : '#e0e0e0'
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '12px',
                    color: mode === 'dark' ? '#ffffff' : 'inherit'
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                    opacity: 1
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">\
                      <IconButton 
                        onClick={handleTogglePasswordVisibility} 
                        edge="end"
                        tabIndex={-1}
                        sx={{ color: mode === 'dark' ? '#cccccc' : 'rgba(0,0,0,0.5)' }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {/* Remember Me checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    sx={{
                      color: mode === 'dark' ? '#cccccc' : '#666666',
                      '&.Mui-checked': {
                        color: greenPalette.mediumGreen
                      }
                    }}
                  />
                }
                label={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: mode === 'dark' ? '#cccccc' : '#666666',
                      fontSize: '0.85rem'
                    }}
                  >
                    Remember Me
                  </Typography>
                }
                sx={{ mb: 2, alignSelf: 'flex-start' }}
              />

              {/* Sign In button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ 
                  py: 1.2, 
                  bgcolor: greenPalette.mediumGreen,
                  '&:hover': {
                    bgcolor: greenPalette.mediumDarkGreen
                  },
                  mb: 2,
                  textTransform: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 12px rgba(45, 169, 75, 0.3)'
                }}
              >
                Sign In
              </Button>

              {/* No Account text */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mr: 1, 
                    color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                    fontSize: '0.85rem'
                  }}
                >
                  No Account?
                </Typography>
                <Link 
                  href="/signup" 
                  underline="hover" 
                  sx={{ 
                    color: greenPalette.mediumGreen, 
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    '&:hover': {
                      color: greenPalette.mediumDarkGreen
                    }
                  }}
                >
                  Sign Up
                </Link>
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;