import React, { useState, useEffect, forwardRef } from "react";
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
  CardActionArea,
  Fade,
  Zoom,
  Tooltip,
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
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
}));

const StatCard = forwardRef(({ title, value, icon, color }, ref) => (
  <Card 
    ref={ref}
    sx={{ 
      display: "flex", 
      alignItems: "center", 
      p: 3, 
      borderRadius: 4, 
      boxShadow: 3,
      background: `linear-gradient(135deg, ${color}15, ${color}30)`,
      border: `1px solid ${color}30`,
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6,
      }
    }}
  >
    <Avatar 
      sx={{ 
        bgcolor: color, 
        width: 56, 
        height: 56, 
        mr: 2,
        boxShadow: `0 0 20px ${color}40`
      }}
    >
      {icon}
    </Avatar>
    <CardContent>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="bold" color="primary">
        {value}
      </Typography>
    </CardContent>
  </Card>
));

const ActivityCard = ({ title, activities }) => (
  <Card 
    sx={{ 
      display: "flex", 
      flexDirection: "column", 
      p: 3, 
      borderRadius: 4, 
      boxShadow: 3,
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      border: '1px solid rgba(0,0,0,0.05)',
    }}
  >
    <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
      {title}
    </Typography>
    <List>
      {activities.map((activity, index) => (
        <ListItem 
          key={index}
          sx={{
            borderRadius: 2,
            mb: 1,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.02)',
            }
          }}
        >
          <ListItemIcon>
            {activity.icon}
          </ListItemIcon>
          <ListItemText
            primary={activity.title}
            secondary={activity.description}
            primaryTypographyProps={{
              fontWeight: 'medium',
            }}
          />
        </ListItem>
      ))}
    </List>
  </Card>
);

// Add this new component for safe animation
const SafeZoom = ({ children, timeout = 500 }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Box sx={{ minHeight: 200 }}>{children}</Box>;
  }

  return (
    <Zoom in={mounted} timeout={timeout}>
      {children}
    </Zoom>
  );
};

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
    const user =JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.username || user.name || '');
    }
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
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <TenantSidebar drawerOpen={drawerOpen} toggleDrawer={setDrawerOpen} />
      <TenantNavbar toggleDrawer={setDrawerOpen} />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, mt: 8 }}>
        <Container maxWidth={false}>
          <Fade in timeout={800}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 2, md: 4 }, 
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <Typography 
                variant="h4" 
                gutterBottom 
                fontWeight="bold"
                sx={{ 
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3
                }}
              >
                Welcome to Your Dashboard
              </Typography>

              {/* Welcome Section with Search */}
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  color: 'white',
                  mb: 4,
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
                  <Box>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                      Welcome back, {userName}!
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Here's what's happening with your properties today.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', md: 'auto' } }}>
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
                      sx={{ 
                        ml: 1,
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                      }}
                    >
                      Search
                    </SearchButton>
                  </Box>
                </Box>
              </Paper>

              {/* Stats Cards */}
              <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <SafeZoom timeout={500}>
                    <StatCard
                      title="Rented Properties"
                      value={dashboardData.stats.totalRented}
                      icon={<HomeIcon />}
                      color="#4CAF50"
                    />
                  </SafeZoom>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <SafeZoom timeout={700}>
                    <StatCard
                      title="Upcoming Visits"
                      value={dashboardData.stats.totalVisits}
                      icon={<VisibilityIcon />}
                      color="#2196F3"
                    />
                  </SafeZoom>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <SafeZoom timeout={900}>
                    <StatCard
                      title="Active Bookings"
                      value={dashboardData.stats.totalBookings}
                      icon={<CalendarMonthIcon />}
                      color="#FF9800"
                    />
                  </SafeZoom>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <SafeZoom timeout={1100}>
                    <StatCard
                      title="Saved Properties"
                      value={dashboardData.stats.savedCount}
                      icon={<FavoriteIcon />}
                      color="#E91E63"
                    />
                  </SafeZoom>
                </Grid>
              </Grid>

              {/* Current Properties */}
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  mt: 6, 
                  mb: 3,
                  fontWeight: 'bold',
                  color: 'primary.main'
                }}
              >
                My Current Properties
              </Typography>
              <Grid container spacing={3}>
                {dashboardData.currentProperties.map((property) => (
                  <Grid item xs={12} sm={6} md={4} key={property.id}>
                    <SafeZoom timeout={500}>
                      <PropertyCard>
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            height="200"
                            image={property.images || '/default-property.jpg'}
                            alt={property.name}
                            sx={{ objectFit: 'cover' }}
                          />
                          <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                              {property.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <LocationIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                              <Typography variant="body2" color="text.secondary">
                                {typeof property.address === 'object' 
                                  ? `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zipCode}`
                                  : property.address}
                              </Typography>
                            </Box>
                            <Typography 
                              variant="h6" 
                              color="primary" 
                              gutterBottom
                              sx={{ 
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }}
                            >
                              ₹{property.rent}/month
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body2" color="text.secondary">
                              Landlord: {property.landlordName}
                              <br />
                              Contact: {property.landlordContact}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </PropertyCard>
                    </SafeZoom>
                  </Grid>
                ))}
              </Grid>

              {/* Upcoming Visits */}
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  mt: 6, 
                  mb: 3,
                  fontWeight: 'bold',
                  color: 'primary.main'
                }}
              >
                Upcoming Visits
              </Typography>
              <Grid container spacing={3}>
                {dashboardData.upcomingVisits.map((visit) => (
                  <Grid item xs={12} sm={6} md={4} key={visit.id}>
                    <SafeZoom timeout={700}>
                      <Card 
                        sx={{ 
                          borderRadius: 4,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 6,
                          }
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom fontWeight="bold">
                            {visit.propertyName}
                          </Typography>
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
                              sx={{ 
                                mt: 1,
                                borderRadius: 2,
                                fontWeight: 'bold'
                              }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </SafeZoom>
                  </Grid>
                ))}
              </Grid>

              {/* Recent Bookings */}
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  mt: 6, 
                  mb: 3,
                  fontWeight: 'bold',
                  color: 'primary.main'
                }}
              >
                Recent Bookings
              </Typography>
              <Grid container spacing={3}>
                {dashboardData.recentBookings.map((booking) => {
                  // Always show "Completed" regardless of the original status
                  const displayStatus = 'Completed';
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} key={booking.id}>
                      <SafeZoom timeout={900}>
                        <Card 
                          sx={{ 
                            borderRadius: 4,
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: 6,
                            }
                          }}
                        >
                          <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                              {booking.propertyName}
                            </Typography>
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
                                label={displayStatus}
                                color="success"
                                size="small"
                                sx={{ 
                                  mt: 1,
                                  borderRadius: 2,
                                  fontWeight: 'bold'
                                }}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </SafeZoom>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Saved Properties */}
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  mt: 6, 
                  mb: 3,
                  fontWeight: 'bold',
                  color: 'primary.main'
                }}
              >
                Saved Properties
              </Typography>
              <Grid container spacing={3}>
                {dashboardData.savedProperties.map((property) => (
                  <Grid item xs={12} sm={6} md={4} key={property.id}>
                    <SafeZoom timeout={1100}>
                      <PropertyCard>
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            height="200"
                            image={property.image || '/default-property.jpg'}
                            alt={property.name}
                            sx={{ objectFit: 'cover' }}
                          />
                          <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                              {property.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <LocationIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                              <Typography variant="body2" color="text.secondary">
                                {typeof property.address === 'object' 
                                  ? `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zipCode}`
                                  : property.address}
                              </Typography>
                            </Box>
                            <Typography 
                              variant="h6" 
                              color="primary" 
                              gutterBottom
                              sx={{ 
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }}
                            >
                              ₹{property.rent}/month
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Listed by: {property.landlordName}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                              <Tooltip title="Remove from saved">
                                <IconButton 
                                  color="primary"
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                    }
                                  }}
                                >
                                  <FavoriteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </PropertyCard>
                    </SafeZoom>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default TenantDashboard;