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
  Modal,
  TextField,
  Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";

import Sidebar from "../../components/Reusable/Sidebar";
import Navbar from "../../components/Reusable/NavBar";
import { fetchUsers, createUser } from "../../utils/userUtils";

const ManageUsers = () => {
  const [students, setStudents] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    work_type_id: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [studentPage, setStudentPage] = useState(1);
  const [artisanPage, setArtisanPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchAndSetUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found");
        const { students, artisans } = await fetchUsers(token);
        console.log("Fetched students:", students.map(s => s.id));
        console.log("Fetched artisans:", artisans.map(a => a.id));
        setStudents(students);
        setArtisans(artisans);
      } catch (error) {
        setError(error.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchAndSetUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      setAdding(true);
      const token = localStorage.getItem("authToken");
      if (!newUser.name || !newUser.email || !newUser.work_type_id) {
        throw new Error("Please fill in all required fields");
      }
      const user = await createUser(token, newUser, photoFile);
      setArtisans((prev) => [...prev, user.artisan || user]);
      setAddModalOpen(false);
      setNewUser({ name: "", email: "", work_type_id: "" });
      setPhotoFile(null);
      setError("");
      window.location.reload(); // Auto-refresh page
    } catch (error) {
      setError(error.message || "Failed to add artisan");
    } finally {
      setAdding(false);
    }
  };

  const renderAddModal = () => (
    <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}>
        <Typography variant="h6">Add Artisan</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          label="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Work Type ID"
          value={newUser.work_type_id}
          onChange={(e) => setNewUser({ ...newUser, work_type_id: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <Button
          variant="contained"
          component="label"
          sx={{ mt: 2, backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
        >
          Upload Profile Picture
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files[0])}
          />
        </Button>
        <Box mt={2}>
          <Button
            variant="contained"
            onClick={handleAddUser}
            disabled={adding}
            sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
          >
            {adding ? "Adding" : "Add"}
          </Button>
          <Button
            onClick={() => setAddModalOpen(false)}
            sx={{ ml: 2, color: '#1976d2' }}
            disabled={adding}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  const renderStudentTable = () => (
    <Box p={2} borderRadius={2} bgcolor="#fff" boxShadow={1} mb={4}>
      <Typography variant="h6" sx={{ mb: 2, bgcolor: "#1976d2", color: "#fff", p: 1, borderRadius: 1 }}>
        Students
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>Room No</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.length > 0 ? (
            students
              .slice((studentPage - 1) * usersPerPage, studentPage * usersPerPage)
              .map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <Box sx={{ fontWeight: "bold" }}>{student.name}</Box>
                    <Typography variant="body2" color="textSecondary">
                      {student.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{student.room_number || "-"}</TableCell>
                  <TableCell>{student.student_id || "-"}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small">View</Button>
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">No students found...</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Box mt={2} display="flex" justifyContent="left">
        <Pagination
          count={Math.max(1, Math.ceil(students.length / usersPerPage))}
          page={studentPage}
          onChange={(e, page) => setStudentPage(page)}
          shape="rounded"
          sx={{
            '& .MuiPaginationItem-root': {
              borderRadius: '12px',
              backgroundColor: 'white',
              color: '#1976d2',
              '&.Mui-selected': {
                backgroundColor: '#1976d2',
                color: '#fff',
              },
              '&:hover': {
                backgroundColor: '#1976d2',
                color: '#fff',
              },
            },
          }}
        />
      </Box>
    </Box>
  );

  const renderArtisanTable = () => (
    <Box p={2} borderRadius={2} bgcolor="#fff" boxShadow={1}>
      <Typography variant="h6" sx={{ mb: 2, bgcolor: "#1976d2", color: "#fff", p: 1, borderRadius: 1 }}>
        Artisans
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Artisan</TableCell>
            <TableCell>Function</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {artisans.length > 0 ? (
            artisans
              .slice((artisanPage - 1) * usersPerPage, artisanPage * usersPerPage)
              .map((artisan) => (
                <TableRow key={artisan.id}>
                  <TableCell>
                    <Box sx={{ fontWeight: "bold" }}>{artisan.name}</Box>
                    <Typography variant="body2" color="textSecondary">
                      {artisan.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{artisan.work_type || artisan.role || "-"}</TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        display: "inline-block",
                      }}
                    >
                      {artisan.status || "ONLINE"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small">View</Button>
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">No artisans found...</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Box mt={2} display="flex" justifyContent="left">
        <Pagination
          count={Math.max(1, Math.ceil(artisans.length / usersPerPage))}
          page={artisanPage}
          onChange={(e, page) => setArtisanPage(page)}
          shape="rounded"
          sx={{
            '& .MuiPaginationItem-root': {
              borderRadius: '12px',
              backgroundColor: 'white',
              color: '#1976d2',
              '&.Mui-selected': {
                backgroundColor: '#1976d2',
                color: '#fff',
              },
              '&:hover': {
                backgroundColor: '#1976d2',
                color: '#fff',
              },
            },
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Box>
      <Navbar />
      <Box display="flex">
        <Sidebar />
        <Box flexGrow={1} ml={{ md: "280px" }} p={3} bgcolor="#f8f4f4ff" minHeight="100vh">
          {loading ? (
            <Box display="flex" justifyContent="center" mt={5}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box display="flex" justifyContent="flex-start" mb={3} mt={2}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAddModalOpen(true)}
                  sx={{
                    backgroundColor: '#fff',
                    color: '#1976d2',
                    borderRadius: '4px',
                    textTransform: 'none',
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
                    border: '1px solid #e0e0e0',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  Add Artisan
                </Button>
              </Box>
              {renderAddModal()}
              {renderArtisanTable()}
              <br />
              {renderStudentTable()}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ManageUsers;