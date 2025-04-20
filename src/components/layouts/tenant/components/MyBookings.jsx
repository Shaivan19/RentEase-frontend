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
  Button,
  Stack,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  LocationOn,
  Event,
  Payment,
  CheckCircle,
  Pending,
  Cancel,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DEFAULT_PROPERTY_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNhYWEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

const StatusChip = styled(Chip)(({ theme, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return {
          backgroundColor: theme?.palette?.success?.light || '#81c784',
          color: theme?.palette?.success?.dark || '#2e7d32'
        };
      case 'pending':
        return {
          backgroundColor: theme?.palette?.warning?.light || '#ffb74d',
          color: theme?.palette?.warning?.dark || '#f57c00'
        };
      case 'cancelled':
        return {
          backgroundColor: theme?.palette?.error?.light || '#e57373',
          color: theme?.palette?.error?.dark || '#d32f2f'
        };
      default:
        return {
          backgroundColor: theme?.palette?.grey?.[300] || '#e0e0e0',
          color: theme?.palette?.grey?.[700] || '#616161'
        };
    }
  };

  const colors = getStatusColor(status);
  return {
    backgroundColor: colors.backgroundColor,
    color: colors.color,
    fontWeight: 500,
    '& .MuiChip-label': {
      padding: '0 8px'
    }
  };
});

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [leaseDialogOpen, setLeaseDialogOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.token) {
        throw new Error('User not logged in');
      }

      const response = await axios.get('/bookings/tenant', {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });

      if (response.data.success) {
        setBookings(response.data.bookings);
      } else {
        throw new Error(response.data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.message);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Pending color="warning" />;
      case 'cancelled':
        return <Cancel color="error" />;
      default:
        return null;
    }
  };

  const handleViewLease = (booking) => {
    setSelectedBooking(booking);
    setLeaseDialogOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
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
          My Bookings
        </Typography>

        {bookings.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No bookings found
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
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <CardMedia
                          component="img"
                          sx={{ width: 60, height: 60, borderRadius: 1 }}
                          image={booking.property?.images?.[0] || DEFAULT_PROPERTY_IMAGE}
                          alt={booking.property?.title || 'Property Image'}
                        />
                        <Typography variant="body2">
                          {booking.property?.title || 'Property Not Available'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOn color="primary" fontSize="small" />
                        <Typography variant="body2">
                          {booking.property?.location || 'Location Not Available'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Event color="primary" fontSize="small" />
                        <Typography variant="body2">
                          {formatDate(booking.leaseTerms.startDate)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Event color="primary" fontSize="small" />
                        <Typography variant="body2">
                          {formatDate(booking.leaseTerms.endDate)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Payment color="primary" fontSize="small" />
                        <Typography variant="body2">
                          ₹{(booking.leaseTerms.rentAmount || 0).toLocaleString('en-IN')}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <StatusChip
                        icon={getStatusIcon(booking.status)}
                        label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        status={booking.status}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewLease(booking)}
                        >
                          View Lease
                        </Button>
                        {booking.status === 'pending_payment' && (
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() => handlePayment(booking)}
                          >
                            Pay Now
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Lease Dialog */}
        <Dialog
          open={leaseDialogOpen}
          onClose={() => setLeaseDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Lease Agreement</DialogTitle>
          <DialogContent>
            {selectedBooking?.leaseDraft && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1">Property Details</Typography>
                  <Typography>Address: {selectedBooking.leaseDraft.propertyDetails.address}</Typography>
                  <Typography>Rent Amount: ₹{selectedBooking.leaseDraft.propertyDetails.rentAmount}/month</Typography>
                  <Typography>Security Deposit: ₹{selectedBooking.leaseDraft.propertyDetails.securityDeposit}</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1">Lease Terms</Typography>
                  <Typography>Start Date: {new Date(selectedBooking.leaseDraft.leaseTerms.startDate).toLocaleDateString()}</Typography>
                  <Typography>End Date: {new Date(selectedBooking.leaseDraft.leaseTerms.endDate).toLocaleDateString()}</Typography>
                  <Typography>Duration: {selectedBooking.leaseDraft.leaseTerms.duration}</Typography>
                  <Typography>Rent Due Date: {selectedBooking.leaseDraft.leaseTerms.rentDueDate}</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1">Additional Terms</Typography>
                  {selectedBooking.leaseDraft.additionalTerms.map((term, index) => (
                    <Typography key={index}>• {term}</Typography>
                  ))}
                </Box>
                {selectedBooking.paymentDetails && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1">Payment Details</Typography>
                    <Typography>Amount: ₹{selectedBooking.paymentDetails.amount}</Typography>
                    <Typography>Date: {new Date(selectedBooking.paymentDetails.date).toLocaleDateString()}</Typography>
                    <Typography>Transaction ID: {selectedBooking.paymentDetails.paymentId}</Typography>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLeaseDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyBookings; 