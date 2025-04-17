import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
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
  ToggleButtonGroup,
  ToggleButton,
  Container,
  ThemeProvider,
  useTheme,
  createTheme,
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
  Menu as MenuIcon,
  Dashboard,
  TrendingUp,
  CalendarToday,
  CheckCircleOutline,
  CancelOutlined,
  PendingActions,
  Schedule,
  ViewList,
  Timeline,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { toast } from 'react-toastify';
import Carousel from 'react-material-ui-carousel';
import {
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#21CBF3',
    }
  }
});

const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor:
    status === 'confirmed' ? '#4caf50' :
    status === 'pending' ? '#ff9800' :
    status === 'cancelled' ? '#f44336' :
    '#e0e0e0',
  color:
    status === 'confirmed' ? '#1b5e20' :
    status === 'pending' ? '#e65100' :
    status === 'cancelled' ? '#d32f2f' :
    '#616161',
}));

const StatsCard = styled(Card)({
  height: '100%',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
  },
});

const VisitTimelineItem = styled(TimelineItem)(({ status }) => ({
  '& .MuiTimelineDot-root': {
    backgroundColor:
      status === 'confirmed' ? '#4caf50' :
      status === 'pending' ? '#ff9800' :
      status === 'cancelled' ? '#f44336' :
      '#9e9e9e',
  },
}));

const ScheduledVisits = ({ onSidebarToggle }) => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openNewVisitDialog, setOpenNewVisitDialog] = useState(false);
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [visitDate, setVisitDate] = useState(null);
  const [visitTime, setVisitTime] = useState('');
  const [properties, setProperties] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [message, setMessage] = useState('');
  const [cancelMessage, setCancelMessage] = useState('');
  const [visitToCancel, setVisitToCancel] = useState(null);
  const [visitToRemove, setVisitToRemove] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.token) {
          setError('Please login to view visits');
          return;
        }

        const [visitsResponse, propertiesResponse] = await Promise.all([
          axios.get('/allvisit', {
            headers: {
              Authorization: `Bearer ${userData.token}`
            }
          }),
          axios.get('/properties', {
            headers: {
              Authorization: `Bearer ${userData.token}`
            }
          })
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

    const formattedDate = visitDate.toISOString().split('T')[0];
    const hours = visitDate.getHours().toString().padStart(2, '0');
    const minutes = visitDate.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:00`;

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.token) {
        toast.error("Please login again");
        return;
      }

      const response = await axios.post('/visit-properties/schedule', {
        property: selectedProperty,
        tenant: user.userId,
        tenantName: user.username,
        message: message,
        visitDate: formattedDate,
        visitTime: formattedTime,
      }, {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });
      
      // Fetch updated visits list
      const updatedVisitsResponse = await axios.get('/allvisit', {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });
      setVisits(updatedVisitsResponse.data);
      
      setOpenNewVisitDialog(false);
      setSelectedProperty('');
      setVisitDate(null);
      setMessage('');
      
      toast.success('Visit scheduled successfully!');
    } catch (err) {
      console.error('Error scheduling visit:', err);
      toast.error(err.response?.data?.message || 'Failed to schedule visit. Please try again.');
    }
  };

  const handleRescheduleVisit = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.token) {
        toast.error("Please login again");
        return;
      }

      const formattedDate = visitDate.toISOString().split('T')[0];
      const hours = visitDate.getHours().toString().padStart(2, '0');
      const minutes = visitDate.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}:00`;

      const response = await axios.put(`/visit-properties/reschedule/${selectedVisit._id}`, {
        visitDate: formattedDate,
        visitTime: formattedTime,
        tenantName: user.username,
        userId: user.userId,
        propertyId: selectedVisit.property?._id,
        message: message || 'No reason provided'
      }, {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });
      
      // Fetch updated visits list
      const updatedVisitsResponse = await axios.get('/allvisit', {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });
      setVisits(updatedVisitsResponse.data);
      
      setOpenRescheduleDialog(false);
      setSelectedVisit(null);
      setVisitDate(null);
      toast.success('Visit rescheduled successfully!');
    } catch (err) {
      console.error('Error rescheduling visit:', err);
      toast.error(err.response?.data?.message || 'Failed to reschedule visit. Please try again.');
    }
  };

  const handleCancelVisit = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.token) {
        toast.error("Please login again");
        return;
      }

      await axios.delete(`/visit-properties/cancel/${visitToCancel._id}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        data: {
          cancellationReason: cancelMessage,
          tenantName: user.username,
          visitId: visitToCancel._id,
          propertyId: visitToCancel.property?._id,
          userId: user.userId
        }
      });
      
      // Fetch updated visits list
      const updatedVisitsResponse = await axios.get('/allvisit', {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });
      setVisits(updatedVisitsResponse.data);
      
      setOpenCancelDialog(false);
      setVisitToCancel(null);
      setCancelMessage('');
      toast.success('Visit cancelled successfully!');
    } catch (err) {
      console.error('Error cancelling visit:', err);
      toast.error(err.response?.data?.message || 'Failed to cancel visit. Please try again.');
    }
  };

  const handleRemoveVisit = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.token) {
        toast.error("Please login again");
        return;
      }

      await axios.delete(`/visit-properties/remove/${visitToRemove._id}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        data: {
          userId: userData.userId,
          tenantName: userData.username
        }
      });
      
      setVisits(visits.filter(visit => visit._id !== visitToRemove._id));
      setOpenRemoveDialog(false);
      setVisitToRemove(null);
      toast.success('Visit removed from list successfully');
    } catch (err) {
      console.error('Error removing visit:', err);
      toast.error(err.response?.data?.message || 'Failed to remove visit. Please try again.');
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

  // Calculate stats
  const getVisitStats = () => {
    const total = visits.length;
    const confirmed = visits.filter(v => v.status === 'confirmed').length;
    const pending = visits.filter(v => v.status === 'pending').length;
    const cancelled = visits.filter(v => v.status === 'cancelled').length;
    const upcomingVisits = visits.filter(v => 
      new Date(v.visitDate) > new Date() && v.status !== 'cancelled'
    ).length;

    return { total, confirmed, pending, cancelled, upcomingVisits };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'rejected':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      case 'rejected':
        return 'Rejected';
      case 'completed':
        return 'Completed';
      default:
        return status;
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
    <ThemeProvider theme={defaultTheme}>
      <Box 
        sx={{ 
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          p: { xs: 2, md: 3 },
          boxSizing: 'border-box'
        }}
      >
        {/* Header Section */}
        <Container maxWidth="xl" sx={{ mb: 4 }}>
          <Box 
            sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={onSidebarToggle}
                sx={{ display: { xs: 'flex', sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#0088ff' }}>
              Scheduled Visits
            </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenNewVisitDialog(true)}
                sx={{
                  backgroundColor: '#0088ff',
                  '&:hover': {
                    backgroundColor: '#0066cc'
                  }
                }}
            >
              Schedule New Visit
            </Button>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                size="small"
              >
                <ToggleButton value="table">
                  <ViewList />
                </ToggleButton>
                <ToggleButton value="timeline">
                  <Timeline />
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
            {Object.entries(getVisitStats()).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={2.4} key={key}>
                <StatsCard>
                  <Box sx={{ mb: 2 }}>
                    {key === 'total' ? <Dashboard sx={{ color: '#0088ff' }} /> :
                     key === 'confirmed' ? <CheckCircleOutline sx={{ color: '#4caf50' }} /> :
                     key === 'pending' ? <PendingActions sx={{ color: '#ff9800' }} /> :
                     key === 'cancelled' ? <CancelOutlined sx={{ color: '#f44336' }} /> :
                     <TrendingUp sx={{ color: '#0088ff' }} />}
                  </Box>
                  <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Typography>
                </StatsCard>
              </Grid>
            ))}
          </Grid>

          {/* Main Content */}
          <Box sx={{ width: '100%' }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            ) : visits.length === 0 ? (
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  borderRadius: 2,
                  backgroundColor: 'white',
                  width: '100%'
                }}
              >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No scheduled visits found
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/properties')}
                  sx={{ 
                    mt: 2,
                    backgroundColor: '#0088ff',
                    '&:hover': {
                      backgroundColor: '#0066cc'
                    }
                  }}
              >
                Browse Properties
              </Button>
              </Paper>
            ) : viewMode === 'table' ? (
              <Paper 
                elevation={0}
                sx={{ 
                  width: '100%',
                  overflow: 'hidden',
                  borderRadius: 2,
                  backgroundColor: 'white'
                }}
              >
                <TableContainer>
                  <Table sx={{ minWidth: '100%' }}>
                <TableHead>
                  <TableRow>
                        <TableCell width="45%">Property</TableCell>
                        <TableCell width="20%">Location</TableCell>
                        <TableCell width="15%">Date & Time</TableCell>
                        <TableCell width="10%">Status</TableCell>
                        <TableCell width="10%">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visits.map((visit) => (
                    <TableRow key={visit._id}>
                      <TableCell>
                            <Stack direction="row" spacing={3} alignItems="flex-start">
                              {(() => {
                                const propertyImages = [
                                  visit?.property?.propertyImages,
                                  visit?.property?.images,
                                  visit?.property?.imageUrls,
                                  visit?.property?.propertyImage
                                ].find(imgs => Array.isArray(imgs) && imgs.length > 0) || [];

                                const singleImage = !Array.isArray(propertyImages) ? propertyImages : null;

                                return propertyImages.length > 0 || singleImage ? (
                                  Array.isArray(propertyImages) && propertyImages.length > 0 ? (
                                    <Carousel
                                      animation="slide"
                                      autoPlay={true}
                                      interval={4000}
                                      indicators={propertyImages.length > 1}
                                      navButtonsAlwaysVisible={false}
                                      navButtonsAlwaysInvisible={true}
                                      cycleNavigation={true}
                                      sx={{
                                        width: 250,
                                        height: 180,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        boxShadow: 1,
                                        '& .MuiPaper-root': {
                                          borderRadius: 0,
                                        },
                                        '& .MuiIndicator-root': {
                                          color: 'white',
                                        }
                                      }}
                                    >
                                      {propertyImages.map((image, i) => (
                                        <Box
                                          key={i}
                                          component="img"
                                          src={image}
                                          alt={`${visit.property?.title || 'Property'} - Image ${i + 1}`}
                                          sx={{
                                            height: 180,
                                            width: '100%',
                                            objectFit: 'cover',
                                            display: 'block'
                                          }}
                                        />
                                      ))}
                                    </Carousel>
                                  ) : (
                            <CardMedia
                              component="img"
                                      sx={{ 
                                        width: 250, 
                                        height: 180, 
                                        borderRadius: 2,
                                        objectFit: 'cover',
                                        boxShadow: 1
                                      }}
                                      image={singleImage}
                              alt={visit.property?.title || 'Property Image'}
                            />
                                  )
                          ) : (
                            <Box
                              sx={{
                                      width: 250,
                                      height: 180,
                                      borderRadius: 2,
                                      backgroundColor: 'grey.200',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                      boxShadow: 1
                              }}
                            >
                              <Typography variant="caption" color="text.secondary">
                                No Image
                              </Typography>
                            </Box>
                                );
                              })()}
                              <Stack spacing={1.5} sx={{ py: 1 }}>
                                <Typography variant="body1" sx={{ 
                                  wordBreak: 'break-word',
                                  flexGrow: 1,
                                  fontWeight: 500
                                }}>
                            {visit.property?.title || 'Unknown Property'}
                          </Typography>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color="primary"
                                  onClick={() => navigate(`/property/${visit.property?._id}`)}
                                  sx={{ alignSelf: 'flex-start' }}
                                >
                                  View Property Details
                                </Button>
                              </Stack>
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
                                {visit.visitDate ? new Date(visit.visitDate).toLocaleDateString() : 'No date'}
                          </Typography>
                          <AccessTime color="primary" fontSize="small" />
                          <Typography variant="body2">
                                {visit.visitTime || 'No time'}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                            <Chip
                              label={getStatusText(visit.status)}
                              color={getStatusColor(visit.status)}
                              size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                              {(visit.status === 'pending' || visit.status === 'confirmed') && (
                          <Button
                            variant="outlined"
                                  color="primary"
                            size="small"
                            onClick={() => openReschedule(visit)}
                          >
                            Reschedule
                          </Button>
                              )}
                              {(visit.status === 'pending' || visit.status === 'confirmed') && (
                          <Button
                            variant="outlined"
                                  color="error"
                            size="small"
                                  onClick={() => {
                                    setVisitToCancel(visit);
                                    setOpenCancelDialog(true);
                                  }}
                          >
                            Cancel
                          </Button>
                              )}
                              {(visit.status === 'cancelled' || visit.status === 'rejected') && (
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={() => {
                                    setVisitToRemove(visit);
                                    setOpenRemoveDialog(true);
                                  }}
                                >
                                  Remove
                                </Button>
                              )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
              </Paper>
            ) : (
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  backgroundColor: 'white',
                  width: '100%'
                }}
              >
                <Timeline position="alternate">
                  {visits.map((visit) => (
                    <VisitTimelineItem key={visit._id} status={visit.status}>
                      <TimelineSeparator>
                        <TimelineDot>
                          {visit.status === 'confirmed' ? <CheckCircle /> :
                           visit.status === 'pending' ? <Schedule /> :
                           <Cancel />}
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Card sx={{ 
                          p: 2, 
                          mb: 2,
                          boxShadow: theme => theme.shadows[1],
                          '&:hover': {
                            boxShadow: theme => theme.shadows[3]
                          }
                        }}>
                          <Stack direction="row" spacing={2}>
                            {(() => {
                              const propertyImages = [
                                visit?.property?.propertyImages,
                                visit?.property?.images,
                                visit?.property?.imageUrls,
                                visit?.property?.propertyImage
                              ].find(imgs => Array.isArray(imgs) && imgs.length > 0) || [];

                              const singleImage = !Array.isArray(propertyImages) ? propertyImages : null;

                              return propertyImages.length > 0 || singleImage ? (
                                Array.isArray(propertyImages) && propertyImages.length > 0 ? (
                                  <Carousel
                                    animation="slide"
                                    autoPlay={true}
                                    interval={4000}
                                    indicators={propertyImages.length > 1}
                                    navButtonsAlwaysVisible={false}
                                    navButtonsAlwaysInvisible={true}
                                    cycleNavigation={true}
                                    sx={{
                                      width: 250,
                                      height: 180,
                                      borderRadius: 2,
                                      overflow: 'hidden',
                                      boxShadow: 1,
                                      '& .MuiPaper-root': {
                                        borderRadius: 0,
                                      },
                                      '& .MuiIndicator-root': {
                                        color: 'white',
                                      }
                                    }}
                                  >
                                    {propertyImages.map((image, i) => (
                                      <Box
                                        key={i}
                                        component="img"
                                        src={image}
                                        alt={`${visit.property?.title || 'Property'} - Image ${i + 1}`}
                                        sx={{
                                          height: 180,
                                          width: '100%',
                                          objectFit: 'cover',
                                          display: 'block'
                                        }}
                                      />
                                    ))}
                                  </Carousel>
                                ) : (
                                  <CardMedia
                                    component="img"
                                    sx={{ 
                                      width: 250, 
                                      height: 180, 
                                      borderRadius: 2,
                                      objectFit: 'cover',
                                      boxShadow: 1
                                    }}
                                    image={singleImage}
                                    alt={visit.property?.title || 'Property Image'}
                                  />
                                )
                              ) : (
                                <Box
                                  sx={{
                                    width: 250,
                                    height: 180,
                                    borderRadius: 2,
                                    backgroundColor: 'grey.200',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 1
                                  }}
                                >
                                  <Typography variant="caption" color="text.secondary">
                                    No Image
                                  </Typography>
                                </Box>
                              );
                            })()}
                          </Stack>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" gutterBottom>
                              {visit.property?.title || 'Unknown Property'}
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Chip
                                icon={<Event />}
                                label={new Date(visit.visitDate).toLocaleDateString()}
                                size="small"
                              />
                              <Chip
                                icon={<AccessTime />}
                                label={visit.visitTime}
                                size="small"
                              />
                              <Chip
                                icon={<LocationOn />}
                                label={visit.property?.location || 'Location not available'}
                                size="small"
                              />
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                              {visit.status !== 'cancelled' && (
                                <>
                                  <Button
                                    size="small"
                                    startIcon={<Edit />}
                                    onClick={() => openReschedule(visit)}
                                  >
                                    Reschedule
                                  </Button>
                                  <Button
                                    size="small"
                                    color="error"
                                    startIcon={<Cancel />}
                                    onClick={() => {
                                      setVisitToCancel(visit);
                                      setOpenCancelDialog(true);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                              {visit.status === 'cancelled' && (
                                <Button
                                  size="small"
                                  color="error"
                                  startIcon={<Delete />}
                                  onClick={() => {
                                    setVisitToRemove(visit);
                                    setOpenRemoveDialog(true);
                                  }}
                                >
                                  Remove
                                </Button>
                              )}
                            </Stack>
                          </Box>
                        </Card>
                      </TimelineContent>
                    </VisitTimelineItem>
                  ))}
                </Timeline>
              </Paper>
            )}
          </Box>
        </Container>

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
              <TextField
                fullWidth
                label="Message (Optional)"
                multiline
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add any additional notes or requests..."
              />
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
                  Current Date: {selectedVisit?.visitDate && new Date(selectedVisit.visitDate).toLocaleDateString()} {selectedVisit?.visitTime}
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

        {/* Cancel Visit Dialog */}
        <Dialog
          open={openCancelDialog}
          onClose={() => {
            setOpenCancelDialog(false);
            setVisitToCancel(null);
            setCancelMessage('');
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Cancel Visit</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Typography variant="body1">
                Are you sure you want to cancel this visit?
              </Typography>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Property: {visitToCancel?.property?.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Scheduled for: {visitToCancel?.visitDate && new Date(visitToCancel.visitDate).toLocaleDateString()} {visitToCancel?.visitTime}
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Cancellation Reason"
                multiline
                rows={3}
                value={cancelMessage}
                onChange={(e) => setCancelMessage(e.target.value)}
                placeholder="Please provide a reason for cancellation..."
                required
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setOpenCancelDialog(false);
                setVisitToCancel(null);
                setCancelMessage('');
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCancelVisit}
              disabled={!cancelMessage.trim()}
            >
              Cancel Visit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Remove Dialog */}
        <Dialog
          open={openRemoveDialog}
          onClose={() => {
            setOpenRemoveDialog(false);
            setVisitToRemove(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Remove Visit from List</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Typography variant="body1">
                Are you sure you want to remove this cancelled visit from your list?
              </Typography>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Property: {visitToRemove?.property?.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Scheduled for: {visitToRemove?.visitDate && new Date(visitToRemove.visitDate).toLocaleDateString()} {visitToRemove?.visitTime}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: Cancelled
                </Typography>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setOpenRemoveDialog(false);
                setVisitToRemove(null);
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleRemoveVisit}
            >
              Remove
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
    </ThemeProvider>
  );
};

export default ScheduledVisits;