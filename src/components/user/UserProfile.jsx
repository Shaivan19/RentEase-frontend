import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  TextField,
  Stack,
  IconButton,
  useTheme,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Email,
  Phone,
  Person,
  Lock,
  Business,
  CloudUpload
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userAPI, authAPI } from '../../services/api';

const UserProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:1906/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setProfile(data.data);
          setEditedUser(data.data);
        } else {
          console.error('Error fetching profile:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedUser(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:1906/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUser)
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.data);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        console.error('Error updating profile:', data.message);
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:1906/api/users/password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password changed successfully!');
        setChangePasswordDialog(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        console.error('Error changing password:', data.message);
        toast.error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Error changing password. Please try again.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:1906/api/users/avatar', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/octet-stream'
        },
        body: file
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(prev => ({
          ...prev,
          avatar: data.data.avatar
        }));
        toast.success('Profile picture updated successfully!');
      } else {
        console.error('Error uploading image:', data.message);
        toast.error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        pt: { xs: '80px', sm: '90px' },
        pb: 4,
        backgroundColor: theme.palette.background.default
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper
          }}
        >
          {/* Header Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Profile
            </Typography>
            {!isEditing ? (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                sx={{ borderRadius: 2 }}
              >
                Edit Profile
              </Button>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  sx={{ borderRadius: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{ borderRadius: 2 }}
                >
                  Save Changes
                </Button>
              </Stack>
            )}
          </Box>

          {/* Profile Content */}
          <Grid container spacing={4}>
            {/* Profile Picture */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  src={profile?.avatar}
                  sx={{
                    width: 150,
                    height: 150,
                    mb: 2,
                    border: `4px solid ${theme.palette.primary.main}`
                  }}
                >
                  {profile?.username?.charAt(0).toUpperCase()}
                </Avatar>
                {isEditing && (
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    disabled={uploadingImage}
                    sx={{ borderRadius: 2 }}
                  >
                    {uploadingImage ? 'Uploading...' : 'Change Photo'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </Button>
                )}
              </Box>
            </Grid>

            {/* User Information */}
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                {/* Username */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Username
                  </Typography>
                  <TextField
                    fullWidth
                    name="username"
                    value={isEditing ? editedUser.username : profile.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <Person sx={{ color: 'text.secondary', mr: 1 }} />
                      ),
                    }}
                  />
                </Box>

                {/* Email */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    value={isEditing ? editedUser.email : profile.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <Email sx={{ color: 'text.secondary', mr: 1 }} />
                      ),
                    }}
                  />
                </Box>

                {/* Phone */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Phone
                  </Typography>
                  <TextField
                    fullWidth
                    name="phone"
                    value={isEditing ? editedUser.phone : profile.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <Phone sx={{ color: 'text.secondary', mr: 1 }} />
                      ),
                    }}
                  />
                </Box>

                {/* User Type */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Account Type
                  </Typography>
                  <TextField
                    fullWidth
                    value={profile.userType}
                    disabled
                    InputProps={{
                      startAdornment: (
                        <Business sx={{ color: 'text.secondary', mr: 1 }} />
                      ),
                    }}
                  />
                </Box>

                {/* Password Change Button */}
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<Lock />}
                    onClick={() => setChangePasswordDialog(true)}
                    sx={{ borderRadius: 2 }}
                  >
                    Change Password
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordDialog} onClose={() => setChangePasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;