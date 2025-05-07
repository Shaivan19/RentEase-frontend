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
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  MonetizationOn,
  HomeWork,
  Assignment,
  TrendingUp,
  NotificationsActive,
  Refresh,
  Upcoming,
  Event,
  Cancel,
  Schedule,
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
  const [notifications, setNotifications] = useState([]);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [user, setUser] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [lastPaymentCheck, setLastPaymentCheck] = useState(new Date());

  const [dashboardData, setDashboardData] = useState({
    properties: [],
    upcomingVisits: [],
    recentBookings: [],
    monthlyEarnings: [],
    stats: {
      totalProperties: 0,
      occupiedProperties: 0,
      occupancyRate: 0,
      totalBookings: 0,
      upcomingVisitsCount: 0,
    }
  });

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  // Add event listeners for property status and payment updates
  useEffect(() => {
    const handlePropertyStatusUpdate = (event) => {
      console.log('Property status updated event received:', event.detail);
      // Refresh dashboard data when a property status is updated
      fetchDashboardData();
    };

    const handlePaymentReceived = (event) => {
      console.log('Payment received event received:', event.detail);
      if (event.detail && event.detail.amount) {
        // Update total earnings immediately
        setTotalEarnings(prev => prev + event.detail.amount);
        // Refresh dashboard data to update occupancy rate and other stats
        fetchDashboardData();
      }
    };

    window.addEventListener('propertyStatusUpdated', handlePropertyStatusUpdate);
    window.addEventListener('paymentReceived', handlePaymentReceived);
    
    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('propertyStatusUpdated', handlePropertyStatusUpdate);
      window.removeEventListener('paymentReceived', handlePaymentReceived);
    };
  }, []);

  // Add polling mechanism for payments and status updates
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.token) {
          console.error("No user token found");
          return;
        }

        const response = await axios.get('/landlord/dashboard', {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          // Check if any property statuses have changed
          const currentProperties = response.data.data.properties;
          const oldProperties = dashboardData.properties;
          
          const hasStatusChanged = currentProperties.some((prop, index) => 
            oldProperties[index]?.status !== prop.status
          );

          if (hasStatusChanged) {
            console.log('Property status changes detected, updating dashboard');
            setDashboardData(prev => ({
              ...response.data.data,
              monthlyEarnings: prev.monthlyEarnings
            }));
          }
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    };

    // Check for updates every 5 seconds
    const interval = setInterval(checkForUpdates, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [dashboardData.properties]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.token) {
        console.error("No user token found in localStorage");
        return;
      }

      console.log('User data from localStorage:', userData);

      const [dashboardResponse, earningsResponse] = await Promise.all([
        axios.get('/landlord/dashboard', {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            'Content-Type': 'application/json'
          }
        }).catch(error => {
          console.error('Dashboard API error:', error.response || error);
          throw error;
        }),
        axios.get('/payments/landlord-earnings', {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            'Content-Type': 'application/json'
          }
        }).catch(error => {
          console.error('Earnings API error:', error.response || error);
          throw error;
        })
      ]);

      if (dashboardResponse.data.success && earningsResponse.data.success) {
        console.log('Dashboard response:', dashboardResponse.data);
        console.log('Earnings response:', earningsResponse.data);
        
        // Log the properties array specifically
        console.log('Properties in response:', dashboardResponse.data.data.properties);
        
        setDashboardData({
          ...dashboardResponse.data.data,
          monthlyEarnings: earningsResponse.data.monthlyEarnings
        });

        // Set total earnings from the API response
        setTotalEarnings(earningsResponse.data.totalEarnings || 0);
        
        // Transform visits into notifications
        const visitNotifications = dashboardResponse.data.data.upcomingVisits.map(visit => ({
          id: visit.id,
          type: 'visit',
          title: 'Property Visit',
          message: `${visit.tenantName} has requested to visit ${visit.propertyName}`,
          time: new Date(visit.visitDate).toLocaleString(),
          status: visit.status
        }));
        
        setNotifications(visitNotifications);
        setLastUpdated(new Date());
      } else {
        console.error("Error in API responses:", {
          dashboard: dashboardResponse.data,
          earnings: earningsResponse.data
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error.response || error);
      if (error.response?.status === 401) {
        console.error("Authentication error. Please log in again.");
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Set up polling for new notifications
    const interval = setInterval(fetchDashboardData, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const getNotificationIcon = (type, status) => {
    switch (status) {
      case 'scheduled':
        return <Event color="primary" />;
      case 'rescheduled':
        return <Schedule color="warning" />;
      case 'cancelled':
        return <Cancel color="error" />;
      default:
        return <NotificationsActive color="primary" />;
    }
  };

  const pendingBookings = dashboardData.recentBookings.filter((booking) => booking.status.toLowerCase() === "pending").length;

  // Calculate earnings trend
  const calculateEarningsTrend = () => {
    if (!dashboardData.monthlyEarnings || dashboardData.monthlyEarnings.length < 2) return "No data";
    
    const currentMonth = new Date().getMonth();
    const currentEarnings = dashboardData.monthlyEarnings[currentMonth]?.earnings || 0;
    const lastMonthEarnings = dashboardData.monthlyEarnings[currentMonth - 1]?.earnings || 0;
    
    if (lastMonthEarnings === 0) return "New earnings";
    
    const trend = ((currentEarnings - lastMonthEarnings) / lastMonthEarnings) * 100;
    return `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`;
  };

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
            <IconButton 
              color="primary"
              onClick={handleNotificationsOpen}
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsActive />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        PaperProps={{
          sx: {
            maxHeight: 400,
            width: 360,
            mt: 1,
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" fontWeight={600}>
            Notifications
          </Typography>
        </Box>
        {notifications.length === 0 ? (
          <MenuItem>
            <Typography variant="body2" color="text.secondary">
              No new notifications
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={handleNotificationsClose}
              sx={{
                py: 1.5,
                px: 2,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                {getNotificationIcon(notification.type, notification.status)}
              </ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </>
                }
              />
            </MenuItem>
          ))
        )}
      </Menu>

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
              trend: `${dashboardData?.stats?.upcomingVisitsCount ?? 0} Visits Scheduled`,
              trendColor: pendingBookings > 0 ? "warning.main" : "success.main",
            },
            {
              title: "Total Earnings",
              value: formatToRupees(totalEarnings),
              icon: <MonetizationOn fontSize="large" />,
              trend: `${dashboardData?.stats?.occupiedProperties ?? 0} Rented Properties`,
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
                  {calculateEarningsTrend()} from last month
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
            <TenantRequestsTable requests={dashboardData.upcomingVisits} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LandlordDashboard;