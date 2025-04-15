import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  IconButton,
  Chip,
  useTheme,
  InputBase,
  alpha,
  Button,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import {
  Payments as PaymentsIcon,
  Favorite as FavoriteIcon,
  CalendarMonth as CalendarMonthIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Bed as BedIcon,
  Bathtub as BathIcon,
  SquareFoot as AreaIcon,
  Home as HomeIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import TenantNavbar from "./TenantNavbar";
import TenantSidebar from "./TenantSidebar";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
}));

const PropertyCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ display: "flex", alignItems: "center", p: 2, borderRadius: 2, boxShadow: 3, width: "100%" }}>
    <Avatar sx={{ bgcolor: color, width: 50, height: 50, mr: 2 }}>
      {icon}
    </Avatar>
    <CardContent>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4">{value}</Typography>
    </CardContent>
  </Card>
);

const ActivityCard = ({ title, activities }) => (
  <Card sx={{ display: "flex", flexDirection: "column", p: 2, borderRadius: 2, boxShadow: 3, width: "100%" }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <List>
      {activities.map((activity, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            {activity.icon}
          </ListItemIcon>
          <ListItemText
            primary={activity.title}
            secondary={activity.description}
          />
        </ListItem>
      ))}
    </List>
  </Card>
);

const TenantDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchDashboardData();
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.username || user.name || '');
    }

    // Add event listener for visit scheduling
    const handleVisitScheduled = () => {
      fetchDashboardData();
    };
    window.addEventListener('visitScheduled', handleVisitScheduled);

    // Cleanup
    return () => {
      window.removeEventListener('visitScheduled', handleVisitScheduled);
    };
  }, []);

  const getAuthToken = () => {
    const userDataString = localStorage.getItem('user');
    if (!userDataString) return null;
    
    try {
      const userData = JSON.parse(userDataString);
      return userData.token;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error('No token found');
        return;
      }
      const response = await axios.get('/tenant/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      // const data = await response.json();

      if(response.data.success) {
        setDashboardData(response.data.data);
      }else{
        console.error('Error fetching dashboard data:', response.data.message);
      }

      // if (response.ok) {
      //   setDashboardData(data.data);
      // } else {
      //   console.error('Error fetching dashboard data:', data.message);
      // }
    } catch (error) {
      console.error('Error fetching dashbord dqata:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()){
      navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }



  // const handleSearch = async () => {
  //   if (!searchQuery.trim()) return;
    
  //   setIsSearching(true);
  //   try {
  //     const token = getAuthToken();
  //     if (!token) {
  //       console.error('No token found');
  //       return;
  //     }
  //     const response = await axios.get(`/tenant/search?query=${encodeURIComponent(searchQuery)}`,{
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });
  //     setSearchResults(response.data);
  //   } catch (error) {
  //     console.error('Search failed:', error);
  //     setSearchResults([]);
  //   } finally {
  //     setIsSearching(false);
  //   }
  // };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSaveProperty = async (propertyId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error('No token found');
        return;
      }
      await axios.post(`/tenant/save-property/${propertyId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Refresh dashboard data to update saved properties count
      fetchDashboardData();
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      {/* Sidebar */}
      <TenantSidebar drawerOpen={drawerOpen} toggleDrawer={setDrawerOpen} />

      {/* Navbar */}
      <TenantNavbar toggleDrawer={setDrawerOpen} />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, width: "100vw" }}>
        <Container maxWidth={false}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>Welcome to Your Dashboard</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Manage your properties, visits, and bookings here.
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              {/* Welcome Section with Search */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    color: 'white',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h4" gutterBottom>
                        Welcome back, {userName}!
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.8 }}>
                        Here's what's happening with your properties today.
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Search>
                        <SearchIconWrapper>
                          <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                          placeholder="Search properties..."
                          inputProps={{ 'aria-label': 'search' }}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                      </Search>
                      <SearchButton
                        variant="contained"
                        onClick={handleSearch}
                        disabled={isSearching}
                        startIcon={<SearchIcon />}
                      >
                        Search
                      </SearchButton>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Stats Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={3}>
                  <StatCard
                    title="Rented Properties"
                    value={dashboardData.stats.totalRented}
                    icon={<HomeIcon />}
                    color="#4CAF50"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StatCard
                    title="Upcoming Visits"
                    value={dashboardData.stats.totalVisits}
                    icon={<VisibilityIcon />}
                    color="#2196F3"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StatCard
                    title="Active Bookings"
                    value={dashboardData.stats.totalBookings}
                    icon={<CalendarMonthIcon />}
                    color="#FF9800"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StatCard
                    title="Saved Properties"
                    value={dashboardData.stats.savedCount}
                    icon={<FavoriteIcon />}
                    color="#E91E63"
                  />
                </Grid>
              </Grid>

              {/* Current Properties */}
              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>My Current Properties</Typography>
              <Grid container spacing={3}>
                {dashboardData.currentProperties.map((property) => (
                  <Grid item xs={12} sm={6} md={4} key={property.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={property.images || '/default-property.jpg'}
                        alt={property.name}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>{property.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {typeof property.address === 'object' 
                              ? `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zipCode}`
                              : property.address}
                          </Typography>
                        </Box>
                        <Typography variant="h6" color="primary" gutterBottom>
                          ₹{property.rent}/month
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2">
                          Landlord: {property.landlordName}
                          <br />
                          Contact: {property.landlordContact}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Upcoming Visits */}
              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Upcoming Visits</Typography>
              <Grid container spacing={3}>
                {dashboardData.upcomingVisits.map((visit) => (
                  <Grid item xs={12} sm={6} md={4} key={visit.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>{visit.propertyName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {typeof visit.address === 'object'
                            ? `${visit.address.street}, ${visit.address.city}, ${visit.address.state} ${visit.address.zipCode}`
                            : visit.address}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            Visit Date: {new Date(visit.visitDate).toLocaleDateString()}
                          </Typography>
                          <Chip
                            label={visit.status}
                            color={visit.status === 'CONFIRMED' ? 'success' : 'warning'}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Recent Bookings */}
              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Recent Bookings</Typography>
              <Grid container spacing={3}>
                {dashboardData.recentBookings.map((booking) => (
                  <Grid item xs={12} sm={6} md={4} key={booking.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>{booking.propertyName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {typeof booking.address === 'object'
                            ? `${booking.address.street}, ${booking.address.city}, ${booking.address.state} ${booking.address.zipCode}`
                            : booking.address}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            Landlord: {booking.landlordName}
                          </Typography>
                          <Typography variant="body2">
                            Date: {new Date(booking.bookingDate).toLocaleDateString()}
                          </Typography>
                          <Chip
                            label={booking.status}
                            color={
                              booking.status === 'CONFIRMED' ? 'success' 
                              : booking.status === 'PENDING' ? 'warning' 
                              : 'error'
                            }
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Saved Properties */}
              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Saved Properties</Typography>
              <Grid container spacing={3}>
                {dashboardData.savedProperties.map((property) => (
                  <Grid item xs={12} sm={6} md={4} key={property.id}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={property.image || '/default-property.jpg'}
                        alt={property.name}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>{property.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {typeof property.address === 'object' 
                              ? `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zipCode}`
                              : property.address}
                          </Typography>
                        </Box>
                        <Typography variant="h6" color="primary" gutterBottom>
                          ₹{property.rent}/month
                        </Typography>
                        <Typography variant="body2">
                          Listed by: {property.landlordName}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <IconButton color="primary">
                            <FavoriteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default TenantDashboard;