import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Button
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  Bed,
  Bathtub,
  SquareFoot,
  Visibility
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isLoggedIn } from '../../utils/auth';

const PropertyCard = ({ property }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleViewDetails = (e) => {
    e.stopPropagation(); // Prevent card click event
    if (!isLoggedIn()) {
      setSnackbar({
        open: true,
        message: 'Please login to view property details',
        severity: 'warning'
      });
      navigate('/login');
      return;
    }
    navigate(`/property/${property._id}`);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Card
        component={motion.div}
        whileHover={{ y: -5 }}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          '&:hover': {
            boxShadow: 6
          }
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={property.images[0]}
          alt={property.title}
          sx={{ objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1
          }}
        >
          <Chip
            label={property.status}
            color={property.status === 'Available' ? 'success' : 'error'}
            size="small"
            sx={{ 
              backdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)'
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            {property.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {property.location}
            </Typography>
          </Box>
          <Typography variant="h6" color="primary" gutterBottom>
            ₹{property.price.toLocaleString()}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Bed sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {property.bedrooms} Beds
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Bathtub sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {property.bathrooms} Baths
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SquareFoot sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {property.area} sq ft
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {property.type}
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleViewDetails}
              sx={{
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white'
                }
              }}
            >
              <Visibility sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

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
    </>
  );
};

export default PropertyCard; 