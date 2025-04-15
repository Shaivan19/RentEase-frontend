import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Alert
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

const PropertyCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
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
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,1)'
  }
}));

const PropertyListingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [favorites, setFavorites] = useState([]);
  const [sortOption, setSortOption] = useState('recent');
  const [filterOpen, setFilterOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    priceRange: ''
  });

  useEffect(() => {
    // Direct API call to fetch properties
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:1906/api/properties');
        const data = await response.json();
        
        if (response.ok) {
          setProperties(data.properties);
        } else {
          console.error('Error fetching properties:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
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
                         property.propertyType.toLowerCase().includes(searchQuery.toLowerCase());
    
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Find Your Perfect Property
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 3 }}>
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
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Filter Properties</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField 
                  select 
                  fullWidth 
                  label="Property Type" 
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Studio">Studio</option>
                  <option value="Commercial">Commercial</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField 
                  select 
                  fullWidth 
                  label="Bedrooms" 
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField 
                  select 
                  fullWidth 
                  label="Bathrooms" 
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField 
                  select 
                  fullWidth 
                  label="Price Range" 
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="0-1000">₹0 - ₹1,000</option>
                  <option value="1000-2000">₹1,000 - ₹2,000</option>
                  <option value="2000-3000">₹2,000 - ₹3,000</option>
                  <option value="3000-5000">₹3,000 - ₹5,000</option>
                  <option value="5000-10000">₹5,000 - ₹10,000</option>
                  <option value="10000-999999">₹10,000+</option>
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
        <Grid container spacing={3}>
          {sortedProperties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property._id}>
              <PropertyCard>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={property.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={property.title}
                  />
                  <PriceTag>₹{property.price.toLocaleString()}/mo</PriceTag>
                  <FavoriteButton onClick={() => toggleFavorite(property._id)}>
                    {favorites.includes(property._id) ? (
                      <Favorite color="error" />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </FavoriteButton>
                </Box>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
                      {property.title}
                    </Typography>
                    <Chip 
                      label={property.propertyType}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                    <LocationOn fontSize="small" color="primary" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    {property.address ? (
                      `${property.address.street || ''}, ${property.address.city || ''}, ${property.address.state || ''}`
                    ) : (
                      property.location || 'Location not specified'
                    )}
                  </Typography>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={4}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <KingBed fontSize="small" color="action" />
                        <Typography variant="body2">
                          {property.bedrooms} {property.bedrooms > 1 ? 'Beds' : 'Bed'}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Bathtub fontSize="small" color="action" />
                        <Typography variant="body2">
                          {property.bathrooms} {property.bathrooms > 1 ? 'Baths' : 'Bath'}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <SquareFoot fontSize="small" color="action" />
                        <Typography variant="body2">
                          {property.propertyType}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>

                  {property.amenities && property.amenities.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {property.amenities.slice(0, 3).map((amenity, index) => (
                          <Chip
                            key={index}
                            label={amenity}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {property.amenities.length > 3 && (
                          <Chip
                            label={`+${property.amenities.length - 3} more`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </Box>
                  )}
                  
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, py: 1.5, borderRadius: '8px', fontWeight: 600 }}
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
  );
};

export default PropertyListingPage; 