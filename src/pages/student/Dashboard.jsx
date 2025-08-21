import React from 'react';
import NavBar from '../../components/Reusable/NavBar';
import Sidebar from '../../components/Reusable/Sidebar';
import Box from '@mui/material/Box';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import OpenComplaints from '../../components/Reusable/OpenComplaints';

const studentNavItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, route: '/student/dashboard' },
  { label: 'Complaints', icon: <AssignmentIcon />, route: '/student/complaints' },
  { label: 'Notifications', icon: <NotificationsIcon />, route: '/student/notifications' },
  { label: 'Profile', icon: <PersonIcon />, route: '/student/profile' },
];

const Dashboard = () => {
  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column" sx={{ minWidth: 0 }}>
        <NavBar userType="student" pageTitle="Dashboard" />
        <OpenComplaints role="student"/>
      </Box>
    </Box>
  );
};

export default Dashboard; 