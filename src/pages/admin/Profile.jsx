import React, { useRef, useState } from 'react';
import { Box } from '@mui/material';
import {
  Card,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { Facebook, Twitter, Instagram, Edit } from '@mui/icons-material';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { useThemeContext } from '../../contexts/ThemeContext';
import NavBar from '../../components/Reusable/NavBar';
import Sidebar from '../../components/Reusable/Sidebar';

function Profile() {
  const { mode } = useThemeContext();
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef();

  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(true);
  const [toggle3, setToggle3] = useState(true);
  const [toggle4, setToggle4] = useState(true);
  const [toggle5, setToggle5] = useState(true);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column" sx={{ minWidth: 0 }}>
        <NavBar notificationCount={5} />
        <Box
          component="main"
          sx={{
            p: { xs: 2, sm: 3 },
            flexGrow: 1,
            backgroundColor: mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              minHeight: '100%',
              position: 'relative',
            }}
          >
             {/* grey bar*/}
            <Box
              sx={{
                backgroundColor: '#d3d3d3',
                width: { xs: '80%', md: '82%' },
                height: '34%',
                borderRadius: 4,
                position: 'absolute',
                top: 10,
                left: { xs: 0, md: 266 },
                zIndex: 0,
              }}
            />
               {/* white card with info */}
            <Card
              sx={{
                maxWidth: '1110px',
                width: { xs: '80%', md: '100%' },
                mx: 0,
                p: 4,
                ml: { xs: 0, md: 40 },
                mt: 12,
                display: 'flex',
                height: 'auto',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 4,
                zIndex: 1,
                position: 'relative',
                borderRadius: 2,
              }}
            >
              {/* Platform settings area */}
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    mb: 4,
                    cursor: 'pointer',
                  }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                  <Avatar
                    src={selectedImage}
                    sx={{
                      width: 120,
                      height: 120,
                      border: '3px solid white',
                      boxShadow: 2,
                      mt: -2,
                      ml: -1,
                      mb: 1,
                    }}
                  />
                </Box>

                <Typography variant="body1" fontWeight="bold" color="#14213D" gutterBottom>
                  Platform Settings
                </Typography>

                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
                  <Box flex={1}>
                    <Typography variant="subtitle2" fontSize="14px" sx={{ mb: 2.5 }}>
                      ACCOUNT
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        sx={{ mb: 2, color: '#7a7a7a' }}
                        control={
                          <IconButton onClick={() => setToggle1(!toggle1)} sx={{ fontSize: 32 }}>
                            {toggle1 ? (
                              <ToggleOnIcon sx={{ fontSize: 32, color: "#14213D" }} />
                            ) : (
                              <ToggleOffIcon sx={{ fontSize: 32 }} />
                            )}
                          </IconButton>
                        }
                        label="Notify me of new maintenance complaints"
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        sx={{ mb: 2, color: '#7a7a7a' }}
                        control={
                          <IconButton onClick={() => setToggle2(!toggle2)} sx={{ fontSize: 32 }}>
                            {toggle2 ? (
                              <ToggleOnIcon sx={{ fontSize: 32, color: "#14213D" }} />
                            ) : (
                              <ToggleOffIcon sx={{ fontSize: 32 }} />
                            )}
                          </IconButton>
                        }
                        label="Notify me of updates on ongoing complaints"
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        sx={{ mb: 2, color: '#7a7a7a' }}
                        control={
                          <IconButton onClick={() => setToggle3(!toggle3)} sx={{ fontSize: 32 }}>
                            {toggle3 ? (
                              <ToggleOnIcon sx={{ fontSize: 32, color: "#14213D" }} />
                            ) : (
                              <ToggleOffIcon sx={{ fontSize: 32 }} />
                            )}
                          </IconButton>
                        }
                        label="Notify me of urgent maintenance issues"
                        labelPlacement="end"
                      />
                    </FormGroup>
                  </Box>

                  <Box flex={1}>
                    <Typography variant="subtitle2" fontSize="14px" sx={{ mb: 2.5 }}>
                      APPLICATION
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        sx={{ mb: 2, color: '#7a7a7a' }}
                        control={
                          <IconButton onClick={() => setToggle4(!toggle4)} sx={{ fontSize: 32 }}>
                            {toggle4 ? (
                              <ToggleOnIcon sx={{ fontSize: 32, color: "#14213D" }} />
                            ) : (
                              <ToggleOffIcon sx={{ fontSize: 32 }} />
                            )}
                          </IconButton>
                        }
                        label="Receive detailed maintenance report"
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        sx={{ mb: 2, color: '#7a7a7a' }}
                        control={
                          <IconButton onClick={() => setToggle5(!toggle5)} sx={{ fontSize: 32 }}>
                            {toggle5 ? (
                              <ToggleOnIcon sx={{ fontSize: 32, color: "#14213D" }} />
                            ) : (
                              <ToggleOffIcon sx={{ fontSize: 32 }} />
                            )}
                          </IconButton>
                        }
                        label="Request feedback after maintenance resolution"
                        labelPlacement="end"
                      />
                    </FormGroup>
                  </Box>
                </Box>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

              {/* Profile Information area */}
              <Box sx={{ flex: 1, mt: { xs: 4, md: 18 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body1" fontWeight="bold" color="#14213D" sx={{ mb: 3 }}>
                    Profile Information
                  </Typography>
                  <Tooltip title="Edit Description">
                  </Tooltip>
                </Box>

                <Box
                  sx={{
                    borderBottom: '1px solid gray',
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3,
                    pb: 0.5,
                  }}
                >
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    style={{
                      outline: 'none',
                      flexGrow: 1,
                      color: 'gray',
                    }}
                    onFocus={(e) => {
                      if (e.target.innerText === 'Add description') {
                        e.target.innerText = '';
                        e.target.style.color = 'black';
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.innerText.trim() === '') {
                        e.target.innerText = 'Add description';
                        e.target.style.color = 'gray';
                      }
                    }}
                  >
                    Add description
                  </span>
                  <Edit fontSize="small" sx={{ ml: 1, color: 'gray' }} />
                </Box>

                <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={4}>
                  <Box display="flex" flexDirection="column" gap={1}>
                    {['Name', 'Email', 'Phone', 'Block', 'Room No', 'Programme'].map((label) => (
                      <Typography key={label} variant="body2">
                        {label}:{' '}
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          style={{ outline: 'none' }}
                        ></span>
                      </Typography>
                    ))}
                  </Box>

                  <Box display="flex" flexDirection="column" gap={1}>
                    {['Location', 'Description'].map((label) => (
                      <Typography key={label} variant="body2">
                        {label}:{' '}
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          style={{ outline: 'none' }}
                        ></span>
                      </Typography>
                    ))}

                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2">Social:</Typography>
                      <Box display="flex" gap={1} mt={0.5}>
                        <IconButton size="small" sx={{ color: '#1DA1F2' }}>
                          <Facebook />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#1DA1F2' }}>
                          <Twitter />
                        </IconButton>
                        <IconButton size="small" sx={{ color: 'black' }}>
                          <Instagram />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Profile;
