import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  MonetizationOn,
  HomeWork,
  Assignment,
  TrendingUp,
  NotificationsActive,
  Refresh,
  Upcoming,
} from "@mui/icons-material";
import EarningsChart from "./components/EarningChart";
import TenantRequestsTable from "./components/TenantRequestTable";
import StatsCards from "./components/StatsCards";
import axios from "axios";
import { formatToRupees } from "../../../utils/Currency";

const LandlordDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    properties:[],
    upcomingVisits:[],
    recentBookings:[],
    stats:{
      totalProperties: 0,
      occupiedProperties: 0,
      occupancyRate: 0,
      totalBookings: 0,
      upcomingVisitsCount: 0,
    }
  //   totalProperties: 0,
  //   pendingRequests: 0,
  //   totalEarnings: 0,
  //   earningsTrend: "0",
  //   monthlyEarnings: [],
  //   tenantRequests: []
  });

  // const fetchDashboardData = async () => {
  //   setLoading(true);
  //   try {
  //     const userData = JSON.parse(localStorage.getItem('user'));
  //     const response = await axios.get(`/landlord/dashboard/${userData.userId}`);
  //     setDashboardData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching dashboard data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log("User Data:", user); // Debug user data
  
      if (!user || !user.token) {
        console.error("No user token found");
        return;
      }
  
      const response = await axios.get('/landlord/dashboard', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
  
      console.log("Raw API Response:", response); // Debug full response
      console.log("Response Data:", response.data); // Debug response data
  
      if (response.data.success) {
        const dashboardData = response.data.data;
        console.log("Dashboard Stats:", dashboardData.stats); // Debug stats specifically
        setDashboardData(dashboardData);
      } else {
        console.error("API request was not successful:", response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
    fetchDashboardData();}
  }, []);

  const pendingBookings = dashboardData.recentBookings.filter((booking) => booking.status.toLowerCase() === "pending").length;

  const totalEarnings = dashboardData.properties.filter(property => property.status ==='Occupied').reduce((total, property)=> total + (property.price || 0),0)

  const handleRefresh = () => {
    setLastUpdated(new Date());
    fetchDashboardData();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", flexGrow: 1, p: { xs: 2, md: 3 } }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: "primary.main" }}>
            Welcome back, {user?.username || "Landlord"}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Here's what's happening with your properties today
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton color="primary">
              <NotificationsActive />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <StatsCards
          stats={[
            {
              title: "Total Properties",
              value: dashboardData?.stats?.totalProperties ?? 0,
              icon: <HomeWork fontSize="large" />,
              trend: `${dashboardData?.stats?.occupancyRate ?? 0}% Occupied`,
              trendColor: dashboardData?.stats?.occupancyRate ?? 50 ? "success.main" : "error.main",
            },
            {
              title: "Pending Requests",
              value: pendingBookings,
              icon: <Assignment fontSize="large" />,
              trend: `${dashboardData?.stats?.upcomingVisitsCount??0}Visits Scheduled`,
              trendColor: pendingBookings > 0 ? "warning.main": "success.main",
            },
            {
              title: "Total Earnings",
              value: formatToRupees(dashboardData?.properties?.filter(property => property.status ==='Occupied').reduce((total, property)=> total + (property.price || 0),0)),
              icon: <MonetizationOn fontSize="large" />,
              trend: `${dashboardData?.stats?.occupiedProperties??0} Rented Properties`,
              trendColor: "success.main",
            },
          ]}
        />
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Earnings Chart */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Earnings Overview
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TrendingUp color="success" />
                <Typography variant="body2" color="success.main">
                  {dashboardData.earningsTrend} from last month
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <EarningsChart data={dashboardData.monthlyEarnings} />
          </Paper>
        </Grid>

        {/* Recent Tenant Requests */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Recent Tenant Requests
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <TenantRequestsTable requests={dashboardData.tenantRequests} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LandlordDashboard;