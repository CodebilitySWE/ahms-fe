import React, { useState } from 'react';
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

export default function LComplaint() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    roomNo: '',
    date: '',
    block: '',
    category: '',
    priority: '',
    title: '',
    description: '',
    image: null,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await fetch('https://ahms-be-obre.onrender.com/api/complaints', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: data,
      });

      if (res.ok) {
        alert('Complaint submitted successfully!');
        setFormData({
          roomNo: '',
          date: '',
          block: '',
          category: '',
          priority: '',
          title: '',
          description: '',
          image: null,
        });
      } else if (res.status === 401) {
        alert('Unauthorized. Please log in again.');
      } else {
        alert('Submission failed!');
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
          ml: { xs: 0, sm: '250px' }, // <-- THIS LINE fixes the sidebar overlap
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
            label="Room No"
            name="roomNo"
            fullWidth
            value={formData.roomNo}
            onChange={handleChange}
            sx={{ gridColumn: 'span 12' }}
          />

          <TextField
            label="Date"
            name="date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.date}
            onChange={handleChange}
            sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}
          />

          <Select
            displayEmpty
            name="block"
            value={formData.block}
            onChange={handleChange}
            sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}
          >
            <MenuItem value="" disabled>Select Block</MenuItem>
            <MenuItem value="Annex A">Annex A</MenuItem>
            <MenuItem value="Annex B">Annex B</MenuItem>
          </Select>

          <Select
            displayEmpty
            name="category"
            value={formData.category}
            onChange={handleChange}
            sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}
          >
            <MenuItem value="" disabled>Select Category</MenuItem>
            <MenuItem value="Plumbing">Plumbing</MenuItem>
            <MenuItem value="Electrical">Electrical</MenuItem>
            <MenuItem value="Carpentry">Carpentry</MenuItem>
            <MenuItem value="Painting">Painting</MenuItem>
            <MenuItem value="Security">Security</MenuItem>
            <MenuItem value="Cleanliness">Cleanliness</MenuItem>
          </Select>

          <Select
            displayEmpty
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}
          >
            <MenuItem value="" disabled>Select Priority</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Urgent">Urgent</MenuItem>
          </Select>

          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            sx={{ gridColumn: 'span 12' }}
          />

          <TextField
            label="Description"
            name="description"
            multiline
            minRows={4}
            value={formData.description}
            onChange={handleChange}
            sx={{ gridColumn: 'span 12' }}
          />

          <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <label htmlFor="image">
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
                  {formData.image ? formData.image.name : 'Attach image'}
                </Typography>
              </Box>
            </label>
            <input
              type="file"
              name="image"
              id="image"
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
