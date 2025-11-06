import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
} from '@mui/material';
import { useThemeContext } from '../../contexts/ThemeContext';
import NavBar from '../../components/Reusable/NavBar';
import Sidebar from '../../components/Reusable/Sidebar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DashboardCard from '../../components/Reusable/DashboardCard';
import Notification from '../../components/Reusable/Notification';
import OpenComplaints from '../../components/Reusable/OpenComplaints';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Dashboard() {
  const { mode } = useThemeContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    changePercent: 0,
    period: 'string'
  });
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      
      // Fetch dashboard stats
      const statsResponse = await fetch(`${API_BASE_URL}/api/student/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      const statsData = await statsResponse.json();

      if (statsData.success) {
        setStats({
          total: statsData.data.complaints?.total || 0,
          resolved: statsData.data.resolved?.total || 0,
          pending: statsData.data.pending?.total || 0,
          complaintsChangePercent: statsData.data.complaints?.changePercent || 0,
          complaintsPeriod: statsData.data.complaints?.period || 'than last week',
          resolvedChangePercent: statsData.data.resolved?.changePercent || 0,
          resolvedPeriod: statsData.data.resolved?.period || 'than yesterday',
          pendingLastUpdated: statsData.data.pending?.lastUpdated || 'Just updated'
        });
      }

      // Fetch notifications count
      const notificationsResponse = await fetch(`${API_BASE_URL}/api/student/dashboard/notifications?limit=5`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      const notificationsData = await notificationsResponse.json();
      
      if (notificationsData.success) {
        const unreadCount = (notificationsData.data || []).filter(n => !n.is_read).length;
        setNotificationCount(unreadCount);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" minHeight="100vh">
        <Sidebar />
        <Box flex={1} display="flex" alignItems="center" justifyContent="center">
          <CircularProgress sx={{ color: '#4caf50' }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        sx={{
          minWidth: 0,
          ml: { xs: 0, sm: '280px' },
        }}
      >
        <NavBar 
          notificationCount={notificationCount}
          pageName="Dashboard"
          userType="/Student"
          userRole="student"
        />

        <Box
          component="main"
          sx={{
            px: { xs: 2, sm: 3 },
            py: 3,
            flexGrow: 1,
            backgroundColor: mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
            overflow: 'auto',
          }}
        >
          {/* Stats Cards using DashboardCard */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 3, 
              mb: 4,
              flexWrap: 'wrap',
              pt: 3,
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}
          >
            <DashboardCard
              title="Complaints"
              value={stats.total}
              icon={<AssignmentIcon />}
              iconBackground="linear-gradient(195deg, #42424a 0%, #191919 100%)"
              iconColor="#fff"
              trend={{ 
                value: Math.abs(stats.complaintsChangePercent || 0), 
                period: stats.complaintsPeriod, 
                positive: (stats.complaintsChangePercent || 0) >= 0, 
                direction: (stats.complaintsChangePercent || 0) >= 0 ? 'up' : 'down' 
              }}
              animateValue={true}
            />
            
            <DashboardCard
              title="Resolved"
              value={stats.resolved}
              icon={<CheckCircleIcon />}
              iconBackground="linear-gradient(195deg, #66BB6A 0%, #43A047 100%)"
              iconColor="#fff"
              trend={{ 
                value: Math.abs(stats.resolvedChangePercent || 0), 
                period: stats.resolvedPeriod, 
                positive: (stats.resolvedChangePercent || 0) >= 0, 
                direction: (stats.resolvedChangePercent || 0) >= 0 ? 'up' : 'down' 
              }}
              animateValue={true}
            />
            
            <DashboardCard
              title="Pending"
              value={stats.pending}
              icon={<HourglassEmptyIcon />}
              iconBackground="linear-gradient(195deg, #EC407A 0%, #D81B60 100%)"
              iconColor="#fff"
              subtitle={stats.pendingLastUpdated}
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
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}
          >
            <Box flex={{ xs: '1 1 100%', md: '0 0 55%' }}>
              <OpenComplaints role="student" />
            </Box>
            
            <Box flex={{ xs: '1 1 100%', md: '0 0 40%' }}>
              <Notification role="student" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;