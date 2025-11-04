// src/pages/LoginPage.jsx  ← COPY-PASTE THIS ENTIRE FILE
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box, Button, Typography, TextField, Checkbox, FormControlLabel,
  InputAdornment, IconButton, Link, Alert, Paper, Radio, RadioGroup
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser } from '../../utils/authUtils';
import LoaderComponent from '../../components/loaders/AdvancedLoaders';

const green = '#2DA94B';

export default function LoginPage() {
  const { mode = 'light', toggleTheme } = useThemeContext() || {};
  const { login, user, loading: authLoading } = useAuth() || {};
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ email: '', password: '', role: 'Student' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && !authLoading) {
      if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
      if (user.role === 'student') navigate('/student/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const result = await loginUser(credentials);
      const backendRole = (result.user?.role || '').toLowerCase();
      if (backendRole !== credentials.role.toLowerCase()) throw new Error('Role mismatch');
      toast.success('Welcome back!');
      login({ ...result.user, token: result.token });
    } catch (err) {
      setError(err.message || 'Login failed'); toast.error(err.message);
    } finally { setLoading(false); }
  };

  if (authLoading || loading) return <LoaderComponent isLoading={true} loadingText="Signing In" />;

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', bgcolor: mode === 'dark' ? '#121212' : '#f8f9fa' }}>
      <ToastContainer />

      {/* 1. PHOTO HEADER */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: { xs: '45vh', md: '50vh' },
        background: `url('/Akuafo_hall.jpg') center/cover no-repeat`,
        backgroundBlendMode: 'multiply',
        backgroundColor: 'rgba(0,0,0,0.25)',
        zIndex: 1
      }} />

      
      {/* 3. ACMS + DARK/SUN BUTTON */}
      <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 10, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography sx={{
          bgcolor: green, color: 'white', px: 3, py: 1.5,
          borderRadius: '30px', fontWeight: 'bold', fontSize: '1.1rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
        }}>
          ACMS
        </Typography>
        <IconButton onClick={toggleTheme} sx={{
          bgcolor: 'rgba(255,255,255,0.25)', color: 'white',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' }
        }}>
          {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </IconButton>
      </Box>

      {/* 4. LOGIN CARD – MOVED UP, CLOSER TO TITLE */}
      <Box sx={{
        position: 'absolute',
        top: { xs: '32vh', md: '36vh' },   // ← Significantly closer to title
        left: '50%',
        transform: 'translateX(-50%)',
        width: { xs: '92%', sm: '480px' },
        zIndex: 5
      }}>
        <Paper elevation={24} sx={{
          borderRadius: '28px',
          p: { xs: 4, sm: 6 },
          bgcolor: mode === 'dark' ? '#1e1e1e' : 'white',
          color: mode === 'dark' ? '#e0e0e0' : 'inherit',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
        }}>
          <Typography variant="h4" sx={{ 
            textAlign: 'center', 
            fontWeight: 700, 
            color: green, 
            mb: 1 
          }}>
            Welcome Back!
          </Typography>
          <Typography sx={{ 
            textAlign: 'center', 
            color: mode === 'dark' ? '#aaaaaa' : '#555', 
            mb: 4 
          }}>
            Enter details to sign in
          </Typography>

          <RadioGroup 
            row 
            value={credentials.role} 
            onChange={e => setCredentials({ ...credentials, role: e.target.value })}
            sx={{ justifyContent: 'center', mb: 3, gap: 6 }}
          >
            <FormControlLabel 
              value="Admin" 
              control={<Radio sx={{ color: green, '&.Mui-checked': { color: green } }} />} 
              label="Admin" 
              sx={{ color: mode === 'dark' ? '#e0e0e0' : 'inherit' }}
            />
            <FormControlLabel 
              value="Student" 
              control={<Radio sx={{ color: green, '&.Mui-checked': { color: green } }} />} 
              label="Student" 
              sx={{ color: mode === 'dark' ? '#e0e0e0' : 'inherit' }}
            />
          </RadioGroup>

          {error && <Alert severity="error" sx={{ mb: 2, bgcolor: mode === 'dark' ? '#440000' : undefined }}>{error}</Alert>}

          <form onSubmit={handleSubmit} autoComplete="off">
            <TextField 
              fullWidth 
              label="Email" 
              type="email" 
              required
              value={credentials.email}
              onChange={e => setCredentials({ ...credentials, email: e.target.value })}
              sx={{ 
                mb: 3, 
                '& .MuiOutlinedInput-root': { borderRadius: '14px' },
                '& .MuiInputLabel-root': { 
                  color: mode === 'dark' ? '#bbbbbb !important' : '#555 !important' 
                },
                '& .MuiOutlinedInput-input': {
                  color: mode === 'dark' ? '#e0e0e0' : 'inherit'
                }
              }} 
            />

            <TextField 
              fullWidth 
              label="Password" 
              type={showPassword ? 'text' : 'password'} 
              required
              value={credentials.password}
              onChange={e => setCredentials({ ...credentials, password: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: mode === 'dark' ? '#bbbbbb' : 'inherit' }}>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ 
                mb: 2, 
                '& .MuiOutlinedInput-root': { borderRadius: '14px' },
                '& .MuiInputLabel-root': { 
                  color: mode === 'dark' ? '#bbbbbb !important' : '#555 !important' 
                },
                '& .MuiOutlinedInput-input': {
                  color: mode === 'dark' ? '#e0e0e0' : 'inherit'
                }
              }} 
            />

            <FormControlLabel 
              control={<Checkbox sx={{ color: mode === 'dark' ? '#bbbbbb' : 'inherit' }} />} 
              label="Remember Me" 
              sx={{ mb: 3, color: mode === 'dark' ? '#e0e0e0' : 'inherit' }} 
            />

            <Button 
              type="submit" 
              fullWidth 
              variant="contained"
              sx={{ 
                py: 2, 
                borderRadius: '14px', 
                bgcolor: green, 
                fontWeight: 700, 
                fontSize: '1.1rem',
                '&:hover': { bgcolor: '#258c3e' }
              }}
            >
              Sign In
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography display="inline" sx={{ color: mode === 'dark' ? '#aaaaaa' : '#666' }}>
                No Account? 
              </Typography>{' '}
              <Link 
                href="/signup" 
                sx={{ 
                  color: green, 
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Sign Up
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}