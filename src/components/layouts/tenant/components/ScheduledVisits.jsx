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
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  LocationOn,
  Event,
  AccessTime,
  CheckCircle,
  Pending,
  Cancel,
  Delete,
  Edit,
  Add,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { toast } from 'react-toastify';

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === 'confirmed' ? theme.palette?.success?.light || '#4caf50' :
    status === 'pending' ? theme.palette?.warning?.light || '#ff9800' :
    status === 'cancelled' ? theme.palette?.error?.light || '#f44336' :
    theme.palette?.grey?.[300] || '#e0e0e0',
  color:
    status === 'confirmed' ? theme.palette?.success?.dark || '#1b5e20' :
    status === 'pending' ? theme.palette?.warning?.dark || '#e65100' :
    status === 'cancelled' ? theme.palette?.error?.dark || '#d32f2f' :
    theme.palette?.grey?.[700] || '#616161',
}));

const ScheduledVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openNewVisitDialog, setOpenNewVisitDialog] = useState(false);
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [visitDate, setVisitDate] = useState(null);
  const [visitTime, setVisitTime] = useState('');
  const [properties, setProperties] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [visitsResponse, propertiesResponse] = await Promise.all([
          axios.get('/allvisit'),
          axios.get('/properties')
        ]);
        setVisits(visitsResponse.data);
        setProperties(propertiesResponse.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleScheduleVisit = async () => {
    if (!user?.userId) {
      setError('Please log in to schedule a visit');
      return;
    }

    const formattedDate = visitDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const formattedTime = visitDate.toTimeString().split(' ')[0]; // HH:MM:SS

    try {
      const response = await axios.post('/visit/schedule', {
        property: selectedProperty,
        tenant: user.userId,
        message: message,
        visitDate: formattedDate,
        visitTime: formattedTime,
      });
      setVisits([...visits, response.data]);
      setOpenNewVisitDialog(false);
      setSelectedProperty('');
      setVisitDate(null);
      setMessage('');
      
      // Dispatch a custom event to notify the dashboard to update
      window.dispatchEvent(new Event('visitScheduled'));
      
      // Optionally show success message
      toast.success('Visit scheduled successfully!');
    } catch (err) {
      console.error('Error scheduling visit:', err);
      setError('Failed to schedule visit. Please try again.');
    }
  };

  const handleRescheduleVisit = async () => {
    try {
      const response = await axios.put(`/visit/reschedule/${selectedVisit._id}`, {
        date: visitDate,
      });
      setVisits(visits.map(visit => 
        visit._id === selectedVisit._id ? response.data : visit
      ));
      setOpenRescheduleDialog(false);
      setSelectedVisit(null);
      setVisitDate(null);
    } catch (err) {
      console.error('Error rescheduling visit:', err);
      setError('Failed to reschedule visit. Please try again.');
    }
  };

  const handleCancelVisit = async (visitId) => {
    try {
      await axios.delete(`/visit/cancel/${visitId}`);
      setVisits(visits.filter(visit => visit._id !== visitId));
    } catch (err) {
      console.error('Error cancelling visit:', err);
      setError('Failed to cancel visit. Please try again.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Pending color="warning" />;
      case 'cancelled':
        return <Cancel color="error" />;
      default:
        return null;
    }
  };

  const openReschedule = (visit) => {
    setSelectedVisit(visit);
    setVisitDate(new Date(visit.date));
    setOpenRescheduleDialog(true);
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Scheduled Visits
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenNewVisitDialog(true)}
          >
            Schedule New Visit
          </Button>
        </Box>

        {visits.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No scheduled visits found
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
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visits.map((visit) => (
                  <TableRow key={visit._id}>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        {visit?.property?.images?.length > 0 ? (
                          <CardMedia
                            component="img"
                            sx={{ width: 60, height: 60, borderRadius: 1 }}
                            image={visit.property.images[0]}
                            alt={visit.property?.title || 'Property Image'}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: 1,
                              backgroundColor: 'grey.300',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              No Image
                            </Typography>
                          </Box>
                        )}
                        <Typography variant="body2">
                          {visit.property?.title || 'Unknown Property'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOn color="primary" fontSize="small" />
                        <Typography variant="body2">
                          {visit.property?.location || 'Location not available'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Event color="primary" fontSize="small" />
                        <Typography variant="body2">
                          {new Date(visit.date).toLocaleDateString()}
                        </Typography>
                        <AccessTime color="primary" fontSize="small" />
                        <Typography variant="body2">
                          {new Date(visit.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <StatusChip
                        icon={getStatusIcon(visit.status)}
                        label={visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                        status={visit.status}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => openReschedule(visit)}
                          disabled={visit.status === 'cancelled'}
                        >
                          Reschedule
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleCancelVisit(visit._id)}
                          disabled={visit.status === 'cancelled'}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* New Visit Dialog */}
        <Dialog
          open={openNewVisitDialog}
          onClose={() => setOpenNewVisitDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Schedule New Visit</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Select Property</InputLabel>
                <Select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  label="Select Property"
                >
                  {properties.map((property) => (
                    <MenuItem key={property._id} value={property._id}>
                      {property.title} - {property.location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Select Date and Time"
                  value={visitDate}
                  onChange={(newValue) => setVisitDate(newValue)}
                  minDate={new Date()}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenNewVisitDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleScheduleVisit}
              disabled={!selectedProperty || !visitDate}
            >
              Schedule Visit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reschedule Dialog */}
        <Dialog
          open={openRescheduleDialog}
          onClose={() => {
            setOpenRescheduleDialog(false);
            setSelectedVisit(null);
            setVisitDate(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Reschedule Visit</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Property: {selectedVisit?.property?.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Date: {selectedVisit && new Date(selectedVisit.date).toLocaleString()}
                </Typography>
              </Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Select New Date and Time"
                  value={visitDate}
                  onChange={(newValue) => setVisitDate(newValue)}
                  minDate={new Date()}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setOpenRescheduleDialog(false);
                setSelectedVisit(null);
                setVisitDate(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleRescheduleVisit}
              disabled={!visitDate}
            >
              Reschedule Visit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ScheduledVisits;