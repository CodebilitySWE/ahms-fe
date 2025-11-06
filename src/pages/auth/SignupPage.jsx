import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Paper,
  Avatar,
  Tooltip,
  Alert
} from "@mui/material";
import { useThemeContext } from "../../contexts/ThemeContext";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { registerUser } from '../../utils/authUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const greenPalette = {
  main: '#2DA94B', 
};

const SignupPage = () => {
  // Theme context
  let themeContext;
  try {
    themeContext = useThemeContext();
  } catch (error) {
    themeContext = { mode: 'light', toggleTheme: () => {} };
  }
  const { mode, toggleTheme } = themeContext;
  
  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    email: "",
    programme: "",
    password: "",
    confirmPassword: "",
    block: "",    
    room_no: "",                            
    phone: "",
    agreeToTerms: false
  });
  
  // For photo upload
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'agreeToTerms' ? checked : value
    }));
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setFileName("");
    setPhotoFile(null);
    setPhotoPreview(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Form validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      toast.error('Please agree to the terms and conditions');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Map form data to API expected fields
      const apiData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone,
        student_id: formData.id,
        room_number: formData.room_no, 
        block: formData.block,
        programme: formData.programme
      };
      
      // Call API to register user
      const response = await registerUser(apiData, photoFile);
      
      if (response.success) {
        toast.success('Registration successful! Welcome aboard!');
        // Login the user and redirect
        login(response.user);
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      toast.error(err.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', bgcolor: mode === 'dark' ? '#121212' : '#f8f9fa' }}>
      <ToastContainer />

      {/* PHOTO HEADER */}
      <Box sx={{
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0,
        height: { xs: '35vh', md: '40vh' },
        background: `url('/Akuafo_hall.jpg') center/cover no-repeat`,
        backgroundBlendMode: 'multiply',
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 1
      }} />

      {/* AKUAFO HALL TEXT OVERLAY */}
      <Box sx={{
        position: 'absolute',
        top: { xs: '12vh', md: '14vh' },
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        textAlign: 'center'
      }}>
        <Typography sx={{
          color: 'white',
          fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
          fontWeight: 900,
          letterSpacing: '0.05em',
          textShadow: '0 4px 20px rgba(0,0,0,0.6)',
          lineHeight: 1
        }}>
          Akuafo Hall
        </Typography>
        <Typography sx={{
          color: 'rgba(255,255,255,0.95)',
          fontSize: { xs: '0.9rem', sm: '1.1rem' },
          fontWeight: 500,
          mt: 1,
          letterSpacing: '0.1em',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)'
        }}>
          HALL OF EXCELLENCE
        </Typography>
      </Box>

      {/* ACMS + THEME TOGGLE */}
      <Box sx={{ 
        position: 'absolute', 
        top: 24, 
        right: 24, 
        zIndex: 10, 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center' 
      }}>
        <Typography sx={{
          bgcolor: greenPalette.main, 
          color: 'white', 
          px: 3, 
          py: 1.5,
          borderRadius: '30px', 
          fontWeight: 'bold', 
          fontSize: '1.1rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
        }}>
          ACMS
        </Typography>
        <IconButton 
          onClick={toggleTheme} 
          sx={{
            bgcolor: 'rgba(255,255,255,0.25)', 
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' }
          }}
        >
          {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </IconButton>
      </Box>

      {/* SIGNUP CARD */}
      <Box sx={{
        position: 'absolute',
        top: { xs: '28vh', md: '32vh' },
        left: '50%',
        transform: 'translateX(-50%)',
        width: { xs: '92%', sm: '500px' },
        maxHeight: { xs: '68vh', md: '65vh' },
        overflowY: 'auto',
        zIndex: 5,
        pb: 4,
        '&::-webkit-scrollbar': {
          width: '8px'
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          background: mode === 'dark' ? '#555' : '#ccc',
          borderRadius: '4px'
        }
      }}>
        <Paper elevation={24} sx={{
          borderRadius: '28px',
          p: { xs: 3, sm: 5 },
          bgcolor: mode === 'dark' ? '#1e1e1e' : 'white',
          color: mode === 'dark' ? '#e0e0e0' : 'inherit',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
        }}>
          <Typography variant="h4" sx={{ 
            textAlign: 'center', 
            fontWeight: 700, 
            color: greenPalette.main, 
            mb: 1 
          }}>
            Welcome Student!
          </Typography>
          <Typography sx={{ 
            textAlign: 'center', 
            color: mode === 'dark' ? '#aaaaaa' : '#555', 
            mb: 3 
          }}>
            Enter your credentials to register
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, bgcolor: mode === 'dark' ? '#440000' : undefined }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Photo Upload Section */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3
            }}>
              {photoPreview ? (
                <Box sx={{ position: 'relative', mb: 1 }}>
                  <Avatar
                    src={photoPreview}
                    alt="Profile preview"
                    sx={{
                      width: 100,
                      height: 100,
                      border: `3px solid ${greenPalette.main}`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                  />
                  <Tooltip title="Remove photo">
                    <IconButton 
                      size="small"
                      onClick={handleRemovePhoto}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.9)' : 'white',
                        color: '#d32f2f',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        '&:hover': {
                          bgcolor: mode === 'dark' ? 'rgba(255,255,255,1)' : 'white',
                          color: '#b71c1c'
                        }
                      }}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Box 
                  onClick={() => fileInputRef.current.click()}
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px dashed ${mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`,
                    cursor: 'pointer',
                    mb: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      borderColor: greenPalette.main
                    }
                  }}
                >
                  <PhotoCameraIcon 
                    sx={{ 
                      color: greenPalette.main, 
                      fontSize: 36, 
                      opacity: 0.8
                    }} 
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      mt: 0.5, 
                      color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                      fontSize: '0.7rem'
                    }}
                  >
                    Add photo
                  </Typography>
                </Box>
              )}
              
              <Typography 
                onClick={() => fileInputRef.current.click()}
                sx={{
                  color: greenPalette.main,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {photoPreview ? "Change Photo" : "Upload Your Photo"}
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
            </Box>

            {/* Form Fields */}
            <TextField
              name="name"
              label="Full Name"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
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
            
            <TextField
              name="id"
              label="Student ID"
              fullWidth
              required
              value={formData.id}
              onChange={handleChange}
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
            
            <TextField
              name="email"
              label="Student Email"
              fullWidth
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
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
            
            <TextField
              name="programme"
              label="Programme of Study"
              fullWidth
              required
              value={formData.programme}
              onChange={handleChange}
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
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl fullWidth>
                <Select
                  name="block"
                  displayEmpty
                  required
                  value={formData.block}
                  onChange={handleChange}
                  IconComponent={KeyboardArrowDownIcon}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span style={{ 
                        color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' 
                      }}>Block</span>;
                    }
                    return selected;
                  }}
                  sx={{
                    borderRadius: '14px',
                    color: mode === 'dark' ? '#e0e0e0' : 'inherit',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)'
                    }
                  }}
                >
                  <MenuItem value="Main">Main</MenuItem>
                  <MenuItem value="Annex A">Annex A</MenuItem>
                  <MenuItem value="Annex B">Annex B</MenuItem>
                </Select>
              </FormControl>

              <TextField
                name="room_no"
                label="Room No."
                fullWidth
                required
                value={formData.room_no}
                onChange={handleChange}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: '14px' },
                  '& .MuiInputLabel-root': { 
                    color: mode === 'dark' ? '#bbbbbb !important' : '#555 !important' 
                  },
                  '& .MuiOutlinedInput-input': {
                    color: mode === 'dark' ? '#e0e0e0' : 'inherit'
                  }
                }}
              />
            </Box>
            
            <TextField
              name="phone"
              label="Phone Number"
              fullWidth
              required
              value={formData.phone}
              onChange={handleChange}
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
            
            <TextField
              name="password"
              label="Password"
              fullWidth
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
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
            
            <TextField
              name="confirmPassword"
              label="Re-type Password"
              fullWidth
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
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
              control={
                <Checkbox 
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  sx={{
                    color: greenPalette.main,
                    '&.Mui-checked': {
                      color: greenPalette.main,
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: mode === 'dark' ? '#e0e0e0' : 'inherit' }}>
                  I agree to the{' '}
                  <Link 
                    href="#" 
                    sx={{ 
                      color: greenPalette.main,
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Terms and Conditions
                  </Link>
                </Typography>
              }
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                py: 2,
                borderRadius: '14px',
                bgcolor: greenPalette.main,
                color: 'white',
                fontWeight: 700,
                fontSize: '1.1rem',
                mb: 2,
                '&:hover': {
                  bgcolor: '#258c3e'
                },
                '&:disabled': {
                  bgcolor: mode === 'dark' ? '#444' : '#ccc'
                }
              }}
            >
              {isSubmitting ? 'SIGNING UP...' : 'SIGN UP'}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography display="inline" sx={{ color: mode === 'dark' ? '#aaaaaa' : '#666' }}>
                Already have an account?{' '}
              </Typography>
              <Link 
                href="/login" 
                sx={{ 
                  color: greenPalette.main,
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default SignupPage;