import React from 'react';
import { Box, Typography, Container, Grid, Paper, Avatar } from '@mui/material';
import { styled } from '@mui/system';

// Icons (you can replace these with actual icons from @mui/icons-material)
import HomeIcon from '@mui/icons-material/Home';
import PaymentsIcon from '@mui/icons-material/Payments';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const AboutUs = () => {
  const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
    },
  }));

  const FeatureCard = ({ icon, title, description }) => (
    <StyledPaper elevation={3}>
      <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
        <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mb: 2 }}>
          {icon}
        </Avatar>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </StyledPaper>
  );

  return (
    <Box 
      component="main" 
      sx={{ 
        width: '100vw',
        minHeight: '100vh',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: '64px', sm: '70px' }, // Add padding top to account for navbar height
        boxSizing: 'border-box'
      }}
    >
      <Container maxWidth={false} sx={{ py: 6, px: { xs: 2, sm: 4, md: 6 }, width: '100%' }}>
        {/* Hero Section */}
        <Box textAlign="center" mb={8}>
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2, #4dabf5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Revolutionizing Rental Management
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            maxWidth="800px" 
            mx="auto"
            sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}
          >
            RentEase is transforming the way properties are rented and managed, creating seamless experiences for landlords and tenants alike.
          </Typography>
        </Box>

        {/* Our Story */}
        <Box mb={8}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
            Our Story
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph>
                Founded in 2023, RentEase was born out of frustration with the traditional rental process. We saw how difficult it was for tenants to find the right properties and for landlords to manage them efficiently.
              </Typography>
              <Typography variant="body1" paragraph>
                Our mission is to bridge the gap between property owners and renters through technology, creating a platform that simplifies every step of the rental journey.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: '100%',
                  backgroundImage: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.3) 100%)',
                  borderRadius: '16px',
                  p: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h5" sx={{ fontStyle: 'italic', fontWeight: 300 }}>
                  "Making rental management effortless through innovation and technology"
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Features */}
        <Box mb={8}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
            Why Choose RentEase
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                icon={<HomeIcon fontSize="large" />}
                title="Smart Property Listings"
                description="Find or list properties with advanced search filters and detailed descriptions."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                icon={<PaymentsIcon fontSize="large" />}
                title="Seamless Payments"
                description="Secure online transactions with automatic reminders and tracking."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                icon={<HandshakeIcon fontSize="large" />}
                title="Digital Agreements"
                description="Paperless contracts with e-signatures for a hassle-free experience."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                icon={<SupportAgentIcon fontSize="large" />}
                title="24/7 Support"
                description="Round-the-clock assistance for all your rental needs."
              />
            </Grid>
          </Grid>
        </Box>

        {/* Team/Values Section */}
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
            Our Core Values
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: "Transparency",
                description: "We believe in clear communication and honest dealings between all parties."
              },
              {
                title: "Innovation",
                description: "Continually improving our platform to solve real rental challenges."
              },
              {
                title: "Efficiency",
                description: "Streamlining processes to save time and reduce stress for our users."
              },
              {
                title: "Community",
                description: "Building trust and long-term relationships in the rental ecosystem."
              }
            ].map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper elevation={0} sx={{ p: 3, height: '100%', borderLeft: '4px solid #1976d2' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {value.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUs;