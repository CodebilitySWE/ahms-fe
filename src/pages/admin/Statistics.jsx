import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useThemeContext } from '../../contexts/ThemeContext';
import NavBar from '../../components/Reusable/NavBar';
import Sidebar from '../../components/Reusable/Sidebar';
import DashboardCard from '../../components/Reusable/DashboardCard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const COLORS_USERS = ['#4A90E2', '#7FB3D5'];
const COLORS_ARTISANS = ['#4ECDC4', '#95E1D3', '#F38181'];
const COLORS_COMPLAINTS = ['#4ECDC4', '#4A90E2', '#95A5A6'];

function Statistics() {
  const { mode } = useThemeContext();
  const [stats, setStats] = useState({
    totalUsers: 450,
    totalComplaints: 245,
    resolvedComplaints: 160,
    pendingComplaints: 61
  });

  const [userData, setUserData] = useState([
    { name: 'Annex A', value: 187 },
    { name: 'Main', value: 135 },
    { name: 'Annex B', value: 157 }
  ]);

  const [artisanData, setArtisanData] = useState([
    { name: 'Main', value: 58 },
    { name: 'Annex', value: 30 },
    { name: 'Available', value: 12 }
  ]);

  const [complaintData, setComplaintData] = useState([
    { name: 'Resolved', value: 65 },
    { name: 'Pending', value: 25 },
    { name: 'Declined', value: 10 }
  ]);

  const [complaintTypeData, setComplaintTypeData] = useState([
    { type: 'Plumbing', count: 120 },
    { type: 'Security', count: 45 },
    { type: 'Painting', count: 105 },
    { type: 'Carpentry', count: 98 },
    { type: 'Cleanliness', count: 75 },
    { type: 'Electrical', count: 135 }
  ]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/admin/statistics`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Update stats with API data
          if (data.data) {
            setStats(prev => ({
              ...prev,
              ...data.data.overview
            }));
            
            if (data.data.users) setUserData(data.data.users);
            if (data.data.artisans) setArtisanData(data.data.artisans);
            if (data.data.complaints) setComplaintData(data.data.complaints);
            if (data.data.complaintTypes) setComplaintTypeData(data.data.complaintTypes);
          }
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, [API_BASE_URL]);

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column" sx={{ minWidth: 0 }}>
        <NavBar pageTitle="Statistics" />
        
        <Box 
          component="main" 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            flexGrow: 1, 
            backgroundColor: mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          {/* Top Statistics Cards */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(auto-fit, minmax(200px, 250px))',
                sm: 'repeat(2, minmax(200px, 250px))',
                md: 'repeat(4, minmax(200px, 250px))'
              },
              gap: { xs: 2, sm: 2.5, md: 3 },
              justifyContent: 'center',
              width: '100%',
              maxWidth: '1200px',
              mb: { xs: 3, md: 4 },
              mt: { xs: 2, md: 3 },
              px: { xs: 1, sm: 2 }
            }}
          >
            <DashboardCard
              icon={<PeopleIcon />}
              title="Total Users"
              value={stats.totalUsers}
              iconBackground="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              iconColor="#ffffff"
              animateValue={true}
              sx={{ width: '100%', height: 'auto', minWidth: 'unset', maxWidth: 'unset' }}
            />
            
            <DashboardCard
              icon={<AssignmentIcon />}
              title="Total Complaints"
              value={stats.totalComplaints}
              iconBackground="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              iconColor="#ffffff"
              animateValue={true}
              sx={{ width: '100%', height: 'auto', minWidth: 'unset', maxWidth: 'unset' }}
            />
            
            <DashboardCard
              icon={<CheckCircleIcon />}
              title="Resolved Complaints"
              value={stats.resolvedComplaints}
              iconBackground="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              iconColor="#ffffff"
              animateValue={true}
              sx={{ width: '100%', height: 'auto', minWidth: 'unset', maxWidth: 'unset' }}
            />
            
            <DashboardCard
              icon={<PendingIcon />}
              title="Pending Complaints"
              value={stats.pendingComplaints}
              iconBackground="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
              iconColor="#ffffff"
              animateValue={true}
              sx={{ width: '100%', height: 'auto', minWidth: 'unset', maxWidth: 'unset' }}
            />
          </Box>

          {/* Charts Section */}
          <Box
            sx={{
              width: '100%',
              maxWidth: '1400px',
              px: { xs: 1, sm: 2 }
            }}
          >
            {/* Pie Charts Row */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, 1fr)'
                },
                gap: { xs: 2.5, md: 3 },
                mb: { xs: 2.5, md: 3 }
              }}
            >
              {/* Users Pie Chart */}
              <Card sx={{ 
                height: '100%', 
                backgroundColor: mode === 'dark' ? '#2d2d2d' : '#fff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      color: '#4A90E2', 
                      fontWeight: 'bold', 
                      textAlign: 'center',
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    Users
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={userData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_USERS[index % COLORS_USERS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ mt: 2 }}>
                    {userData.map((item, index) => (
                      <Typography 
                        key={index} 
                        variant="body2" 
                        sx={{ 
                          color: mode === 'dark' ? '#fff' : '#666',
                          fontSize: { xs: '0.8rem', sm: '0.875rem' }
                        }}
                      >
                        {item.name} - {item.value}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Artisans Pie Chart */}
              <Card sx={{ 
                height: '100%', 
                backgroundColor: mode === 'dark' ? '#2d2d2d' : '#fff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      color: '#4ECDC4', 
                      fontWeight: 'bold', 
                      textAlign: 'center',
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    Artisans
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={artisanData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {artisanData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_ARTISANS[index % COLORS_ARTISANS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Complaints Pie Chart */}
              <Card sx={{ 
                height: '100%', 
                backgroundColor: mode === 'dark' ? '#2d2d2d' : '#fff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      color: '#4A90E2', 
                      fontWeight: 'bold', 
                      textAlign: 'center',
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    Complaints
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={complaintData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {complaintData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_COMPLAINTS[index % COLORS_COMPLAINTS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS_COMPLAINTS[0] }} />
                      <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Resolved</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS_COMPLAINTS[1] }} />
                      <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Pending</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS_COMPLAINTS[2] }} />
                      <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Declined</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Bar Chart - Complaint Types */}
            <Card sx={{ 
              backgroundColor: mode === 'dark' ? '#2d2d2d' : '#fff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    color: '#4A90E2', 
                    fontWeight: 'bold',
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  Type of Complaint
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={complaintTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="type" 
                      label={{ value: 'Type of complaint', position: 'insideBottom', offset: -5 }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      label={{ value: 'Number of Complaints', angle: -90, position: 'insideLeft' }}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4CAF50" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Statistics;