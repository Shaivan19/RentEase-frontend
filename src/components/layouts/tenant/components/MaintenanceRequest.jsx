// import { useState } from "react";
// import {
//     Box,
//     Container,
//     Grid,
//     Typography,
//     Button,
//     TextField,
//     Paper,
//     Stepper,
//     Step,
//     StepLabel,
//     StepContent,
//     Card,
//     CardContent,
//     IconButton,
//     Chip,
//     Stack,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     useTheme,
//     useMediaQuery,
//   } from '@mui/material';
//   import {
//     Build,
//     Description,
//     PhotoCamera,
//     PriorityHigh,
//     CheckCircle,
//     Schedule,
//     Assignment,
//     Close,
//   } from '@mui/icons-material';

//   const maintenanceTypes = [
//     'Plumbing',
//     'Electrical',
//     'HVAC',
//     'Appliance',
//     'Structural',
//     'Pest Control',
//     'Other',
//   ];

//   const priorityLevels = [
//     { label: 'Low', color: 'success' },
//     { label: 'Medium', color: 'warning' },
//     { label: 'High', color: 'error' },
//   ];

// const MaintenanceRequest = () => {
// //     const theme = useTheme();
// //   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
// //   const [activeStep, setActiveStep] = useState(0);
//     const [formData, setFormData] = useState({
//         title: "",
//         description: "",
//         priority:"medium",
//         images: [],
//     });

//     const handleSubmit = async(e) => {
//         e.preventDefault();
//         try{
//             const token = localStorage.getItem("token");
//             const formDataToSend = new FormData();

//             Object.keys(formData).forEach((key) => {
//                 if (key === "images") {
//                     formData.images.forEach((image) => {
//                         formDataToSend.append("images", image);
//                     });
//                 } else {
//                     formDataToSend.append(key, formData[key]);
//                 }
//             });
//             const response = await fetch("/maintenance/request",{
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: formDataToSend,
//             });

//             const data = await response.json();
//             if(response.ok){
//                 console.log("Maintenance request submitted successfully", data);
//                 setFormData({
//                     title: "",
//                     description: "",
//                     priority:"medium",
//                     images: [],
//                 });
//             }else{
//                  alert(data.message);
//             }
//         }catch (error){
//         console.error("Error submitting maintenance request", error);
//         alert("An error occurred while submitting the request. Please try again later.");
//         }
//     }
// };

// //----------------------------------------------------//


// export default MaintenanceRequest;

import React, { useState } from 'react';
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
} from '@mui/icons-material';

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
  { label: 'Low', color: 'success' },
  { label: 'Medium', color: 'warning' },
  { label: 'High', color: 'error' },
];

const MaintenanceRequest = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    images: [],
    preferredDate: '',
    preferredTime: '',
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
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
    setFormData({ ...formData, images: files });
    
    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previewUrls);
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData.images.forEach(image => {
            formDataToSend.append('images', image);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch('http://localhost:1906/api/maintenance/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        alert('Maintenance request submitted successfully!');
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          images: [],
          preferredDate: '',
          preferredTime: '',
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      alert('Error submitting request. Please try again.');
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
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: formData.title === type
                      ? `2px solid ${theme.palette.primary.main}`
                      : '2px solid transparent',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
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
              <Stack direction="row" spacing={1}>
                {priorityLevels.map((level) => (
                  <Chip
                    key={level.label}
                    label={level.label}
                    color={level.color}
                    onClick={() => setFormData({ ...formData, priority: level.label })}
                    sx={{
                      cursor: 'pointer',
                      border: formData.priority === level.label
                        ? `2px solid ${theme.palette[level.color].main}`
                        : 'none',
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
            />
          </Stack>
        </Box>
      ),
    },
    {
      label: 'Photos & Schedule',
      content: (
        <Box sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Box>
              <Typography gutterBottom>Upload Photos</Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
                sx={{ mb: 2 }}
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
                  <Grid item xs={4} key={index}>
                    <Box sx={{ position: 'relative' }}>
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
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Preferred Date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleFormChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Preferred Time"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleFormChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
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
        Please provide details about the maintenance issue you're experiencing.
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                {step.content}
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                  >
                    {index === steps.length - 1 ? 'Submit' : 'Next'}
                  </Button>
                  {index > 0 && (
                    <Button onClick={handleBack}>
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
        {[1, 2, 3].map((request) => (
          <Grid item xs={12} key={request}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Plumbing Issue
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label="High Priority"
                        color="error"
                        size="small"
                        icon={<PriorityHigh />}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Submitted on March 25, 2024
                      </Typography>
                    </Stack>
                  </Box>
                  <Chip
                    label="In Progress"
                    color="warning"
                    icon={<Schedule />}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Water leakage in the kitchen sink. Need immediate attention.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Assignment />}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CheckCircle />}
                  >
                    Mark as Complete
                  </Button>
                </Box>
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
    </Container>
  );
};

export default MaintenanceRequest; 