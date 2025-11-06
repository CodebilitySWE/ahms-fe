import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton
} from '@mui/material';
import { useThemeContext } from '../../contexts/ThemeContext';
import NavBar from '../../components/Reusable/NavBar';
import Sidebar from '../../components/Reusable/Sidebar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DashboardCard from '../../components/Reusable/DashboardCard';

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
  const [openComplaints, setOpenComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);

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

      // Fetch open complaints
      const complaintsResponse = await fetch(`${API_BASE_URL}/api/student/dashboard/complaints/open?limit=10&offset=0`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      const complaintsData = await complaintsResponse.json();
      
      if (complaintsData.success) {
        setOpenComplaints(complaintsData.data || []);
      }

      // Fetch notifications
      const notificationsResponse = await fetch(`${API_BASE_URL}/api/student/dashboard/notifications?limit=5`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      const notificationsData = await notificationsResponse.json();
      
      if (notificationsData.success) {
        setNotifications(notificationsData.data || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/student/dashboard/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Update notification in state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, is_read: true }
              : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getPriorityColor = (priority) => {
    const p = priority?.toLowerCase();
    if (p === 'urgent' || p === 'high') return '#ef5350';
    if (p === 'medium') return '#ff9800';
    if (p === 'low') return '#66bb6a';
    return '#757575';
  };

  const getNotificationIcon = (status) => {
    if (status === 'accepted') {
      return (
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: '2px solid #4caf50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            backgroundColor: '#f1f8f4'
          }}
        >
          <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 14 }} />
        </Box>
      );
    } else if (status === 'declined' || status === 'rejected') {
      return (
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: '2px solid #f44336',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            backgroundColor: '#fff5f5'
          }}
        >
          <Typography sx={{ color: '#f44336', fontSize: 14, fontWeight: 700 }}>!</Typography>
        </Box>
      );
    }
    return null;
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Now';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
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
          notificationCount={notifications.filter(n => !n.is_read).length}
          // onSearch={handleSearch}
          pageName="Dashboard"           // The current page name
          userType="/Student"              // User type label
          userRole="student"              // Role for navigation (student/admin/artisan)
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
              pt: 3 // Padding for floating icons
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
            />
            
            <DashboardCard
              title="Pending"
              value={stats.pending}
              icon={<HourglassEmptyIcon />}
              iconBackground="linear-gradient(195deg, #EC407A 0%, #D81B60 100%)"
              iconColor="#fff"
              subtitle={stats.pendingLastUpdated}
            />
          </Box>

          <Grid container spacing={3}>
            {/* Open Complaints Table */}
            <Grid item xs={12} md={7}>
              <Card sx={{ boxShadow: 2, borderRadius: 2, overflow: 'hidden', height: '100%' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 16, color: '#2c3e50' }}>
                    Open Complaints
                  </Typography>
                  <IconButton size="small">
                    <MoreVertIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: 11, textTransform: 'uppercase' }}>COMPLAINANT</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: 11, textTransform: 'uppercase' }}>ROOM/NUMBER</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: 11, textTransform: 'uppercase' }}>PRIORITY</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: 11, textTransform: 'uppercase' }}>PRIORITY LEVEL</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {openComplaints.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#999' }}>
                            No open complaints
                          </TableCell>
                        </TableRow>
                      ) : (
                        openComplaints.slice(0, 3).map((complaint) => (
                          <TableRow key={complaint.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                            <TableCell sx={{ fontSize: 13, color: '#2c3e50' }}>
                              {complaint.category_name || complaint.title || 'Unknown'}
                            </TableCell>
                            <TableCell sx={{ fontSize: 13, color: '#5a6c7d' }}>
                              {complaint.room_number || 'N/A'}
                            </TableCell>
                            <TableCell sx={{ fontSize: 13, color: getPriorityColor(complaint.priority), fontWeight: 500 }}>
                              {complaint.priority || 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  width: '100%',
                                  height: 6,
                                  bgcolor: '#e0e0e0',
                                  borderRadius: 1,
                                  overflow: 'hidden'
                                }}
                              >
                                <Box
                                  sx={{
                                    width: complaint.priority?.toLowerCase() === 'high' || complaint.priority?.toLowerCase() === 'urgent' 
                                      ? '90%' 
                                      : complaint.priority?.toLowerCase() === 'medium' 
                                      ? '60%' 
                                      : '30%',
                                    height: '100%',
                                    bgcolor: getPriorityColor(complaint.priority),
                                    transition: 'width 0.3s'
                                  }}
                                />
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>

            {/* Notifications Panel */}
            <Grid item xs={12} md={5}>
              <Card sx={{ boxShadow: 2, borderRadius: 2, overflow: 'hidden', height: '100%' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 16, color: '#2c3e50' }}>
                    Notifications
                  </Typography>
                </Box>

                <Box sx={{ p: 2, maxHeight: '400px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography sx={{ color: '#999', fontSize: 14 }}>
                        No new notifications
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {notifications.map((notification) => (
                        <Box
                          key={notification.id}
                          sx={{
                            display: 'flex',
                            gap: 1.5,
                            p: 1.5,
                            borderRadius: 1,
                            bgcolor: notification.is_read ? '#fff' : '#f8f9fa',
                            border: '1px solid #e9ecef',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: '#f0f0f0',
                              transform: 'translateX(2px)'
                            }
                          }}
                          onClick={() => !notification.is_read && markNotificationAsRead(notification.id)}
                        >
                          {getNotificationIcon(notification.status || notification.message)}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: notification.is_read ? 400 : 500,
                                color: '#2c3e50',
                                lineHeight: 1.4,
                                mb: 0.5
                              }}
                            >
                              {notification.message || `Your complaint about ${notification.complaint_title || notification.category_name || 'service'} has been ${notification.status}`}
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: '#95a5a6' }}>
                              {formatTimeAgo(notification.created_at)}
                            </Typography>
                          </Box>
                          {!notification.is_read && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: '#4caf50',
                                alignSelf: 'center',
                                flexShrink: 0
                              }}
                            />
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;