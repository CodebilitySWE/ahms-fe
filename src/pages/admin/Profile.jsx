import React from 'react';
import { Box } from '@mui/material';
import { useThemeContext } from '../../contexts/ThemeContext';
import NavBar from '../../components/Reusable/NavBar';
import Sidebar from '../../components/Reusable/Sidebar';

function Profile() {
  const { mode } = useThemeContext();

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column" sx={{ minWidth: 0 }}>
        <NavBar notificationCount={5} />
        
        <Box component="main" sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, backgroundColor: mode === 'dark' ? '#1a1a1a' : '#f5f5f5' }}>
          {/* Content will go here */}
        </Box>
      </Box>
    </Box>
  );
}

export default Profile;