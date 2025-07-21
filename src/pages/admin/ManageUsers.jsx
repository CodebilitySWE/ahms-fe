
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
} from "@mui/material";
import axios from "axios";
import { Add } from "@mui/icons-material";

import Sidebar from "../../components/Reusable/Sidebar";
import Navbar from "../../components/Reusable/NavBar";

const ManageUsers = () => {
  const [students, setStudents] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [studentRes, artisanRes] = await Promise.all([
          axios.get("https://ahms-be-obre.onrender.com/api/admin/manage_users/students", { headers }),
          axios.get("https://ahms-be-obre.onrender.com/api/admin/manage_users/artisans", { headers }),
        ]);

        setStudents(studentRes.data.students || []);
        setArtisans(artisanRes.data.artisans || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
          {students.length > 0 ? students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <Box sx={{ fontWeight: "bold" }}>{student.name}</Box>
                <Typography variant="body2" color="textSecondary">
                  {student.email}
                </Typography>
              </TableCell>
              <TableCell>{student.room_no || "-"}</TableCell>
              <TableCell>{student.student_id || "-"}</TableCell>
              <TableCell>
                <Button variant="outlined" size="small">View</Button>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4} align="center">No students found...</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Box mt={2} display="flex" justifyContent="left">
        <Pagination
          count={3}
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
              }
            }
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
          {artisans.length > 0 ? artisans.map((artisan) => (
            <TableRow key={artisan.id}>
              <TableCell>
                <Box sx={{ fontWeight: "bold" }}>{artisan.name}</Box>
                <Typography variant="body2" color="textSecondary">
                  {artisan.email}
                </Typography>
              </TableCell>
              <TableCell>{artisan.role || "-"}</TableCell>
              <TableCell>
                <Typography
                  variant="caption"
                  sx={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    display: "inline-block"
                  }}
                >
                  {artisan.status || "ONLINE"}
                </Typography>
              </TableCell>
              <TableCell>
                <Button variant="outlined" size="small">View</Button>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4} align="center">No artisans found...</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Box mt={2} display="flex" justifyContent="left">
        <Pagination
          count={3}
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
              }
            }
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Box>
      {/* Fixed Navbar at the top */}
      <Navbar />

      {/* Main layout: Sidebar + Page content */}
      <Box display="flex">
        <Sidebar />

        {/* Main Content */}
        <Box
          flexGrow={1}
          ml={{ md: "280px" }}
          p={3}
          bgcolor="#f8f4f4ff"
          minHeight="100vh"
           // Push down content to avoid overlapping fixed Navbar
        >
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
                  sx={{
                    backgroundColor: '#fff',
                    color: '#1976d2',
                    borderRadius: '4px',
                    textTransform: 'none',
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
                    border: '1px solid #e0e0e0',
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  Add User
                </Button>
              </Box>
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
