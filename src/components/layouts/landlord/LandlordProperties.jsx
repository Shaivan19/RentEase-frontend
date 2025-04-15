import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  Paper,
  Fade,
  Fab,
  FormControl,
  InputLabel,
  Select,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  FormLabel
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  MoreVert,
  LocationOn,
  KingBed,
  Bathtub,
  SquareFoot,
  Star,
  Close,
  Add as AddIcon,
  FilterList
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';

const PropertyCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
  }
}));

const PriceTag = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: theme.spacing(0.75, 2),
  borderRadius: '24px',
  fontWeight: 700,
  fontSize: '1.1rem',
  zIndex: 1,
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  zIndex: 1000
}));

const SearchBar = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  marginBottom: theme.spacing(3)
}));

const LandlordProperties = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: '',
    priceRange: [0, 100000],
    bedrooms: '',
    bathrooms: '',
    amenities: []
  });

  // Fetch landlord's properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.userId) {
          setError('User not found. Please log in again.');
          return;
        }
        const response = await axios.get(`/properties/landlord/${user.userId}`);
        setProperties(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err.response?.data?.error || 'Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setFilterDialogOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      propertyType: '',
      priceRange: [0, 100000],
      bedrooms: '',
      bathrooms: '',
      amenities: []
    });
  };

  // Filter properties based on search and filters
  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.propertyType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPropertyType = !filters.propertyType || property.propertyType === filters.propertyType;
    const matchesPrice = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];
    const matchesBedrooms = !filters.bedrooms || property.bedrooms === parseInt(filters.bedrooms);
    const matchesBathrooms = !filters.bathrooms || property.bathrooms === parseInt(filters.bathrooms);
    const matchesAmenities = filters.amenities.length === 0 || 
      filters.amenities.every(amenity => property.amenities.includes(amenity));

    return matchesSearch && matchesPropertyType && matchesPrice && 
           matchesBedrooms && matchesBathrooms && matchesAmenities;
  });

  // Handle property deletion
  const handleDeleteClick = (property) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/properties/${propertyToDelete._id}`);
      setProperties(properties.filter(p => p._id !== propertyToDelete._id));
      toast.success('Property deleted successfully');
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting property:', err);
      toast.error('Failed to delete property');
    }
  };

  // Handle menu actions
  const handleMenuClick = (event, property) => {
    setAnchorEl(event.currentTarget);
    setSelectedProperty(property);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProperty(null);
  };

  const handleEdit = () => {
    if (selectedProperty) {
      navigate(`/landlord/edit-property/${selectedProperty._id}`);
      handleMenuClose();
    }
  };

  // Update the FAB click handler
  const handleAddProperty = () => {
    navigate('/landlord/addnewproperty');
  };

  return (
    <Box 
      sx={{ 
        width: '100%',
        minHeight: '100vh',
        pt: { xs: '60px', sm: '70px' },
        backgroundColor: theme.palette.background.default
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              backgroundClip: 'text',
              textFillColor: 'transparent'
            }}
          >
            My Properties
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Manage and update your property listings
          </Typography>
          
          {/* Search Bar */}
          <SearchBar>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField
                fullWidth
                placeholder="Search properties..."
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
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilterDialogOpen(true)}
                sx={{ 
                  borderRadius: '12px',
                  textTransform: 'none',
                  px: 3
                }}
              >
                Filters
              </Button>
            </Stack>
          </SearchBar>
        </Box>

        {/* Loading and Error States */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        {/* Property Listings */}
        {!loading && !error && (
          <Grid container spacing={3}>
            {filteredProperties.map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property._id}>
                <Fade in timeout={500}>
                  <PropertyCard>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="240"
                        image={property.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={property.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <PriceTag>₹{property.price.toLocaleString()}/mo</PriceTag>
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                        }}
                        onClick={(e) => handleMenuClick(e, property)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                          {property.title}
                        </Typography>
                        <Chip 
                          label={property.propertyType}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ borderRadius: '12px' }}
                        />
                      </Stack>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mt: 1, 
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <LocationOn fontSize="small" color="primary" />
                        {property.address ? `${property.address.street}, ${property.address.city}, ${property.address.state}` : property.location}
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Grid container spacing={2} sx={{ mt: 1 }}>
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
                                sx={{ borderRadius: '12px' }}
                              />
                            ))}
                            {property.amenities.length > 3 && (
                              <Chip
                                label={`+${property.amenities.length - 3} more`}
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: '12px' }}
                              />
                            )}
                          </Stack>
                        </Box>
                      )}
                    </CardContent>
                  </PropertyCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add Property FAB */}
        <StyledFab 
          color="primary" 
          aria-label="add property"
          onClick={handleAddProperty}
        >
          <AddIcon />
        </StyledFab>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: { 
              borderRadius: '16px',
              maxWidth: '400px',
              width: '100%'
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Delete Property</Typography>
              <IconButton onClick={() => setDeleteDialogOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this property? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ borderRadius: '12px' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error"
              variant="contained"
              sx={{ borderRadius: '12px' }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Property Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { 
              borderRadius: '12px',
              minWidth: 200
            }
          }}
        >
          <MenuItem onClick={handleEdit}>
            <Edit sx={{ mr: 1 }} /> Edit Property
          </MenuItem>
          <MenuItem onClick={() => {
            handleDeleteClick(selectedProperty);
            handleMenuClose();
          }}>
            <Delete sx={{ mr: 1 }} /> Delete Property
          </MenuItem>
        </Menu>

        {/* Filter Dialog */}
        <Dialog
          open={filterDialogOpen}
          onClose={() => setFilterDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { 
              borderRadius: '16px',
              maxWidth: '500px'
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Filter Properties</Typography>
              <IconButton onClick={() => setFilterDialogOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {/* Property Type Filter */}
              <FormControl fullWidth>
                <InputLabel>Property Type</InputLabel>
                <Select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  label="Property Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="Apartment">Apartment</MenuItem>
                  <MenuItem value="House">House</MenuItem>
                  <MenuItem value="Villa">Villa</MenuItem>
                  <MenuItem value="Studio">Studio</MenuItem>
                </Select>
              </FormControl>

              {/* Price Range Filter */}
              <Box>
                <FormLabel>Price Range (₹)</FormLabel>
                <Slider
                  value={filters.priceRange}
                  onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100000}
                  step={1000}
                  marks={[
                    { value: 0, label: '₹0' },
                    { value: 50000, label: '₹50k' },
                    { value: 100000, label: '₹100k' }
                  ]}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2">₹{filters.priceRange[0].toLocaleString()}</Typography>
                  <Typography variant="body2">₹{filters.priceRange[1].toLocaleString()}</Typography>
                </Box>
              </Box>

              {/* Bedrooms and Bathrooms */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Bedrooms</InputLabel>
                    <Select
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                      label="Bedrooms"
                    >
                      <MenuItem value="">Any</MenuItem>
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="3">3+</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Bathrooms</InputLabel>
                    <Select
                      value={filters.bathrooms}
                      onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                      label="Bathrooms"
                    >
                      <MenuItem value="">Any</MenuItem>
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="3">3+</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Amenities Filter */}
              <Box>
                <FormLabel>Amenities</FormLabel>
                <FormGroup>
                  <Grid container spacing={2}>
                    {['Parking', 'Gym', 'Pool', 'Security', 'Elevator', 'AC'].map((amenity) => (
                      <Grid item xs={6} key={amenity}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={filters.amenities.includes(amenity)}
                              onChange={(e) => {
                                const newAmenities = e.target.checked
                                  ? [...filters.amenities, amenity]
                                  : filters.amenities.filter(a => a !== amenity);
                                handleFilterChange('amenities', newAmenities);
                              }}
                            />
                          }
                          label={amenity}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={resetFilters}
              sx={{ borderRadius: '12px' }}
            >
              Reset
            </Button>
            <Button 
              onClick={applyFilters}
              variant="contained"
              sx={{ borderRadius: '12px' }}
            >
              Apply Filters
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default LandlordProperties; 