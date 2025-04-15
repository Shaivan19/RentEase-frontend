import React, { useState, useEffect } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import LandlordSidebar from "./LandlordSidebar";
import LandlordNavbar from "./LandlordNavbar";

const LandlordLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", width: "100vw", overflow: "hidden" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 280,
          flexShrink: 0,
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          zIndex: theme.zIndex.drawer,
          display: isSidebarOpen ? 'block' : 'none',
          bgcolor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        }}
      >
        <LandlordSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          width: '100%',
          marginLeft: isSidebarOpen ? '280px' : 0,
          transition: theme.transitions.create('margin-left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Navbar */}
        <LandlordNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Page Content */}
        <Box
          sx={{
            p: 3,
            width: '100%',
            bgcolor: theme.palette.background.default,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default LandlordLayout;
