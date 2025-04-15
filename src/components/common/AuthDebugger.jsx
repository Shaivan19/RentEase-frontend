import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Divider, Alert } from '@mui/material';
import { debugAuthStorage, getCurrentUser, getUserType, logout } from '../../utils/auth';

/**
 * A component for debugging authentication state and localStorage content
 * This is for development purposes only and should be removed in production
 */
const AuthDebugger = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [error, setError] = useState(null);
  const [showComponent, setShowComponent] = useState(false);

  const refreshDebugInfo = () => {
    try {
      const info = debugAuthStorage();
      setDebugInfo(info);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Debug error:", err);
    }
  };

  useEffect(() => {
    refreshDebugInfo();
  }, []);

  const handleClearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    refreshDebugInfo();
  };

  const handleLogout = () => {
    logout();
    refreshDebugInfo();
  };

  if (!showComponent) {
    return (
      <Button 
        variant="outlined" 
        color="warning" 
        size="small" 
        onClick={() => setShowComponent(true)}
        sx={{ position: 'fixed', bottom: 10, right: 10, zIndex: 9999 }}
      >
        Debug Auth
      </Button>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        m: 2, 
        maxWidth: 500, 
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        opacity: 0.9,
        '&:hover': {
          opacity: 1
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Auth Debugger</Typography>
        <Button 
          variant="outlined" 
          color="error" 
          size="small"
          onClick={() => setShowComponent(false)}
        >
          Close
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Current User Type:</strong> {getUserType() || 'Not logged in'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Is Logged In:</strong> {getCurrentUser()?.isLoggedIn ? 'Yes' : 'No'}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" gutterBottom>
        Local Storage Data:
      </Typography>
      
      <Box sx={{ 
        backgroundColor: '#f5f5f5', 
        p: 2, 
        borderRadius: 1, 
        mb: 2,
        overflowX: 'auto'
      }}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {debugInfo?.userData ? JSON.stringify(debugInfo.userData, null, 2) : 'No user data'}
        </pre>
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Session Storage Data:
      </Typography>
      
      <Box sx={{ 
        backgroundColor: '#f5f5f5', 
        p: 2, 
        borderRadius: 1, 
        mb: 2,
        overflowX: 'auto'
      }}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {debugInfo?.signupData ? JSON.stringify(debugInfo.signupData, null, 2) : 'No signup data'}
        </pre>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button 
          variant="outlined" 
          color="primary" 
          size="small"
          onClick={refreshDebugInfo}
        >
          Refresh
        </Button>
        
        <Button 
          variant="outlined" 
          color="warning" 
          size="small"
          onClick={handleLogout}
        >
          Logout
        </Button>
        
        <Button 
          variant="outlined" 
          color="error" 
          size="small"
          onClick={handleClearStorage}
        >
          Clear Storage
        </Button>
      </Box>
    </Paper>
  );
};

export default AuthDebugger; 