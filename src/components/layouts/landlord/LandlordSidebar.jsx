import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Home,
  Business,
  MonetizationOn,
  Person,
  ExitToApp,
  Menu,
  ExpandLess,
  ExpandMore,
  Dashboard,
  AddHome,
  Settings,
  Notifications,
  Assessment,
  Close,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: <Dashboard />,
    path: "/landlord/dashboard",
  },
  {
    title: "Properties",
    icon: <Business />,
    path: "/landlord/properties",
    subItems: [
      { title: "View Properties", path: "/landlord/properties", icon: <Business /> },
      { title: "Add Property", path: "/landlord/addnewproperty", icon: <AddHome /> },
    ],
  },
  {
    title: "Earnings",
    icon: <MonetizationOn />,
    path: "/landlord/earnings",
  },
  {
    title: "Reports",
    icon: <Assessment />,
    path: "/landlord/reports",
  },
  {
    title: "Notifications",
    icon: <Notifications />,
    path: "/landlord/notifications",
  },
  {
    title: "Profile",
    icon: <Person />,
    path: "/landlord/profile",
  },
  {
    title: "Settings",
    icon: <Settings />,
    path: "/landlord/settings",
  },
];

const LandlordSidebar = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userInitials = user.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase() : 'L';

  const handleMenuClick = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={isOpen}
      sx={{
        width: 280,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
          border: "none",
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {/* Profile Section */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Avatar
          sx={{
            width: 48,
            height: 48,
            border: `2px solid ${theme.palette.primary.main}`,
          }}
        >
          {userInitials}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {user.username || "Landlord"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.userType?.charAt(0).toUpperCase() + user.userType?.slice(1) || 'Landlord'}
          </Typography>
        </Box>
        {isMobile && (
          <IconButton
            onClick={() => onClose?.()}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Menu Items */}
      <List sx={{ p: 1 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.title}>
            {item.subItems ? (
              <>
                <ListItemButton
                  onClick={() => handleMenuClick(item.title)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? theme.palette.primary.main : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    sx={{
                      color: isActive(item.path) ? theme.palette.primary.main : "inherit",
                    }}
                  />
                  {openMenus[item.title] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openMenus[item.title]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItemButton
                        key={subItem.title}
                        component={Link}
                        to={subItem.path}
                        sx={{
                          pl: 4,
                          borderRadius: 1,
                          mb: 0.5,
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: isActive(subItem.path) ? theme.palette.primary.main : "inherit",
                          }}
                        >
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={subItem.title}
                          sx={{
                            color: isActive(subItem.path) ? theme.palette.primary.main : "inherit",
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? theme.palette.primary.main : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{
                    color: isActive(item.path) ? theme.palette.primary.main : "inherit",
                  }}
                />
              </ListItemButton>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* Logout Button */}
      <Box sx={{ mt: "auto", p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <ListItemButton
          component={Link}
          to="/logout"
          sx={{
            borderRadius: 1,
            color: theme.palette.error.main,
            "&:hover": {
              backgroundColor: theme.palette.error.lighter,
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default LandlordSidebar;