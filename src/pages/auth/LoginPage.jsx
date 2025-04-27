import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputAdornment,
  IconButton,
  Link,
  CircularProgress,
  useMediaQuery
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser } from '../../utils/authUtils';

const greenPalette = {
  darkGreen: '#055519',  // 13%
  mediumDarkGreen: '#24873D', // 28%
  mediumGreen: '#2DA94B', // 39%
  green: '#2B8C43', // 50%
  lightGreen: '#2BA148', // 54%, 68%
  lightestGreen: '#1C7B34' // 75%
};

const LoginPage = () => {
  // Access theme and auth contexts
  let themeContext;
  let authContext;
  
  try {
    themeContext = useThemeContext();
  } catch (error) {
    themeContext = { mode: 'dark', toggleTheme: () => {} };
  }
  
  try {
    authContext = useAuth();
  } catch (error) {
    authContext = { login: () => {} };
  }
  
  const { mode, toggleTheme } = themeContext;
  const { login } = authContext;
  const isMobile = useMediaQuery('(max-width:768px)');
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    role: 'Student'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Update body background color for dark mode
  useEffect(() => {
    document.body.style.backgroundColor = mode === 'dark' ? '#121212' : '#ffffff';
  }, [mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await loginUser(credentials);
      login({
        ...credentials,
        ...result
      });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: mode === 'dark' ? '#121212' : '#ffffff',
        color: mode === 'dark' ? '#ffffff' : '#000000',
      }}
    >
      {/* Gray rectangle at the top */}
      <Box
        sx={{
          width: '100%',
          bgcolor: mode === 'dark' ? '#1e1e1e' : '#e5e5e5',
          height: { xs: '150px', sm: '200px', md: '40vh' },
          position: 'relative',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          p: 2
        }}
      >
        {/* ACMS button and theme toggle in top right */}
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              bgcolor: greenPalette.mediumGreen,
              px: 2,
              py: 1,
              borderRadius: '4px',
              fontWeight: 'bold',
              boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            ACMS
          </Typography>
          
          <IconButton
            onClick={toggleTheme}
            sx={{ 
              color: mode === 'dark' ? '#ffffff' : '#000000',
              bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Centered container for login boxes */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '80%', md: '750px' },
          height: { xs: 'auto', md: 'auto' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Green box is the bottom layer with longer height */}
        <Box
          sx={{
            position: 'relative',
            width: { xs: '100%', md: '100%' },
            height: { xs: 'auto', md: '500px' },
            borderRadius: '4px',
            boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          {/* Green section (bigger than the login form) */}
          <Box
            sx={{
              width: { xs: '100%', md: '55%' },
              height: { xs: '180px', md: '100%' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              // Using exact linear gradient with colors from the palette
              background: `linear-gradient(135deg, 
                ${greenPalette.darkGreen} 0%, 
                ${greenPalette.mediumDarkGreen} 25%, 
                ${greenPalette.mediumGreen} 35%, 
                ${greenPalette.green} 45%, 
                ${greenPalette.lightGreen} 60%, 
                ${greenPalette.lightestGreen} 85%)`,
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                mb: { xs: 2, md: 0 }
              }}
            >
              WELCOME!
            </Typography>
            
            {/* Footer in the green section */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
                display: 'flex',
                justifyContent: 'space-between',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.8rem'
              }}
            >
              <Typography variant="body2">All rights reserved</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">© Akuafo Hall 2025</Typography>
              </Box>
            </Box>
          </Box>
          
          {/* White overlay area for login form - positioned slightly over green section */}
          <Box
            sx={{
              position: { xs: 'relative', md: 'absolute' },
              top: { xs: 'auto', md: '50%' },
              right: { xs: 'auto', md: '0' },
              transform: { xs: 'none', md: 'translateY(-50%)' },
              width: { xs: '100%', md: '55%' },
              bgcolor: mode === 'dark' ? '#242424' : '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: { xs: '1.5rem', sm: '2rem' },
              boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
              borderRadius: '4px',
              border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              height: { xs: 'auto', md: '400px' },
              zIndex: 2
            }}
          >
            <Typography 
              sx={{ 
                mb: 3, 
                textAlign: 'center',
                color: mode === 'dark' ? '#e0e0e0' : '#4d5b42',
                fontWeight: 'normal',
                fontSize: { xs: '1rem', md: '1.1rem' }
              }}
            >
              Enter details to sign in
            </Typography>
            
            {error && (
              <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '300px' }}>
              {/* Role selection */}
              <FormControl component="fieldset" sx={{ width: '100%', mb: 2 }}>
                <RadioGroup
                  row
                  name="role"
                  value={credentials.role}
                  onChange={handleChange}
                  sx={{ 
                    justifyContent: 'center',
                    '& .MuiFormControlLabel-root': { 
                      mx: { xs: 0.5, sm: 1 },
                    }
                  }}
                >
                  <FormControlLabel 
                    value="Admin" 
                    control={
                      <Radio 
                        sx={{
                          color: mode === 'dark' ? '#9e9e9e' : '#9e9e9e',
                          padding: '4px',
                          '&.Mui-checked': {
                            color: mode === 'dark' ? greenPalette.lightGreen : greenPalette.green
                          }
                        }}
                      />
                    } 
                    label="Admin" 
                    sx={{ 
                      '& .MuiTypography-root': { 
                        color: credentials.role === 'Admin' 
                          ? (mode === 'dark' ? greenPalette.lightGreen : greenPalette.green) 
                          : (mode === 'dark' ? '#bbbbbb' : '#666666'),
                        fontSize: '0.9rem'
                      }
                    }}
                  />
                  <FormControlLabel 
                    value="Student" 
                    control={
                      <Radio 
                        sx={{
                          color: mode === 'dark' ? '#9e9e9e' : '#9e9e9e',
                          padding: '4px',
                          '&.Mui-checked': {
                            color: mode === 'dark' ? greenPalette.lightGreen : greenPalette.green
                          }
                        }}
                      />
                    } 
                    label="Student" 
                    sx={{ 
                      '& .MuiTypography-root': { 
                        color: credentials.role === 'Student' 
                          ? (mode === 'dark' ? greenPalette.lightGreen : greenPalette.green) 
                          : (mode === 'dark' ? '#bbbbbb' : '#666666'),
                        fontSize: '0.9rem'
                      }
                    }}
                  />
                  <FormControlLabel 
                    value="Artisan" 
                    control={
                      <Radio 
                        sx={{
                          color: mode === 'dark' ? '#9e9e9e' : '#9e9e9e',
                          padding: '4px',
                          '&.Mui-checked': {
                            color: mode === 'dark' ? greenPalette.lightGreen : greenPalette.green
                          }
                        }}
                      />
                    } 
                    label="Artisan" 
                    sx={{ 
                      '& .MuiTypography-root': { 
                        color: credentials.role === 'Artisan' 
                          ? (mode === 'dark' ? greenPalette.lightGreen : greenPalette.green) 
                          : (mode === 'dark' ? '#bbbbbb' : '#666666'),
                        fontSize: '0.9rem'
                      }
                    }}
                  />
                </RadioGroup>
              </FormControl>
              
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
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px',
                    bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#ffffff'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '10px 14px',
                    color: mode === 'dark' ? '#ffffff' : 'inherit'
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                    opacity: 1
                  },
                }}
              />
              
              {/* Password field */}
              <TextField
                fullWidth
                placeholder="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={credentials.password}
                onChange={handleChange}
                required
                sx={{ 
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px',
                    bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#ffffff'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '10px 14px',
                    color: mode === 'dark' ? '#ffffff' : 'inherit'
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                    opacity: 1
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleTogglePasswordVisibility} 
                        edge="end"
                        sx={{ color: mode === 'dark' ? '#cccccc' : 'rgba(0,0,0,0.5)' }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              {/* Sign In button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ 
                  py: { xs: 1, md: 1.2 }, 
                  bgcolor: greenPalette.mediumGreen,
                  '&:hover': {
                    bgcolor: greenPalette.mediumDarkGreen
                  },
                  mb: 2,
                  textTransform: 'none',
                  borderRadius: '4px',
                  fontWeight: 'normal',
                  fontSize: '1rem',
                  boxShadow: 'none'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
              
              {/* No Account text */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
                <Typography variant="body2" sx={{ mr: 1, color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                  No Account?
                </Typography>
                <Link 
                  href="/signup" 
                  underline="hover" 
                  sx={{ color: mode === 'dark' ? greenPalette.lightGreen : greenPalette.mediumGreen, fontWeight: 500 }}
                >
                  Sign Up
                </Link>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;