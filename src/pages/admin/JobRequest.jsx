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

// Lazy load dialogs/modals (only loaded when needed)
const ActionMenu = lazy(() => import("../../utils/ActionMenu"));
const ActionDialog = lazy(() => import("../Shared/ActionDialog"));
const NotificationSnackbar = lazy(() => import("../Shared/NotificationSnackbar"));

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const REQUEST_LIMIT = 5;
const COMPLETED_LIMIT = 5;

// Memoized Table Row Component
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

// Memoized Requests Table Component
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

// Memoized Completed Table Component
const CompletedTable = memo(({
    completed,
    completedPage,
    completedTotalPages,
    completedPagination,
    selectedArtisan,
    loading,
    onPageChange,
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
                                <Button disabled sx={{ minWidth: "auto", color: "#999", p: 0.5 }}>
                                    <MoreVert />
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
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [openActionDialog, setOpenActionDialog] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [actionType, setActionType] = useState("");
    const [completionNotes, setCompletionNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Pagination state
    const [requestPage, setRequestPage] = useState(1);
    const [completedPage, setCompletedPage] = useState(1);
    const [requestPagination, setRequestPagination] = useState({ total: 0, limit: 5, offset: 0 });
    const [completedPagination, setCompletedPagination] = useState({ total: 0, limit: 5, offset: 0 });

    // Notification state
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // Menu anchor for action buttons
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuComplaint, setMenuComplaint] = useState(null);

    // Memoize auth token retrieval
    const getAuthHeaders = useCallback(() => ({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    }), []);

    const showNotification = useCallback((message, severity) => {
        setNotification({ open: true, message, severity });
    }, []);

    // Memoize getStatusColor function
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
            
            // Remove duplicates by using a Map with user ID as key
            const uniqueArtisans = [];
            const seenIds = new Set();
            
            (response.data.artisans || []).forEach(artisan => {
                if (!seenIds.has(artisan.id)) {
                    seenIds.add(artisan.id);
                    uniqueArtisans.push(artisan);
                }
            });
            
            console.log("Raw artisans:", response.data.artisans?.length);
            console.log("Unique artisans:", uniqueArtisans.length);
            
            setArtisans(uniqueArtisans);
        } catch (error) {
            console.error("Failed to load artisans:", error);
            showNotification("Failed to load artisans", "error");
        }
    }, [getAuthHeaders, showNotification]);

    const fetchComplaints = useCallback(async () => {
        // FIXED: Check if selectedArtisan exists before proceeding
        if (!selectedArtisan) {
            setRequests([]);
            setCompleted([]);
            setLoading(false);
            return;
        }

        // FIXED: Check if artisans array is populated
        if (artisans.length === 0) {
            console.warn("Artisans not loaded yet");
            return;
        }

        const artisan = artisans.find((a) => a.name === selectedArtisan);
        if (!artisan) {
            console.error("Selected artisan not found:", selectedArtisan);
            showNotification("Selected artisan not found", "error");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const requestOffset = (requestPage - 1) * REQUEST_LIMIT;
            const completedOffset = (completedPage - 1) * COMPLETED_LIMIT;

            console.log("Fetching complaints for artisan:", artisan.id, artisan.name);

            const [requestsRes, completedRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/artisan/complaints`, {
                    headers: getAuthHeaders(),
                    params: { artisan_id: artisan.id, limit: REQUEST_LIMIT, offset: requestOffset },
                }),
                axios.get(`${API_BASE_URL}/api/artisan/complaints/completed`, {
                    headers: getAuthHeaders(),
                    params: { artisan_id: artisan.id, limit: COMPLETED_LIMIT, offset: completedOffset },
                }),
            ]);

            console.log("Requests response:", requestsRes.data);
            console.log("Completed response:", completedRes.data);

            setRequests(requestsRes.data.data || []);
            setRequestPagination(requestsRes.data.pagination || { total: 0, limit: REQUEST_LIMIT, offset: requestOffset });

            setCompleted(completedRes.data.data || []);
            setCompletedPagination(completedRes.data.pagination || { total: 0, limit: COMPLETED_LIMIT, offset: completedOffset });
        } catch (error) {
            console.error("Failed to load complaints:", error);
            console.error("Error response:", error.response?.data);
            showNotification("Failed to load complaints", "error");
        } finally {
            setLoading(false);
        }
    }, [artisans, selectedArtisan, requestPage, completedPage, getAuthHeaders, showNotification]);

    useEffect(() => {
        fetchArtisans();
    }, [fetchArtisans]);

    // FIXED: Only fetch complaints when we have both artisans loaded AND a selected artisan
    useEffect(() => {
        if (selectedArtisan && artisans.length > 0) {
            fetchComplaints();
        } else if (!selectedArtisan) {
            setRequests([]);
            setCompleted([]);
            setLoading(false);
        }
    }, [selectedArtisan, artisans.length, requestPage, completedPage, fetchComplaints]);

    // Memoized handlers
    const handleOpenFilterModal = useCallback(() => setOpenFilterModal(true), []);
    const handleCloseFilterModal = useCallback(() => setOpenFilterModal(false), []);

    const handleApplyFilter = useCallback(() => {
        setRequestPage(1);
        setCompletedPage(1);
        handleCloseFilterModal();
        // FIXED: Don't manually call fetchComplaints - let the useEffect handle it
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
        if (!selectedComplaint) return;

        setSubmitting(true);
        try {
            const endpoint =
                actionType === "start"
                    ? `${API_BASE_URL}/api/artisan/complaints/${selectedComplaint.id}/start`
                    : `${API_BASE_URL}/api/artisan/complaints/${selectedComplaint.id}/complete`;

            const payload = actionType === "complete" ? { notes: completionNotes } : {};

            const response = await axios.post(endpoint, payload, {
                headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
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
    }, [selectedComplaint, actionType, completionNotes, getAuthHeaders, showNotification, handleCloseActionDialog, fetchComplaints]);

    const handleCloseNotification = useCallback(() => {
        setNotification((prev) => ({ ...prev, open: false }));
    }, []);

    const handleRequestPageChange = useCallback((event, value) => {
        setRequestPage(value);
    }, []);

    const handleCompletedPageChange = useCallback((event, value) => {
        setCompletedPage(value);
    }, []);

    // Memoize calculated values
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
                    />
                </Box>
            </Box>

            {/* Filter Modal - No lazy loading */}
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

            {/* Lazy loaded components with Suspense fallback */}
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
        </Box>
    );
};

export default JobRequest;