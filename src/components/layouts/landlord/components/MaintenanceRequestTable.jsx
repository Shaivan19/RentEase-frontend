import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  IconButton,
  Grid,
  Card,
  CardMedia,
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Close, ZoomIn } from '@mui/icons-material';

const LandlordMaintenanceRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  const fetchMaintenanceRequests = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get('/maintenance/landlord', {
        headers: { 
          Authorization: `Bearer ${userData.token}`
        }
      });

      console.log('Maintenance requests response:', response.data); // Debug log

      if (response.data.success) {
        setRequests(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch maintenance requests');
      }
    } catch (err) {
      console.error('Error fetching maintenance requests:', err);
      setError(err.response?.data?.message || 'Failed to fetch maintenance requests');
      if (err.response?.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.token) {
        throw new Error('Authentication required');
      }

      const response = await axios.put(
        `/maintenance/${selectedRequest._id}/status`,
        { status, comment },
        { 
          headers: { 
            Authorization: `Bearer ${userData.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Status updated successfully');
        setOpenDialog(false);
        fetchMaintenanceRequests();
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(err.response?.data?.message || 'Failed to update status');
      if (err.response?.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
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
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Maintenance Requests
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell>Tenant</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request._id}>
                <TableCell>{request.propertyId?.name || request.propertyId?.title}</TableCell>
                <TableCell>{request.tenantId?.username}</TableCell>
                <TableCell>{request.title}</TableCell>
                <TableCell>
                  <Typography variant="body2" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {request.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {request.images && request.images.length > 0 ? (
                      <>
                        <Box
                          sx={{
                            position: 'relative',
                            width: '50px',
                            height: '50px',
                            cursor: 'pointer',
                            '&:hover': { opacity: 0.8 }
                          }}
                          onClick={() => {
                            setSelectedRequest(request);
                            setImageDialogOpen(true);
                          }}
                        >
                          <img
                            src={request.images[0].url}
                            alt="Maintenance"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }}
                          />
                          {request.images.length > 1 && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bgcolor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                px: 0.5,
                                borderRadius: '0 4px 0 4px',
                                fontSize: '0.75rem'
                              }}
                            >
                              +{request.images.length - 1}
                            </Box>
                          )}
                        </Box>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No images
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={request.priority}
                    color={request.priority === 'high' ? 'error' : request.priority === 'medium' ? 'warning' : 'success'}
                  />
                </TableCell>
                <TableCell>
                  <Chip label={request.status} color={getStatusColor(request.status)} />
                </TableCell>
                <TableCell>{format(new Date(request.createdAt), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => {
                      setSelectedRequest(request);
                      setStatus(request.status);
                      setOpenDialog(true);
                    }}
                  >
                    Update Status
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Maintenance Request Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Comment"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Maintenance Request Images
          <IconButton
            onClick={() => setImageDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedRequest && selectedRequest.images && (
            <Grid container spacing={2}>
              {selectedRequest.images.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      image={image.url}
                      alt={`Maintenance ${index + 1}`}
                      sx={{
                        height: 200,
                        objectFit: 'cover',
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.9 }
                      }}
                      onClick={() => window.open(image.url, '_blank')}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LandlordMaintenanceRequest; 