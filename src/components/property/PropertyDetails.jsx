import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  useTheme,
  Stack,
  TextField,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import {
  Home as HomeIcon,
  Bed as BedIcon,
  Bathtub as BathIcon,
  SquareFoot as AreaIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Close as CloseIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  EventAvailable as EventAvailableIcon,
  Key as KeyIcon,
  Person as PersonIcon,
  Place as PlaceIcon,
  LocationCity as LocationCityIcon,
  Map as MapIcon,
  School as SchoolIcon,
  LocalHospital as HospitalIcon,
  LocalMall as MallIcon,
  Park as ParkIcon,
  Train as MetroIcon,
  DirectionsBus as BusIcon,
  Restaurant as RestaurantIcon,
  AccountBalance as BankIcon,
  LocationOn as LocationOnIcon,
  Info as InfoIcon,
  Event as EventIcon,
  Chair as ChairIcon,
  Stars as StarsIcon,
  Construction as ConstructionIcon,
  Home as HomeIconIcon,
  SquareFoot,
  Construction,
  Info,
  Event,
  Chair,
  Stars,
  Home,
  DirectionsWalk as WalkIcon,
  CompareArrows,
  WbSunny,
  AttachMoney,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { isLoggedIn } from '../../utils/auth';
import Navbar from '../layouts/Navbar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [autoSlideInterval, setAutoSlideInterval] = useState(null);
  const [bookVisitDialogOpen, setBookVisitDialogOpen] = useState(false);
  const [rentDialogOpen, setRentDialogOpen] = useState(false);
  const [visitDate, setVisitDate] = useState(null);
  const [propertyScores, setPropertyScores] = useState(null);
  const [sunPosition, setSunPosition] = useState({ x: 50, y: 50 });
  const [showCostComparison, setShowCostComparison] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Define fetchPropertyDetails outside useEffect
  const fetchPropertyDetails = async () => {
    try {
      const response = await axios.get(`/properties/${id}`);
      const propertyData = response.data;

      // Parse nearbyFacilities if it's a string
      if (typeof propertyData.nearbyFacilities === 'string') {
        try {
          propertyData.nearbyFacilities = JSON.parse(propertyData.nearbyFacilities);
        } catch (e) {
          console.error('Error parsing nearbyFacilities:', e);
          propertyData.nearbyFacilities = [];
        }
      }

      setProperty(propertyData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching property:", error);
      setError(error.response?.data?.message || 'Failed to fetch property details');
      setLoading(false);
    }
  };

  // Authentication check
    const checkAuth = () => {
      if (!isLoggedIn()) {
        navigate('/login');
        return;
      }
      fetchPropertyDetails();
    };

  // Use effect for initial load
  useEffect(() => {
    checkAuth();
  }, [id, navigate]);

  useEffect(() => {
    if (selectedImage && property?.images) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          prev === property.images.length - 1 ? 0 : prev + 1
        );
        setSelectedImage(property.images[currentImageIndex]);
      }, 3000); // Change image every 3 seconds

      setAutoSlideInterval(interval);
    }

    return () => {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
      }
    };
  }, [selectedImage, property?.images, currentImageIndex]);

  useEffect(() => {
    if (property) {
      console.log('Property data:', property); // This will help us see the exact structure
    }
  }, [property]);

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  };

  const handlePreviousImage = () => {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
    setSelectedImage(property.images[currentImageIndex]);
  };

  const handleNextImage = () => {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
    setSelectedImage(property.images[currentImageIndex]);
  };

  const getFacilityIcon = (type) => {
    switch (type) {
      case 'Hospital': return <HospitalIcon />;
      case 'Shopping Mall': return <MallIcon />;
      case 'School': return <SchoolIcon />;
      case 'Park': return <ParkIcon />;
      case 'Metro Station': return <MetroIcon />;
      case 'Bus Stop': return <BusIcon />;
      case 'Restaurant': return <RestaurantIcon />;
      case 'Bank': return <BankIcon />;
      default: return <LocationOnIcon />;
    }
  };

  const renderOwnerInfo = () => {
    if (!property?.owner) {
      return (
        <Typography color="text.secondary">
          Owner information not available
        </Typography>
      );
    }

    return (
      <>
        <List sx={{ width: '100%' }}>
          <ListItem>
            <ListItemIcon>
              <PersonIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={property.owner.username}
              secondary="Property Owner"
            />
          </ListItem>

          {property.owner.phone && (
            <ListItem
              button
              component="a"
              href={`tel:${property.owner.phone}`}
              sx={{
                '&:hover': {
                  bgcolor: 'action.hover',
                  borderRadius: 1
                }
              }}
            >
              <ListItemIcon>
                <PhoneIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary={property.owner.phone}
                secondary="Contact Number"
              />
            </ListItem>
          )}

          {property.owner.email && (
            <ListItem
              button
              component="a"
              href={`mailto:${property.owner.email}`}
              sx={{
                '&:hover': {
                  bgcolor: 'action.hover',
                  borderRadius: 1
                }
              }}
            >
              <ListItemIcon>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary={property.owner.email}
                secondary="Email Address"
              />
            </ListItem>
          )}
        </List>

        <Stack spacing={2} sx={{ mt: 3 }}>
          {property.owner.phone && (
            <Button
              variant="contained"
              fullWidth
              startIcon={<PhoneIcon />}
              onClick={() => window.location.href = `tel:${property.owner.phone}`}
              sx={{ 
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none'
              }}
            >
              Call Owner
            </Button>
          )}

          {property.owner.email && (
            <Button
              variant="outlined"
              fullWidth
              startIcon={<EmailIcon />}
              onClick={() => window.location.href = `mailto:${property.owner.email}`}
              sx={{ 
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none'
              }}
            >
              Email Owner
            </Button>
          )}
        </Stack>
      </>
    );
  };

  const calculateLocationScore = (property) => {
    // Example scoring logic based on nearby facilities
    const facilitiesCount = property.nearbyFacilities?.length || 0;
    return Math.min(facilitiesCount * 20, 100);
  };

  const calculateAmenitiesScore = (property) => {
    // Example scoring logic based on amenities
    const amenitiesCount = property.amenities?.length || 0;
    return Math.min(amenitiesCount * 15, 100);
  };

  const calculateValueScore = (property) => {
    // Example scoring logic based on price and area
    const pricePerSqFt = property.price / (property.landArea?.value || 1);
    return Math.min(100 - (pricePerSqFt / 100), 100);
  };

  const calculateConnectivityScore = (property) => {
    // Example scoring logic based on nearby transport facilities
    const transportFacilities = property.nearbyFacilities?.filter(
      f => ['Metro Station', 'Bus Stop'].includes(f.type)
    ).length || 0;
    return Math.min(transportFacilities * 25, 100);
  };

  const updateSunPosition = (time) => {
    // More realistic sun positions
    const timeMap = {
      '6 AM': { x: 10, y: 70 },  // Rising sun
      '9 AM': { x: 30, y: 40 },  // Morning
      '12 PM': { x: 50, y: 20 }, // Noon
      '3 PM': { x: 70, y: 40 },  // Afternoon
      '6 PM': { x: 90, y: 70 }   // Setting sun
    };
    setSunPosition(timeMap[time]);
  };

  const handleFavoriteClick = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }

      const { token } = JSON.parse(userData);
      if (!token) {
        navigate('/login');
        return;
      }

      if (isFavorite) {
        // Unsave the property
        await axios.delete(`/property/unsave/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Save the property
        await axios.post(`/property/save/${id}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      setIsFavorite(!isFavorite);
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('savedPropertiesUpdated'));
    } catch (error) {
      console.error('Error updating favorite status:', error);
      if (error.response?.status === 401) {
        // If token is invalid, redirect to login
        navigate('/login');
      } else {
        // Revert the state if there's an error
        setIsFavorite(!isFavorite);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!property) {
    return (
      <Box p={3}>
        <Alert severity="warning">Property not found</Alert>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ pt: 8, pb: 6, bgcolor: 'background.default', width: '100%' }}>
        <Container 
          maxWidth={false}
          sx={{ 
            py: 4,
            px: { xs: 2, sm: 4, md: 6, lg: 8 },
            maxWidth: '1600px',
            mx: 'auto',
          }}
        >
          <Grid container spacing={4}>
            {/* Main Image Display */}
            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 0, 
                  mb: 3, 
                  position: 'relative',
                  height: { xs: '300px', sm: '400px', md: '450px' },
                  width: '100%',
                  overflow: 'hidden',
                  borderRadius: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: 'background.default'
                }}
              >
                {property.images && property.images.length > 0 ? (
                  <>
                  <Box
                    component="img"
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    {/* Navigation Arrows */}
                    <IconButton
                      sx={{
                        position: 'absolute',
                        left: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255,255,255,0.8)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                        boxShadow: 2,
                        zIndex: 2,
                        width: 40,
                        height: 40,
                      }}
                      onClick={handlePreviousImage}
                    >
                      <NavigateBeforeIcon />
                    </IconButton>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255,255,255,0.8)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                        boxShadow: 2,
                        zIndex: 2,
                        width: 40,
                        height: 40,
                      }}
                      onClick={handleNextImage}
                    >
                      <NavigateNextIcon />
                    </IconButton>
                    {/* Image Counter */}
                  <Box 
                    sx={{ 
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        zIndex: 2
                      }}
                    >
                      {currentImageIndex + 1} / {property.images.length}
                  </Box>
                  </>
                ) : (
                  <Typography>No images available</Typography>
                )}
              </Paper>

            {/* Thumbnail Gallery */}
              <Paper elevation={3} sx={{ p: 1, mb: 3 }}>
                <Box
                    sx={{ 
                    display: 'flex',
                    gap: 1,
                      overflowX: 'auto',
                      '&::-webkit-scrollbar': {
                      height: 6,
                      },
                      '&::-webkit-scrollbar-track': {
                      backgroundColor: 'background.paper',
                      },
                      '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'primary.main',
                      borderRadius: 3,
                      },
                    }}
                  >
                  {property.images?.map((image, index) => (
                    <Box
                        key={index}
                        onClick={() => handleImageClick(image, index)}
                        sx={{ 
                        flexShrink: 0,
                        width: { xs: '80px', sm: '100px' },
                        height: { xs: '60px', sm: '75px' },
                        position: 'relative',
                          cursor: 'pointer',
                          borderRadius: 1,
                        overflow: 'hidden',
                        border: currentImageIndex === index ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                        }}
                      >
                        <img
                          src={image}
                        alt={`Thumbnail ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Property Details */}
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h4" gutterBottom>
                    {property.title}
                  </Typography>
                  <IconButton 
                    onClick={handleFavoriteClick}
                    sx={{ 
                      color: isFavorite ? 'error.main' : 'text.secondary',
                      '&:hover': {
                        color: 'error.main',
                        transform: 'scale(1.1)',
                        transition: 'transform 0.2s'
                      }
                    }}
                  >
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Box>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip 
                    label={property.status} 
                    color={property.status === 'Available' ? 'success' : 'error'} 
                    size="large"
                  />
                  <Typography variant="h5" color="primary">
                    ₹{property.price.toLocaleString()}/month
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} sm={3}>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 3
                        }
                      }}
                    >
                      <BedIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6">{property.bedrooms}</Typography>
                      <Typography variant="body2" color="text.secondary">Bedrooms</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 3
                        }
                      }}
                    >
                      <BathIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6">{property.bathrooms}</Typography>
                      <Typography variant="body2" color="text.secondary">Bathrooms</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 3
                        }
                      }}
                    >
                      <AreaIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6">
                        {property?.landArea?.value || property?.area || property?.squareFootage || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {property?.landArea?.unit || 'sq ft'}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 3
                        }
                      }}
                    >
                      <LocationIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {property.location}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {property.description}
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Features
                </Typography>
                <Grid container spacing={2}>
                  {property.features && property.features.length > 0 ? (
                    property.features.map((feature, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" color="primary">•</Typography>
                          <Typography variant="body2">{feature}</Typography>
                        </Box>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        
                      </Typography>
                    </Grid>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    {/* Address Section */}
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PlaceIcon color="primary" />
                      Complete Address
                    </Typography>
                    <Box sx={{ pl: 2, mb: 3 }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {property.address?.street}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {property.address?.city}, {property.address?.state} {property.address?.zipCode}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {property.address?.country}
                      </Typography>
                    </Box>

                    {/* Nearby Facilities Section */}
                    {property.nearbyFacilities && property.nearbyFacilities.length > 0 && (
                      <Grid item xs={12}>
                        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                          <Typography variant="h6" gutterBottom sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            color: 'primary.main',
                            fontWeight: 'bold'
                          }}>
                            <LocationIcon color="primary" />
                            Nearby Facilities
                          </Typography>

                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            {property.nearbyFacilities.map((facility, index) => (
                              <Grid item xs={12} sm={6} md={4} key={index}>
                                <Paper
                                  elevation={2}
                                  sx={{
                                    p: 2,
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 2,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      transform: 'translateY(-4px)',
                                      boxShadow: 4,
                                      bgcolor: 'action.hover'
                                    },
                                    position: 'relative',
                                    overflow: 'hidden',
                                    borderRadius: 2
                                  }}
                                >
                                  <Box sx={{ 
                                    color: 'primary.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: 1,
                                    borderRadius: 1,
                                    bgcolor: 'primary.lighter'
                                  }}>
                                    {getFacilityIcon(facility.type)}
                                  </Box>
                                  
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle1" sx={{ 
                                      fontWeight: 600,
                                      mb: 0.5
                                    }}>
                                      {facility.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                      {facility.type}
                                    </Typography>
                                    <Box sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center',
                                      gap: 0.5,
                                      color: 'success.main'
                                    }}>
                                      <WalkIcon fontSize="small" />
                                      <Typography variant="body2">
                                        {facility.distance.value} {facility.distance.unit}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Paper>
                              </Grid>
                            ))}
                          </Grid>

                          {/* Google Maps Link */}
                          <Button
                            variant="outlined"
                            startIcon={<MapIcon />}
                            sx={{ mt: 3 }}
                            onClick={() => {
                              const query = encodeURIComponent(
                                `${property.address.street}, ${property.address.city}, ${property.address.state}`
                              );
                              window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                            }}
                          >
                            View on Google Maps
                          </Button>
                        </Paper>
                      </Grid>
                    )}
                  </Paper>
                </Grid>

                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon color="primary" />
                    Property Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <HomeIconIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Property Type" 
                            secondary={property.propertyType} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <EventIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Available From" 
                            secondary={new Date(property.availableFrom).toLocaleDateString()} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <ChairIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Furnished" 
                            secondary={property.furnished ? "Yes" : "No"} 
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <List>
                        {property.amenities && property.amenities.length > 0 && (
                          <ListItem>
                            <ListItemIcon>
                              <StarsIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Amenities" 
                              secondary={
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                  {property.amenities.map((amenity, index) => (
                                    <Chip 
                                      key={index} 
                                      label={amenity} 
                                      size="small" 
                                      color="primary" 
                                      variant="outlined" 
                                    />
                                  ))}
                                </Box>
                              } 
                            />
                          </ListItem>
                        )}
                      </List>
                    </Grid>
                  </Grid>
                </Paper>
              </Paper>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<EventAvailableIcon />}
                    onClick={() => setBookVisitDialogOpen(true)}
                    sx={{ 
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                  >
                    Book a Visit
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    startIcon={<KeyIcon />}
                    onClick={() => setRentDialogOpen(true)}
                    sx={{ 
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                  >
                    Rent Property
                  </Button>
                </Stack>

                <Divider sx={{ my: 3 }} />
                
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: 'primary.main',
                    fontWeight: 'bold'
                  }}>
                    <PersonIcon color="primary" />
                    Contact Property Owner
                  </Typography>
                  {renderOwnerInfo()}
                </Paper>
              </Paper>
            </Grid>

            {/* Property Score Radar Chart */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: 'primary.main',
                  fontWeight: 'bold'
                }}>
                  <CompareArrows />
                  Property Score Analysis
                </Typography>
                <Box sx={{ height: 300, mt: 2 }}>
                  <Radar
                    data={{
                      labels: ['Location', 'Amenities', 'Value', 'Condition', 'Safety', 'Connectivity'],
                      datasets: [{
                        label: 'Property Score',
                        data: [
                          calculateLocationScore(property),
                          calculateAmenitiesScore(property),
                          calculateValueScore(property),
                          95, // Example condition score
                          90, // Example safety score
                          calculateConnectivityScore(property)
                        ],
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                        pointHoverRadius: 8,
                      }]
                    }}
                    options={{
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            stepSize: 20
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          display: false
                        }
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Sun Position Visualizer with improved visuals */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: 'primary.main',
                  fontWeight: 'bold'
                }}>
                  <WbSunny />
                  Natural Light Analysis
                </Typography>
                <Box sx={{ 
                  position: 'relative', 
                  height: 300, 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                  background: 'linear-gradient(180deg, #87CEEB 0%, #E0F6FF 100%)', // Sky gradient
                  boxShadow: 'inset 0 0 50px rgba(255,255,255,0.5)'
                }}>
                  {/* House Silhouette */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: '20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '150px',
                    height: '100px',
                    bgcolor: '#2C3E50',
                    clipPath: 'polygon(0% 100%, 0% 40%, 50% 0%, 100% 40%, 100% 100%)',
                    zIndex: 2
                  }} />
                  
                  {/* Sun */}
                  <Box sx={{
                    position: 'absolute',
                    width: '60px',
                    height: '60px',
                    transform: 'translate(-50%, -50%)',
                    left: `${sunPosition.x}%`,
                    top: `${sunPosition.y}%`,
                    zIndex: 1,
                  }}>
                    {/* Inner glow */}
                    <Box sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      background: '#FDB813',
                      borderRadius: '50%',
                      boxShadow: `
                        0 0 60px 30px #fff,
                        0 0 100px 60px #f0f,
                        0 0 140px 90px #0ff
                      `,
                      opacity: 0.7,
                      transition: 'all 0.5s ease'
                    }} />
                    
                    {/* Sun core */}
                    <Box sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      background: 'radial-gradient(circle, #FDB813 0%, #FDB813 35%, rgba(253,184,19,0) 100%)',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite'
                    }} />
                  </Box>

                  {/* Ground */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    height: '20%',
                    background: 'linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%)',
                    zIndex: 1
                  }} />

                  {/* Controls */}
                  <Box sx={{ 
                    position: 'absolute',
                    bottom: 16,
                    left: 0,
                    right: 0,
                    zIndex: 3,
                    px: 2
                  }}>
                    <Typography variant="subtitle2" align="center" gutterBottom sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                      Sun Position Throughout the Day
                    </Typography>
                    <Stack 
                      direction="row" 
                      spacing={1} 
                      justifyContent="center" 
                      sx={{ mt: 1 }}
                    >
                      {['6 AM', '9 AM', '12 PM', '3 PM', '6 PM'].map((time) => (
                        <Button
                          key={time}
                          size="small"
                          variant="contained"
                          onClick={() => updateSunPosition(time)}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.9)',
                            color: 'primary.main',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,1)',
                            },
                            minWidth: 'auto',
                            px: 1
                          }}
                        >
                          {time}
                        </Button>
                      ))}
                    </Stack>
                  </Box>
                </Box>
                
                {/* Add this to your existing styles */}
                <style>
                  {`
                    @keyframes pulse {
                      0% { transform: scale(1); }
                      50% { transform: scale(1.1); }
                      100% { transform: scale(1); }
                    }
                  `}
                </style>
              </Paper>
            </Grid>

            {/* Smart Cost Comparison */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: 'primary.main',
                  fontWeight: 'bold'
                }}>
                  <AttachMoney />
                  Smart Cost Analysis
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'background.default',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1">Monthly Cost</Typography>
                          <Typography variant="h4" color="primary">
                            ₹{property.price.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            vs Market Average
                          </Typography>
                          <Typography 
                            variant="h6" 
                            color={property.price < 50000 ? "success.main" : "error.main"}
                          >
                            {property.price < 50000 ? "−12%" : "+8%"}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        {[
                          { label: 'Utilities (est.)', cost: property.price * 0.1 },
                          { label: 'Maintenance', cost: property.price * 0.05 },
                          { label: 'Security Deposit', cost: property.price },
                        ].map((item) => (
                          <Box 
                            key={item.label}
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              p: 1,
                              borderBottom: '1px solid',
                              borderColor: 'divider'
                            }}
                          >
                            <Typography variant="body2">{item.label}</Typography>
                            <Typography variant="body2">
                              ₹{item.cost.toLocaleString()}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Book Visit Dialog */}
      <Dialog
        open={bookVisitDialogOpen}
        onClose={() => setBookVisitDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Schedule a Visit</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Select Date and Time"
                value={visitDate}
                onChange={(newValue) => setVisitDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={new Date()}
                sx={{ mb: 2 }}
              />
            </LocalizationProvider>
            <TextField
              fullWidth
              label="Additional Notes"
              multiline
              rows={4}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookVisitDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary">
            Confirm Visit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rent Property Dialog */}
      <Dialog
        open={rentDialogOpen}
        onClose={() => setRentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rent Property</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Rental Terms
            </Typography>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Lease Duration (months)"
                type="number"
                defaultValue={12}
              />
              <TextField
                fullWidth
                label="Move-in Date"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
              <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Cost Breakdown
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Monthly Rent</Typography>
                    <Typography>₹{property?.price}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Security Deposit</Typography>
                    <Typography>₹{property?.price}</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography fontWeight="bold">Total Initial Payment</Typography>
                    <Typography fontWeight="bold">₹{property?.price * 2}</Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRentDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary">
            Proceed to Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'transparent',
            boxShadow: 'none'
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
            }}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            onClick={handlePreviousImage}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
            }}
          >
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton
            onClick={handleNextImage}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
            }}
          >
            <NavigateNextIcon />
          </IconButton>
          <img
            src={selectedImage}
            alt="Property"
            style={{ 
              width: '100%', 
              height: 'auto', 
              display: 'block',
              maxHeight: '90vh',
              objectFit: 'contain'
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyDetails; 