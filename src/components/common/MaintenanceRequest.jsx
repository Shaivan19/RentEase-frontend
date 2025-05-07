import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  IconButton,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Build,
  Description,
  PhotoCamera,
  PriorityHigh,
  CheckCircle,
  Schedule,
  Assignment,
  Close,
  Error as ErrorIcon,
  Edit,
  Delete,
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const maintenanceTypes = [
  'Plumbing',
  'Electrical',
  'HVAC',
  'Appliance',
  'Structural',
  'Pest Control',
  'Other',
];

const priorityLevels = [
  { label: 'low', color: 'success' },
  { label: 'medium', color: 'warning' },
  { label: 'high', color: 'error' },
  { label: 'emergency', color: 'error' },
];

const MaintenanceRequest = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [recentRequests, setRecentRequests] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    propertyId: location.state?.propertyId || '',
    title: '',
    description: '',
    priority: 'medium',
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!location.state?.propertyId) {
      toast.error('No property selected');
      navigate('/tenant/bookings');
      return;
    }
    // Log the property ID to debug
    console.log('Property ID from location state:', location.state.propertyId);
    fetchRecentRequests();
  }, [location.state?.propertyId]);

  const fetchRecentRequests = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.token) {
        throw new Error('User not logged in');
      }

      // Extract the token from the stored user data
      const token = userData.token;
      
      // Get the property ID from location state and ensure it's a string
      const propertyId = typeof location.state?.propertyId === 'object' 
        ? location.state.propertyId._id || location.state.propertyId.id
        : location.state?.propertyId;

      if (!propertyId) {
        console.error('No valid property ID found in location state');
        toast.error('Invalid property ID');
        return;
      }

      console.log('Making request with property ID:', propertyId);

      // Use the correct endpoint for getting property maintenance requests
      const response = await axios.get(`/maintenance/property/${propertyId}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });

      // Add detailed debug logging
      console.log('Full maintenance requests response:', response.data);
      console.log('First request property details:', response.data.data?.[0]?.propertyId);

      if (response.data.success && response.data.data) {
        // The property details should now be properly populated from the backend
        setRecentRequests(response.data.data);
      } else {
        setRecentRequests([]);
      }
    } catch (error) {
      console.error('Error fetching recent requests:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('user');
        navigate('/login');
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Error fetching recent requests');
      }
      setRecentRequests([]);
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (!formData.title) {
          setError('Please select an issue type');
          return false;
        }
        break;
      case 1:
        if (!formData.description) {
          setError('Please provide a description');
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + formData.images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    setFormData({ ...formData, images: [...formData.images, ...files] });
    
    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...previewUrls]);
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const formDataToSend = new FormData();
    
    // Get the property ID from location state and ensure it's a string
    const propertyId = typeof location.state?.propertyId === 'object' 
      ? location.state.propertyId._id || location.state.propertyId.id
      : location.state?.propertyId;

    if (!propertyId) {
      toast.error('Property ID is required');
      setLoading(false);
      return;
    }
    
    // Append each field individually
    formDataToSend.append('propertyId', propertyId);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('priority', formData.priority);

    // Append images
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((image) => {
        formDataToSend.append('images', image);
      });
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.token) {
        toast.error('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      console.log('Sending request with token:', userData.token); // Debug log

      const response = await axios.post(
        '/maintenance/request',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Maintenance request submitted successfully!');
        setFormData({
          propertyId: location.state?.propertyId || '',
          title: '',
          description: '',
          priority: 'medium',
          images: [],
        });
        setPreviewImages([]);
        setActiveStep(0);
        fetchRecentRequests();
      } else {
        toast.error(response.data.message || 'Failed to submit maintenance request');
      }
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data); // Debug log
        toast.error(error.response.data.message || 'Failed to submit maintenance request');
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error('Error submitting maintenance request: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.title) {
      setError('Please select an issue type');
      return false;
    }
    if (!formData.description) {
      setError('Please provide a description');
      return false;
    }
    return true;
  };

  const handleEditRequest = (request) => {
    setSelectedRequest(request);
    setFormData({
      propertyId: request.propertyId._id,
      title: request.title,
      description: request.description,
      priority: request.priority,
      images: [],
    });
    setPreviewImages(request.images.map(img => img.url));
    setEditDialogOpen(true);
  };

  const handleDeleteRequest = (request) => {
    setSelectedRequest(request);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      const response = await axios.delete(
        `/maintenance/request/${selectedRequest._id}`,
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Maintenance request deleted successfully');
        fetchRecentRequests();
      } else {
        toast.error(response.data.message || 'Failed to delete maintenance request');
      }
    } catch (error) {
      console.error('Error deleting maintenance request:', error);
      toast.error(error.response?.data?.message || 'Error deleting maintenance request');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedRequest(null);
    }
  };

  const handleUpdateRequest = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('priority', formData.priority);

      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          formDataToSend.append('images', image);
        });
      }

      const response = await axios.put(
        `/maintenance/request/${selectedRequest._id}`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Maintenance request updated successfully');
        fetchRecentRequests();
        setEditDialogOpen(false);
        setSelectedRequest(null);
      } else {
        toast.error(response.data.message || 'Failed to update maintenance request');
      }
    } catch (error) {
      console.error('Error updating maintenance request:', error);
      toast.error(error.response?.data?.message || 'Error updating maintenance request');
    }
  };

  const steps = [
    {
      label: 'Issue Type',
      content: (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {maintenanceTypes.map((type) => (
              <Grid item xs={12} sm={6} md={4} key={type}>
                <Paper
                  elevation={formData.title === type ? 3 : 1}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: formData.title === type
                      ? `2px solid ${theme.palette.primary.main}`
                      : '2px solid transparent',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out',
                    },
                  }}
                  onClick={() => setFormData({ ...formData, title: type })}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Build color="primary" />
                    <Typography>{type}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ),
    },
    {
      label: 'Priority & Description',
      content: (
        <Box sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Box>
              <Typography gutterBottom>Priority Level</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {priorityLevels.map((level) => (
                  <Chip
                    key={level.label}
                    label={level.label.toUpperCase()}
                    color={level.color}
                    onClick={() => setFormData({ ...formData, priority: level.label })}
                    sx={{
                      cursor: 'pointer',
                      border: formData.priority === level.label
                        ? `2px solid ${theme.palette[level.color].main}`
                        : 'none',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.2s ease-in-out',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Please describe the issue in detail..."
              error={!formData.description && activeStep > 1}
              helperText={!formData.description && activeStep > 1 ? 'Description is required' : ''}
            />
          </Stack>
        </Box>
      ),
    },
    {
      label: 'Photos',
      content: (
        <Box sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Box>
              <Typography gutterBottom>Upload Photos (Max 5)</Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
                sx={{ mb: 2 }}
                disabled={formData.images.length >= 5}
              >
                Add Photos
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              <Grid container spacing={2}>
                {previewImages.map((preview, index) => (
                  <Grid item xs={6} sm={4} md={2.4} key={index}>
                    <Box sx={{ position: 'relative' }}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 0.5,
                          '&:hover': {
                            transform: 'scale(1.02)',
                            transition: 'transform 0.2s ease-in-out',
                          },
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: theme.shape.borderRadius,
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'white',
                            '&:hover': { bgcolor: 'white' },
                          }}
                          onClick={() => removeImage(index)}
                        >
                          <Close />
                        </IconButton>
                      </Paper>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Submit Maintenance Request
      </Typography>
      <Typography color="text.secondary" paragraph>
        {location.state?.propertyDetails?.title ? 
          `Maintenance request for: ${location.state.propertyDetails.title}` : 
          "Please provide details about the maintenance issue you're experiencing."}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                {step.content}
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                  >
                    {index === steps.length - 1 ? (loading ? 'Submitting...' : 'Submit') : 'Next'}
                  </Button>
                  {index > 0 && (
                    <Button onClick={handleBack} disabled={loading}>
                      Back
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Recent Requests */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Recent Requests
      </Typography>
      <Grid container spacing={3}>
        {recentRequests.map((request) => (
          <Grid item xs={12} key={request._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {request.title}
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Property Name: {request.propertyId?.title || request.propertyId?.name || location.state?.propertyDetails?.title || 'Unknown Property'}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Address: {request.propertyId?.address ? 
                          typeof request.propertyId.address === 'string' 
                            ? request.propertyId.address 
                            : `${request.propertyId.address.street || ''}, ${request.propertyId.address.city || ''}, ${request.propertyId.address.state || ''} ${request.propertyId.address.zipCode || ''}`
                          : 'Address not available'}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={`${request.priority.toUpperCase()} Priority`}
                        color={priorityLevels.find(p => p.label === request.priority)?.color || 'default'}
                        size="small"
                        icon={<PriorityHigh />}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Submitted on {new Date(request.createdAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Chip
                      label={request.status.toUpperCase()}
                      color={
                        request.status === 'completed' ? 'success' :
                        request.status === 'in_progress' ? 'warning' :
                        request.status === 'cancelled' ? 'error' : 'default'
                      }
                      icon={
                        request.status === 'completed' ? <CheckCircle /> :
                        request.status === 'in_progress' ? <Schedule /> :
                        <Assignment />
                      }
                    />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {request.description}
                </Typography>
                {request.images && request.images.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, overflowX: 'auto' }}>
                    {request.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`Maintenance ${index + 1}`}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: theme.shape.borderRadius,
                        }}
                      />
                    ))}
                  </Box>
                )}
                {request.status === 'pending' && (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEditRequest(request)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteRequest(request)}
                    >
                      Delete
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Success Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Submitted Successfully</DialogTitle>
        <DialogContent>
          <Typography>
            Your maintenance request has been submitted. We will review it and get back to you shortly.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message="Maintenance request submitted successfully"
      />

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Maintenance Request</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={handleFormChange}
                    name="priority"
                  >
                    {priorityLevels.map((level) => (
                      <MenuItem key={level.label} value={level.label}>
                        {level.label.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Upload Photos (Max 5)</Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                  sx={{ mb: 2 }}
                  disabled={formData.images.length >= 5}
                >
                  Add Photos
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                <Grid container spacing={2}>
                  {previewImages.map((preview, index) => (
                    <Grid item xs={6} sm={4} md={2.4} key={index}>
                      <Box sx={{ position: 'relative' }}>
                        <Paper
                          elevation={2}
                          sx={{
                            p: 0.5,
                            '&:hover': {
                              transform: 'scale(1.02)',
                              transition: 'transform 0.2s ease-in-out',
                            },
                          }}
                        >
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: theme.shape.borderRadius,
                            }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'white',
                              '&:hover': { bgcolor: 'white' },
                            }}
                            onClick={() => removeImage(index)}
                          >
                            <Close />
                          </IconButton>
                        </Paper>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateRequest}>Update</Button>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Maintenance Request</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this maintenance request?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmDelete}>Delete</Button>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MaintenanceRequest; 