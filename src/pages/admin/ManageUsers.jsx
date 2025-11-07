import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Button,
  Alert,
  Snackbar,
  useTheme,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import axios from "axios";

import Sidebar from "../../components/Reusable/Sidebar";
import Navbar from "../../components/Reusable/NavBar";
import { fetchUsers } from "../../utils/userUtils";
import {
  renderArtisanTable,
  renderStudentTable,
  renderArtisanModal,
  renderWorkTypeModal,
  renderArtisanDetailModal,
  renderStudentDetailModal,
} from "../../utils/RenderFunctions";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ManageUsers = () => {
  const theme = useTheme();
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
        setArtisanPage(1);
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
          bgcolor={theme.palette.mode === 'dark' ? '#1e1e1e' : '#f8f4f4ff'}
          minHeight="100vh"
          sx={{
            color: theme.palette.text.primary,
          }}
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
              
              {renderArtisanTable(
                artisans,
                artisanPage,
                artisanPagination,
                ARTISAN_LIMIT,
                handleViewArtisan,
                handleArtisanPageChange,
                artisanTotalPages,
                theme
              )}
              
              {renderStudentTable(
                students,
                studentPage,
                studentPagination,
                STUDENT_LIMIT,
                handleViewStudent,
                handleStudentPageChange,
                studentTotalPages,
                theme
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Modals */}
      {renderArtisanModal(
        openArtisanModal,
        handleCloseArtisanModal,
        artisanFormData,
        handleArtisanInputChange,
        workTypes,
        submitting,
        handleSubmitArtisan,
        theme
      )}

      {renderWorkTypeModal(
        openWorkTypeModal,
        handleCloseWorkTypeModal,
        workTypeFormData,
        handleWorkTypeInputChange,
        submitting,
        handleSubmitWorkType,
        theme
      )}

      {renderArtisanDetailModal(
        openArtisanDetailModal,
        handleCloseArtisanDetail,
        selectedArtisan,
        theme
      )}

      {renderStudentDetailModal(
        openStudentDetailModal,
        handleCloseStudentDetail,
        selectedStudent,
        theme
      )}

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