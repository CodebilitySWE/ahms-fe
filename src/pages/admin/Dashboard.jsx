import React, { useState, useEffect } from 'react';
import NavBar from '../../components/Reusable/NavBar';
import Sidebar from '../../components/Reusable/Sidebar';
import DashboardCard from '../../components/Reusable/DashboardCard';
import Notification from '../../components/Reusable/Notification';
import OpenComplaints from '../../components/Reusable/OpenComplaints';

import Box from '@mui/material/Box';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { useTheme } from '@mui/material/styles';

const Dashboard = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const [stats, setStats] = useState({
    totalUsers: { total: 0, changePercent: 0, period: 'month' },
    complaints: { total: 0, changePercent: 0, period: 'week' },
    resolved: { total: 0, changePercent: 0, period: 'day' },
    pending: { total: 0, changePercent: 0, updatedAt: '' }
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication failed');
        }

        // Fetch dashboard statistics
        const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Dashboard stats:', data);
          
          setStats({
            totalUsers: data.data?.users || { total: 0, changePercent: 0, period: 'month' },
            complaints: data.data?.complaints || { total: 0, changePercent: 0, period: 'week' },
            resolved: data.data?.resolved || { total: 0, changePercent: 0, period: 'day' },
            pending: data.data?.pending || { total: 0, changePercent: 0, updatedAt: '' }
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Set default values on error
        setStats({
          totalUsers: { total: 0, changePercent: 0, period: 'month' },
          complaints: { total: 0, changePercent: 0, period: 'week' },
          resolved: { total: 0, changePercent: 0, period: 'day' },
          pending: { total: 0, changePercent: 0, updatedAt: '' }
        });
      }
    };

    fetchDashboardStats();
  }, [API_BASE_URL]);

  return (
    <Box 
      display="flex" 
      minHeight="100vh"
      sx={{
        bgcolor: isDarkMode ? '#0a0a0a' : '#f5f5f5'
      }}
    >
      <Sidebar />
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        sx={{
          minWidth: 0,
          ml: { xs: 0, sm: '250px' },
        }}
      >
        <NavBar 
          notificationCount={5}
          pageName="Dashboard"
          userType="/Admin"
          userRole="admin"
        />
        
        <Box 
          component="main" 
          sx={{ 
            p: 3, 
            flexGrow: 1,
            bgcolor: isDarkMode ? '#0a0a0a' : '#f5f5f5'
          }}
        >
          {/* Dashboard Cards Section */}
          <Box 
            display="flex" 
            gap={3} 
            mb={4}
            flexWrap="wrap"
            sx={{ 
              mt: 3,
              justifyContent: { xs: 'flex-end', md: 'flex-end' }
            }}
          >
            <DashboardCard
              icon={<PeopleIcon />}
              title="Total Users"
              value={stats.totalUsers.total}
              iconBackground="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              iconColor="#ffffff"
              trend={{ 
                direction: 'up', 
                value: stats.totalUsers.changePercent, 
                period: `than last ${stats.totalUsers.period}` 
              }}
              animateValue={true}
            />
            
            <DashboardCard
              icon={<AssignmentIcon />}
              title="Complaints"
              value={stats.complaints.total}
              iconBackground="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              iconColor="#ffffff"
              trend={{ 
                direction: 'up', 
                value: stats.complaints.changePercent, 
                period: `than last ${stats.complaints.period}` 
              }}
              animateValue={true}
            />
            
            <DashboardCard
              icon={<CheckCircleIcon />}
              title="Resolved"
              value={stats.resolved.total}
              iconBackground="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              iconColor="#ffffff"
              trend={{ 
                direction: 'up', 
                value: stats.resolved.changePercent, 
                period: `than last ${stats.resolved.period}` 
              }}
              animateValue={true}
            />
            
            <DashboardCard
              icon={<PendingIcon />}
              title="Pending"
              value={stats.pending.total}
              iconBackground="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
              iconColor="#ffffff"
              trend={{ 
                direction: 'up', 
                value: stats.pending.changePercent || 0, 
                period: 'complaints pending' 
              }}
              animateValue={true}
            />
          </Box>

          {/* Complaints and Notifications Section */}
          <Box 
            display="flex" 
            gap={3}
            flexWrap={{ xs: 'wrap', md: 'nowrap' }}
            sx={{ 
              alignItems: 'flex-start',
              justifyContent: { xs: 'center', md: 'flex-end' }
            }}
          >
            <Box flex={{ xs: '1 1 100%', md: '0 0 45%' }}>
              <OpenComplaints role="admin" />
            </Box>
            
            <Box flex={{ xs: '1 1 100%', md: '0 0 30%' }}>
              <Notification role="admin" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;