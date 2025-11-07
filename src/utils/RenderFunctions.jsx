import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";

// Artisan Table Render Function
export const renderArtisanTable = (
  artisans,
  artisanPage,
  artisanPagination,
  ARTISAN_LIMIT,
  handleViewArtisan,
  handleArtisanPageChange,
  artisanTotalPages,
  theme
) => (
  <Box
    p={2}
    borderRadius={2}
    bgcolor={theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff'}
    boxShadow={1}
    mb={4}
    color={theme.palette.text.primary}
  >
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
      Artisans
    </Typography>

    <Table>
      <TableHead>
        <TableRow
          sx={{
            bgcolor: theme.palette.mode === 'dark' ? '#2b2b2b' : '#f5f5f5',
          }}
        >
          {["ARTISAN", "FUNCTION", "STATUS", "DETAILS"].map((header) => (
            <TableCell
              key={header}
              sx={{
                fontWeight: 600,
                color: theme.palette.mode === 'dark' ? '#bbb' : '#666',
                textTransform: "uppercase",
                fontSize: "0.75rem",
              }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {artisans.length > 0 ? (
          artisans.map((artisan) => (
            <TableRow
              key={artisan.id}
              sx={{
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark" ? "#2a2a2a" : "#f9f9f9",
                },
              }}
            >
              <TableCell>
                <Box
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  {artisan.name}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.875rem",
                    color: theme.palette.text.secondary,
                  }}
                >
                  {artisan.email}
                </Typography>
              </TableCell>

              <TableCell sx={{ color: theme.palette.text.secondary }}>
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
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    display: "inline-block",
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
                    fontWeight: 500,
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={4}
              align="center"
              sx={{
                py: 4,
                color:
                  theme.palette.mode === "dark" ? "#777" : "#999",
              }}
            >
              No artisans found...
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>

    {artisanTotalPages > 1 && (
      <Box
        mt={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          Showing{" "}
          {artisans.length > 0
            ? (artisanPage - 1) * ARTISAN_LIMIT + 1
            : 0}{" "}
          -{" "}
          {Math.min(artisanPage * ARTISAN_LIMIT, artisanPagination.total)} of{" "}
          {artisanPagination.total} artisans
        </Typography>

        <Pagination
          count={artisanTotalPages}
          page={artisanPage}
          onChange={handleArtisanPageChange}
          shape="rounded"
          sx={{
            '& .MuiPaginationItem-root': {
              borderRadius: '8px',
              backgroundColor:
                theme.palette.mode === 'dark' ? '#2b2b2b' : 'white',
              border: `1px solid ${
                theme.palette.mode === 'dark' ? '#444' : '#e0e0e0'
              }`,
              color: theme.palette.text.primary,
              fontWeight: 500,
              '&.Mui-selected': {
                backgroundColor: '#2DA94B',
                color: '#fff',
                border: '1px solid #2DA94B',
              },
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#3a3a3a' : '#f0f0f0',
              },
            },
          }}
        />
      </Box>
    )}
  </Box>
);


// Student Table Render Function
export const renderStudentTable = (
  students,
  studentPage,
  studentPagination,
  STUDENT_LIMIT,
  handleViewStudent,
  handleStudentPageChange,
  studentTotalPages,
  theme
) => (
  <Box
    p={2}
    borderRadius={2}
    bgcolor={theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff'}
    boxShadow={1}
    color={theme.palette.text.primary}
  >
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
        <TableRow
          sx={{
            bgcolor: theme.palette.mode === 'dark' ? '#2b2b2b' : '#f5f5f5'
          }}
        >
          {["STUDENTS", "ROOM NO", "ID", "DETAILS"].map((header) => (
            <TableCell
              key={header}
              sx={{
                fontWeight: 600,
                color: theme.palette.mode === 'dark' ? '#bbb' : '#666',
                textTransform: "uppercase",
                fontSize: "0.75rem"
              }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {students.length > 0 ? (
          students.map((student) => (
            <TableRow
              key={student.id}
              sx={{
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark" ? "#2a2a2a" : "#f9f9f9"
                }
              }}
            >
              <TableCell>
                <Box sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  {student.name}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.875rem",
                    color: theme.palette.text.secondary
                  }}
                >
                  {student.email}
                </Typography>
              </TableCell>

              <TableCell sx={{ color: theme.palette.text.secondary }}>
                {student.room_number || "-"}
              </TableCell>

              <TableCell sx={{ color: theme.palette.text.secondary }}>
                {student.student_id || "-"}
              </TableCell>

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
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={4}
              align="center"
              sx={{
                py: 4,
                color: theme.palette.mode === "dark" ? "#777" : "#999"
              }}
            >
              No students found...
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>

    {studentTotalPages > 1 && (
      <Box
        mt={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          Showing{" "}
          {students.length > 0
            ? (studentPage - 1) * STUDENT_LIMIT + 1
            : 0}{" "}
          -{" "}
          {Math.min(studentPage * STUDENT_LIMIT, studentPagination.total)} of{" "}
          {studentPagination.total} students
        </Typography>

        <Pagination
          count={studentTotalPages}
          page={studentPage}
          onChange={handleStudentPageChange}
          shape="rounded"
          sx={{
            "& .MuiPaginationItem-root": {
              borderRadius: "8px",
              backgroundColor:
                theme.palette.mode === "dark" ? "#2b2b2b" : "#fff",
              border: `1px solid ${
                theme.palette.mode === "dark" ? "#444" : "#e0e0e0"
              }`,
              color: theme.palette.text.primary,
              fontWeight: 500,
              "&.Mui-selected": {
                backgroundColor: "#2DA94B",
                color: "#fff",
                border: "1px solid #2DA94B"
              },
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#3a3a3a" : "#f0f0f0"
              }
            }
          }}
        />
      </Box>
    )}
  </Box>
);


// Add Artisan Modal
export const renderArtisanModal = (
  openArtisanModal,
  handleCloseArtisanModal,
  artisanFormData,
  handleArtisanInputChange,
  workTypes,
  submitting,
  handleSubmitArtisan
) => (
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
);

// Add Work Type Modal
export const renderWorkTypeModal = (
  openWorkTypeModal,
  handleCloseWorkTypeModal,
  workTypeFormData,
  handleWorkTypeInputChange,
  submitting,
  handleSubmitWorkType
) => (
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
);

// Artisan Detail Modal
export const renderArtisanDetailModal = (
  openArtisanDetailModal,
  handleCloseArtisanDetail,
  selectedArtisan
) => (
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
);

// Student Detail Modal
export const renderStudentDetailModal = (
  openStudentDetailModal,
  handleCloseStudentDetail,
  selectedStudent
) => (
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
);