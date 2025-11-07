import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ClearIcon from "@mui/icons-material/Clear";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useTheme } from '@mui/material/styles';

const fetchNotifications = async (token, role) => {
  if (!token) {
    throw new Error("No auth token provided.");
  }

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const endpoint = role === 'admin' 
    ? `${API_BASE_URL}/api/admin/dashboard/notifications?limit=5`
    : `${API_BASE_URL}/api/student/dashboard/notifications?limit=5`;

  const response = await fetch(endpoint, {
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
  return notifications.slice(0, 5);
};

const markNotificationAsRead = async (token, role, notificationId) => {
  if (!token) {
    throw new Error("No auth token provided.");
  }

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const endpoint = role === 'admin'
    ? `${API_BASE_URL}/api/admin/dashboard/notifications/${notificationId}/read`
    : `${API_BASE_URL}/api/student/dashboard/notifications/${notificationId}/read`;

  const response = await fetch(endpoint, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to mark notification as read");
  }

  return data;
};

const Notification = ({ role = 'student' }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const [notifications, setNotifications] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    fetchNotifications(token, role)
      .then(setNotifications)
      .catch((err) => {
        console.error("Error fetching notifications:", err.message);
      });
  }, [role]);

  const handleAccordionToggle = async (notification) => {
    const isExpanding = expandedId !== notification.id;
    setExpandedId(isExpanding ? notification.id : null);

    if (isExpanding && !notification.is_read) {
      const token = localStorage.getItem("authToken");
      try {
        await markNotificationAsRead(token, role, notification.id);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notification.id ? { ...notif, is_read: true } : notif
          )
        );
      } catch (err) {
        console.error("Error marking notification as read:", err.message);
      }
    }
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((msg) => msg.id !== id));
    if (expandedId === id) setExpandedId(null);
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

  return (
    <Box
      sx={{
        width: {
          xs: "215px",
          sm: "215px",
          md: "400px",
        },
        minHeight: {
          xs: 300,
          md: 300,
        },
        border: 1,
        borderRadius: 4,
        padding: 2,
        boxShadow: isDarkMode 
          ? "0px 4px 12px rgba(0, 0, 0, 0.5)" 
          : "0px 2px 3px rgba(0, 0, 0, 0.2)",
        borderColor: isDarkMode ? "#333" : "#F5F5F5",
        backgroundColor: isDarkMode ? "#1a1a1a" : "white",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: isDarkMode ? "#ffffff" : "#44577C",
          marginBottom: 2,
          fontSize: 16,
        }}
      >
        Notifications
      </Typography>

      {notifications.length === 0 ? (
        <Typography sx={{ 
          textAlign: "center", 
          color: isDarkMode ? "#666" : "gray", 
          fontSize: 14 
        }}>
          No notifications to show
        </Typography>
      ) : (
        notifications.map((msg) => (
          <Box key={msg.id}>
            <Accordion
              expanded={expandedId === msg.id}
              onChange={() => handleAccordionToggle(msg)}
              disableGutters
              sx={{
                backgroundColor: isDarkMode 
                  ? (msg.is_read ? '#1a1a1a' : '#252525')
                  : (msg.is_read ? '#fff' : '#f8f9fa'),
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <KeyboardArrowDownIcon 
                    sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }} 
                  />
                }
                sx={{
                  display: "flex",
                  alignItems: "center",
                  paddingY: 1,
                  paddingX: 1,
                  backgroundColor: isDarkMode 
                    ? (msg.is_read ? '#1a1a1a' : '#252525')
                    : (msg.is_read ? '#fff' : '#f8f9fa'),
                  "& .MuiAccordionSummary-content": {
                    alignItems: "center",
                  },
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(msg.id);
                  }}
                  sx={{ marginRight: 1 }}
                >
                  <ClearIcon sx={{ 
                    fontSize: 14, 
                    color: isDarkMode ? '#b0b0b0' : 'inherit' 
                  }} />
                </IconButton>

                {msg.is_read && (
                  <CheckCircleOutlineIcon
                    sx={{ color: "#4caf50", fontSize: 18, marginRight: 1 }}
                  />
                )}

                {!msg.is_read && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#4caf50",
                      marginRight: 1,
                      flexShrink: 0
                    }}
                  />
                )}

                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: isDarkMode 
                        ? (msg.is_read ? '#b0b0b0' : '#ffffff')
                        : (msg.is_read ? '#666' : '#2c3e50'),
                      fontWeight: msg.is_read ? 400 : 500,
                      lineHeight: 1.4,
                    }}
                  >
                    {msg.message}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: 11, 
                    color: isDarkMode ? '#666' : '#95a5a6', 
                    mt: 0.5 
                  }}>
                    {formatTimeAgo(msg.created_at)}
                  </Typography>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ 
                paddingX: 2, 
                paddingY: 1, 
                backgroundColor: isDarkMode ? '#252525' : '#fafafa' 
              }}>
                <Typography fontSize={13} sx={{ 
                  color: isDarkMode ? '#e0e0e0' : '#2c3e50', 
                  mb: 1 
                }}>
                  {msg.message}
                </Typography>
                <Typography fontSize={12} sx={{ 
                  color: isDarkMode ? '#666' : '#95a5a6' 
                }}>
                  Created: {new Date(msg.created_at).toLocaleString()}
                </Typography>
                {msg.complaint_title && (
                  <Typography fontSize={12} sx={{ 
                    color: isDarkMode ? '#666' : '#95a5a6', 
                    mt: 0.5 
                  }}>
                    Complaint: {msg.complaint_title}
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>

            <Box
              sx={{
                width: "100%",
                height: "1px",
                backgroundColor: isDarkMode ? "#333" : "#D9D9D9",
                marginY: 1,
              }}
            />
          </Box>
        ))
      )}
    </Box>
  );
};

export default Notification;
