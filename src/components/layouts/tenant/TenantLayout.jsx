import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import TenantNavbar from "./TenantNavbar";
import TenantSidebar from "./TenantSidebar";

const TenantLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <Box sx={{ 
      display: "flex",
      minHeight: "100vh",
      width: "100vw",
      backgroundColor: "#f5f5f5",
      overflow: "hidden"
    }}>
      {/* Sidebar */}
      <TenantSidebar drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />

      {/* Main content wrapper */}
      <Box sx={{ 
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100vh",
        overflow: "auto"
      }}>
        {/* Navbar */}
        <TenantNavbar toggleDrawer={toggleDrawer} />

        {/* Main Content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            width: "100%",
            p: { xs: 2, md: 3 },
            mt: 8,
            minHeight: "calc(100vh - 64px)", // Subtract navbar height
            overflow: "auto",
            boxSizing: "border-box"
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default TenantLayout;