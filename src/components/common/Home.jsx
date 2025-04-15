import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  Rating,
  Container,
  Chip,
  IconButton,
  useTheme,
  Divider,
  Stack,
  Tabs,
  Tab,
  Pagination,
  Avatar,
  CircularProgress,
  Alert
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ApartmentIcon from '@mui/icons-material/Apartment';
import BusinessIcon from '@mui/icons-material/Business';
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import { KingBed, Bathtub, SquareFoot } from "@mui/icons-material";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loadGoogleMapsAPI } from "../../utils/googleMaps";

const Home = () => {
  const theme = useTheme();
  const [favorites, setFavorites] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [markers, setMarkers] = useState([]);

  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/properties');
        setProperties(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const initMap = async () => {
      try {
        const maps = await loadGoogleMapsAPI();
        
        const mapOptions = {
          center: { lat: 23.033863, lng: 72.585022 },
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#242f3e" }]
            },
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#746855" }]
            },
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }]
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#38414e" }]
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9ca5b3" }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }]
            }
          ]
        };

        const mapElement = document.getElementById('map');
        if (!mapElement) return;

        const newMap = new maps.Map(mapElement, mapOptions);
        setMap(newMap);

        // Add markers for each property
        properties.forEach(property => {
          const markerPosition = { lat: property.latitude, lng: property.longitude };
          const newMarker = new maps.Marker({
            position: markerPosition,
            map: newMap,
            title: property.title,
            optimized: true
          });
          markers.push(newMarker);
        });

        return () => {
          markers.forEach(marker => marker.setMap(null));
          if (newMap) {
            newMap.setOptions({});
          }
        };
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setMapError('Failed to load Google Maps. Please try again later.');
      }
    };

    initMap();
  }, [properties]);

  const toggleFavorite = (id) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const PropertyCard = ({ property }) => (
    <Card
      component={motion.div}
      whileHover={{ y: -5 }}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="240"
          image={property.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={property.title}
          sx={{ objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: '50%',
            p: 1,
            cursor: 'pointer',
            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
          }}
          onClick={() => toggleFavorite(property._id)}
        >
          {favorites[property._id] ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </Box>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {property.title}
          </Typography>
          <Rating 
            value={property.rating || 4.5} 
            precision={0.5} 
            readOnly 
            size="small"
            sx={{ ml: 1 }}
          />
        </Stack>
        
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <LocationOnIcon color="primary" sx={{ mr: 1 }} fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {property.address ? `${property.address.street}, ${property.address.city}, ${property.address.state}` : property.location}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <KingBed fontSize="small" color="action" />
              <Typography variant="body2">
                {property.bedrooms} {property.bedrooms > 1 ? 'Beds' : 'Bed'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Bathtub fontSize="small" color="action" />
              <Typography variant="body2">
                {property.bathrooms} {property.bathrooms > 1 ? 'Baths' : 'Bath'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <SquareFoot fontSize="small" color="action" />
              <Typography variant="body2">
                {property.propertyType}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        
        <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
          ₹{property.price.toLocaleString()}/mo
        </Typography>
        
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate(`/property/${property._id}`)}
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  const OfficeCard = ({ office }) => (
    <Card
      component={motion.div}
      whileHover={{ y: -5 }}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        height: '100%'
      }}
    >
      <Grid container>
        <Grid item xs={12} md={5}>
          <CardMedia
            component="img"
            height="100%"
            image={office.image}
            alt={office.title}
            sx={{ height: { xs: 200, md: '100%' } }}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {office.title}
              </Typography>
              <Rating 
                value={office.rating} 
                precision={0.5} 
                readOnly 
                size="small"
                sx={{ ml: 1 }}
              />
            </Stack>
            
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationOnIcon color="primary" sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {office.location}
              </Typography>
            </Box>
            
            <Typography
              variant="h6"
              color="primary"
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              {office.price}
            </Typography>
            
            <Grid container spacing={1} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight={500}>
                  <Box component="span" color="text.secondary">Size:</Box> {office.size}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight={500}>
                  <Box component="span" color="text.secondary">Capacity:</Box> {office.capacity}
                </Typography>
              </Grid>
            </Grid>
            
            <Button 
              variant="contained" 
              fullWidth
              sx={{
                mt: 'auto',
                borderRadius: 2,
                py: 1.5,
                fontWeight: 600
              }}
            >
              View Details
            </Button>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle search on Enter key
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box 
      component="main" 
      sx={{ 
        width: '100vw',
        minHeight: '100vh',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: '64px', sm: '70px' },
        boxSizing: 'border-box'
      }}
    >
      {/* Hero Section with Visible Background */}
      <Box
        sx={{
          width: '100%',
          height: { xs: '70vh', md: '90vh' },
          backgroundImage: "url('https://github.com/Shaivan19/mybackgrounds/blob/main/webbackground_optimized.png?raw=true')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: 'fixed',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)'
          }
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
            color: "white",
            textAlign: "center",
            px: { xs: 2, sm: 4, md: 6 },
            width: '100%'
          }}
        >
          <Typography
            component={motion.h1}
            {...fadeInUp}
            variant="h1"
            fontWeight="bold"
            sx={{ 
              mb: 3,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Discover Your Perfect Space
          </Typography>
          <Typography
            component={motion.p}
            {...fadeInUp}
            variant="h5"
            sx={{ 
              mb: 4, 
              opacity: 0.9,
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            Find the ideal home or office across India's top cities
          </Typography>
          <Box
            component={motion.div}
            {...fadeInUp}
            sx={{
              width: "100%",
              maxWidth: 800,
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <TextField
              fullWidth
              variant="filled"
              placeholder="Search by location, property type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: 2,
                '& .MuiFilledInput-root': {
                  height: '56px',
                  borderRadius: 2,
                  '&:before, &:after': { display: 'none' }
                },
                '& .MuiFilledInput-input': {
                  py: '14px'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleSearch}
              sx={{
                minWidth: { xs: "100%", sm: "140px" },
                height: "56px",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              Search
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Popular Cities Section */}
      <Box sx={{ py: 8, bgcolor: 'white', width: '100%' }}>
        <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, sm: 4, md: 6 } }}>
          <Typography
            component={motion.h2}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 2 }}
          >
            Explore Popular Cities
          </Typography>
          
          <Typography
            component={motion.p}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 5, maxWidth: '700px', mx: 'auto' }}
          >
            Discover rental properties in India's most sought-after locations
          </Typography>
          
          <Grid container spacing={3}>
            {[
              { name: 'Mumbai', image: 'https://github.com/Shaivan19/mybackgrounds/blob/main/an%20apartment.png?raw=true', count: 350 },
              { name: 'Delhi', image: 'https://github.com/Shaivan19/mybackgrounds/blob/main/an%20apartment.png?raw=true', count: 285 },
              { name: 'Bangalore', image: 'https://github.com/Shaivan19/mybackgrounds/blob/main/an%20apartment.png?raw=true', count: 420 },
              { name: 'Hyderabad', image: 'https://github.com/Shaivan19/mybackgrounds/blob/main/an%20apartment.png?raw=true', count: 215 },
              { name: 'Chennai', image: 'https://github.com/Shaivan19/mybackgrounds/blob/main/an%20apartment.png?raw=true', count: 190 },
              { name: 'Pune', image: 'https://github.com/Shaivan19/mybackgrounds/blob/main/an%20apartment.png?raw=true', count: 175 }
            ].map((city) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                key={city.name}
                component={motion.div}
                whileHover={{ y: -10 }}
              >
                <Card 
                  sx={{ 
                    borderRadius: 4,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    height: 200,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                      zIndex: 1
                    }
                  }}
                  onClick={() => navigate('/properties')}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={city.image}
                    alt={city.name}
                    sx={{ position: 'absolute' }}
                  />
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      p: 3,
                      width: '100%',
                      zIndex: 2
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold" color="white" gutterBottom>
                      {city.name}
                    </Typography>
                    <Typography variant="body2" color="white">
                      {city.count} Properties
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default', width: '100%' }}>
        <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, sm: 4, md: 6 } }}>
          <Typography
            component={motion.h2}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 2 }}
          >
            How RentEase Works
          </Typography>
          
          <Typography
            component={motion.p}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 6, maxWidth: '700px', mx: 'auto' }}
          >
            Simple steps to find your perfect home or manage your property
          </Typography>
          
          <Grid container spacing={4}>
            {[
              {
                icon: <SearchIcon fontSize="large" />,
                title: "Search Properties",
                description: "Browse thousands of verified listings across India with detailed filters to find what you need.",
                color: "#3f51b5"
              },
              {
                icon: <ContactMailIcon fontSize="large" />,
                title: "Connect Directly",
                description: "Contact landlords or tenants without middlemen and schedule viewings at your convenience.",
                color: "#f44336"
              },
              {
                icon: <HomeIcon fontSize="large" />,
                title: "Secure Agreement",
                description: "Complete digital rental agreements with secure payments and transparent terms.",
                color: "#009688"
              }
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: step.color,
                      width: 80,
                      height: 80,
                      mb: 3,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                    }}
                  >
                    {step.icon}
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/properties')}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 2,
                fontWeight: 'bold'
              }}
            >
              Explore Properties
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, bgcolor: 'white', width: '100%' }}>
        <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, sm: 4, md: 6 } }}>
          <Typography
            component={motion.h2}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 2 }}
          >
            What Our Users Say
          </Typography>
          
          <Typography
            component={motion.p}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 6, maxWidth: '700px', mx: 'auto' }}
          >
            Thousands of satisfied landlords and tenants trust RentEase
          </Typography>
          
          <Grid container spacing={4}>
            {[
              {
                name: "Priya Sharma",
                role: "Tenant",
                review: "RentEase made finding my new apartment so simple. The filter options helped me narrow down exactly what I wanted, and I could contact the landlord directly without any broker fees.",
                avatar: "https://github.com/Shaivan19/mybackgrounds/blob/main/an%20apartment.png?raw=true",
                rating: 5
              },
              {
                name: "Rajesh Kumar",
                role: "Landlord",
                review: "Managing my rental properties has never been easier. The dashboard gives me a clear overview of all my properties, and I can quickly handle maintenance requests and payments in one place.",
                avatar: "https://github.com/Shaivan19/mybackgrounds/blob/main/an%20apartment.png?raw=true",
                rating: 4.5
              },
              {
                name: "Ananya Patel",
                role: "Tenant",
                review: "I've used several rental platforms, but RentEase stands out for its user-friendly interface and responsive support team. Found my dream apartment in just three days!",
                avatar: "https://github.com/Shaivan19/mybackgrounds/blob/main/an%20apartment.png?raw=true",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  sx={{
                    borderRadius: 4,
                    p: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={testimonial.avatar}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Rating value={testimonial.rating} precision={0.5} readOnly sx={{ mb: 2 }} />
                  
                  <Typography variant="body1" sx={{ mb: 2, flexGrow: 1 }}>
                    "{testimonial.review}"
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box 
        sx={{ 
          py: 8, 
          bgcolor: 'primary.main', 
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 60%)',
            zIndex: 0
          }
        }}
      >
        <Container maxWidth={false} sx={{ position: 'relative', zIndex: 1, width: '100%', px: { xs: 2, sm: 4, md: 6 } }}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            sx={{
              maxWidth: 800,
              mx: 'auto',
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>
              Stay Updated with RentEase
            </Typography>
            
            <Typography variant="body1" color="rgba(255,255,255,0.8)" sx={{ mb: 4 }}>
              Subscribe to our newsletter for the latest property listings and rental tips
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              <TextField
                placeholder="Enter your email address"
                fullWidth
                sx={{
                  bgcolor: 'white',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'secondary.dark'
                  },
                  flexShrink: 0
                }}
              >
                Subscribe
              </Button>
            </Box>
            
            <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ mt: 2, display: 'block' }}>
              We respect your privacy. Unsubscribe at any time.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Property Listings */}
      <Box sx={{ py: 8, position: 'relative', width: '100%' }}>
        <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, sm: 4, md: 6 } }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{ mb: 6 }}
          >
            <Tab label="Residential" icon={<ApartmentIcon />} iconPosition="start" />
            <Tab label="Commercial" icon={<BusinessIcon />} iconPosition="start" />
          </Tabs>
          
          {tabValue === 0 && (
            <>
              <Typography
                component={motion.h2}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                variant="h4"
                fontWeight="bold"
                textAlign="center"
                sx={{ mb: 6 }}
              >
                Featured Residential Properties
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress size={60} />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                  {error}
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {properties.slice(0, 4).map((property) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={property._id}>
                      <PropertyCard property={property} />
                    </Grid>
                  ))}
                </Grid>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/properties')}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    fontWeight: 'bold'
                  }}
                >
                  View All Properties
                </Button>
              </Box>
            </>
          )}
          
          {tabValue === 1 && (
            <>
              <Typography
                component={motion.h2}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                variant="h4"
                fontWeight="bold"
                textAlign="center"
                sx={{ mb: 6 }}
              >
                Premium Office Spaces
              </Typography>
              
              <Grid container spacing={3}>
                {officeSpaces.map((office, index) => (
                  <Grid item xs={12} md={6} key={office.id}>
                    <OfficeCard office={office} />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Container>
      </Box>

      {/* Map Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50', width: '100%' }}>
        <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, sm: 4, md: 6 } }}>
          <Typography
            component={motion.h2}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 6 }}
          >
            Explore Properties on Map
          </Typography>
          
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            sx={{
              height: "500px",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: 3,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            {mapError ? (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100'
                }}
              >
                <Typography color="error">{mapError}</Typography>
              </Box>
            ) : (
              <div id="map" style={{ width: '100%', height: '100%' }} />
            )}
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 4
        }}
      >
        <Container maxWidth="xl">
          <Typography textAlign="center" variant="body1">
            © {new Date().getFullYear()} RentEase. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;