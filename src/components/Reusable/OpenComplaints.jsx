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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchOpenComplaints = async (token, role) => {
  if (!token) {
    throw new Error("No auth token provided.");
  }

  // Determine the correct endpoint based on role
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
        boxShadow: 2, 
        borderRadius: 2, 
        overflow: 'hidden', 
        height: '100%',
        minHeight: 300
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: '1px solid #e0e0e0', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: 16, color: '#2c3e50' }}>
          Open Complaints
        </Typography>
        <IconButton size="small">
          <MoreVertIcon sx={{ fontSize: 20 }} />
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
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#666', 
                    fontSize: 11, 
                    textTransform: 'uppercase' 
                  }}
                >
                  {role === 'admin' ? 'COMPLAINANT' : 'CATEGORY'}
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#666', 
                    fontSize: 11, 
                    textTransform: 'uppercase' 
                  }}
                >
                  ROOM/NUMBER
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#666', 
                    fontSize: 11, 
                    textTransform: 'uppercase' 
                  }}
                >
                  PRIORITY
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#666', 
                    fontSize: 11, 
                    textTransform: 'uppercase' 
                  }}
                >
                  PRIORITY LEVEL
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#999' }}>
                    No open complaints
                  </TableCell>
                </TableRow>
              ) : (
                complaints.slice(0, limit).map((complaint) => (
                  <TableRow 
                    key={complaint.id} 
                    sx={{ 
                      '&:hover': { bgcolor: '#f9f9f9' },
                      cursor: 'pointer' 
                    }}
                  >
                    <TableCell sx={{ fontSize: 13, color: '#2c3e50' }}>
                      {role === 'admin' 
                        ? (complaint.student_name || complaint.complainant || 'Unknown')
                        : (complaint.category_name || complaint.title || 'Unknown')
                      }
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, color: '#5a6c7d' }}>
                      {complaint.room_number || 'N/A'}
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontSize: 13, 
                        color: getPriorityColor(complaint.priority), 
                        fontWeight: 500 
                      }}
                    >
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