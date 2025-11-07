// ============================================
// 1. OpenComplaints.jsx - WITH DARK MODE
// ============================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from '@mui/material/styles';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchOpenComplaints = async (token, role) => {
  if (!token) {
    throw new Error("No auth token provided.");
  }

  const endpoint = role === 'admin'
    ? `${API_BASE_URL}/api/admin/dashboard/complaints/open?limit=10&offset=0`
    : `${API_BASE_URL}/api/student/dashboard/complaints/open?limit=10&offset=0`;

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch open complaints");
  }

  return data.data || [];
};

const OpenComplaints = ({ role = 'student', limit = 3 }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    fetchOpenComplaints(token, role)
      .then((data) => {
        setComplaints(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching open complaints:", err.message);
        setLoading(false);
      });
  }, [role]);

  const getPriorityColor = (priority) => {
    const p = priority?.toLowerCase();
    if (p === 'urgent' || p === 'high') return '#ef5350';
    if (p === 'medium') return '#ff9800';
    if (p === 'low') return '#66bb6a';
    return '#757575';
  };

  const getPriorityWidth = (priority) => {
    const p = priority?.toLowerCase();
    if (p === 'urgent' || p === 'high') return '90%';
    if (p === 'medium') return '60%';
    if (p === 'low') return '30%';
    return '0%';
  };

  return (
    <Card 
      sx={{ 
        boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.5)' : 2,
        borderRadius: 2, 
        overflow: 'hidden', 
        height: '100%',
        minHeight: 300,
        bgcolor: isDarkMode ? '#1a1a1a' : '#ffffff',
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: isDarkMode ? '#1a1a1a' : '#ffffff',
        }}
      >
        <Typography sx={{ 
          fontWeight: 600, 
          fontSize: 16, 
          color: isDarkMode ? '#ffffff' : '#2c3e50' 
        }}>
          Open Complaints
        </Typography>
        <IconButton size="small">
          <MoreVertIcon sx={{ 
            fontSize: 20, 
            color: isDarkMode ? '#ffffff' : 'inherit' 
          }} />
        </IconButton>
      </Box>

      {loading ? (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            py: 8 
          }}
        >
          <CircularProgress size={40} sx={{ color: '#4caf50' }} />
        </Box>
      ) : (
        <TableContainer sx={{ bgcolor: isDarkMode ? '#1a1a1a' : '#ffffff' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ 
                bgcolor: isDarkMode ? '#252525' : '#f5f5f5' 
              }}>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: isDarkMode ? '#b0b0b0' : '#666', 
                    fontSize: 11, 
                    textTransform: 'uppercase',
                    borderBottom: `1px solid ${isDarkMode ? '#333' : 'rgba(224, 224, 224, 1)'}`
                  }}
                >
                  {role === 'admin' ? 'COMPLAINANT' : 'CATEGORY'}
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: isDarkMode ? '#b0b0b0' : '#666', 
                    fontSize: 11, 
                    textTransform: 'uppercase',
                    borderBottom: `1px solid ${isDarkMode ? '#333' : 'rgba(224, 224, 224, 1)'}`
                  }}
                >
                  ROOM/NUMBER
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: isDarkMode ? '#b0b0b0' : '#666', 
                    fontSize: 11, 
                    textTransform: 'uppercase',
                    borderBottom: `1px solid ${isDarkMode ? '#333' : 'rgba(224, 224, 224, 1)'}`
                  }}
                >
                  PRIORITY
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: isDarkMode ? '#b0b0b0' : '#666', 
                    fontSize: 11, 
                    textTransform: 'uppercase',
                    borderBottom: `1px solid ${isDarkMode ? '#333' : 'rgba(224, 224, 224, 1)'}`
                  }}
                >
                  PRIORITY LEVEL
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={4} 
                    align="center" 
                    sx={{ 
                      py: 4, 
                      color: isDarkMode ? '#666' : '#999',
                      borderBottom: 'none'
                    }}
                  >
                    No open complaints
                  </TableCell>
                </TableRow>
              ) : (
                complaints.slice(0, limit).map((complaint) => (
                  <TableRow 
                    key={complaint.id} 
                    sx={{ 
                      '&:hover': { 
                        bgcolor: isDarkMode ? '#252525' : '#f9f9f9' 
                      },
                      cursor: 'pointer',
                      bgcolor: isDarkMode ? '#1a1a1a' : '#ffffff',
                    }}
                  >
                    <TableCell sx={{ 
                      fontSize: 13, 
                      color: isDarkMode ? '#e0e0e0' : '#2c3e50',
                      borderBottom: `1px solid ${isDarkMode ? '#333' : 'rgba(224, 224, 224, 1)'}`
                    }}>
                      {role === 'admin' 
                        ? (complaint.complainant_name || complaint.complainant || 'Unknown')
                        : (complaint.category_name || complaint.title || 'Unknown')
                      }
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: 13, 
                      color: isDarkMode ? '#b0b0b0' : '#5a6c7d',
                      borderBottom: `1px solid ${isDarkMode ? '#333' : 'rgba(224, 224, 224, 1)'}`
                    }}>
                      {complaint.room_number || 'N/A'}
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontSize: 13, 
                        color: getPriorityColor(complaint.priority), 
                        fontWeight: 500,
                        borderBottom: `1px solid ${isDarkMode ? '#333' : 'rgba(224, 224, 224, 1)'}`
                      }}
                    >
                      {complaint.priority || 'N/A'}
                    </TableCell>
                    <TableCell sx={{
                      borderBottom: `1px solid ${isDarkMode ? '#333' : 'rgba(224, 224, 224, 1)'}`
                    }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: 6,
                          bgcolor: isDarkMode ? '#333' : '#e0e0e0',
                          borderRadius: 1,
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          sx={{
                            width: getPriorityWidth(complaint.priority),
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
      )}
    </Card>
  );
};

export default OpenComplaints;