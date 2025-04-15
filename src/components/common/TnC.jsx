import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  useTheme,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Card,
  CardContent,
  Button
} from "@mui/material";
import {
  Gavel,
  Security,
  Article,
  CheckCircle,
  Help
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TnC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const sections = [
    {
      id: 'general',
      title: 'General Terms',
      icon: <Article />,
      content: (
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Acceptance of Terms"
              secondary="By accessing and using RentEase, you agree to be bound by these Terms and Conditions."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="User Accounts"
              secondary="You must be at least 18 years old to create an account and use our services."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Account Security"
              secondary="You are responsible for maintaining the confidentiality of your account credentials."
            />
          </ListItem>
        </List>
      )
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: <Security />,
      content: (
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Data Collection"
              secondary="We collect and process your personal information in accordance with our Privacy Policy."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Data Protection"
              secondary="We implement appropriate security measures to protect your personal information."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Third-Party Access"
              secondary="We may share your information with trusted third parties as described in our Privacy Policy."
            />
          </ListItem>
        </List>
      )
    },
    {
      id: 'legal',
      title: 'Legal Requirements',
      icon: <Gavel />,
      content: (
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Compliance"
              secondary="Users must comply with all applicable laws and regulations when using our services."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Intellectual Property"
              secondary="All content and materials available on RentEase are protected by intellectual property rights."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Liability"
              secondary="RentEase is not liable for any damages arising from the use of our services."
            />
          </ListItem>
        </List>
      )
    }
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 8,
        position: 'relative',
        width: '100vw',
        left: 0,
        right: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          zIndex: 0
        }
      }}
    >
      <Container 
        maxWidth={false} 
        disableGutters
        sx={{ 
          position: 'relative', 
          zIndex: 1,
          px: { xs: 2, sm: 4, md: 6, lg: 8 },
          width: '100%',
          margin: 0,
          maxWidth: '100% !important'
        }}
      >
        {/* Header Section */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            textAlign: 'center',
            mb: 6,
            color: 'white',
            width: '100%'
          }}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              mb: 2,
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }
            }}
          >
            Terms and Conditions
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Please read these terms carefully before using RentEase
          </Typography>
        </Box>

        {/* Main Content */}
        <Grid container spacing={4} sx={{ width: '100%' }}>
          {/* Left Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              sx={{
                p: 3,
                position: 'sticky',
                top: 24,
                height: 'fit-content',
                width: '100%'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Quick Navigation
              </Typography>
              <List>
                {sections.map((section) => (
                  <ListItem
                    key={section.id}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      bgcolor: 'primary.light',
                      color: 'white',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'primary.main'
                      }
                    }}
                    onClick={() => {
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <ListItemIcon sx={{ color: 'white' }}>
                      {section.icon}
                    </ListItemIcon>
                    <ListItemText primary={section.title} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Main Content Area */}
          <Grid item xs={12} md={9} sx={{ width: '100%' }}>
            {sections.map((section, index) => (
              <Paper
                key={section.id}
                id={section.id}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                sx={{
                  p: 4,
                  mb: 4,
                  borderRadius: 4,
                  boxShadow: 3,
                  width: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      mr: 2,
                      width: 48,
                      height: 48
                    }}
                  >
                    {section.icon}
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">
                    {section.title}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                {section.content}
              </Paper>
            ))}
          </Grid>
        </Grid>

        {/* Bottom Info Card */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 4,
              width: '100%',
              maxWidth: '1200px'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3} alignItems="center" justifyContent="center">
                <Grid item xs={12} md={8} sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" gutterBottom>
                    Need Help?
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    If you have any questions about our Terms and Conditions, please don't hesitate to contact our support team.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<Help />}
                    onClick={() => navigate('/contactus')}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5
                    }}
                  >
                    Contact Support
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default TnC;
