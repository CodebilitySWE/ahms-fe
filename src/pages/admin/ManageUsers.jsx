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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ahms-be-obre.onrender.com/';

const ManageUsers = () => {
  const [artisans, setArtisans] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {

        const token = localStorage.getItem('authToken')

        if(!token){
                throw new Error("Auth failed")
            }

        const url = `${API_BASE_URL}/api/admin/artisans`

        const urlWithParams = new URL(url)
        urlWithParams.searchParams.append('limit', '3')
        urlWithParams.searchParams.append('offset', '0')

        const response = await fetch(urlWithParams.toString(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        const data = await response.json();
        setArtisans(data.slice(0, 2));
      } catch (error) {
        console.error("Error", error);
      }
      return
    };

    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('authToken')
        console.log('Token:', token);

        if(!token){
                throw new Error("Auth failed")
            }

            const url = `${API_BASE_URL}/api/admin/artisans`

        const urlWithParams = new URL(url)
        urlWithParams.searchParams.append('limit', '3')
        urlWithParams.searchParams.append('offset', '0')

        const response = await fetch(urlWithParams.toString(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        const data = await response.json();
        setArtisans(data.slice(0, 2));
      } catch (error) {
        console.error("Error", error);
      }
      return
    };

    fetchArtisans();
    fetchStudents();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, mt: {xs:18, md:20}, ml: { xs: 0, md: "280px" }, }}>
      {/* Artisans */}
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 2,
          mb: 5,
          pt: 5,
          pb: 4,
          px: { xs: 1, sm: 2 },
          
        }}
      >
        <Typography //artisans blue header box
          variant="h6"
          sx={{
            position: "absolute",
            top: -20,
            left: 0,
            right: 0,
            backgroundColor: "#2196f3",
            width: "100%",
            color: "white",
            py: 1,
            px: 3,
            borderRadius: 2,
            textAlign: "center",
            fontWeight: "bold",
            width: "95%",
            mx: "auto",
            
          }}
        >
          Artisans
        </Typography>

        <Box sx={{ width: "100%", overflowX: "auto"  }}>
          <Table
            sx={{
              width: "100%",
              tableLayout: "fixed",
              
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
                      maxWidth: 100,
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
          pb: 4,
          px: { xs: 1, sm: 2 },
        }}
      >
        <Typography //students blue header box
          variant="h6"
          sx={{
            position: "absolute",
            top: -20,
            left: 0,
            right: 0,
            width: "100%",
            backgroundColor: "#2196f3",
            color: "white",
            py: 1,
            borderRadius: 2,
            fontWeight: "bold",
            textAlign: "center",
            width: "95%",
            mx: "auto",
            
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
