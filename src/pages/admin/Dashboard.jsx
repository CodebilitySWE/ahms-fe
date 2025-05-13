import React from 'react';
import NavBar from '../../components/Reusable/NavBar';
import Sidebar from '../../components/Reusable/Sidebar';
import Box from '@mui/material/Box';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';

const adminNavItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, route: '/admin/dashboard' },
  { label: 'Manage Users', icon: <PeopleIcon />, route: '/admin/manage-users' },
  { label: 'Complaints', icon: <AssignmentIcon />, route: '/admin/complaints' },
  { label: 'Notifications', icon: <NotificationsIcon />, route: '/admin/notifications' },
  { label: 'Profile', icon: <PersonIcon />, route: '/admin/profile' },
  { label: 'Statistics', icon: <BarChartIcon />, route: '/admin/statistics' },
];

const Dashboard = () => {
  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar role="admin" />
      <Box flex={1} display="flex" flexDirection="column" sx={{ minWidth: 0 }}>
        <NavBar userType="admin" pageTitle="Dashboard" />
      </Box>
    </Box>
  );
};

export default Dashboard; 