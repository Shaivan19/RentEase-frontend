import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  IconButton
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  AccessTime,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Send,
  Close
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { contactConfig } from "../../config/contact";
import { sendContactForm } from "../../services/contactService";
import { loadGoogleMapsAPI } from "../../utils/googleMaps";
import { motion } from "framer-motion";

// Form validation schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  subject: yup.string().required('Subject is required').min(5, 'Subject must be at least 5 characters'),
  message: yup.string().required('Message is required').min(10, 'Message must be at least 10 characters'),
});

const ContactUs = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [mapError, setMapError] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

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

        const markerPosition = { lat: 10.0531754, lng: 73.7031263 };
        const newMarker = new maps.Marker({
          position: markerPosition,
          map: newMap,
          title: 'RentEase Office',
          optimized: true
        });
        setMarker(newMarker);

        const infoWindow = new maps.InfoWindow({
          content: `
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 5px 0;">RentEase Office</h3>
              <p style="margin: 0;">Anupam Society-1</p>
              <p style="margin: 0;">Near Rathi Hospital, Ahmedabad</p>
            </div>
          `
        });

        newMarker.addListener('click', () => {
          infoWindow.open(newMap, newMarker);
        });

        return () => {
          if (newMarker) {
            newMarker.setMap(null);
          }
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
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await sendContactForm(data);
      setSnackbar({
        open: true,
        message: 'Message sent successfully! We\'ll get back to you soon.',
        severity: 'success'
      });
      reset();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        pt: { xs: 8, sm: 10 },
        pb: 8,
        backgroundColor: theme.palette.background.default,
        width: '100vw',
        left: 0,
        right: 0,
        position: 'relative',
        minHeight: '100vh'
      }}
    >
      <Container 
        maxWidth={false} 
        disableGutters
        sx={{ 
          px: { xs: 2, sm: 4, md: 6, lg: 8 },
          width: '100%',
          margin: 0,
          maxWidth: '100% !important'
        }}
      >
        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', width: '100%' }}>
              <Typography variant="h4" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Have questions? We're here to help. Send us a message and we'll respond as soon as possible.
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Address"
                    secondary="123 Business Street, New Delhi, India"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Phone" 
                    secondary="+91 123 456 7890"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary="contact@rentease.com"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Working Hours"
                    secondary="Mon - Fri: 9:00 AM - 6:00 PM"
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 3 }} />

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconButton color="primary">
                    <Facebook />
                  </IconButton>
                  <IconButton color="primary">
                    <Twitter />
                  </IconButton>
                  <IconButton color="primary">
                    <Instagram />
                  </IconButton>
                  <IconButton color="primary">
                    <LinkedIn />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          {/* Contact Form and Map */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {/* Contact Form */}
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
                  <Typography variant="h5" gutterBottom>
                    Send us a Message
              </Typography>
                  <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                          label="Name"
                          {...register('name')}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  </Grid>
                      <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                          label="Email"
                          {...register('email')}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                          {...register('subject')}
                      error={!!errors.subject}
                      helperText={errors.subject?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      multiline
                      rows={4}
                          {...register('message')}
                      error={!!errors.message}
                      helperText={errors.message?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={loading}
                        >
                          {loading ? <CircularProgress size={24} /> : 'Send Message'}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Grid>

              {/* Google Map */}
              <Grid item xs={12}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  sx={{
                    height: "400px",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    width: '100%'
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
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactUs;
