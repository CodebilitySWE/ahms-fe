import React, { useRef, useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  IconButton as MuiIconButton,
} from '@mui/material';
import { Facebook, Twitter, Instagram, Edit, Visibility, VisibilityOff, Save, PhotoCamera } from '@mui/icons-material';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../../components/Reusable/NavBar';
import Sidebar from '../../components/Reusable/Sidebar';
import {
  getProfile,
  updateProfile,
  updatePassword,
  updateProfilePicture,
  updateRoleDetails,
} from '../../utils/profileUtils';

function Profile() {
  const { mode } = useThemeContext();
  const { user } = useAuth();
  const fileInputRef = useRef();

  // State for profile data
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // State for edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone_number: '',
    // Role-specific fields will be added dynamically
  });

  // State for password change
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // State for password visibility
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // State for alerts
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(true);
  const [toggle3, setToggle3] = useState(true);
  const [toggle4, setToggle4] = useState(true);
  const [toggle5, setToggle5] = useState(true);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      console.log('Fetching profile data...'); // Debug log
      const response = await getProfile(user.token);
      console.log('Profile data received:', response); // Debug log
      setProfileData(response.data);
    } catch (error) {
      console.error('Error in fetchProfileData:', error); // Debug log
      setAlert({ open: true, message: error.message, severity: 'error' });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUpdating(true);
      await updateProfilePicture(user.token, file);
      await fetchProfileData(); // Refresh data
      setAlert({ open: true, message: 'Profile picture updated successfully!', severity: 'success' });
    } catch (error) {
      setAlert({ open: true, message: error.message, severity: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const handleEditClick = () => {
    const baseForm = {
      name: profileData?.name || '',
      phone_number: profileData?.phone_number || '',
    };

    // Add role-specific fields based on user role
    if (user.role === 'student' && profileData?.roleDetails) {
      baseForm.student_id = profileData.roleDetails.student_id || '';
      baseForm.room_number = profileData.roleDetails.room_number || '';
      baseForm.block = profileData.roleDetails.block || '';
      baseForm.programme = profileData.roleDetails.programme || '';
    } else if (user.role === 'artisan' && profileData?.roleDetails) {
      baseForm.work_type_id = profileData.roleDetails.work_type_id || '';
      baseForm.availability = profileData.roleDetails.availability || false;
    } else if (user.role === 'admin' && profileData?.roleDetails) {
      baseForm.position_in_hall = profileData.roleDetails.position_in_hall || '';
    }

    setEditForm(baseForm);
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      setUpdating(true);
      
      // Update basic profile
      await updateProfile(user.token, {
        name: editForm.name,
        phone_number: editForm.phone_number,
      });

      // Update role-specific details
      const roleData = {};
      if (user.role === 'student') {
        roleData.student_id = editForm.student_id;
        roleData.room_number = editForm.room_number;
        roleData.block = editForm.block;
        roleData.programme = editForm.programme;
      } else if (user.role === 'artisan') {
        roleData.work_type_id = editForm.work_type_id;
        roleData.availability = editForm.availability;
      } else if (user.role === 'admin') {
        roleData.position_in_hall = editForm.position_in_hall;
      }

      if (Object.keys(roleData).length > 0) {
        await updateRoleDetails(user.token, roleData);
      }

      await fetchProfileData(); // Refresh data
      setEditModalOpen(false);
      setAlert({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (error) {
      setAlert({ open: true, message: error.message, severity: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAlert({ open: true, message: 'New passwords do not match!', severity: 'error' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setAlert({ open: true, message: 'Password must be at least 6 characters long!', severity: 'error' });
      return;
    }

    try {
      setUpdating(true);
      await updatePassword(user.token, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setAlert({ open: true, message: 'Password updated successfully!', severity: 'success' });
    } catch (error) {
      setAlert({ open: true, message: error.message, severity: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Get role-specific display fields
  const getRoleSpecificFields = () => {
    if (!profileData?.roleDetails) return [];

    if (user.role === 'student') {
      return [
        { label: 'Student ID', value: profileData.roleDetails.student_id },
        { label: 'Room Number', value: profileData.roleDetails.room_number },
        { label: 'Block', value: profileData.roleDetails.block },
        { label: 'Programme', value: profileData.roleDetails.programme },
      ];
    } else if (user.role === 'artisan') {
      return [
        { label: 'Work Type', value: profileData.roleDetails.work_type_name },
        { label: 'Availability', value: profileData.roleDetails.availability ? 'Available' : 'Not Available' },
      ];
    } else if (user.role === 'admin') {
      return [
        { label: 'Position', value: profileData.roleDetails.position_in_hall },
      ];
    }
    return [];
  };

  // Get role-specific form fields for modal
  const getRoleSpecificFormFields = () => {
    if (user.role === 'student') {
      return [
        { name: 'student_id', label: 'Student ID', value: editForm.student_id || '' },
        { name: 'room_number', label: 'Room Number', value: editForm.room_number || '' },
        { name: 'block', label: 'Block', value: editForm.block || '' },
        { name: 'programme', label: 'Programme', value: editForm.programme || '' },
      ];
    } else if (user.role === 'artisan') {
      return [
        { name: 'work_type_id', label: 'Work Type ID', value: editForm.work_type_id || '' },
        { name: 'availability', label: 'Availability', value: editForm.availability || false, type: 'boolean' },
      ];
    } else if (user.role === 'admin') {
      return [
        { name: 'position_in_hall', label: 'Position in Hall', value: editForm.position_in_hall || '' },
      ];
    }
    return [];
  };

  if (loading) {
    return (
      <Box display="flex" minHeight="100vh" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  // Fallback in case profileData is null
  if (!profileData) {
    return (
      <Box display="flex" minHeight="100vh" justifyContent="center" alignItems="center">
        <Typography variant="h6" color="error">
          Failed to load profile data. Please try refreshing the page.
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar role={user.role} />
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
                    src={profileData?.profile_picture}
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
                  <Tooltip title="Edit Profile">
                    <IconButton onClick={handleEditClick} size="small">
                      <Edit />
                    </IconButton>
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
                    <Typography variant="body2">
                      Name: <strong>{profileData?.name || 'Not set'}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Email: <strong>{profileData?.email || 'Not set'}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Phone: <strong>{profileData?.phone_number || 'Not set'}</strong>
                    </Typography>
                    {getRoleSpecificFields().map((field, index) => (
                      <Typography key={index} variant="body2">
                        {field.label}: <strong>{field.value || 'Not set'}</strong>
                      </Typography>
                    ))}
                    <Typography variant="body2">
                      Role: <strong>{profileData?.role?.charAt(0).toUpperCase() + profileData?.role?.slice(1) || 'Not set'}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Member Since: <strong>{profileData?.created_at ? new Date(profileData.created_at).toLocaleDateString() : 'Not set'}</strong>
                    </Typography>
                  </Box>

                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography variant="body2">
                      Location: <strong>Akuafo Hall</strong>
                    </Typography>
                    <Typography variant="body2">
                      Description: <strong>{user.role?.charAt(0).toUpperCase() + user.role?.slice(1)} User</strong>
                    </Typography>

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

      {/* Edit Profile Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Phone Number"
              value={editForm.phone_number}
              onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
              fullWidth
            />
            {getRoleSpecificFormFields().map((field, index) => (
              <TextField
                key={index}
                label={field.label}
                value={field.value}
                onChange={(e) => setEditForm({ ...editForm, [field.name]: e.target.value })}
                fullWidth
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            disabled={updating}
            startIcon={updating ? <CircularProgress size={16} /> : <Save />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Profile;
