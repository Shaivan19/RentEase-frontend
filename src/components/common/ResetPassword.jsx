import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { authAPI } from '../services/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authAPI.resetPassword(formData.email);
      toast.success('Password reset instructions sent to your email');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authAPI.resetPassword(token, formData.newPassword);
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        backgroundColor: 'background.default'
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: 'background.paper'
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Reset Password
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {token ? (
            // Reset password form
            <form onSubmit={handleResetPassword}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
                required
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ mt: 3 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
            </form>
          ) : (
            // Request reset form
            <form onSubmit={handleRequestReset}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ mt: 3 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Send Reset Instructions'}
              </Button>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;