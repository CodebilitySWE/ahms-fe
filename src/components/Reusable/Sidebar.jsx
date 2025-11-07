import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import ReportIcon from "@mui/icons-material/Assignment";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";

const sidebarComponents = {
  student: [
    { name: "Dashboard", icon: <DashboardIcon />, path: "/student/dashboard" },
    { name: "Lodge Complaint", icon: <ReportIcon />, path: "/student/lodge-complaint" },
    { name: "My Complaints", icon: <ReportIcon />, path: "/student/complaints" },
    { name: "Notifications", icon: <NotificationsOutlinedIcon />, path: "/student/notifications" },
    { name: "Profile", icon: <PersonIcon />, path: "/student/profile" },
  ],
  artisan: [
    { name: "Dashboard", icon: <DashboardIcon />, path: "/artisan/dashboard" },
    { name: "Job Request", icon: <ReportIcon />, path: "/artisan/job-request" },
    { name: "Upload Report", icon: <ReportIcon />, path: "/artisan/upload-report" },
    { name: "Notifications", icon: <NotificationsOutlinedIcon />, path: "/artisan/notifications" },
    { name: "Profile", icon: <PersonIcon />, path: "/artisan/profile" },
    { name: "Statistics", icon: <BarChartIcon />, path: "/artisan/statistics" },
  ],
  admin: [
    { name: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { name: "Manage Users", icon: <GroupIcon />, path: "/admin/manage-users" },
    { name: "Complaints", icon: <ReportIcon />, path: "/admin/complaints" },
    { name: "Job Requests", icon: <AssignmentOutlinedIcon />, path: "/admin/requests" },
    { name: "Notifications", icon: <NotificationsOutlinedIcon />, path: "/admin/notifications" },
    { name: "Profile", icon: <PersonIcon />, path: "/admin/profile" },
  ],
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Tablet and mobile
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role || "admin";
  const items = sidebarComponents[role] || [];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false); // Close drawer on mobile after navigation
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const drawerContent = (
    <Box display="flex" flexDirection="column" height="100%" p={2}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4} mt={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <img
            src={logo}
            alt="Logo"
            style={{
              height: 35,
              filter:
                "brightness(0) saturate(100%) invert(37%) sepia(93%) saturate(1458%) hue-rotate(115deg) brightness(94%) contrast(102%)",
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2DA94B" }}>
            ACMS
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <Box height={2} bgcolor="#2DA94B" borderRadius={1} mb={2} />

      <List>
        {items.map((item) => (
          <ListItemButton
            key={item.name}
            sx={{
              mb: 1,
              backgroundColor: location.pathname === item.path ? "#2DA94B" : "transparent",
              color: "white",
              "&:hover": {
                backgroundColor: "#2DA94B",
                color: "white",
              },
            }}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon
              sx={{
                color: "white",
                minWidth: 40,
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.name} sx={{ color: "white" }} />
          </ListItemButton>
        ))}
      </List>

      <Box flexGrow={1} />

      <Box textAlign="center">
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogout}
          sx={{
            backgroundColor: "#2DA94B",
            textTransform: "none",
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#258c3e",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1300,
            backgroundColor: "#2DA94B",
            color: "white",
            "&:hover": {
              backgroundColor: "#258c3e",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Temporary Drawer for Mobile/Tablet */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: 250,
              backgroundColor: "#2c2c2c",
              color: "white",
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* Permanent Drawer for Desktop */
        <Drawer
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": {
              width: 250,
              backgroundColor: "#2c2c2c",
              color: "white",
              borderRadius: 2,
              mt: 2,
              ml: 2,
              mb: 2,
              height: "calc(100vh - 32px)",
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;