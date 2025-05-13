import React from 'react';
import NavBar from '../../components/Reusable/NavBar';
import Sidebar from '../../components/Reusable/Sidebar';
import Box from '@mui/material/Box';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import ReportIcon from '@mui/icons-material/Report';
import BarChartIcon from '@mui/icons-material/BarChart';

const artisanNavItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, route: '/artisan/dashboard' },
  { label: 'Job Request', icon: <WorkIcon />, route: '/artisan/job-request' },
  { label: 'Upload Report', icon: <ReportIcon />, route: '/artisan/upload-report' },
  { label: 'Notifications', icon: <NotificationsIcon />, route: '/artisan/notifications' },
  { label: 'Profile', icon: <PersonIcon />, route: '/artisan/profile' },
  { label: 'Statistics', icon: <BarChartIcon />, route: '/artisan/statistics' },
];

const Dashboard = () => {
  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar role="artisan" />
      <Box flex={1} display="flex" flexDirection="column" sx={{ minWidth: 0 }}>
        <NavBar userType="artisan" pageTitle="Dashboard" />
      </Box>
    </Box>
  );
};

export default Dashboard; 