import React, {useState} from "react";
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
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import ReportIcon from "@mui/icons-material/Assignment";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import logo from "../../assets/logo.png";


const sidebarComponents = {//sidebar components based on user
  student: [
    {name: "Dashboard", icon: <DashboardIcon />},
    {name: "LComplaint", icon: <ReportIcon />},
    {name: "Complaint", icon: <ReportIcon />},
    {name: "Notifications", icon: <NotificationsOutlinedIcon />},
    {name: "Profile", icon: <PersonIcon />},
  ],
  artisan: [
    {name: "Dashboard", icon: <DashboardIcon />},
    {name: "Job Request", icon: <ReportIcon />},
    {name: "Upload Report", icon: <ReportIcon />},
    {name: "Notifications", icon: <NotificationsOutlinedIcon />},
    {name: "Profile", icon: <PersonIcon />},
    {name: "Statistics", icon: <BarChartIcon />},
  ],
  admin: [
    {name: "Dashboard", icon: <DashboardIcon />},
    {name: "Manage Users", icon: <GroupIcon />},
    {name: "Complaints", icon: <ReportIcon />},
    {name: "Notifications", icon: <NotificationsOutlinedIcon />},
    {name: "Profile", icon: <PersonIcon />},
    {name: "Statistics", icon: <BarChartIcon />},
  ],
};

const Sidebar = ({ role = "admin" }) => {//behaviour on mobile 
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const items = sidebarComponents[role] || [];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
          <ListItemButton key={item.name} sx={{ mb: 1 }}>
            <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        ))}
      </List>

      <Box flexGrow={1} />

      <Box textAlign="center">
        <Button
          variant="contained"
          fullWidth
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

const App = () => {
  const userRole = "admin"; 
  return( 
    <Box display = "flex">
      <Sidebar role = {userRole} />
      <Box p = {3} flexGrow ={1}></Box>
    </Box>
  );
};

export default App;
