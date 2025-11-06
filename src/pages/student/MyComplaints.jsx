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
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Rating
} from '@mui/material';
import { useThemeContext } from '../../contexts/ThemeContext';
import NavBar from '../../components/Reusable/NavBar';
import Sidebar from '../../components/Reusable/Sidebar';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function MyComplaints() {
  const { mode } = useThemeContext();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [existingRating, setExistingRating] = useState(null);
  const [loadingRating, setLoadingRating] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/complaints`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setComplaints(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setLoading(false);
    }
  };

  const fetchExistingRating = async (complaintId) => {
    setLoadingRating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/complaints/${complaintId}/rating`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setExistingRating(data.data);
          setRating(data.data.rating);
          setFeedbackText(data.data.feedback || '');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error fetching rating:', error);
      return false;
    } finally {
      setLoadingRating(false);
    }
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setDetailsOpen(true);
  };

  const handleOpenFeedback = async (complaint) => {
    setSelectedComplaint(complaint);
    setExistingRating(null);
    setRating(0);
    setFeedbackText('');
    setFeedbackOpen(true);
    
    // Check if rating already exists
    if (complaint.status?.toLowerCase() === 'completed') {
      await fetchExistingRating(complaint.id);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!rating || rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5 stars');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/complaints/${selectedComplaint.id}/rate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          rating: rating,
          feedback: feedbackText.trim() || undefined
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        alert('Rating submitted successfully');
        setFeedbackOpen(false);
        setFeedbackText('');
        setRating(0);
        setExistingRating(null);
        fetchComplaints();
      } else {
        alert(data.message || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'accepted' || statusLower === 'completed') return '#4caf50';
    if (statusLower === 'declined' || statusLower === 'rejected') return '#f44336';
    if (statusLower === 'pending' || statusLower === 'submitted') return '#ff9800';
    return '#757575';
  };

  const getPriorityColor = (priority) => {
    const priorityLower = priority?.toLowerCase();
    if (priorityLower === 'urgent' || priorityLower === 'high') return '#ef5350';
    if (priorityLower === 'medium') return '#ff9800';
    if (priorityLower === 'low') return '#66bb6a';
    return '#757575';
  };

  const openComplaints = complaints.filter(c => 
    c.status?.toLowerCase() !== 'completed'
  );

  const completedComplaints = complaints.filter(c => 
    c.status?.toLowerCase() === 'completed'
  );

  const ComplaintsTable = ({ complaints }) => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: 12 }}>TYPE</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: 12 }}>DESCRIPTION</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: 12 }}>DATE</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: 12 }}>STATUS</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: 12 }}>ACTION</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: 12 }}>PRIORITY</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: 12 }}>FEEDBACK</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {complaints.map((complaint, index) => (
            <TableRow 
              key={complaint.id}
              sx={{ 
                bgcolor: index % 2 === 0 ? '#fff' : '#fafafa',
                '&:hover': { bgcolor: '#f0f0f0' }
              }}
            >
              <TableCell sx={{ color: '#666' }}>{complaint.category_name}</TableCell>
              <TableCell sx={{ color: '#666', maxWidth: 200 }}>
                {complaint.title?.length > 30 
                  ? `${complaint.title.substring(0, 30)}...` 
                  : complaint.title}
              </TableCell>
              <TableCell sx={{ color: '#666' }}>
                {new Date(complaint.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Typography 
                  sx={{ 
                    color: getStatusColor(complaint.status),
                    fontWeight: 500,
                    textTransform: 'capitalize'
                  }}
                >
                  {complaint.status}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{
                    color: '#ef5350',
                    cursor: 'pointer',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline' }
                  }}
                  onClick={() => handleViewDetails(complaint)}
                >
                  View
                </Typography>
              </TableCell>
              <TableCell>
                <Typography 
                  sx={{ 
                    color: getPriorityColor(complaint.priority),
                    fontWeight: 500,
                    textTransform: 'capitalize'
                  }}
                >
                  {complaint.priority}
                </Typography>
              </TableCell>
              <TableCell>
                {complaint.status?.toLowerCase() === 'completed' ? (
                  <Typography
                    sx={{
                      color: '#4caf50',
                      cursor: 'pointer',
                      fontWeight: 600,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                    onClick={() => handleOpenFeedback(complaint)}
                  >
                    Rate
                  </Typography>
                ) : (
                  <Typography sx={{ color: '#999', fontSize: 14 }}>
                    N/A
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

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
          pageName="My Complaints"
          userType="/Student"
          userRole="student"
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
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
              <CircularProgress sx={{ color: '#4caf50' }} />
            </Box>
          ) : (
            <>
              <Card sx={{ mb: 3, boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                <Box
                  sx={{
                    px: 3,
                    py: 2,
                    background: 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)',
                  }}
                >
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>
                    Complaints
                  </Typography>
                </Box>
                
                {openComplaints.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography sx={{ color: '#999' }}>No open complaints</Typography>
                  </Box>
                ) : (
                  <ComplaintsTable complaints={openComplaints} />
                )}
              </Card>

              <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                <Box
                  sx={{
                    px: 3,
                    py: 2,
                    background: 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)',
                  }}
                >
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>
                    Completed
                  </Typography>
                </Box>
                
                {completedComplaints.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography sx={{ color: '#999' }}>No completed complaints</Typography>
                  </Box>
                ) : (
                  <ComplaintsTable complaints={completedComplaints} />
                )}
              </Card>
            </>
          )}
        </Box>
      </Box>

      {/* Complaint Details Modal */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#66bb6a', color: '#fff', fontWeight: 600 }}>
          Complaint Details
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedComplaint && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#666', fontSize: 14 }}>Type:</Typography>
                <Typography sx={{ fontSize: 16 }}>{selectedComplaint.category_name}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#666', fontSize: 14 }}>Description:</Typography>
                <Typography sx={{ fontSize: 16 }}>{selectedComplaint.title}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#666', fontSize: 14 }}>Date:</Typography>
                <Typography sx={{ fontSize: 16 }}>
                  {new Date(selectedComplaint.created_at).toLocaleDateString()}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#666', fontSize: 14 }}>Status:</Typography>
                <Typography 
                  sx={{ 
                    fontSize: 16, 
                    color: getStatusColor(selectedComplaint.status),
                    textTransform: 'capitalize'
                  }}
                >
                  {selectedComplaint.status}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#666', fontSize: 14 }}>Priority:</Typography>
                <Typography 
                  sx={{ 
                    fontSize: 16, 
                    color: getPriorityColor(selectedComplaint.priority),
                    textTransform: 'capitalize'
                  }}
                >
                  {selectedComplaint.priority}
                </Typography>
              </Box>
              {selectedComplaint.admin_name && (
                <Box>
                  <Typography sx={{ fontWeight: 600, color: '#666', fontSize: 14 }}>Assigned Admin:</Typography>
                  <Typography sx={{ fontSize: 16 }}>{selectedComplaint.admin_name}</Typography>
                </Box>
              )}
              {selectedComplaint.artisan_name && (
                <Box>
                  <Typography sx={{ fontWeight: 600, color: '#666', fontSize: 14 }}>Assigned Artisan:</Typography>
                  <Typography sx={{ fontSize: 16 }}>{selectedComplaint.artisan_name}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
          <Button
            onClick={() => setDetailsOpen(false)}
            sx={{
              color: '#1976d2',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 16
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rating & Feedback Modal */}
      <Dialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#66bb6a', color: '#fff', fontWeight: 600 }}>
          {existingRating ? 'Your Rating & Feedback' : 'Rate & Submit Feedback'}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {loadingRating ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
              <CircularProgress sx={{ color: '#4caf50' }} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {existingRating && (
                <Box sx={{ bgcolor: '#f0f7ff', p: 2, borderRadius: 1, mb: 1 }}>
                  <Typography sx={{ fontSize: 14, color: '#1976d2', fontWeight: 500 }}>
                    You have already rated this complaint on {new Date(existingRating.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              )}

              {/* Rating Section */}
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#666', fontSize: 14, mb: 1 }}>
                  Rating <span style={{ color: '#f44336' }}>*</span>
                </Typography>
                <Rating
                  name="complaint-rating"
                  value={rating}
                  onChange={(event, newValue) => {
                    if (!existingRating) {
                      setRating(newValue);
                    }
                  }}
                  readOnly={!!existingRating}
                  size="large"
                  sx={{
                    fontSize: '2.5rem',
                    '& .MuiRating-iconFilled': {
                      color: '#fbbf24',
                    },
                    '& .MuiRating-iconHover': {
                      color: '#fbbf24',
                    },
                  }}
                />
                {rating > 0 && (
                  <Typography sx={{ fontSize: 14, color: '#666', mt: 1 }}>
                    {rating} star{rating !== 1 ? 's' : ''}
                  </Typography>
                )}
              </Box>

              {/* Feedback Text Section */}
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#666', fontSize: 14, mb: 1 }}>
                  Feedback {!existingRating && '(Optional)'}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Share your experience with the complaint resolution..."
                  value={feedbackText}
                  onChange={(e) => {
                    if (!existingRating) {
                      setFeedbackText(e.target.value);
                    }
                  }}
                  disabled={!!existingRating}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1
                    }
                  }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1, justifyContent: 'flex-end' }}>
          <Button
            onClick={() => {
              setFeedbackOpen(false);
              setFeedbackText('');
              setRating(0);
              setExistingRating(null);
            }}
            sx={{
              color: '#1976d2',
              textTransform: 'uppercase',
              fontWeight: 600
            }}
          >
            Close
          </Button>
          {!existingRating && (
            <Button
              onClick={handleSubmitFeedback}
              disabled={!rating || submitting}
              sx={{
                bgcolor: '#4caf50',
                color: '#fff',
                textTransform: 'uppercase',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#45a049'
                },
                '&.Mui-disabled': {
                  bgcolor: '#ccc',
                  color: '#666'
                }
              }}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MyComplaints;