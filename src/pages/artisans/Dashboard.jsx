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
   const [complaints, setComplaints] = useState([]);
  
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ahms-be.onrender.com';
  
    useEffect(() => {
      const fetchComplaints = async () => {
        try {
          const token = localStorage.getItem('authToken');
          if (!token) {
            throw new Error('Authentication failed');
          }
  
          const url = `${API_BASE_URL}/api/artisan/dashboard/complaints/open`;
          const urlWithParams = new URL(url);
          urlWithParams.searchParams.append('limit', '5');
          urlWithParams.searchParams.append('offset', '0');
  
          const response = await fetch(urlWithParams.toString(), {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          });
  
          const data = await response.json();
          setComplaints(data.data);
          console.log(data.data);
        } catch (error) {
          console.error('Error fetching complaints:', error);
        }
      };
  
      fetchComplaints();
    }, []);
  
    const getPriorityStyle = (priority) => {
      const level = priority.toLowerCase();
      switch (level) {
        case 'low':
          return { backgroundColor: green[500], width: '20%' };
        case 'medium':
          return { backgroundColor: yellow[500], width: '60%' };
        case 'high':
          return { backgroundColor: orange[500], width: '80%' };
        case 'urgent':
          return { backgroundColor: red[500], width: '100%' };
        default:
          return { backgroundColor: '#aaa', width: '40%' };
      }
    };
  
  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar role="artisan" />
      <Box flex={1} display="flex" flexDirection="column" sx={{ minWidth: 0 }}>
        <NavBar userType="artisan" pageTitle="Dashboard" />
        
        {/* Open Complaints box */}
        <Box
          sx={{
            width: '90%',
            maxWidth: 750,
            mt: 25,
            ml: 32,
            backgroundColor: '#fff',
            borderRadius: '8px 8px 0 0',
            p: 3,
            pb: 32,
            boxShadow: 3,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={6}
            textAlign="left"
            sx={{ color: '#4a6785' }}
          >
            Open Complaints
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#444', fontWeight: 500 }}>COMPLAINANT</TableCell>
                <TableCell align="center" sx={{ color: '#444', fontWeight: 500 }}>
                  ROOM NUMBER
                </TableCell>
                <TableCell align="center" sx={{ color: '#444', fontWeight: 500 }}>
                  PRIORITY
                </TableCell>
                <TableCell sx={{ color: '#444', fontWeight: 500 }}>PRIORITY LEVEL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {Array.isArray(complaints) && complaints.length > 0 ? (
    complaints.map((c, index) => (
      <TableRow key={index} sx={{ height: 50 }}>
        <TableCell sx={{ fontWeight: 600 }}>{c.complainant_name}</TableCell>
        <TableCell align="center" sx={{ fontWeight: 500 }}>
          {String(c.room_number || c.room).padStart(2, '0')}
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 500 }}>
          {c.priority}
        </TableCell>
        <TableCell>
          <Box
            sx={{
              width: 70,
              height: 6,
              borderRadius: 4,
              backgroundColor: '#ddd',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                borderRadius: 4,
                ...getPriorityStyle(c.priority),
              }}
            />
          </Box>
        </TableCell>
      </TableRow>
    ))
  ) : null}
</TableBody>

          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 