import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import Sidebar from '../../components/Reusable/Sidebar';
import NavBar from '../../components/Reusable/NavBar';
import { useAuth } from '../../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LComplaint() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    room_number: '',
    location: 'Akuafo Hall',
    block: '',
    category_id: '',
    priority: '',
    title: '',
    description: '',
    attachment: null,
  });

  const [categories, setCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/complaints/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.category_id || 
        !formData.location || !formData.room_number || !formData.block) {
      alert('Please fill in all required fields');
      return;
    }

    const data = new FormData();
    
    // Map form data to backend expected field names
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category_id', formData.category_id);
    data.append('location', formData.location);
    data.append('room_number', formData.room_number);
    data.append('block', formData.block);
    data.append('priority', formData.priority || 'medium');
    
    if (formData.attachment) {
      data.append('attachment', formData.attachment);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: data,
      });

      const responseData = await res.json();

      if (res.ok) {
        alert('Complaint submitted successfully!');
        setFormData({
          room_number: '',
          location: 'Akuafo Hall',
          block: '',
          category_id: '',
          priority: '',
          title: '',
          description: '',
          attachment: null,
        });
      } else {
        alert(responseData.message || 'Submission failed!');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <NavBar onMenuClick={toggleSidebar} />
      <Sidebar role="student" open={isSidebarOpen} onClose={closeSidebar} />

      <Box
        flex={1}
        p={isSmallScreen ? 2 : 4}
        mt={4}
        sx={{
          width: '100%',
          maxWidth: '1095px',
          mx: 'auto',
          ml: { xs: 0, sm: '250px' },
          transition: 'margin-left 0.3s ease-in-out',
        }}
      >
        <Box
          sx={{
            bgcolor: '#1976d2',
            px: 3,
            py: 2,
            color: 'white',
            borderRadius: '12px',
            height: '70px',
            boxShadow: 1,
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Lodge Complaint
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          rowGap={3}
          columnGap={2}
          bgcolor={theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff'}
          p={isSmallScreen ? 2 : 4}
          borderRadius={3}
          border={`1px solid ${theme.palette.divider}`}
          boxShadow={1}
          color={theme.palette.text.primary}
        >
          <TextField
            label="Room Number *"
            name="room_number"
            fullWidth
            required
            value={formData.room_number}
            onChange={handleChange}
            sx={{ gridColumn: 'span 12' }}
          />

          <TextField
            label="Location *"
            name="location"
            fullWidth
            required
            value={formData.location}
            InputProps={{
              readOnly: true,
            }}
            sx={{ gridColumn: 'span 12' }}
          />

          <Select
            displayEmpty
            name="block"
            value={formData.block}
            onChange={handleChange}
            required
            sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}
          >
            <MenuItem value="" disabled>Select Block *</MenuItem>
            <MenuItem value="Main">Main</MenuItem>
            <MenuItem value="Annex A">Annex A</MenuItem>
            <MenuItem value="Annex B">Annex B</MenuItem>
          </Select>

          <Select
            displayEmpty
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}
          >
            <MenuItem value="" disabled>Select Category *</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>

          <Select
            displayEmpty
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}
          >
            <MenuItem value="" disabled>Select Priority</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
          </Select>

          <TextField
            label="Title *"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            sx={{ gridColumn: 'span 12' }}
          />

          <TextField
            label="Description *"
            name="description"
            multiline
            minRows={4}
            required
            value={formData.description}
            onChange={handleChange}
            sx={{ gridColumn: 'span 12' }}
          />

          <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <label htmlFor="attachment">
              <Box
                sx={{
                  width: '100%',
                  height: 200,
                  border: '1px dashed #aaa',
                  borderRadius: 2,
                  p: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <ImageIcon fontSize="large" />
                <Typography variant="body2" sx={{ mt: 1, fontSize: '14px' }}>
                  {formData.attachment ? formData.attachment.name : 'Attach image'}
                </Typography>
              </Box>
            </label>
            <input
              type="file"
              name="attachment"
              id="attachment"
              accept="image/*"
              onChange={handleChange}
              style={{ display: 'none' }}
            />
          </Box>

          <Box
            sx={{
              gridColumn: { xs: 'span 12', md: 'span 6' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#1976d2',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                py: 1.5,
              }}
            >
              Submit Complaint
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
