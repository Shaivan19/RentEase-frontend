import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  Divider,
  Badge
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InfoIcon from "@mui/icons-material/Info";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme?.palette?.background?.paper || '#ffffff',
  color: theme?.palette?.text?.primary || '#000000',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  height: '64px',
  borderBottom: theme?.palette?.divider ? `1px solid ${theme.palette.divider}` : '1px solid #e0e0e0',
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  fontWeight: active ? 600 : 400,
  textTransform: 'none',
  fontSize: '0.9rem',
  color: active 
    ? (theme?.palette?.primary?.main || '#0072ff') 
    : (theme?.palette?.text?.secondary || '#757575'),
  '&:hover': {
    color: theme?.palette?.primary?.main || '#0072ff',
    backgroundColor: 'transparent',
  },
}));

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const allowedPages = [
    "/home", 
    "/login", 
    "/signup", 
    "/contactus", 
    "/", 
    "/properties", 
    "/aboutus",
    "/property/:id",
    "/property/*"
  ];

  if (!allowedPages.includes(location.pathname) && 
      !location.pathname.startsWith('/property/')) return null;

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
    navigate("/home");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleDashboardRedirect = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (user.role === "landlord") {
      navigate("/landlord/dashboard");
    } else if (user.role === "tenant") {
      navigate("/tenant/dashboard");
    } else {
      navigate("/home");
    }
    handleMenuClose();
  };

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/home" },
    { text: "Properties", icon: <BusinessIcon />, path: "/properties" },
    { text: "Contact Us", icon: <ContactMailIcon />, path: "/contactus" },
    { text: "About Us", icon: <InfoIcon />, path: "/aboutus" }
  ];

  return (
    <StyledAppBar position="fixed">
      <Toolbar sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        height: '64px',
        px: { xs: 2, md: 4 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center",
              color: 'primary.main',
              '&:hover': {
                opacity: 0.8
              }
            }}
            onClick={() => navigate("/home")}
          >
            RentEase
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, ml: 4 }}>
            {menuItems.map((item) => (
              <NavButton 
                key={item.text} 
                startIcon={item.icon} 
                onClick={() => navigate(item.path)}
                active={location.pathname === item.path}
              >
                {item.text}
              </NavButton>
            ))}
          </Box>
        </Box>

        {/* Right Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user && (
            <>
              <IconButton color="inherit" sx={{ color: 'text.secondary' }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <IconButton 
                onClick={handleMenuOpen}
                sx={{ 
                  p: 0,
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <Avatar 
                  src={user?.avatar} 
                  sx={{ 
                    width: 36, 
                    height: 36,
                    bgcolor: 'primary.main',
                    color: 'white'
                  }}
                >
                  {user?.name ? user.name.charAt(0) : 'U'}
                </Avatar>
              </IconButton>
              
              <Menu 
                anchorEl={anchorEl} 
                open={Boolean(anchorEl)} 
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 2,
                    overflow: 'visible',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    }
                  }
                }}
              >
                <MenuItem onClick={() => { navigate("/user/profile"); handleMenuClose(); }}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDashboardRedirect}>
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Dashboard</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                  <ListItemText sx={{ color: 'error.main' }}>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )}

          {!user && (
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="text"
                onClick={() => navigate("/login")}
                sx={{ 
                  fontWeight: 600,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                Login
              </Button>
              
              <Button
                variant="contained"
                onClick={() => navigate("/signup")}
                sx={{ 
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                    backgroundColor: 'primary.dark'
                  }
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}

          {/* Mobile Menu Icon */}
          <IconButton 
            sx={{ 
              display: { xs: "flex", md: "none" },
              color: 'text.secondary'
            }} 
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Mobile Drawer */}
        <Drawer 
          anchor="right" 
          open={drawerOpen} 
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: {
              width: 280,
              pt: 2
            }
          }}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                sx={{
                  px: 3,
                  py: 1.5,
                  color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                  fontWeight: location.pathname === item.path ? 600 : 400
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            
            {user && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem 
                  button 
                  onClick={() => { handleDashboardRedirect(); setDrawerOpen(false); }}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem 
                  button 
                  onClick={() => { navigate("/user/profile"); setDrawerOpen(false); }}
                >
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem 
                  button 
                  onClick={() => { handleLogout(); setDrawerOpen(false); }}
                  sx={{ color: 'error.main' }}
                >
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            )}
          </List>
        </Drawer>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;