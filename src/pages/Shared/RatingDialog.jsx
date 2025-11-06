import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    CircularProgress,
    Rating,
    Divider
} from '@mui/material';
import { Person, Star, Comment } from '@mui/icons-material';

const RatingDialog = ({ open, onClose, complaint, rating, loading }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle 
                sx={{ 
                    bgcolor: '#2DA94B', 
                    color: '#fff', 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <Star sx={{ fontSize: 24 }} />
                Rating & Feedback
            </DialogTitle>
            
            <DialogContent dividers sx={{ p: 3 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                        <CircularProgress sx={{ color: '#2DA94B' }} size={40} />
                    </Box>
                ) : rating ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Complaint Info */}
                        <Box>
                            <Typography 
                                sx={{ 
                                    fontWeight: 600, 
                                    color: '#666', 
                                    fontSize: 12,
                                    textTransform: 'uppercase',
                                    mb: 1 
                                }}
                            >
                                Complaint
                            </Typography>
                            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#333' }}>
                                {complaint?.title}
                            </Typography>
                        </Box>

                        <Divider />

                        {/* Student Info */}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Person sx={{ fontSize: 20, color: '#666' }} />
                                <Typography 
                                    sx={{ 
                                        fontWeight: 600, 
                                        color: '#666', 
                                        fontSize: 12,
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Rated By
                                </Typography>
                            </Box>
                            <Typography sx={{ fontSize: 16, color: '#333' }}>
                                {rating.student_name}
                            </Typography>
                        </Box>

                        {/* Rating */}
                        <Box>
                            <Typography 
                                sx={{ 
                                    fontWeight: 600, 
                                    color: '#666', 
                                    fontSize: 12,
                                    textTransform: 'uppercase',
                                    mb: 1 
                                }}
                            >
                                Rating
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Rating
                                    value={rating.rating}
                                    readOnly
                                    size="large"
                                    sx={{
                                        '& .MuiRating-iconFilled': {
                                            color: '#fbbf24',
                                        }
                                    }}
                                />
                                <Typography 
                                    sx={{ 
                                        fontSize: 24, 
                                        fontWeight: 700, 
                                        color: '#fbbf24' 
                                    }}
                                >
                                    {rating.rating}/5
                                </Typography>
                            </Box>
                        </Box>

                        {/* Feedback */}
                        {rating.feedback && (
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Comment sx={{ fontSize: 20, color: '#666' }} />
                                    <Typography 
                                        sx={{ 
                                            fontWeight: 600, 
                                            color: '#666', 
                                            fontSize: 12,
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        Feedback
                                    </Typography>
                                </Box>
                                <Box 
                                    sx={{ 
                                        bgcolor: '#f5f5f5', 
                                        p: 2, 
                                        borderRadius: 1,
                                        border: '1px solid #e0e0e0'
                                    }}
                                >
                                    <Typography sx={{ fontSize: 14, color: '#333', lineHeight: 1.6 }}>
                                        {rating.feedback}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {/* Date */}
                        <Box>
                            <Typography 
                                sx={{ 
                                    fontWeight: 600, 
                                    color: '#666', 
                                    fontSize: 12,
                                    textTransform: 'uppercase',
                                    mb: 0.5 
                                }}
                            >
                                Submitted On
                            </Typography>
                            <Typography sx={{ fontSize: 14, color: '#666' }}>
                                {new Date(rating.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography sx={{ color: '#999', fontSize: 16 }}>
                            No rating available for this complaint
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: '#2DA94B',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        px: 3
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RatingDialog;