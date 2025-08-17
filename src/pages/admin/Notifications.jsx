import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Button,
  Stack
} from '@mui/material';
import { useThemeContext } from '../../contexts/ThemeContext';
import NavBar from '../../components/Reusable/NavBar';
import Sidebar from '../../components/Reusable/Sidebar';
import { useEffect, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { formatDistanceToNow } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("authToken");
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


const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);


  useEffect(() => {
    
    fetchNotifications(token, 0)
      .then((newData) => {
      setNotifications(newData);
      setHasMore(newData.length === limit); // if less than limit, no more pages
    })
    .catch((err) => console.error("Error fetching notifications:", err.message));
}, []);


  const handleLoadMore = () => {
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

  const handleAccordionToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id, token) => {
    setNotifications((prev) => prev.filter((msg) => msg.id !== id));
    const newResponse = fetch(`${API_BASE_URL}/api/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    newResponse
      .then(() => {
    if (expandedId === id) setExpandedId(null);
      })
      .catch((err) => {
        console.error("Error deleting notification:", err.message);
      });
  };

  const handleMarkAllAsRead = (token) => {
    
    const newResponse = fetch(`${API_BASE_URL}/api/notifications/read-all`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    newResponse
    .then(() => {
      setNotifications((prev) =>
      prev.map((msg) => ({
        ...msg,
        is_read: true,
      }))
    )})
    .catch((err) => {
      console.error("Error marking all as read:", err.message);
    });
  };

  const getStatusIcon = (status) => {
    if (status === 'accepted') {
      return <CheckCircleIcon sx={{ color: 'green', fontSize: 20 }} />;
    } else if (status === 'declined') {
      return <WarningAmberOutlinedIcon sx={{ color: 'red', fontSize: 20 }} />;
    }
  };

  return (
    <Box
      sx={{
        width: { xs: '80%', sm: '80%', md: 900 },
        minHeight: 425,
        border: 1,
        borderRadius: 4,
        padding: 2,
        boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.2)',
        borderColor: '#F5F5F5',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}>
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#44577C",
            marginBottom: 2,
            fontSize: 25,
          }}
        >
          Notifications
        </Typography>

        {notifications.length > 0 && (
          <Button
            size="small"
            startIcon={<ClearIcon sx={{ fontSize: 32 }}/>}
            onClick={handleMarkAllAsRead(localStorage.getItem("authToken"))}
            sx={{ fontSize: 15, textTransform: 'none', color: '#44577C', fontWeight: "bold" }}
          >
            Mark all as read
          </Button>
        )}
      </Box>
      
      {notifications.length === 0 ? (
        <Typography sx={{ textAlign: "center", color: "gray", fontSize: 18 }}>
          No notifications to show
        </Typography>
      ) : (
        notifications.map((msg) => {
          const diffMs = new Date() - new Date(msg.created_at);
          const diffMinutes = diffMs / (1000 * 60);
          const timeAgo = diffMinutes < 1
            ? 'Now'
            : formatDistanceToNow(new Date(msg.created_at), { addSuffix: true });

          return (
              <Accordion key={msg.id}
                expanded={expandedId === msg.id}
                onChange={() => handleAccordionToggle(msg.id)}
                disableGutters
                sx={{
                  backgroundColor: msg.is_read ? '#fff' : '#f9f9f9', width: '100%',
                }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    py: 1,
                    px: 1,
                    width: '100%',
                    backgroundColor: "#fff",
                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",
                    },
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg.id, localStorage.getItem("authToken"));
                    }}
                    sx={{ mr: 1 }}
                  >
                    <ClearIcon sx={{ fontSize: 18 }} />
                  </IconButton>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    {getStatusIcon(msg.status)}
                    <Stack spacing={0.8}>
                      <Typography
                        sx={{
                          fontSize: msg.is_read ? 15 : 17,
                          fontWeight: msg.is_read ? 500 : 600,
                        }}
                      >
                        Complaint ID: {msg.id} has been {msg.complaint_status}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: 'gray', fontStyle: 'italic' }}>
                        {timeAgo}
                      </Typography>
                    </Stack>
                  </Stack>
                  
                </AccordionSummary>
                
                <AccordionDetails sx={{ px: 2, py: 1 }}>
                 
                  <Typography fontSize={msg.is_read ? 14 : 16} color={msg.is_read ? '#000202' : '#000000' }>
                    {msg.message}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'gray', mt: 0.5 }}>
                    {new Date(msg.created_at).toLocaleString()}
                  </Typography>
                </AccordionDetails>
                
              </Accordion>

             
              
          );
        })
      )}

      {notifications.length > 0 && hasMore && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="outlined"
            endIcon={<ExpandMoreIcon />}
            onClick={handleLoadMore}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              color: "#44577C",
              borderRadius: 3
            }}
          >
            Load More
          </Button>
        </Box>
      )}
      
    </Box>

  )
};

function Notifications() {
  const { mode } = useThemeContext();

  return (
    <Box display="flex" minHeight="100vh" flex-direction="row" sx={{ backgroundColor: mode === 'dark' ? '#121212' : '#f5f5f5' }}>
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column" sx={{ minWidth: 400 }}>
        <NavBar notificationCount={5} />
        <Box
          sx={{
            p: { xs: 0, sm: 2, md: 4 },
            backgroundColor: mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
            Width: '100%',
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: { xs: 0, sm: "250px", md: '300px' },
          }}
        >

              <Notification />
        </Box>
      </Box>
    </Box>
  );
}

export default Notifications;
