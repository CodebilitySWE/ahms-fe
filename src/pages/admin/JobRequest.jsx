import React, { useState, useEffect, useCallback, useMemo, memo, lazy, Suspense } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    CircularProgress,
    Button,
    Pagination,
    Chip,
} from "@mui/material";
import { FilterList, MoreVert } from "@mui/icons-material";
import axios from "axios";

import Sidebar from "../../components/Reusable/Sidebar";
import Navbar from "../../components/Reusable/NavBar";
import FilterModal from "../../utils/FilterModal";

const ActionMenu = lazy(() => import("../../utils/ActionMenu"));
const ActionDialog = lazy(() => import("../Shared/ActionDialog"));
const NotificationSnackbar = lazy(() => import("../Shared/NotificationSnackbar"));
const RatingDialog = lazy(() => import("../Shared/RatingDialog"));

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const REQUEST_LIMIT = 5;
const COMPLETED_LIMIT = 5;

const TableRowMemo = memo(({ request, onActionClick, getStatusColor }) => (
    <TableRow sx={{ "&:hover": { bgcolor: "#f9f9f9" } }}>
        <TableCell>
            <Box sx={{ fontWeight: 600, color: "#333" }}>{request.title}</Box>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.875rem" }}>
                {request.description?.substring(0, 50)}...
            </Typography>
        </TableCell>
        <TableCell>
            <Button
                onClick={(e) => onActionClick(e, request)}
                sx={{ minWidth: "auto", color: "#2DA94B", p: 0.5 }}
            >
                <MoreVert />
            </Button>
        </TableCell>
        <TableCell>
            <Chip
                label={request.status?.toUpperCase() || "PENDING"}
                sx={{
                    backgroundColor: getStatusColor(request.status),
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                }}
            />
        </TableCell>
    </TableRow>
));

TableRowMemo.displayName = "TableRowMemo";

const RequestsTable = memo(({
    requests,
    requestPage,
    requestTotalPages,
    requestPagination,
    selectedArtisan,
    loading,
    onFilterClick,
    onActionClick,
    onPageChange,
    getStatusColor,
}) => (
    <Box p={2} borderRadius={2} bgcolor="#fff" boxShadow={1} mb={4}>
        <Typography
            variant="h6"
            sx={{
                mb: 2,
                bgcolor: "#2DA94B",
                color: "#fff",
                p: 1.5,
                borderRadius: 1,
                fontWeight: 600,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            Requests
            <Button
                startIcon={<FilterList />}
                onClick={onFilterClick}
                sx={{
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
            >
                Filter by Artisan
            </Button>
        </Typography>
        <Table>
            <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#666", textTransform: "uppercase", fontSize: "0.75rem" }}>
                        DESCRIPTION
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#666", textTransform: "uppercase", fontSize: "0.75rem" }}>
                        ACTION STATUS
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#666", textTransform: "uppercase", fontSize: "0.75rem" }}>
                        STATUS
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                            <CircularProgress sx={{ color: "#2DA94B" }} size={30} />
                        </TableCell>
                    </TableRow>
                ) : requests.length > 0 ? (
                    requests.map((request) => (
                        <TableRowMemo
                            key={request.id}
                            request={request}
                            onActionClick={onActionClick}
                            getStatusColor={getStatusColor}
                        />
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4, color: "#999" }}>
                            {selectedArtisan ? "No requests found..." : "Please select an artisan to view requests"}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
        {requestTotalPages > 1 && (
            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="textSecondary">
                    Showing {requests.length > 0 ? (requestPage - 1) * REQUEST_LIMIT + 1 : 0} -{" "}
                    {Math.min(requestPage * REQUEST_LIMIT, requestPagination.total)} of {requestPagination.total} requests
                </Typography>
                <Pagination
                    count={requestTotalPages}
                    page={requestPage}
                    onChange={onPageChange}
                    shape="rounded"
                    sx={{
                        "& .MuiPaginationItem-root": {
                            borderRadius: "8px",
                            backgroundColor: "white",
                            border: "1px solid #e0e0e0",
                            color: "#666",
                            fontWeight: 500,
                            "&.Mui-selected": {
                                backgroundColor: "#2DA94B",
                                color: "#fff",
                                border: "1px solid #2DA94B",
                            },
                            "&:hover": { backgroundColor: "#f0f0f0" },
                        },
                    }}
                />
            </Box>
        )}
    </Box>
));

RequestsTable.displayName = "RequestsTable";

const CompletedTable = memo(({
    completed,
    completedPage,
    completedTotalPages,
    completedPagination,
    selectedArtisan,
    loading,
    onPageChange,
    onViewRating,
}) => (
    <Box p={2} borderRadius={2} bgcolor="#fff" boxShadow={1}>
        <Typography
            variant="h6"
            sx={{
                mb: 2,
                bgcolor: "#2DA94B",
                color: "#fff",
                p: 1.5,
                borderRadius: 1,
                fontWeight: 600,
            }}
        >
            Completed
        </Typography>
        <Table>
            <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#666", textTransform: "uppercase", fontSize: "0.75rem" }}>
                        DESCRIPTION
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#666", textTransform: "uppercase", fontSize: "0.75rem" }}>
                        RATING
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#666", textTransform: "uppercase", fontSize: "0.75rem" }}>
                        STATUS
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                            <CircularProgress sx={{ color: "#2DA94B" }} size={30} />
                        </TableCell>
                    </TableRow>
                ) : completed.length > 0 ? (
                    completed.map((item) => (
                        <TableRow key={item.id} sx={{ "&:hover": { bgcolor: "#f9f9f9" } }}>
                            <TableCell>
                                <Box sx={{ fontWeight: 600, color: "#333" }}>{item.title}</Box>
                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.875rem" }}>
                                    {item.description?.substring(0, 50)}...
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Button 
                                    onClick={() => onViewRating(item)}
                                    sx={{ 
                                        minWidth: "auto", 
                                        color: item.rating ? "#fbbf24" : "#999", 
                                        p: 0.5,
                                        textTransform: "none",
                                        fontWeight: 600
                                    }}
                                >
                                    {item.rating ? `⭐ ${item.rating}` : "No Rating"}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label="COMPLETED"
                                    sx={{
                                        backgroundColor: "#4caf50",
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: "0.75rem",
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4, color: "#999" }}>
                            {selectedArtisan ? "No completed requests found..." : "Please select an artisan to view completed requests"}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
        {completedTotalPages > 1 && (
            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="textSecondary">
                    Showing {completed.length > 0 ? (completedPage - 1) * COMPLETED_LIMIT + 1 : 0} -{" "}
                    {Math.min(completedPage * COMPLETED_LIMIT, completedPagination.total)} of {completedPagination.total} completed
                </Typography>
                <Pagination
                    count={completedTotalPages}
                    page={completedPage}
                    onChange={onPageChange}
                    shape="rounded"
                    sx={{
                        "& .MuiPaginationItem-root": {
                            borderRadius: "8px",
                            backgroundColor: "white",
                            border: "1px solid #e0e0e0",
                            color: "#666",
                            fontWeight: 500,
                            "&.Mui-selected": {
                                backgroundColor: "#2DA94B",
                                color: "#fff",
                                border: "1px solid #2DA94B",
                            },
                            "&:hover": { backgroundColor: "#f0f0f0" },
                        },
                    }}
                />
            </Box>
        )}
    </Box>
));

CompletedTable.displayName = "CompletedTable";

const JobRequest = () => {
    const [requests, setRequests] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [artisans, setArtisans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedArtisan, setSelectedArtisan] = useState("");
    const [selectedArtisanData, setSelectedArtisanData] = useState(null);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [openActionDialog, setOpenActionDialog] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [actionType, setActionType] = useState("");
    const [completionNotes, setCompletionNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
    const [selectedRating, setSelectedRating] = useState(null);
    const [loadingRating, setLoadingRating] = useState(false);

    const [requestPage, setRequestPage] = useState(1);
    const [completedPage, setCompletedPage] = useState(1);
    const [requestPagination, setRequestPagination] = useState({ total: 0, limit: 5, offset: 0 });
    const [completedPagination, setCompletedPagination] = useState({ total: 0, limit: 5, offset: 0 });

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [anchorEl, setAnchorEl] = useState(null);
    const [menuComplaint, setMenuComplaint] = useState(null);

    const getAuthHeaders = useCallback(() => ({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    }), []);

    const showNotification = useCallback((message, severity) => {
        setNotification({ open: true, message, severity });
    }, []);

    const getStatusColor = useCallback((status) => {
        const colors = {
            assigned: "#2196f3",
            scheduled: "#ff9800",
            in_progress: "#9c27b0",
            completed: "#4caf50",
        };
        return colors[status?.toLowerCase()] || "#757575";
    }, []);

    const fetchArtisans = useCallback(async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/admin/manage_users/artisans?limit=1000&offset=0`,
                { headers: getAuthHeaders() }
            );
            
            const uniqueArtisans = [];
            const seenIds = new Set();
            
            (response.data.artisans || []).forEach(artisan => {
                if (!seenIds.has(artisan.id)) {
                    seenIds.add(artisan.id);
                    uniqueArtisans.push(artisan);
                }
            });
            
            setArtisans(uniqueArtisans);
        } catch (error) {
            console.error("Failed to load artisans:", error);
            showNotification("Failed to load artisans", "error");
        }
    }, [getAuthHeaders, showNotification]);

    const fetchComplaints = useCallback(async () => {
        if (!selectedArtisan || artisans.length === 0) {
            setRequests([]);
            setCompleted([]);
            setLoading(false);
            return;
        }

        const artisan = artisans.find((a) => a.name === selectedArtisan);
        if (!artisan) {
            console.error("Selected artisan not found:", selectedArtisan);
            showNotification("Selected artisan not found", "error");
            setLoading(false);
            return;
        }

        setSelectedArtisanData(artisan);

        try {
            setLoading(true);
            const requestOffset = (requestPage - 1) * REQUEST_LIMIT;
            const completedOffset = (completedPage - 1) * COMPLETED_LIMIT;

            const [requestsRes, completedRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/artisan/complaints`, {
                    headers: getAuthHeaders(),
                    params: { 
                        artisanId: artisan.id, 
                        limit: REQUEST_LIMIT, 
                        offset: requestOffset 
                    },
                }),
                axios.get(`${API_BASE_URL}/api/artisan/complaints/completed`, {
                    headers: getAuthHeaders(),
                    params: { 
                        artisanId: artisan.id, 
                        limit: COMPLETED_LIMIT, 
                        offset: completedOffset 
                    },
                }),
            ]);

            setRequests(requestsRes.data.data || []);
            setRequestPagination(requestsRes.data.pagination || { total: 0, limit: REQUEST_LIMIT, offset: requestOffset });

            setCompleted(completedRes.data.data || []);
            setCompletedPagination(completedRes.data.pagination || { total: 0, limit: COMPLETED_LIMIT, offset: completedOffset });
        } catch (error) {
            console.error("Failed to load complaints:", error);
            showNotification("Failed to load complaints", "error");
        } finally {
            setLoading(false);
        }
    }, [artisans, selectedArtisan, requestPage, completedPage, getAuthHeaders, showNotification]);

    useEffect(() => {
        fetchArtisans();
    }, [fetchArtisans]);

    useEffect(() => {
        if (selectedArtisan && artisans.length > 0) {
            fetchComplaints();
        } else if (!selectedArtisan) {
            setRequests([]);
            setCompleted([]);
            setSelectedArtisanData(null);
            setLoading(false);
        }
    }, [selectedArtisan, artisans.length, requestPage, completedPage, fetchComplaints]);

    const handleOpenFilterModal = useCallback(() => setOpenFilterModal(true), []);
    const handleCloseFilterModal = useCallback(() => setOpenFilterModal(false), []);

    const handleApplyFilter = useCallback(() => {
        setRequestPage(1);
        setCompletedPage(1);
        handleCloseFilterModal();
    }, [handleCloseFilterModal]);

    const handleOpenActionMenu = useCallback((event, complaint) => {
        setAnchorEl(event.currentTarget);
        setMenuComplaint(complaint);
    }, []);

    const handleCloseActionMenu = useCallback(() => {
        setAnchorEl(null);
        setMenuComplaint(null);
    }, []);

    const handleStartComplaint = useCallback((complaint) => {
        setSelectedComplaint(complaint);
        setActionType("start");
        setOpenActionDialog(true);
        handleCloseActionMenu();
    }, [handleCloseActionMenu]);

    const handleCompleteComplaint = useCallback((complaint) => {
        setSelectedComplaint(complaint);
        setActionType("complete");
        setCompletionNotes("");
        setOpenActionDialog(true);
        handleCloseActionMenu();
    }, [handleCloseActionMenu]);

    const handleCloseActionDialog = useCallback(() => {
        setOpenActionDialog(false);
        setSelectedComplaint(null);
        setActionType("");
        setCompletionNotes("");
    }, []);

    const handleSubmitAction = useCallback(async () => {
        if (!selectedComplaint || !selectedArtisanData) return;

        setSubmitting(true);
        try {
            const endpoint =
                actionType === "start"
                    ? `${API_BASE_URL}/api/artisan/complaints/${selectedComplaint.id}/start`
                    : `${API_BASE_URL}/api/artisan/complaints/${selectedComplaint.id}/complete`;

            const params = actionType === "complete" 
                ? { 
                    id: selectedArtisanData.id,
                    artisanName: selectedArtisanData.name,
                    notes: completionNotes 
                }
                : {
                    artisanId: selectedArtisanData.id,
                    artisanName: selectedArtisanData.name
                };

            const response = await axios.post(endpoint, null, {
                headers: getAuthHeaders(),
                params: params
            });

            if (response.data.success) {
                showNotification(
                    actionType === "start" ? "Complaint started successfully" : "Complaint completed successfully",
                    "success"
                );
                handleCloseActionDialog();
                fetchComplaints();
            }
        } catch (error) {
            console.error(`Error ${actionType}ing complaint:`, error);
            const errorMessage = error.response?.data?.message || `Failed to ${actionType} complaint`;
            showNotification(errorMessage, "error");
        } finally {
            setSubmitting(false);
        }
    }, [selectedComplaint, selectedArtisanData, actionType, completionNotes, getAuthHeaders, showNotification, handleCloseActionDialog, fetchComplaints]);

    const handleCloseNotification = useCallback(() => {
        setNotification((prev) => ({ ...prev, open: false }));
    }, []);

    const handleRequestPageChange = useCallback((event, value) => {
        setRequestPage(value);
    }, []);

    const handleCompletedPageChange = useCallback((event, value) => {
        setCompletedPage(value);
    }, []);

    const handleViewRating = useCallback(async (complaint) => {
        setSelectedComplaint(complaint);
        setRatingDialogOpen(true);
        setSelectedRating(null);
        setLoadingRating(true);

        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/complaints/${complaint.id}/rating`,
                { headers: getAuthHeaders() }
            );

            if (response.data.success) {
                setSelectedRating(response.data.data);
            }
        } catch (error) {
            console.error("Failed to load rating:", error);
            if (error.response?.status === 404) {
                showNotification("No rating found for this complaint", "info");
            } else {
                showNotification("Failed to load rating", "error");
            }
        } finally {
            setLoadingRating(false);
        }
    }, [getAuthHeaders, showNotification]);

    const handleCloseRatingDialog = useCallback(() => {
        setRatingDialogOpen(false);
        setSelectedComplaint(null);
        setSelectedRating(null);
    }, []);

    const requestTotalPages = useMemo(() => Math.ceil(requestPagination.total / REQUEST_LIMIT), [requestPagination.total]);
    const completedTotalPages = useMemo(() => Math.ceil(completedPagination.total / COMPLETED_LIMIT), [completedPagination.total]);

    return (
        <Box display="flex" minHeight="100vh">
            <Sidebar />
            <Box
                flex={1}
                display="flex"
                flexDirection="column"
                sx={{
                    minWidth: 0,
                    ml: { xs: 0, sm: "280px" },
                }}
            >
                <Navbar notificationCount={5} pageName="Job Requests" userType="/Admin" userRole="admin" />
                <Box flexGrow={1} ml={{ md: "0px" }} p={3} bgcolor="#f8f4f4ff" minHeight="100vh">
                    <RequestsTable
                        requests={requests}
                        requestPage={requestPage}
                        requestTotalPages={requestTotalPages}
                        requestPagination={requestPagination}
                        selectedArtisan={selectedArtisan}
                        loading={loading}
                        onFilterClick={handleOpenFilterModal}
                        onActionClick={handleOpenActionMenu}
                        onPageChange={handleRequestPageChange}
                        getStatusColor={getStatusColor}
                    />
                    <CompletedTable
                        completed={completed}
                        completedPage={completedPage}
                        completedTotalPages={completedTotalPages}
                        completedPagination={completedPagination}
                        selectedArtisan={selectedArtisan}
                        loading={loading}
                        onPageChange={handleCompletedPageChange}
                        onViewRating={handleViewRating}
                    />
                </Box>
            </Box>

            {openFilterModal && (
                <FilterModal
                    open={openFilterModal}
                    onClose={handleCloseFilterModal}
                    artisans={artisans}
                    selectedArtisan={selectedArtisan}
                    onArtisanChange={setSelectedArtisan}
                    onApply={handleApplyFilter}
                />
            )}

            <Suspense fallback={null}>
                {Boolean(anchorEl) && (
                    <ActionMenu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseActionMenu}
                        complaint={menuComplaint}
                        onStart={handleStartComplaint}
                        onComplete={handleCompleteComplaint}
                    />
                )}
            </Suspense>

            <Suspense fallback={null}>
                {openActionDialog && (
                    <ActionDialog
                        open={openActionDialog}
                        onClose={handleCloseActionDialog}
                        actionType={actionType}
                        complaint={selectedComplaint}
                        completionNotes={completionNotes}
                        onNotesChange={setCompletionNotes}
                        onSubmit={handleSubmitAction}
                        submitting={submitting}
                    />
                )}
            </Suspense>

            <Suspense fallback={null}>
                {notification.open && (
                    <NotificationSnackbar
                        open={notification.open}
                        message={notification.message}
                        severity={notification.severity}
                        onClose={handleCloseNotification}
                    />
                )}
            </Suspense>

            <Suspense fallback={null}>
                {ratingDialogOpen && (
                    <RatingDialog
                        open={ratingDialogOpen}
                        onClose={handleCloseRatingDialog}
                        complaint={selectedComplaint}
                        rating={selectedRating}
                        loading={loadingRating}
                    />
                )}
            </Suspense>
        </Box>
    );
};

export default JobRequest;