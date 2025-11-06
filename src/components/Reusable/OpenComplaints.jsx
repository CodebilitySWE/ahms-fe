import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { green, orange, red, yellow } from '@mui/material/colors';

const OpenComplaints = ({ role }) => {
  const [complaints, setComplaints] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication failed');
        }

        // Endpoints associated with different roles
        let url = '';
        if (role === 'admin') {
          url = `${API_BASE_URL}/api/admin/dashboard/complaints/open`;
        } else if (role === 'artisan') {
          url = `${API_BASE_URL}/api/artisan/dashboard/complaints/open`;
        } else if (role === 'student') {
          url = `${API_BASE_URL}/api/student/dashboard/complaints/open`;
        } else {
          console.error('Invalid role:', role);
          return;
        }

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
        setComplaints(data.data || []);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, [role, API_BASE_URL]);

  const getPriorityStyle = (priority) => {
    const level = priority?.toLowerCase() || '';
    switch (level) {
      case 'low':
        return { backgroundColor: green[500], width: '25%' };
      case 'medium':
        return { backgroundColor: yellow[600], width: '50%' };
      case 'high':
        return { backgroundColor: orange[500], width: '75%' };
      case 'urgent':
        return { backgroundColor: red[500], width: '100%' };
      default:
        return { backgroundColor: '#aaa', width: '40%' };
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', md: 750 },
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2.5,
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Typography
          variant="h6"
          fontWeight="600"
          sx={{ color: '#4a6785', fontSize: '1.1rem' }}
        >
          Open Complaints
        </Typography>
        <IconButton size="small">
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', py: 1.5 }}>
                COMPLAINANT
              </TableCell>
              <TableCell align="center" sx={{ color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', py: 1.5 }}>
                ROOM NUMBER
              </TableCell>
              <TableCell align="center" sx={{ color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', py: 1.5 }}>
                PRIORITY
              </TableCell>
              <TableCell sx={{ color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', py: 1.5 }}>
                PRIORITY LEVEL
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(complaints) && complaints.length > 0 ? (
              complaints.map((c, index) => (
                <TableRow 
                  key={index} 
                  sx={{ 
                    height: 60,
                    '&:hover': { backgroundColor: '#f9f9f9' },
                    borderBottom: index === complaints.length - 1 ? 'none' : '1px solid #f0f0f0'
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: '#333', fontSize: '0.875rem' }}>
                    {c.complainant_name || 'Unknown'}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 500, color: '#555', fontSize: '0.875rem' }}>
                    {String(c.room_number || c.room || '00').padStart(2, '0')}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        color: '#fff',
                        backgroundColor: 
                          c.priority?.toLowerCase() === 'low' ? green[500] :
                          c.priority?.toLowerCase() === 'medium' ? yellow[700] :
                          c.priority?.toLowerCase() === 'high' ? orange[600] :
                          c.priority?.toLowerCase() === 'urgent' ? red[500] :
                          '#999'
                      }}
                    >
                      {c.priority || 'N/A'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        width: 100,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#e0e0e0',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          borderRadius: 4,
                          transition: 'width 0.3s ease',
                          ...getPriorityStyle(c.priority),
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#999' }}>
                  No open complaints
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default OpenComplaints;