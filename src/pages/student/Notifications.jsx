import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress
} from '@mui/material';
import { useThemeContext } from '../../contexts/ThemeContext';
import NavBar from '../../components/Reusable/NavBar';
import Sidebar from '../../components/Reusable/Sidebar';
import { useEffect, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { formatDistanceToNow } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const limit = 5;

const fetchNotifications = async (token, offset = 0) => {
  if (!token) {
    throw new Error("No auth token provided.");
  }

  const response = await fetch(`${API_BASE_URL}/api/notifications?offset=${offset}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch notifications");
  }

  const notifications = data.data || [];
  return notifications;
};

const Notification = ({ mode }) => {
  const [notifications, setNotifications] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  // Dark mode colors
  const isDark = mode === 'dark';
  const bgColor = isDark ? '#1e1e1e' : 'white';
  const cardBg = isDark ? '#2a2a2a' : '#fff';
  const readBg = isDark ? '#1e1e1e' : '#fff';
  const unreadBg = isDark ? '#252525' : '#fafafa';
  const hoverBg = isDark ? '#2a2a2a' : '#f9f9f9';
  const hoverUnreadBg = isDark ? '#2d2d2d' : '#f5f5f5';
  const textColor = isDark ? '#e0e0e0' : '#2c3e50';
  const mutedText = isDark ? '#b0b0b0' : '#5a6c7d';
  const lightText = isDark ? '#888' : '#95a5a6';
  const borderColor = isDark ? '#3a3a3a' : '#e0e0e0';
  const readBorder = isDark ? '#2a2a2a' : '#e9ecef';
  const unreadBorder = isDark ? '#3a3a3a' : '#d0d0d0';
  const expandedBg = isDark ? '#1a1a1a' : '#fafafa';
  const detailCardBg = isDark ? '#252525' : 'white';
  const dividerColor = isDark ? '#3a3a3a' : '#f0f0f0';

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetchNotifications(token, 0)
      .then((newData) => {
        setNotifications(newData);
        setHasMore(newData.length === limit);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err.message);
        setLoading(false);
      });
  }, []);

  const handleLoadMore = () => {
    const token = localStorage.getItem("authToken");
    const newOffset = offset + limit;
    fetchNotifications(token, newOffset)
      .then((newData) => {
        if (newData.length > 0) {
          setNotifications((prev) => [...prev, ...newData]);
          setOffset(newOffset);
          setHasMore(newData.length === limit);
        } else {
          setHasMore(false);
        }
      })
      .catch((err) => console.error("Error loading more:", err.message));
  };

  const handleToggle = (id) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("authToken");
    setNotifications((prev) => prev.filter((msg) => msg.id !== id));
    fetch(`${API_BASE_URL}/api/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        setExpandedIds(prev => prev.filter(i => i !== id));
      })
      .catch((err) => {
        console.error("Error deleting notification:", err.message);
      });
  };

  const handleMarkAllAsRead = () => {
    const token = localStorage.getItem("authToken");
    fetch(`${API_BASE_URL}/api/notifications/read-all`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        setNotifications((prev) =>
          prev.map((msg) => ({
            ...msg,
            is_read: true,
          }))
        );
      })
      .catch((err) => {
        console.error("Error marking all as read:", err.message);
      });
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    
    if (statusLower === 'assigned') {
      return (
        <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 24 }} />
      );
    } else if (statusLower === 'rejected') {
      return (
        <CloseIcon sx={{ color: '#f44336', fontSize: 24, fontWeight: 700 }} />
      );
    } else{
        return (
          <CheckCircleIcon sx={{ color: '#9e9e9e', fontSize: 24 }} />
        );
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'assigned') return '#4caf50';
    if (statusLower === 'rejected') return '#f44336';
    if (statusLower !== 'assigned' || statusLower !== 'rejected') return isDark ? '#b0b0b0' : '#2c3e50';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress sx={{ color: '#4caf50' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: { xs: '90%', sm: '85%', md: 900 },
        minHeight: 425,
        border: `1px solid ${borderColor}`,
        borderRadius: 3,
        padding: 3,
        boxShadow: isDark 
          ? '0px 4px 12px rgba(0, 0, 0, 0.5)' 
          : '0px 4px 12px rgba(0, 0, 0, 0.08)',
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: textColor,
            fontSize: 24,
          }}
        >
          Notifications
        </Typography>

        {notifications.length > 0 && (
          <Button
            size="small"
            startIcon={<CloseIcon sx={{ fontSize: 18 }} />}
            onClick={handleMarkAllAsRead}
            sx={{
              fontSize: 14,
              textTransform: 'none',
              color: mutedText,
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'transparent',
                color: textColor
              }
            }}
          >
            Mark all as read
          </Button>
        )}
      </Box>

      {notifications.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography sx={{ color: lightText, fontSize: 16 }}>
            No notifications to show
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {notifications.map((msg) => {
            const diffMs = new Date() - new Date(msg.created_at);
            const diffMinutes = diffMs / (1000 * 60);
            const timeAgo = diffMinutes < 1
              ? 'Now'
              : formatDistanceToNow(new Date(msg.created_at), { addSuffix: true });

            const isExpanded = expandedIds.includes(msg.id);
            const statusColor = getStatusColor(msg.complaint_status);

            return (
              <Box
                key={msg.id}
                sx={{
                  backgroundColor: msg.is_read ? readBg : unreadBg,
                  border: `1px solid ${msg.is_read ? readBorder : unreadBorder}`,
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Summary Row */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: msg.is_read ? hoverBg : hoverUnreadBg
                    }
                  }}
                  onClick={() => handleToggle(msg.id)}
                >
                  {getStatusIcon(msg.complaint_status)}

                  <Box sx={{ flex: 1, minWidth: 0, mx: 2 }}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: msg.is_read ? 400 : 500,
                        color: textColor,
                        lineHeight: 1.5,
                      }}
                    >
                      Complaint ID: <span style={{ color: statusColor, fontWeight: 500 }}>{msg.complaint_id}</span> has been{' '}
                      <span style={{ color: statusColor, fontWeight: 600 }}>
                        {msg.complaint_status}
                      </span>
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: lightText,
                        mt: 0.5
                      }}
                    >
                      {timeAgo}
                    </Typography>
                  </Box>

                  <IconButton
                    size="small"
                    sx={{
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                      color: mutedText,
                      mr: 1
                    }}
                  >
                    <KeyboardArrowDownIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg.id);
                    }}
                    sx={{
                      color: lightText,
                      '&:hover': {
                        color: '#e74c3c',
                        backgroundColor: isDark ? '#3a1a1a' : '#fee'
                      }
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>

                {/* Expanded Details - Block Information */}
                {isExpanded && (
                  <Box 
                    sx={{ 
                      px: 3, 
                      pb: 3, 
                      pt: 1, 
                      pl: 7, 
                      borderTop: `1px solid ${dividerColor}`,
                      backgroundColor: expandedBg
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: detailCardBg,
                        border: `1px solid ${borderColor}`,
                        borderRadius: 2,
                        p: 2,
                        mt: 1
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: mutedText }}>
                            Block:
                          </Typography>
                          <Typography sx={{ fontSize: 13, color: textColor }}>
                            {msg.block || 'N/A'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: mutedText }}>
                            Room No:
                          </Typography>
                          <Typography sx={{ fontSize: 13, color: textColor }}>
                            {msg.room_number || msg.room_no || 'N/A'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: mutedText }}>
                            Category:
                          </Typography>
                          <Typography sx={{ fontSize: 13, color: textColor }}>
                            {msg.category_name || msg.category || 'N/A'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: mutedText }}>
                            Description:
                          </Typography>
                          <Typography 
                            sx={{ 
                              fontSize: 13, 
                              color: textColor,
                              maxWidth: '60%',
                              textAlign: 'right'
                            }}
                          >
                            {msg.description || msg.message || 'No description'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: mutedText }}>
                            Date:
                          </Typography>
                          <Typography sx={{ fontSize: 13, color: textColor }}>
                            {new Date(msg.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      )}

      {notifications.length > 0 && hasMore && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="outlined"
            endIcon={<ExpandMoreIcon />}
            onClick={handleLoadMore}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              color: mutedText,
              borderColor: borderColor,
              borderRadius: 2,
              px: 3,
              '&:hover': {
                borderColor: mutedText,
                backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa'
              }
            }}
          >
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

function Notifications() {
  const { mode } = useThemeContext();

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
          notificationCount={5}
          pageName="Notifications"
          userType="/Student"
          userRole="student"
        />
        <Box
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
            width: '100%',
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            ml: { xs: 0, sm: "0px", md: '0px' },
          }}
        >
          <Notification mode={mode} />
        </Box>
      </Box>
    </Box>
  );
}

export default Notifications;