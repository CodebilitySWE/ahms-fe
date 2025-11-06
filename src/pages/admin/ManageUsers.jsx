import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import axios from "axios";

import Sidebar from "../../components/Reusable/Sidebar";
import Navbar from "../../components/Reusable/NavBar";
import { fetchUsers } from "../../utils/userUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ManageUsers = () => {
  const [students, setStudents] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openArtisanModal, setOpenArtisanModal] = useState(false);
  const [openWorkTypeModal, setOpenWorkTypeModal] = useState(false);
  const [openArtisanDetailModal, setOpenArtisanDetailModal] = useState(false);
  const [openStudentDetailModal, setOpenStudentDetailModal] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Pagination state
  const [artisanPage, setArtisanPage] = useState(1);
  const [studentPage, setStudentPage] = useState(1);
  const [artisanPagination, setArtisanPagination] = useState({ total: 0, limit: 5, offset: 0 });
  const [studentPagination, setStudentPagination] = useState({ total: 0, limit: 5, offset: 0 });
  
  const ARTISAN_LIMIT = 5;
  const STUDENT_LIMIT = 5;
  
  // Form state for artisan
  const [artisanFormData, setArtisanFormData] = useState({
    name: "",
    email: "",
    work_type_id: "",
  });

  // Form state for work type
  const [workTypeFormData, setWorkTypeFormData] = useState({
    name: "",
    description: "",
  });
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchWorkTypes();
  }, []);

  useEffect(() => {
    fetchAndSetUsers();
  }, [artisanPage, studentPage]);

  const fetchAndSetUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const artisanOffset = (artisanPage - 1) * ARTISAN_LIMIT;
      const studentOffset = (studentPage - 1) * STUDENT_LIMIT;
      
      const { students, artisans, studentPage: studentPg, artisanPage: artisanPg } = await fetchUsers(
        token,
        artisanOffset,
        studentOffset,
        ARTISAN_LIMIT,
        STUDENT_LIMIT
      );
      
      setStudents(students);
      setArtisans(artisans);
      setStudentPagination(studentPg);
      setArtisanPagination(artisanPg);
    } catch (error) {
      console.error("Failed to load users:", error);
      showNotification("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/manage_users/categories`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const categories = response.data.categories || response.data || [];
      setWorkTypes(categories);
      console.log("Work types loaded:", categories);
    } catch (error) {
      console.error("Failed to load work types:", error);
      showNotification("Failed to load work types", "error");
    }
  };

  // Artisan Modal Handlers
  const handleOpenArtisanModal = () => {
    setOpenArtisanModal(true);
    setArtisanFormData({ name: "", email: "", work_type_id: "" });
  };

  const handleCloseArtisanModal = () => {
    setOpenArtisanModal(false);
    setArtisanFormData({ name: "", email: "", work_type_id: "" });
  };

  const handleArtisanInputChange = (e) => {
    const { name, value } = e.target;
    setArtisanFormData({
      ...artisanFormData,
      [name]: value,
    });
    
    if (name === "work_type_id") {
      const selectedType = workTypes.find(type => type.id === value);
      console.log("Selected work type:", selectedType);
    }
  };

  const handleSubmitArtisan = async () => {
    if (!artisanFormData.name || !artisanFormData.email || !artisanFormData.work_type_id) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      
      const payload = {
        name: artisanFormData.name.trim(),
        email: artisanFormData.email.trim(),
        work_type_id: parseInt(artisanFormData.work_type_id, 10)
      };
      
      console.log("Submitting artisan:", payload);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/artisans`,
        payload,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        showNotification("Artisan added successfully", "success");
        handleCloseArtisanModal();
        setArtisanPage(1); // Reset to first page
        fetchAndSetUsers();
      }
    } catch (error) {
      console.error("Error adding artisan:", error.response || error);
      const errorMessage = error.response?.data?.message || "Failed to add artisan";
      showNotification(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Work Type Modal Handlers
  const handleOpenWorkTypeModal = () => {
    setOpenWorkTypeModal(true);
    setWorkTypeFormData({ name: "", description: "" });
  };

  const handleCloseWorkTypeModal = () => {
    setOpenWorkTypeModal(false);
    setWorkTypeFormData({ name: "", description: "" });
  };

  const handleWorkTypeInputChange = (e) => {
    const { name, value } = e.target;
    setWorkTypeFormData({
      ...workTypeFormData,
      [name]: value,
    });
  };

  const handleSubmitWorkType = async () => {
    if (!workTypeFormData.name || !workTypeFormData.description) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      
      const payload = {
        name: workTypeFormData.name.trim(),
        description: workTypeFormData.description.trim(),
      };
      
      console.log("Submitting work type:", payload);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/manage_users/categories`,
        payload,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success || response.status === 201) {
        showNotification("Work type created successfully", "success");
        handleCloseWorkTypeModal();
        fetchWorkTypes();
      }
    } catch (error) {
      console.error("Error creating work type:", error.response || error);
      const errorMessage = error.response?.data?.message || "Failed to create work type";
      showNotification(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Detail Modal Handlers
  const handleViewArtisan = (artisan) => {
    setSelectedArtisan(artisan);
    setOpenArtisanDetailModal(true);
  };

  const handleCloseArtisanDetail = () => {
    setOpenArtisanDetailModal(false);
    setSelectedArtisan(null);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setOpenStudentDetailModal(true);
  };

  const handleCloseStudentDetail = () => {
    setOpenStudentDetailModal(false);
    setSelectedStudent(null);
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Pagination handlers
  const handleArtisanPageChange = (event, value) => {
    setArtisanPage(value);
  };

  const handleStudentPageChange = (event, value) => {
    setStudentPage(value);
  };

  // Calculate total pages
  const artisanTotalPages = Math.ceil(artisanPagination.total / ARTISAN_LIMIT);
  const studentTotalPages = Math.ceil(studentPagination.total / STUDENT_LIMIT);

  const renderArtisanTable = () => (
    <Box p={2} borderRadius={2} bgcolor="#fff" boxShadow={1} mb={4}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2, 
          bgcolor: "#2DA94B", 
          color: "#fff", 
          p: 1.5, 
          borderRadius: 1,
          fontWeight: 600
        }}
      >
        Artisans
      </Typography>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: 600, color: "#666", textTransform: "uppercase", fontSize: "0.75rem" }}>
              ARTISAN
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: "#666", textTransform: "uppercase", fontSize: "0.75rem" }}>
              FUNCTION
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: "#666", textTransform: "uppercase", fontSize: "0.75rem" }}>
              STATUS
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: "#666", textTransform: "uppercase", fontSize: "0.75rem" }}>
              DETAILS
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {artisans.length > 0 ? artisans.map((artisan) => (
            <TableRow key={artisan.id} sx={{ "&:hover": { bgcolor: "#f9f9f9" } }}>
              <TableCell>
                <Box sx={{ fontWeight: 600, color: "#333" }}>{artisan.name}</Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.875rem" }}>
                  {artisan.email}
                </Typography>
              </TableCell>
              <TableCell sx={{ color: "#666" }}>
                {artisan.work_type || "-"}
              </TableCell>
              <TableCell>
                <Typography
                  variant="caption"
                  sx={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    display: "inline-block",
                    fontWeight: 600,
                    fontSize: "0.75rem"
                  }}
                >
                  {artisan.status || "ONLINE"}
                </Typography>
              </TableCell>
              <TableCell>
                <Button 
                  variant="text" 
                  size="small"
                  onClick={() => handleViewArtisan(artisan)}
                  sx={{ 
                    color: "#2DA94B",
                    textTransform: "none",
                    fontWeight: 500
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 4, color: "#999" }}>
                No artisans found...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {artisanTotalPages > 1 && (
        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="textSecondary">
            Showing {artisans.length > 0 ? ((artisanPage - 1) * ARTISAN_LIMIT + 1) : 0} - {Math.min(artisanPage * ARTISAN_LIMIT, artisanPagination.total)} of {artisanPagination.total} artisans
          </Typography>
          <Pagination
            count={artisanTotalPages}
            page={artisanPage}
            onChange={handleArtisanPageChange}
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: '8px',
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                color: '#666',
                fontWeight: 500,
                '&.Mui-selected': {
                  backgroundColor: '#2DA94B',
                  color: '#fff',
                  border: '1px solid #2DA94B',
                },
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                }
              }
            }}
          />
        </Box>
      )}
    </Box>
  );

  const renderStudentTable = () => (
    <Box p={2} borderRadius={2} bgcolor="#fff" boxShadow={1}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2, 
          bgcolor: "#2DA94B", 
          color: "#fff", 
          p: 1.5, 
          borderRadius: 1,
          fontWeight: 600
        }}
      >
        Students
      </Typography>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: 600, color: "#666", textTransform: "uppercase", fontSize: "0.75rem" }}>
              STUDENTS
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: "#666", textTransform: "uppercase", fontSize: "0.75rem" }}>
              ROOM NO
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: "#666", textTransform: "uppercase", fontSize: "0.75rem" }}>
              ID
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: "#666", textTransform: "uppercase", fontSize: "0.75rem" }}>
              DETAILS
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.length > 0 ? students.map((student) => (
            <TableRow key={student.id} sx={{ "&:hover": { bgcolor: "#f9f9f9" } }}>
              <TableCell>
                <Box sx={{ fontWeight: 600, color: "#333" }}>{student.name}</Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.875rem" }}>
                  {student.email}
                </Typography>
              </TableCell>
              <TableCell sx={{ color: "#666" }}>{student.room_number || "-"}</TableCell>
              <TableCell sx={{ color: "#666" }}>{student.student_id || "-"}</TableCell>
              <TableCell>
                <Button 
                  variant="text" 
                  size="small"
                  onClick={() => handleViewStudent(student)}
                  sx={{ 
                    color: "#2DA94B",
                    textTransform: "none",
                    fontWeight: 500
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 4, color: "#999" }}>
                No students found...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {studentTotalPages > 1 && (
        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="textSecondary">
            Showing {students.length > 0 ? ((studentPage - 1) * STUDENT_LIMIT + 1) : 0} - {Math.min(studentPage * STUDENT_LIMIT, studentPagination.total)} of {studentPagination.total} students
          </Typography>
          <Pagination
            count={studentTotalPages}
            page={studentPage}
            onChange={handleStudentPageChange}
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: '8px',
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                color: '#666',
                fontWeight: 500,
                '&.Mui-selected': {
                  backgroundColor: '#2DA94B',
                  color: '#fff',
                  border: '1px solid #2DA94B',
                },
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                }
              }
            }}
          />
        </Box>
      )}
    </Box>
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
        <Navbar 
          notificationCount={5}
          pageName="Manage Users"
          userType="/Admin"
          userRole="admin"
        />
        <Box
          flexGrow={1}
          ml={{ md: "0px" }}
          p={3}
          bgcolor="#f8f4f4ff"
          minHeight="100vh"
        >
          {loading ? (
            <Box display="flex" justifyContent="center" mt={5}>
              <CircularProgress sx={{ color: "#2DA94B" }} />
            </Box>
          ) : (
            <>
              <Box display="flex" justifyContent="flex-start" gap={2} mb={3} mt={2}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleOpenArtisanModal}
                  sx={{
                    backgroundColor: '#fff',
                    color: '#2DA94B',
                    borderRadius: '8px',
                    textTransform: 'none',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e0e0e0',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.15)',
                    }
                  }}
                >
                  Add Artisan
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleOpenWorkTypeModal}
                  sx={{
                    backgroundColor: '#2DA94B',
                    color: '#fff',
                    borderRadius: '8px',
                    textTransform: 'none',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    '&:hover': {
                      backgroundColor: '#228B3D',
                      boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.15)',
                    }
                  }}
                >
                  Add Work Type
                </Button>
              </Box>
              {renderArtisanTable()}
              {renderStudentTable()}
            </>
          )}
        </Box>
      </Box>

      {/* Add Artisan Modal */}
      <Dialog 
        open={openArtisanModal} 
        onClose={handleCloseArtisanModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: "#2DA94B", 
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add New Artisan
          </Typography>
          <Button 
            onClick={handleCloseArtisanModal}
            sx={{ color: "#fff", minWidth: "auto" }}
          >
            <Close />
          </Button>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={artisanFormData.name}
            onChange={handleArtisanInputChange}
            margin="normal"
            required
            variant="outlined"
            placeholder="Enter artisan's full name"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={artisanFormData.email}
            onChange={handleArtisanInputChange}
            margin="normal"
            required
            variant="outlined"
            placeholder="Enter artisan's email"
          />
          <TextField
            fullWidth
            select
            label="Work Type"
            name="work_type_id"
            value={artisanFormData.work_type_id}
            onChange={handleArtisanInputChange}
            margin="normal"
            required
            variant="outlined"
            helperText={workTypes.length === 0 ? "Loading work types..." : "Select the artisan's specialty"}
          >
            {workTypes.length > 0 ? (
              workTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Loading...</MenuItem>
            )}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={handleCloseArtisanModal}
            sx={{ 
              textTransform: "none",
              color: "#666",
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitArtisan}
            variant="contained"
            disabled={submitting}
            sx={{ 
              bgcolor: "#2DA94B",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              '&:hover': {
                bgcolor: "#228B3D"
              }
            }}
          >
            {submitting ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Add Artisan"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Work Type Modal */}
      <Dialog 
        open={openWorkTypeModal} 
        onClose={handleCloseWorkTypeModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: "#2DA94B", 
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Create New Work Type
          </Typography>
          <Button 
            onClick={handleCloseWorkTypeModal}
            sx={{ color: "#fff", minWidth: "auto" }}
          >
            <Close />
          </Button>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Work Type Name"
            name="name"
            value={workTypeFormData.name}
            onChange={handleWorkTypeInputChange}
            margin="normal"
            required
            variant="outlined"
            placeholder="e.g., Plumbing, Electrical, Carpentry"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={workTypeFormData.description}
            onChange={handleWorkTypeInputChange}
            margin="normal"
            required
            variant="outlined"
            multiline
            rows={3}
            placeholder="Brief description of this work type"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={handleCloseWorkTypeModal}
            sx={{ 
              textTransform: "none",
              color: "#666",
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitWorkType}
            variant="contained"
            disabled={submitting}
            sx={{ 
              bgcolor: "#2DA94B",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              '&:hover': {
                bgcolor: "#228B3D"
              }
            }}
          >
            {submitting ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Create Work Type"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Artisan Detail Modal */}
      <Dialog 
        open={openArtisanDetailModal} 
        onClose={handleCloseArtisanDetail}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: "#2DA94B", 
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Artisan Details
          </Typography>
          <Button 
            onClick={handleCloseArtisanDetail}
            sx={{ color: "#fff", minWidth: "auto" }}
          >
            <Close />
          </Button>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {selectedArtisan && (
            <Box>
              <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Full Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                  {selectedArtisan.name}
                </Typography>

                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Email Address
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                  {selectedArtisan.email}
                </Typography>

                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Work Type / Specialty
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                  {selectedArtisan.work_type || "-"}
                </Typography>

                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  User ID
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                  {selectedArtisan.id}
                </Typography>

                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Status
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    display: "inline-block",
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                >
                  {selectedArtisan.status || "ONLINE"}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseArtisanDetail}
            variant="contained"
            sx={{ 
              bgcolor: "#2DA94B",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              '&:hover': {
                bgcolor: "#228B3D"
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Student Detail Modal */}
      <Dialog 
        open={openStudentDetailModal} 
        onClose={handleCloseStudentDetail}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: "#2DA94B", 
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Student Details
          </Typography>
          <Button 
            onClick={handleCloseStudentDetail}
            sx={{ color: "#fff", minWidth: "auto" }}
          >
            <Close />
          </Button>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {selectedStudent && (
            <Box>
              <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Full Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                  {selectedStudent.name}
                </Typography>

                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Email Address
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                  {selectedStudent.email}
                </Typography>

                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Student ID
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                  {selectedStudent.student_id || "-"}
                </Typography>

                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Room Number
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                  {selectedStudent.room_number || "-"}
                </Typography>

                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Block
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                  {selectedStudent.block || "-"}
                </Typography>

                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Programme
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                  {selectedStudent.programme || "-"}
                </Typography>

                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  User ID
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedStudent.id}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseStudentDetail}
            variant="contained"
            sx={{ 
              bgcolor: "#2DA94B",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              '&:hover': {
                bgcolor: "#228B3D"
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageUsers;