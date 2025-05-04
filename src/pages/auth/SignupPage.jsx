import React, { useState, useRef } from "react";
import {
  Box,
  Card,
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
  Paper
} from "@mui/material";
import { useThemeContext } from "../../contexts/ThemeContext";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { registerUser } from '../../utils/authUtils';

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
    
    // Clear the file input
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
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
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
        // Login the user and redirect
        login(response.user);
        navigate('/student');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: mode === 'dark' ? '#121212' : '#e5e5e5',
      }}
    >

      {/* Header with Logo and Theme Toggle */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          alignItems: "center",
          gap: 1,
          zIndex: 10
        }}
      >
        <Button
          variant="contained"
          disableElevation
          sx={{
            bgcolor: greenPalette.main,
            color: "white",
            fontWeight: "bold",
            px: 2,
            py: 0.5,
            minWidth: "auto",
            "&:hover": {
              bgcolor: "#248a3d"
            }
          }}
        >
          ACMS
        </Button>
        
        <IconButton
          onClick={toggleTheme}
          size="small"
          sx={{
            color: mode === 'dark' ? '#ffffff' : '#000000',
            bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            borderRadius: "50%",
            width: 32,
            height: 32
          }}
        >
          {mode === 'dark' ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
        </IconButton>
      </Box>

      {/* Card Container*/} 
      <Paper
        elevation={4}
        sx={{
          width: { xs: "90%", sm: 400 },
          maxWidth: 400,
          borderRadius: 2,
          overflow: "hidden",
          my: 2
        }}
      >
        {/* Green Header*/} 
        <Box
          sx={{
            width: "100%",
            bgcolor: greenPalette.main,
            color: "white",
            p: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 400 }}>
            Welcome Student!
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Enter your credentials to register
          </Typography>
        </Box>

        {/* Form*/} 
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 3,
            pt: 2,
            bgcolor: mode === 'dark' ? '#242424' : '#ffffff',
          }}
        >
          {error && (
            <Box 
              sx={{ 
                p: 1.5, 
                mb: 2, 
                bgcolor: '#ffebee', 
                color: '#c62828',
                borderRadius: 1
              }}
            >
              {error}
            </Box>
          )}
          {/* Form Fields*/} 
          <TextField
            name="name"
            placeholder="Name"
            fullWidth
            variant="standard"
            margin="dense"
            value={formData.name}
            onChange={handleChange}
            sx={{
              mb: 1.5,
              '& .MuiInput-underline:before': {
                borderBottomColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              },
              '& .MuiInputBase-input': {
                color: mode === 'dark' ? '#ffffff' : '#000000',
              }
            }}
          />
          
          <TextField
            name="id"
            placeholder="ID"
            fullWidth
            variant="standard"
            margin="dense"
            value={formData.id}
            onChange={handleChange}
            sx={{
              mb: 1.5,
              '& .MuiInput-underline:before': {
                borderBottomColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              },
              '& .MuiInputBase-input': {
                color: mode === 'dark' ? '#ffffff' : '#000000',
              }
            }}
          />
          
          <TextField
            name="email"
            placeholder="Student Email"
            fullWidth
            variant="standard"
            margin="dense"
            type="email"
            value={formData.email}
            onChange={handleChange}
            sx={{
              mb: 1.5,
              '& .MuiInput-underline:before': {
                borderBottomColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              },
              '& .MuiInputBase-input': {
                color: mode === 'dark' ? '#ffffff' : '#000000',
              }
            }}
          />
          
          <TextField
            name="programme"
            placeholder="Programme of Study"
            fullWidth
            variant="standard"
            margin="dense"
            value={formData.programme}
            onChange={handleChange}
            sx={{
              mb: 1.5,
              '& .MuiInput-underline:before': {
                borderBottomColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              },
              '& .MuiInputBase-input': {
                color: mode === 'dark' ? '#ffffff' : '#000000',
              }
            }}
          />
          
          <TextField
            name="password"
            placeholder="Password"
            fullWidth
            variant="standard"
            type="password"
            margin="dense"
            value={formData.password}
            onChange={handleChange}
            sx={{
              mb: 1.5,
              '& .MuiInput-underline:before': {
                borderBottomColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              },
              '& .MuiInputBase-input': {
                color: mode === 'dark' ? '#ffffff' : '#000000',
              }
            }}
          />
          
          <TextField
            name="confirmPassword"
            placeholder="Re-type Password"
            fullWidth
            variant="standard"
            type="password"
            margin="dense"
            value={formData.confirmPassword}
            onChange={handleChange}
            sx={{
              mb: 1.5,
              '& .MuiInput-underline:before': {
                borderBottomColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              },
              '& .MuiInputBase-input': {
                color: mode === 'dark' ? '#ffffff' : '#000000',
              }
            }}
          />
          
          {/* Block as a dropdown*/} 
          <FormControl 
            fullWidth 
            variant="standard" 
            margin="dense"
            sx={{
              mb: 1.5,
              '& .MuiInput-underline:before': {
                borderBottomColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              }
            }}
          >
            <Select
              name="block"
              displayEmpty
              value={formData.block}
              onChange={handleChange}
              IconComponent={KeyboardArrowDownIcon}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ 
                    color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' 
                  }}>Block</span>;
                }
                return selected;
              }}
              sx={{
                color: mode === 'dark' ? '#ffffff' : '#000000',
              }}
            >
              <MenuItem value="Main">Main</MenuItem>
              <MenuItem value="Annex A">Annex A</MenuItem>
              <MenuItem value="Annex B">Annex B</MenuItem>
            </Select>
          </FormControl>

          <TextField
            name="room_no"
            placeholder="Room Number"
            fullWidth
            variant="standard"
            margin="dense"
            value={formData.room_no}
            onChange={handleChange}
            sx={{
              mb: 1.5,
              '& .MuiInput-underline:before': {
                borderBottomColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              },
              '& .MuiInputBase-input': {
                color: mode === 'dark' ? '#ffffff' : '#000000',
              }
            }}
          />
          
          <TextField
            name="phone"
            placeholder="Phone"
            fullWidth
            variant="standard"
            margin="dense"
            value={formData.phone}
            onChange={handleChange}
            sx={{
              mb: 1.5,
              '& .MuiInput-underline:before': {
                borderBottomColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              },
              '& .MuiInputBase-input': {
                color: mode === 'dark' ? '#ffffff' : '#000000',
              }
            }}
          />
          
          {/* Photo Preview and Upload */}
<Box sx={{ 
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  mb: 1.5,
  mt: 1
}}>
  {photoPreview ? (
    // Show photo preview with remove option
    <Box sx={{ position: 'relative', mb: 1 }}>
      <Avatar
        src={photoPreview}
        alt="Profile preview"
        sx={{
          width: 100,
          height: 100,
          border: `2px solid ${greenPalette.main}`,
          boxShadow: '0 3px 5px rgba(0,0,0,0.2)'
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
    // Show upload placeholder
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
  
  <Box 
    onClick={() => fileInputRef.current.click()}
    sx={{
      textAlign: 'center',
      color: greenPalette.main,
      fontWeight: 'bold',
      cursor: 'pointer',
      py: 0.5,
      '&:hover': {
        textDecoration: 'underline'
      }
    }}
  >
    {photoPreview ? "Change Photo" : "Upload Your Photo"}
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      style={{ display: 'none' }}
      onChange={handlePhotoUpload}
    />
      </Box>
    </Box>
          
          {/* Terms and Conditions Checkbox */}
          <FormControlLabel
            control={
              <Checkbox 
                size="small"
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
              <Typography variant="body2">
                I agree to the{' '}
                <Link 
                  href="#" 
                  sx={{ 
                    color: greenPalette.main,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Terms and Conditions
                </Link>
              </Typography>
            }
            sx={{ mb: 2 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{
              bgcolor: greenPalette.main,
              color: 'white',
              py: 1.5,
              mb: 2,
              borderRadius: 1,
              textTransform: 'uppercase',
              '&:hover': {
                bgcolor: '#248a3d'
              }
            }}
          >
            {isSubmitting ? 'SIGNING UP...' : 'SIGN UP'}
          </Button>
          
          {/* Sign In Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link 
                href="/login" 
                sx={{ 
                  color: greenPalette.main,
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignupPage;
