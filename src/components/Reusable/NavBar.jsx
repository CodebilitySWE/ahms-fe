import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Badge,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle,
  Home as HomeIcon,
} from '@mui/icons-material';

const NavBar = ({
  notificationCount = 0,
  pageName = '',
  userType = '',
  userRole = '', // 'student', 'admin', or 'artisan'
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/${userRole}/profile`);
  };

  const handleNotificationClick = () => {
    navigate(`/${userRole}/notifications`);
  };

  // Color scheme based on your design
  const colors = {
    iconColor: '#9fa8b3',
    iconHover: '#6b7d92',
    pageNameColor: '#2c3e50',
    userTypeColor: '#7c8592',
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: theme.palette.background.paper,
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 1.5, sm: 2 },
        borderBottom: `1px solid ${theme.palette.divider}`,
        minHeight: { xs: 56, sm: 64 },
        transition: 'all 0.3s ease',
        position: 'relative',
        zIndex: theme.zIndex.appBar,
      }}
    >
      {/* Left Section: Home Icon, User Type, and Page Name */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <HomeIcon 
          sx={{ 
            color: colors.iconColor, 
            fontSize: { xs: 22, sm: 24 } 
          }} 
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {userType && (
            <Typography
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                color: colors.userTypeColor,
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              {userType}
            </Typography>
          )}
          {pageName && (
            <Typography
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem' },
                color: colors.pageNameColor,
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {pageName}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Right Section: Profile and Notifications */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
        {/* Profile Icon */}
        <Tooltip title="Profile" placement="bottom">
          <IconButton
            onClick={handleProfileClick}
            sx={{
              color: colors.iconColor,
              '&:hover': {
                color: colors.iconHover,
                bgcolor: 'rgba(0,0,0,0.04)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <AccountCircle sx={{ fontSize: { xs: 26, sm: 30 } }} />
          </IconButton>
        </Tooltip>

        {/* Notifications Icon */}
        <Tooltip title="Notifications" placement="bottom">
          <IconButton
            onClick={handleNotificationClick}
            sx={{
              color: colors.iconColor,
              '&:hover': {
                color: colors.iconHover,
                bgcolor: 'rgba(0,0,0,0.04)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Badge
              badgeContent={notificationCount}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  minWidth: 18,
                  height: 18,
                },
              }}
            >
              <NotificationsIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default NavBar;