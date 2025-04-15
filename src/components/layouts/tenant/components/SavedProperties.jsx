import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Stack,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  LocationOn,
  KingBed,
  Bathtub,
  SquareFoot,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

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
  }
}));

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

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

  const fetchSavedProperties = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.get('/property/saved', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setSavedProperties(response.data.properties);
      setError(null);
    } catch (err) {
      console.error('Error fetching saved properties:', err);
      setError('Failed to load saved properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchSavedProperties();

    // Add event listener for saved properties updates
    const handleSavedPropertiesUpdate = () => {
      fetchSavedProperties();
    };

    window.addEventListener('savedPropertiesUpdated', handleSavedPropertiesUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('savedPropertiesUpdated', handleSavedPropertiesUpdate);
    };
  }, [navigate]);

  const handleRemoveFavorite = async (propertyId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.delete(`/property/unsave/${propertyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setSavedProperties(savedProperties.filter(property => property.id !== propertyId));
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('savedPropertiesUpdated'));
    } catch (err) {
      console.error('Error removing property from favorites:', err);
      setError('Failed to remove property from favorites. Please try again.');
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

  return (
    <Box sx={{ pt: 8, pb: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Saved Properties
        </Typography>

        {savedProperties.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No saved properties yet
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/properties')}
              sx={{ mt: 2 }}
            >
              Browse Properties
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {savedProperties.map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property.id}>
                <PropertyCard>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={property.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={property.title}
                    />
                    <IconButton
                      onClick={() => handleRemoveFavorite(property.id)}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,1)'
                        }
                      }}
                    >
                      <FavoriteIcon color="error" />
                    </IconButton>
                  </Box>
                  <CardContent>
                    <Stack spacing={1}>
                      <Typography variant="h6" component="h2" noWrap>
                        {property.title}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOn color="primary" fontSize="small" />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {typeof property.address === 'object'
                            ? `${property.address.street}, ${property.address.city}`
                            : property.address}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <KingBed color="primary" fontSize="small" />
                          <Typography variant="body2">
                            {property.bedrooms} {property.bedrooms > 1 ? 'Beds' : 'Bed'}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Bathtub color="primary" fontSize="small" />
                          <Typography variant="body2">
                            {property.bathrooms} {property.bathrooms > 1 ? 'Baths' : 'Bath'}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <SquareFoot color="primary" fontSize="small" />
                          <Typography variant="body2">
                            {property.area} sqft
                          </Typography>
                        </Stack>
                      </Stack>
                      <Divider sx={{ my: 1 }} />
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" color="primary">
                          ₹{property.price.toLocaleString()}/month
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/property/${property.id}`)}
                        >
                          View Details
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </PropertyCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default SavedProperties; 