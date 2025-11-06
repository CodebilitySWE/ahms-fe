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

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    complaints: 0,
    resolved: 0,
    pending: 0
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
          setStats({
            totalUsers: data.data?.users,
            complaints: data.data?.complaints,
            resolved: data.data?.resolved,
            pending: data.data?.pending
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Set default values on error
        setStats({
          totalUsers: 99,
          complaints: 13,
          resolved: 4,
          pending: 9
        });
      }
    };

    fetchDashboardStats();
  }, [API_BASE_URL]);

  return (
    <Box display="flex" minHeight="100vh" sx={{ backgroundColor: '#f5f5f5' }}>
      <Sidebar role="admin" />
      <Box flex={1} display="flex" flexDirection="column" sx={{ minWidth: 0 }}>
        <NavBar userType="admin" pageTitle="Dashboard" />
        
        <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
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
              trend={{ direction: 'up', value: stats.totalUsers.changePercent, period: 'than last month' }}
              animateValue={true}
            />
            
            <DashboardCard
              icon={<AssignmentIcon />}
              title="Complaints"
              value={stats.complaints.total}
              iconBackground="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              iconColor="#ffffff"
              trend={{ direction: 'up', value: stats.complaints.changePercent, period: 'than last week' }}
              animateValue={true}
            />
            
            <DashboardCard
              icon={<CheckCircleIcon />}
              title="Resolved"
              value={stats.resolved.total}
              iconBackground="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              iconColor="#ffffff"
              trend={{ direction: 'up', value: stats.resolved.changePercent, period: 'than last day' }}
              animateValue={true}
            />
            
            <DashboardCard
              icon={<PendingIcon />}
              title="Pending"
              value={stats.pending.total}
              iconBackground="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
              iconColor="#ffffff"
              trend={{ direction: 'up', value: stats.pending.changePercent, period: 'than last week' }}
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
              <Notification />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;