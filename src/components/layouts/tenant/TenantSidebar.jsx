import React, { useState } from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Collapse, Tooltip } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentIcon from "@mui/icons-material/Payment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BuildIcon from "@mui/icons-material/Build";
import { useNavigate, useLocation } from "react-router-dom";

const TenantSidebar = ({ drawerOpen, toggleDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // const [openPayments, setOpenPayments] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);


  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDrawerClose=()=>{
    toggleDrawer(false);
  };

  return (
    <Drawer 
      variant="temporary" 
      open={drawerOpen} 
      onClose={handleDrawerClose} 
      sx={{ 
        "& .MuiDrawer-paper": { 
          width: 280, 
          backgroundColor: "#1e1e2d", 
          color: "white",
          borderRight: "none",
          boxSizing: "border-box"
        },
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        }
      }}
    >
      
      <List>
       {/* Dashboard */}
       <Tooltip title="Dashboard" placement="right">
          <ListItemButton 
            selected={location.pathname === "/dashboard"} 
            onClick={() => {
              navigate("/dashboard");
              handleDrawerClose();
            }}
            sx={{ "&.Mui-selected": { backgroundColor: "#282846" } }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </Tooltip>

        {/* Properties Section */}
        <ListItemButton onClick={() => setPropertiesOpen(!propertiesOpen)}>
          <ListItemIcon sx={{ color: "white" }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Properties" />
          {propertiesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
        <Collapse in={propertiesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton 
              sx={{ pl: 4 }}
              selected={location.pathname === "/search-properties"}
              onClick={() => {
                navigate("/search-properties");
                handleDrawerClose();
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Search Properties" />
            </ListItemButton>
            <ListItemButton 
              sx={{ pl: 4 }}
              selected={location.pathname === "/tenant/savedproperties"}
              onClick={() => {
                navigate("/tenant/savedproperties");
                handleDrawerClose();
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <FavoriteIcon />
              </ListItemIcon>
              <ListItemText primary="Saved Properties" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Bookings Section */}
        <ListItemButton onClick={() => setBookingsOpen(!bookingsOpen)}>
          <ListItemIcon sx={{ color: "white" }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Bookings" />
          {bookingsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
        <Collapse in={bookingsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton 
              sx={{ pl: 4 }}
              selected={location.pathname === "/tenant/booking"}
              onClick={() => {
                navigate("/tenant/booking");
                handleDrawerClose();
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="My Bookings" />
            </ListItemButton>
            <ListItemButton 
              sx={{ pl: 4 }}
              selected={location.pathname === "/tenant/visits"}
              onClick={() => {
                navigate("/tenant/visits");
                handleDrawerClose();
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Scheduled Visits" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Maintenance Section */}
        <ListItemButton 
          selected={location.pathname === "/tenant/maintenancerequest"}
          onClick={() => {
            navigate("/tenant/maintenancerequest");
            handleDrawerClose();
          }}
          sx={{ "&.Mui-selected": { backgroundColor: "#282846" } }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <BuildIcon />
          </ListItemIcon>
          <ListItemText primary="Maintenance" />
        </ListItemButton>

        {/* Support */}
        <ListItemButton 
          selected={location.pathname === "/contactus"}
          onClick={() => {
            navigate("/contactus");
            handleDrawerClose();
          }}
          sx={{ "&.Mui-selected": { backgroundColor: "#282846" } }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <SupportAgentIcon />
          </ListItemIcon>
          <ListItemText primary="Contact Us" />
        </ListItemButton>

        {/* Logout */}
        <ListItemButton 
          onClick={() => {
            handleLogout();
            handleDrawerClose();
          }} 
          sx={{ 
            color: "red",
            marginTop: 'auto'
          }}
        >
          <ListItemIcon sx={{ color: "red" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>

{/*         
        {[{ text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" }].map((item) => (
          <Tooltip title={item.text} placement="right" key={item.text}>
            <ListItemButton selected={location.pathname === item.path} onClick={() => navigate(item.path)} sx={{ "&.Mui-selected": { backgroundColor: "#282846" } }}>
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </Tooltip>
        ))}

        <ListItemButton onClick={() => setOpenPayments(!openPayments)}>
          <ListItemIcon sx={{ color: "white" }}>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary="Payments" />
          {openPayments ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
        <Collapse in={openPayments} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/payments/history")}>
              <ListItemText primary="Payment History" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/payments/methods")}>
              <ListItemText primary="Payment Methods" />
            </ListItemButton>
          </List>
        </Collapse>

        {[{ text: "Saved Properties", icon: <FavoriteIcon />, path: "/saved-properties" }, { text: "Support", icon: <SupportAgentIcon />, path: "/support" }].map((item) => (
          <Tooltip title={item.text} placement="right" key={item.text}>
            <ListItemButton selected={location.pathname === item.path} onClick={() => navigate(item.path)} sx={{ "&.Mui-selected": { backgroundColor: "#282846" } }}>
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </Tooltip>
        ))}

        <ListItemButton onClick={handleLogout} sx={{ color: "red" }}>
          <ListItemIcon sx={{ color: "red" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton> */}
      </List>
    </Drawer>
  );
};

export default TenantSidebar;