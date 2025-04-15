import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  Home,
  Payment,
  Build,
  Chat,
  Security,
  Speed,
} from '@mui/icons-material';
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import Navbar from "../layouts/Navbar";

// Modern styled components
const GradientBackground = styled(Box)(({ theme }) => ({
  background: theme.palette && theme.palette.primary ? 
    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.dark, 0.8)} 100%)` : 
    'linear-gradient(135deg, #0072ff 0%, rgba(0, 88, 204, 0.8) 100%)',
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  color: "#ffffff",
  padding: theme.spacing ? theme.spacing(4) : '32px',
  position: 'relative',
  overflow: 'hidden',
  paddingTop: 'calc(64px + 2rem)', // Navbar height + padding
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "url(https://github.com/Shaivan19/mybackgrounds/blob/main/webbackground_optimized.png?raw=true)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.5,
    zIndex: 0,
  }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
  },
}));

const GlowButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  fontWeight: 'bold',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    right: '-50%',
    bottom: '-50%',
    background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)',
    transform: 'rotate(45deg)',
    animation: 'shine 3s infinite',
  },
  '@keyframes shine': {
    '0%': { transform: 'translateX(-100%) rotate(45deg)' },
    '100%': { transform: 'translateX(100%) rotate(45deg)' },
  }
}));

const features = [
  {
    icon: <Home fontSize="large" />,
    title: 'Property Management',
    description: 'Easily list, manage, and track your properties all in one place.',
  },
  {
    icon: <Payment fontSize="large" />,
    title: 'Digital Payments',
    description: 'Secure and automated payment processing for rent and deposits.',
  },
  {
    icon: <Build fontSize="large" />,
    title: 'Maintenance Tracking',
    description: 'Streamlined maintenance requests and tracking system.',
  },
  {
    icon: <Chat fontSize="large" />,
    title: 'Direct Communication',
    description: 'Built-in messaging system for seamless tenant-landlord communication.',
  },
  {
    icon: <Security fontSize="large" />,
    title: 'Secure Agreements',
    description: 'Digital lease agreements with e-signature capabilities.',
  },
  {
    icon: <Speed fontSize="large" />,
    title: 'Quick Processing',
    description: 'Fast and efficient property listing and application process.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Hero Section */}
      <GradientBackground>
        <Container maxWidth={false} sx={{ position: 'relative', zIndex: 1, width: '100%', px: { xs: 2, sm: 4, md: 6 } }}>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={8} sx={{ textAlign: 'center' }}>
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.8rem', sm: '3.5rem', md: '4.5rem' },
                  lineHeight: 1.2,
                  mb: 3,
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
              >
                Modern Property Management <Box component="span" sx={{ color: 'secondary.main' }}>Simplified</Box>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: '700px',
                  mx: 'auto',
                  textShadow: '0 1px 4px rgba(0,0,0,0.2)'
                }}
              >
                The all-in-one platform that transforms how landlords and tenants interact, making rental management effortless and efficient.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <GlowButton
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/signup')}
                  sx={{
                    bgcolor: 'white',
                    color: '#0055cc',
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 700,
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  Get Started
                </GlowButton>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    const featuresSection = document.querySelector('#features');
                    featuresSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 700,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      borderWidth: 2,
                    },
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </GradientBackground>

      {/* Features Section */}
      <Box sx={{ 
        py: { xs: 8, md: 12 },
        background: 'radial-gradient(circle at 50% 50%, rgba(245,245,245,1) 0%, rgba(255,255,255,1) 100%)',
        width: '100%'
      }}>
        <Container id="features" maxWidth={false} sx={{ width: '100%', px: { xs: 2, sm: 4, md: 6 } }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              component="h2"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                letterSpacing: 1,
                fontSize: '1rem',
                mb: 2,
                display: 'inline-block',
                bgcolor: theme.palette && theme.palette.primary ? 
                  alpha(theme.palette.primary.main, 0.1) : 
                  'rgba(0, 114, 255, 0.1)',
                px: 2,
                py: 1,
                borderRadius: '12px'
              }}
            >
              WHY CHOOSE US
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2.2rem', md: '3rem' }
              }}
            >
              Powerful Features for <Box component="span" sx={{ color: 'primary.main' }}>Modern</Box> Rentals
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                maxWidth: '700px',
                mx: 'auto',
                fontSize: '1.1rem'
              }}
            >
              Everything you need to manage your rental properties efficiently and build better relationships with tenants.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard>
                  <CardContent sx={{ 
                    textAlign: 'center', 
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        color: 'white',
                        fontSize: '2rem'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{ fontWeight: 700, mb: 2 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '1rem' }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: theme.palette && theme.palette.primary ? 
            `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)` :
            'linear-gradient(135deg, #005ccf 0%, #0072ff 100%)',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 75% 50%, rgba(255,255,255,0.2) 0%, transparent 40%)',
          }
        }}
      >
        <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, sm: 4, md: 6 } }}>
          <Box sx={{ 
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ 
                fontWeight: 800,
                color: 'white',
                mb: 3,
                fontSize: { xs: '2.2rem', md: '3rem' },
                textShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              Ready to Transform Your Rental Experience?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: 'rgba(255,255,255,0.95)',
                maxWidth: '700px',
                mx: 'auto',
                textShadow: '0 1px 4px rgba(0,0,0,0.2)'
              }}
            >
              Join thousands of satisfied landlords and tenants who trust our platform to simplify their rental journey.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <GlowButton
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{
                  bgcolor: 'white',
                  color: '#0055cc',
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 700,
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                Sign Up Free
              </GlowButton>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 700,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Log In
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;