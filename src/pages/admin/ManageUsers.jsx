import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const ManageUsers = () => {
  const [artisans, setArtisans] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const response = await fetch(
          "https://ahms-be-obre.onrender.com/api/admin/artisans"
        );
        const data = await response.json();
        setArtisans(data.slice(0, 2));
      } catch (error) {
        console.error("Error", error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await fetch(
          "https://ahms-be-obre.onrender.com/api/admin/students"
        );
        const data = await response.json();
        setStudents(data.slice(0, 2));
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchArtisans();
    fetchStudents();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Artisans */}
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 2,
          mb: 5,
          pt: 5,
          px: { xs: 1, sm: 2 },
          overflowX: "hidden",
        }}
      >
        <Typography //artisans blue header box
          variant="h6"
          sx={{
            position: "absolute",
            top: -12,
            left: 0,
            backgroundColor: "#2196f3",
            width: "100%",
            color: "white",
            py: 1,
            borderRadius: 2,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Artisans
        </Typography>

        <Box sx={{ width: "100%" }}>
          <Table
            sx={{
              width: "100%",
              tableLayout: "auto",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>ARTISAN</TableCell>
                <TableCell>FUNCTION</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell>DETAILS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {artisans.map((a, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {a.artisan}
                  </TableCell>
                  <TableCell>{a.function}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        backgroundColor: "green",
                        color: "white",
                        px: 1,
                        borderRadius: 1,
                        display: "inline-block",
                        fontSize: "0.7rem",
                      }}
                    >
                      ONLINE
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: "black", cursor: "pointer" }}>
                      View
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>

      {/* Students */}
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 2,
          pt: 5,
          px: { xs: 1, sm: 2 },
          overflowX: "hidden",
        }}
      >
        <Typography //students blue header box
          variant="h6"
          sx={{
            position: "absolute",
            top: -12,
            left: 0,
            width: "100%",
            backgroundColor: "#2196f3",
            color: "white",
            py: 1,
            borderRadius: 2,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Students
        </Typography>

        <Box sx={{ width: "100%" }}>
          <Table
            sx={{
              width: "100%",
              tableLayout: "auto",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>STUDENTS</TableCell>
                <TableCell>ROOMNO</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>DETAILS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((s, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {s.name}
                  </TableCell>
                  <TableCell>{s.roomNumber}</TableCell>
                  <TableCell>{s.id}</TableCell>
                  <TableCell>
                    <Typography sx={{ color: "black", cursor: "pointer" }}>
                      View
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default ManageUsers;
