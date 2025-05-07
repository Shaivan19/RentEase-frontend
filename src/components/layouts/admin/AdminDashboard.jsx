import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  People as PeopleIcon,
  Home as HomeIcon,
  Event as EventIcon,
  Description as DescriptionIcon 
} from '@mui/icons-material';
import { getAdminToken } from '../../../utils/adminAuth';

const StatCard = ({ icon, title, value, color }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              color: `${color}.dark`,
              borderRadius: '12px',
              p: 2,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {React.cloneElement(icon, { fontSize: 'medium' })}
          </Box>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const StatusChip = ({ status, type = 'user' }) => {
  const theme = useTheme();
  
  const statusConfig = {
    user: {
      active: { label: 'Active', color: 'success' },
      inactive: { label: 'Inactive', color: 'error' },
      default: { label: status, color: 'default' }
    },
    property: {
      available: { label: 'Available', color: 'success' },
      rented: { label: 'Rented', color: 'error' },
      pending: { label: 'Pending', color: 'warning' },
      default: { label: status, color: 'default' }
    }
  };

  const config = statusConfig[type][status] || statusConfig[type].default;

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      sx={{ 
        fontWeight: 500,
        textTransform: 'capitalize'
      }}
    />
  );
};

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTenants: 0,
    totalLandlords: 0,
    totalProperties: 0,
    activeBookings: 0,
    pendingRequests: 0,
    recentTenants: [],
    recentLandlords: [],
    recentProperties: []
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = getAdminToken();
      
      if (!token) {
        showSnackbar('Admin authentication required', 'error');
        return;
      }

      const response = await axios.get('http://localhost:1909/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        setStats(response.data.stats);
      } else {
        throw new Error('Failed to fetch dashboard statistics');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      showSnackbar('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PeopleIcon />}
            title="Total Users"
            value={stats.totalTenants + stats.totalLandlords}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<HomeIcon />}
            title="Total Properties"
            value={stats.totalProperties}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<EventIcon />}
            title="Active Bookings"
            value={stats.activeBookings}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<DescriptionIcon />}
            title="Pending Requests"
            value={stats.pendingRequests}
            color="error"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Recent Users
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...stats.recentTenants, ...stats.recentLandlords].map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {user.username}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <StatusChip status={user.status || 'active'} type="user" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Recent Properties
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentProperties.map((property) => (
                      <TableRow key={property._id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {property.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {property.location}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <StatusChip status={property.status} type="property" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};