import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Divider,
  TextField,
  InputAdornment,
  Pagination,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  MenuItem
} from '@mui/material';
import {
  Search,
  FavoriteBorder,
  Favorite,
  LocationOn,
  KingBed,
  Bathtub,
  SquareFoot,
  FilterList,
  Sort,
  Star
} from '@mui/icons-material';
import { styled } from '@mui/system';
import Carousel from 'react-material-ui-carousel';

const PropertyCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(3),
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }
}));

const PriceTag = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme?.spacing?.(2) || '16px',
  left: theme?.spacing?.(2) || '16px',
  backgroundColor: theme?.palette?.primary?.main || '#1976d2',
  color: 'white',
  padding: theme?.spacing?.(0.5, 1.5) || '4px 12px',
  borderRadius: '20px',
  fontWeight: 700,
  fontSize: '1rem',
  zIndex: 1
}));

const FavoriteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme?.spacing?.(2) || '16px',
  right: theme?.spacing?.(2) || '16px',
  backgroundColor: 'rgba(255,255,255,0.9)',
  zIndex: 2,
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,1)'
  }
}));

const PropertyListingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams] = useSearchParams();
  const [favorites, setFavorites] = useState([]);
  const [sortOption, setSortOption] = useState('recent');
  const [filterOpen, setFilterOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    priceRange: ''
  });

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

  // Update search query when URL parameter changes
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  // Add event listener for property status updates
  useEffect(() => {
    const handlePropertyStatusUpdate = (event) => {
      console.log('Property status updated event received in PropertyList:', event.detail);
      // Refresh properties when a property status is updated
      fetchProperties();
    };

    window.addEventListener('propertyStatusUpdated', handlePropertyStatusUpdate);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('propertyStatusUpdated', handlePropertyStatusUpdate);
    };
  }, []);

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Filter properties based on search and filters
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.propertyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (property.address && 
                          (property.address.street?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.address.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.address.state?.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesType = !filters.propertyType || property.propertyType === filters.propertyType;
    const matchesBeds = !filters.bedrooms || property.bedrooms >= parseInt(filters.bedrooms);
    const matchesBaths = !filters.bathrooms || property.bathrooms >= parseInt(filters.bathrooms);
    
    let matchesPrice = true;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      matchesPrice = property.price >= min && (!max || property.price <= max);
    }

    return matchesSearch && matchesType && matchesBeds && matchesBaths && matchesPrice;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'recent':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add this new function to clear all filters
  const clearFilters = () => {
    setFilters({
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      priceRange: ''
    });
    setSearchQuery('');
  };

  return (
    <Box 
      sx={{ 
        width: '100vw',
        minHeight: '100vh',
        overflowX: 'hidden',
        pt: { xs: '80px', sm: '90px' },
        position: 'relative',
        left: 0,
        right: 0
      }}
    >
      <Container 
        maxWidth={false}
        sx={{ 
          py: 4,
          width: '100%',
          px: { xs: 2, sm: 3, md: 4 },
          mx: 0,
          maxWidth: '100% !important'
        }}
      >
        {/* Search and Filter Section */}
        <Box sx={{ mb: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            Find Your Perfect Property
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row', 
            gap: 2, 
            mb: 3,
            width: '100%'
          }}>
            <TextField
              fullWidth
              placeholder="Search by location, property type, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
                sx: { borderRadius: '12px' }
              }}
            />
            <Button
              variant="contained"
              startIcon={<FilterList />}
              onClick={() => setFilterOpen(!filterOpen)}
              sx={{
                minWidth: '120px',
                borderRadius: '12px',
                px: 3,
                whiteSpace: 'nowrap'
              }}
            >
              Filters
            </Button>
            <Button
              variant="outlined"
              startIcon={<Sort />}
              onClick={() => setSortOption(sortOption === 'price-low' ? 'price-high' : 'price-low')}
              sx={{
                minWidth: '120px',
                borderRadius: '12px',
                px: 3,
                whiteSpace: 'nowrap'
              }}
            >
              Sort
            </Button>
          </Box>

          {filterOpen && (
            <Box sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: '12px',
              backgroundColor: 'background.paper',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              zIndex: 1,
              width: '100%'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Filter Properties</Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={clearFilters}
                  sx={{ 
                    borderRadius: '8px',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'error.light',
                      color: 'white'
                    }
                  }}
                >
                  Clear All Filters
                </Button>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField 
                    select 
                    fullWidth 
                    label="Property Type" 
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: { maxHeight: 300 }
                        }
                      }
                    }}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="Apartment">Apartment</MenuItem>
                    <MenuItem value="House">House</MenuItem>
                    <MenuItem value="Villa">Villa</MenuItem>
                    <MenuItem value="Studio">Studio</MenuItem>
                    <MenuItem value="Commercial">Commercial</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField 
                    select 
                    fullWidth 
                    label="Bedrooms" 
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: { maxHeight: 300 }
                        }
                      }
                    }}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="1">1+</MenuItem>
                    <MenuItem value="2">2+</MenuItem>
                    <MenuItem value="3">3+</MenuItem>
                    <MenuItem value="4">4+</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField 
                    select 
                    fullWidth 
                    label="Bathrooms" 
                    value={filters.bathrooms}
                    onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: { maxHeight: 300 }
                        }
                      }
                    }}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="1">1+</MenuItem>
                    <MenuItem value="2">2+</MenuItem>
                    <MenuItem value="3">3+</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField 
                    select 
                    fullWidth 
                    label="Price Range" 
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: { maxHeight: 300 }
                        }
                      }
                    }}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="0-1000">₹0 - ₹1,000</MenuItem>
                    <MenuItem value="1000-2000">₹1,000 - ₹2,000</MenuItem>
                    <MenuItem value="2000-3000">₹2,000 - ₹3,000</MenuItem>
                    <MenuItem value="3000-5000">₹3,000 - ₹5,000</MenuItem>
                    <MenuItem value="5000-10000">₹5,000 - ₹10,000</MenuItem>
                    <MenuItem value="10000-999999">₹10,000+</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>

        {/* Loading and Error States */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Property Listings */}
        {!loading && !error && (
          <Grid container spacing={3} sx={{ width: '100%', margin: 0 }}>
            {sortedProperties.map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property._id}>
                <PropertyCard>
                  <Box sx={{ position: 'relative' }}>
                    <FavoriteButton 
                      onClick={() => toggleFavorite(property._id)}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 1)'
                        }
                      }}
                    >
                      {favorites.includes(property._id) ? (
                        <Favorite color="error" />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </FavoriteButton>
                    {property.images.length > 0 ? (
                      <Carousel
                        animation="slide"
                        autoPlay={true}
                        interval={6000}
                        indicators={property.images.length > 1}
                        navButtonsAlwaysInvisible={property.images.length <= 1}
                        sx={{
                          height: 250,
                          '& .MuiPaper-root': {
                            borderRadius: 0,
                          }
                        }}
                      >
                        {property.images.map((image, i) => (
                          <Box
                            key={i}
                            component="img"
                            src={image || 'https://via.placeholder.com/400x300?text=No+Image'}
                            alt={`${property.title} - Image ${i + 1}`}
                            sx={{
                              height: 250,
                              width: '100%',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                          />
                        ))}
                      </Carousel>
                    ) : (
                      <Box
                        component="img"
                        src="https://via.placeholder.com/400x300?text=No+Image"
                        alt={property.title}
                        sx={{
                          height: 250,
                          width: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                    )}
                    <PriceTag>₹{property.price.toLocaleString()}/mo</PriceTag>
                  </Box>

                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Stack 
                        direction="row" 
                        justifyContent="space-between" 
                        alignItems="flex-start" 
                        spacing={1}
                        sx={{ mb: 1 }}
                      >
                        <Typography 
                          variant="h6" 
                          component="h3" 
                          sx={{ 
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {property.title}
                        </Typography>
                        <Chip 
                          label={property.propertyType}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ 
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}
                        />
                      </Stack>

                      <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={0.5}
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.875rem'
                        }}
                      >
                        <LocationOn fontSize="small" color="primary" />
                        <Typography 
                          variant="body2" 
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {property.address ? 
                            `${property.address.street}, ${property.address.city}, ${property.address.state}` 
                            : property.location}
                        </Typography>
                      </Stack>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={4}>
                        <Stack 
                          direction="column" 
                          alignItems="center" 
                          spacing={0.5}
                          sx={{ textAlign: 'center' }}
                        >
                          <KingBed color="primary" />
                          <Typography variant="body2" fontWeight={600}>
                            {property.bedrooms} {property.bedrooms > 1 ? 'Beds' : 'Bed'}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={4}>
                        <Stack 
                          direction="column" 
                          alignItems="center" 
                          spacing={0.5}
                          sx={{ textAlign: 'center' }}
                        >
                          <Bathtub color="primary" />
                          <Typography variant="body2" fontWeight={600}>
                            {property.bathrooms} {property.bathrooms > 1 ? 'Baths' : 'Bath'}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={4}>
                        <Stack 
                          direction="column" 
                          alignItems="center" 
                          spacing={0.5}
                          sx={{ textAlign: 'center' }}
                        >
                          <SquareFoot color="primary" />
                          <Typography variant="body2" fontWeight={600}>
                            {property.landArea?.value || 'N/A'} {property.landArea?.unit || 'sqft'}
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>

                    {property.amenities && property.amenities.length > 0 && (
                      <Box sx={{ mb: 2, flex: 1 }}>
                        <Stack 
                          direction="row" 
                          spacing={1} 
                          flexWrap="wrap" 
                          useFlexGap 
                          sx={{ gap: 1 }}
                        >
                          {property.amenities.slice(0, 3).map((amenity, index) => (
                            <Chip
                              key={index}
                              label={amenity}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                borderRadius: '8px',
                                fontSize: '0.75rem'
                              }}
                            />
                          ))}
                          {property.amenities.length > 3 && (
                            <Chip
                              label={`+${property.amenities.length - 3} more`}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                borderRadius: '8px',
                                fontSize: '0.75rem'
                              }}
                            />
                          )}
                        </Stack>
                      </Box>
                    )}

                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ 
                        mt: 'auto',
                        py: 1.5, 
                        borderRadius: '8px', 
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem'
                      }}
                      onClick={() => window.location.href = `/property/${property._id}`}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </PropertyCard>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {!loading && !error && sortedProperties.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={Math.ceil(sortedProperties.length / 9)}
              color="primary"
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: '8px',
                  fontWeight: 600
                }
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PropertyListingPage;