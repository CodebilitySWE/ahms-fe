import React, { useState, useEffect } from 'react';
import { Box, Grid, useTheme, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useThemeContext } from '../../contexts/ThemeContext';
import NavBar from '../../components/Reusable/NavBar';
import Sidebar from '../../components/Reusable/Sidebar';
import DashboardCard from '../../components/Reusable/DashboardCard';
import Notification from '../../components/Reusable/Notification';


// Icons for the cards
import BarChartIcon from '@mui/icons-material/BarChart';
import PrintIcon from '@mui/icons-material/Print';
import DoneIcon from '@mui/icons-material/Done';
import PeopleIcon from '@mui/icons-material/People';


// API call function
const fetchDashboardStats = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/dashboard/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch dashboard stats');
    }

    return result.data;
  } catch (error) {
    console.error('Dashboard stats fetch error:', error);
    throw error;
  }
};

// Helper function to format period text
const formatPeriodText = (period) => {
  switch (period) {
    case 'day': return 'than yesterday';
    case 'week': return 'than last week';
    case 'month': return 'than last month';
    default: return 'than previous period';
  }
};

// Helper function to determine trend direction
const getTrendDirection = (changePercent) => {
  if (changePercent > 0) return 'up';
  if (changePercent < 0) return 'down';
  return 'same';
};

const Dashboard = () => {
  const theme = useTheme();
  const { mode } = useThemeContext();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDashboardStats();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to load dashboard: ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Periodic refresh every 30 seconds - COMMENTED OUT
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     loadDashboardData();
  //   }, 30000); // 30 seconds

  //   return () => clearInterval(interval);
  // }, []);

  // Transform API data for cards
  const getCardData = () => {
    if (!dashboardData) return [];

    return [
      {
        id: 'total-users',
        icon: <BarChartIcon />,
        title: 'Total Users',
        value: dashboardData.users.total,
        iconBackground: '#1976d2',
        iconColor: '#ffffff',
        trend: dashboardData.users.changePercent !== undefined ? {
          value: dashboardData.users.changePercent,
          direction: getTrendDirection(dashboardData.users.changePercent),
          period: formatPeriodText(dashboardData.users.period)
        } : null,
      },
      {
        id: 'complaints',
        icon: <PrintIcon />,
        title: 'Complaints',
        value: dashboardData.complaints.total,
        iconBackground: '#424242',
        iconColor: '#ffffff',
        trend: dashboardData.complaints.changePercent !== undefined ? {
          value: dashboardData.complaints.changePercent,
          direction: getTrendDirection(dashboardData.complaints.changePercent),
          period: formatPeriodText(dashboardData.complaints.period)
        } : null,
      },
      {
        id: 'resolved',
        icon: <DoneIcon />,
        title: 'Resolved',
        value: dashboardData.resolved.total,
        iconBackground: '#4CAF50',
        iconColor: '#ffffff',
        trend: dashboardData.resolved.changePercent !== undefined ? {
          value: dashboardData.resolved.changePercent,
          direction: getTrendDirection(dashboardData.resolved.changePercent),
          period: formatPeriodText(dashboardData.resolved.period)
        } : null,
      },
      {
        id: 'pending',
        icon: <PeopleIcon />,
        title: 'Pending',
        value: dashboardData.pending.total,
        iconBackground: '#FF5722',
        iconColor: '#ffffff',
        trend: null, // No trend data for pending
        subtitle: 'Just updated',
      },
    ];
  };

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar role="admin" />
      <Box flex={1} display="flex" flexDirection="column" sx={{ minWidth: 0 }}>
        <NavBar notificationCount={5} />
        
        <Box component="main" sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, backgroundColor: mode === 'dark' ? '#1a1a1a' : '#f5f5f5' }}>
          {/* Dashboard Statistics Cards */}
          <Box display="flex" flexDirection="row" gap={3} mb={4} sx={{ ml: { xs: 0, md: '260px' } }}>
            {getCardData().map((cardData) => (
              <DashboardCard
                key={cardData.id}
                {...cardData}
                isLoading={loading}
                animateValue={true}
              />
            ))}
          </Box>


          {/* Error state display */}
          {error && !loading && (
            <Box
              sx={{
                mt: 3,
                p: 3,
                backgroundColor: theme.palette.error.light,
                borderRadius: 2,
                border: `1px solid ${theme.palette.error.main}`,
              }}
            >
              <Typography variant="body1" color="error">
                Error loading dashboard data. Please try refreshing the page.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;