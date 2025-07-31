import React, {useState} from "react";
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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import ReportIcon from "@mui/icons-material/Assignment";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";

const sidebarComponents = {//sidebar components based on user
  student: [
    {name: "Dashboard", icon: <DashboardIcon />, path: "/student/dashboard"},
    {name: "LComplaint", icon: <ReportIcon />, path: "/student/lcomplaint"},
    {name: "Complaint", icon: <ReportIcon />, path: "/student/complaint"},
    {name: "Notifications", icon: <NotificationsOutlinedIcon />, path: "/student/notifications"},
    {name: "Profile", icon: <PersonIcon />, path: "/student/profile"},
  ],
  artisan: [
    {name: "Dashboard", icon: <DashboardIcon />, path: "/artisan/dashboard"},
    {name: "Job Request", icon: <ReportIcon />, path: "/artisan/job-request"},
    {name: "Upload Report", icon: <ReportIcon />, path: "/artisan/upload-report"},
    {name: "Notifications", icon: <NotificationsOutlinedIcon />, path: "/artisan/notifications"},
    {name: "Profile", icon: <PersonIcon />, path: "/artisan/profile"},
    {name: "Statistics", icon: <BarChartIcon />, path: "/artisan/statistics"},
  ],
  admin: [
    {name: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard"},
    {name: "Manage Users", icon: <GroupIcon />, path: "/admin/manage-users"},
    {name: "Complaints", icon: <ReportIcon />, path: "/admin/complaints"},
    {name: "Notifications", icon: <NotificationsOutlinedIcon />, path: "/admin/notifications"},
    {name: "Profile", icon: <PersonIcon />, path: "/admin/profile"},
    {name: "Statistics", icon: <BarChartIcon />, path: "/admin/statistics"},
  ],
};

const Sidebar = () => {//behaviour on mobile
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const role = user?.role || "admin"; // fallback to admin for demo
  const items = sidebarComponents[role] || [];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const drawerContent =(
    <Box display = "flex" flexDirection = "column" height = "100%" p ={2}>
      <Box display="flex" alignItems="center" gap={1} mb={4} mt={2}>
        <img src={logo} alt="Logo" style={{ height: 35 }} />
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#00b0ff" }}>
          ACMS
        </Typography>
      </Box>
      <Box height={2} bgcolor="#00b0ff" borderRadius={1} mb={2} />

      <List>
        {items.map((item) => (
          <ListItemButton
            key={item.name}
            sx={{
              mb: 1,
              backgroundColor: location.pathname === item.path ? "#17B1EA" : "transparent",
              color: location.pathname === item.path ? "white" : "white",
              "&:hover": {
                backgroundColor: "#17B1EA",
                color: "white",
              },
            }}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? "white" : "white" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} sx={{ color: location.pathname === item.path ? "white" : "white" }} />
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
            backgroundColor: "#00b0ff",
            textTransform: "none",
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#0096cc",
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
      {isMobile && (
        <IconButton color="inherit" onClick={handleDrawerToggle} sx={{ m: 2 }}>
          <MoreHorizIcon />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: 250,
            backgroundColor: "#2c2c2c",
            color: "white",
            borderRadius: 2,
            mt: isMobile ? 0 : 2,
            ml: isMobile ? 0 : 2,
            mb: isMobile ? 0 : 2,
            height: isMobile ? "100%" : "calc(100vh - 32px)",
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
