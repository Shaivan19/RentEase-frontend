import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Avatar, Tooltip, Badge, InputBase, Box } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, Link } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "auto",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "12ch",
    "&:focus": { width: "20ch" },
  },
}));

const TenantNavbar = ({ toggleDrawer }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState(3);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDraweToggle =()=>{
    toggleDrawer(true);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: 1201, background: "linear-gradient(to right, #0072ff, #00c6ff)" }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={handleDraweToggle}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/home")}>
          RentEase
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search..." inputProps={{ "aria-label": "search" }} />
        </Search>
        <IconButton color="inherit" sx={{ mr: 2 }}>
          <Badge badgeContent={notifications} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2, mr: 2 }}>
          <Button
            color="inherit"
            component={Link}
            to="/home"
            sx={{
              textTransform: 'none',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff'
              }
            }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/properties"
            sx={{
              textTransform: 'none',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff'
              }
            }}
          >
            Properties
          </Button>
        </Box>
        <Tooltip title="Account Settings">
          <IconButton onClick={handleMenuOpen} color="inherit">
            <Avatar sx={{ bgcolor: "#fff", color: "#0072ff" }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ mt: 5 }}
        >
          <MenuItem onClick={() => { navigate("/tenant/profile"); handleMenuClose(); }}>Profile</MenuItem>
          <MenuItem onClick={() => { localStorage.removeItem("user"); navigate("/login"); handleMenuClose(); }}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TenantNavbar;