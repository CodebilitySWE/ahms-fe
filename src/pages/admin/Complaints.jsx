

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
} from '@mui/material';

import { useThemeContext } from '../../contexts/ThemeContext';
import NavBar from '../../components/Reusable/NavBar';
import Sidebar from '../../components/Reusable/Sidebar';

function Complaints() {
  const { mode } = useThemeContext();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    type: 'All'
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const rowsPerPage = 5;
  const getComplaints = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/complaints/open`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      const data = await response.json();

      const complaints = data.data;
      setComplaints(complaints);
      console.log(complaints);
      setLoading(false);

      console.log(complaints);

    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  }

  useEffect(() => {
    getComplaints();
  }, [API_BASE_URL]);

  const handlePageChange = (event, value) => setPage(value);

  const handleViewClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  const filteredComplaints = complaints.filter((item) => {
    if (filters.type === 'All') return true;

    const [filterType, filterValue] = filters.type.split('_');
    
    switch (filterType) {
      case 'type':
        return item.category_name === filterValue;
      case 'priority':
        return item.priority?.toLowerCase() === filterValue.toLowerCase();
      case 'room':
        return true; // Room filtering removed
      case 'status':
        const statusMap = {
          'InProgress': 'in progress',
          'Completed': 'completed',
          'Pending': 'pending'
        };
        return item.status?.toLowerCase() === statusMap[filterValue];
      case 'date':
        const today = new Date();
        const itemDate = new Date(item.created_at);
        
        if (filterValue === 'today') {
          return itemDate.toDateString() === today.toDateString();
        } else if (filterValue === 'week') {
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= weekAgo;
        } else if (filterValue === 'month') {
          return itemDate.getMonth() === today.getMonth() && 
                 itemDate.getFullYear() === today.getFullYear();
        }
        return true;
      default:
        return true;
    }
  });

  const paginatedComplaints = filteredComplaints.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  function checkRoomNumber(value) {
    if (!value) return "N/A";
    return value.toString();
  }

  return (
    <Box display="flex" minHeight="50vh"  >
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
        <NavBar notificationCount={5} />

        <Box
          component="main"
          sx={{
            px: { xs: 2, sm: 3 },
            mt: 6,
            flexGrow: 1,
            backgroundColor: mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
            overflow: 'auto',
          }}
        >
          <Box
            sx={{
              backgroundColor: '#fff',
              borderRadius: 2,
              boxShadow: 1,
              overflowX: 'auto',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                px: 3,
                py: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#1976d2',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            >
              <Typography color="#fff" fontWeight="bold">
                Complaints
              </Typography>

              <Select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                size="small"
                sx={{
                  backgroundColor: '#fff',
                  color: '#000',
                  borderRadius: 1,
                  minWidth: 180,
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem disabled divider sx={{ backgroundColor: '#f5f5f5', color: '#666' }}>
                  Filter by Type
                </MenuItem>
                <MenuItem value="type_Electrical">Type: Electrical</MenuItem>
                <MenuItem value="type_Plumbing">Type: Plumbing</MenuItem>
                <MenuItem value="type_Carpentry">Type: Carpentry</MenuItem>
                <MenuItem value="type_Cleaning">Type: Cleaning</MenuItem>
                
                <MenuItem disabled divider sx={{ backgroundColor: '#f5f5f5', color: '#666' }}>
                  Filter by Priority
                </MenuItem>
                <MenuItem value="priority_High">Priority: High</MenuItem>
                <MenuItem value="priority_Medium">Priority: Medium</MenuItem>
                <MenuItem value="priority_Low">Priority: Low</MenuItem>
                
                <MenuItem disabled divider sx={{ backgroundColor: '#f5f5f5', color: '#666' }}>
                  Filter by Status
                </MenuItem>
                <MenuItem value="status_InProgress">Status: In Progress</MenuItem>
                <MenuItem value="status_Completed">Status: Completed</MenuItem>
                <MenuItem value="status_Pending">Status: Pending</MenuItem>
                
                <MenuItem disabled divider sx={{ backgroundColor: '#f5f5f5', color: '#666' }}>
                  Filter by Date
                </MenuItem>
                <MenuItem value="date_today">Today</MenuItem>
                <MenuItem value="date_week">This Week</MenuItem>
                <MenuItem value="date_month">This Month</MenuItem>
              </Select>
            </Box>

            {/* Table */}
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                      <TableRow>
                        <TableCell>LOGGED BY</TableCell>
                        <TableCell>TYPE</TableCell>
                        <TableCell>PRIORITY</TableCell>
                        <TableCell>ROOM NO.</TableCell>
                        <TableCell>DESCRIPTION</TableCell>
                        <TableCell>DATE</TableCell>
                        <TableCell>STATUS</TableCell>
                        <TableCell>ACTION</TableCell>
                        <TableCell>CONDITION</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedComplaints.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.complainant_name}</TableCell>

                          <TableCell>{item.category_name}</TableCell>
                          <TableCell sx={{ color: getPriorityColor(item.priority) }}>
                            {item.priority}
                          </TableCell>
                          <TableCell>{checkRoomNumber(item.room_number)}</TableCell>

                          <TableCell>{item.title}</TableCell>
                          <TableCell>{item.created_at}</TableCell>

                          <TableCell>{item.status}</TableCell>
                          <TableCell>

                            <Typography
                              sx={{
                                color: '#1976d2',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                              }}
                              onClick={() => handleViewClick(item)}
                            >
                              View
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                color:
                                  item.condition === 'Accepted'
                                    ? 'green'
                                    : item.condition === 'Declined'
                                      ? 'red'
                                      : 'orange',
                                fontWeight: 'bold',
                              }}
                            >
                              {item.condition || 'Pending'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box display="flex" justifyContent="center" my={2}>
                  <Pagination
                    count={Math.ceil(filteredComplaints.length / rowsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Complaint Details</DialogTitle>
        <DialogContent dividers>
          {selectedComplaint && (
            <>
              <Typography><strong>Logged By:</strong> {selectedComplaint.complainant_name}</Typography>

              <Typography><strong>Type:</strong> {selectedComplaint.category_name}</Typography>
              <Typography><strong>Priority:</strong> {selectedComplaint.priority}</Typography>
              <Typography><strong>Room No.:</strong> {checkRoomNumber(selectedComplaint.room_number)}</Typography>


              <Typography><strong>Description:</strong> {selectedComplaint.title}</Typography>

              <Typography><strong>Date:</strong> {selectedComplaint.created_at}</Typography>

              <Typography><strong>Status:</strong> {selectedComplaint.status}</Typography>
              <Typography><strong>Condition:</strong> {selectedComplaint.condition || 'Pending'}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

const getPriorityColor = (priority) => {
  const p = priority?.toLowerCase();
  return p === 'high' ? 'red' : p === 'medium' ? 'orange' : 'green';
};

export default Complaints;


























