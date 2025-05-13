import React, { useState } from 'react';
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
} from '@mui/icons-material';

const NavBar = ({
  notificationCount = 0,
  onSearch = () => {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  // Color scheme based on your design
  const colors = {
    searchBorder: '#e0e6ed',
    searchText: '#7c8592',
    iconColor: '#9fa8b3',
    iconHover: '#6b7d92',
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end', // Right align everything since we have no left content
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
      {/* Right Section: Search, Profile, Notifications */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
        {/* Search Bar - Desktop Only */}
        {!isMobile && (
          <Box sx={{ position: 'relative' }}>
            <Paper
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: `1px solid ${colors.searchBorder}`,
                borderRadius: 2.5,
                px: 2,
                py: 1,
                minWidth: { sm: 200, md: 250, lg: 300 },
                bgcolor: 'transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  border: `1px solid ${theme.palette.primary.light}`,
                  boxShadow: '0 0 0 2px rgba(45, 169, 75, 0.1)',
                },
                '&:focus-within': {
                  border: `1px solid ${theme.palette.primary.main}`,
                  boxShadow: '0 0 0 3px rgba(45, 169, 75, 0.15)',
                },
              }}
            >
              <SearchIcon sx={{ color: colors.iconColor, mr: 1, fontSize: 20 }} />
              <InputBase
                placeholder="Search here"
                value={searchValue}
                onChange={handleSearchChange}
                sx={{
                  color: colors.searchText,
                  fontSize: '0.9rem',
                  width: '100%',
                  '&::placeholder': {
                    color: colors.searchText,
                    opacity: 0.7,
                  },
                }}
              />
            </Paper>
          </Box>
        )}

        {/* Profile Icon */}
        <Tooltip title="Profile" placement="bottom">
          <IconButton
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