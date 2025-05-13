// Admin authentication utilities
const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_ID_KEY = 'admin_id';

// API base URL
const API_BASE_URL = 'http://localhost:1909';

// Helper function to make authenticated API requests
const makeAuthenticatedRequest = async (endpoint, options = {}) => {
  const token = getAdminToken();
  console.log('Current token:', token); // Debug log

  if (!token) {
    console.error('No token found in localStorage');
    throw new Error('No authentication token found');
  }

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  console.log('Request headers:', defaultOptions.headers); // Debug log

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('API Error:', errorData); // Debug log
    throw new Error(errorData.message || 'Request failed');
  }

  return response.json();
};

export const setAdminToken = (token) => {
  console.log('Setting token:', token); // Debug log
  if (!token) {
    console.error('Attempting to set empty token');
    return;
  }
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const getAdminToken = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  console.log('Getting token:', token); // Debug log
  return token;
};

export const setAdminId = (id) => {
  console.log('Setting admin ID:', id); // Debug log
  if (!id) {
    console.error('Attempting to set empty admin ID');
    return;
  }
  localStorage.setItem(ADMIN_ID_KEY, id);
};

export const getAdminId = () => {
  const id = localStorage.getItem(ADMIN_ID_KEY);
  console.log('Getting admin ID:', id); // Debug log
  return id;
};

export const logoutAdmin = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_ID_KEY);
};

export const isAdminAuthenticated = () => {
  const token = getAdminToken();
  console.log('Checking authentication, token exists:', !!token); // Debug log
  return !!token;
};

// Admin authentication
export const adminLogin = async (email, password) => {
  try {
    console.log('Attempting login...'); // Debug log
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Login response:', data); // Debug log

    if (!response.ok) {
      console.error('Login failed:', data); // Debug log
      throw new Error(data.message || 'Login failed');
    }

    if (!data.token) {
      console.error('No token in response:', data); // Debug log
      throw new Error('No token received from server');
    }

    // Store the token and admin ID
    setAdminToken(data.token);
    
    // Extract admin ID from token payload
    try {
      const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
      console.log('Token payload:', tokenPayload); // Debug log
      if (tokenPayload.id) {
        setAdminId(tokenPayload.id);
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }

    // Verify the token and ID were stored
    const storedToken = getAdminToken();
    const storedId = getAdminId();
    console.log('Stored token verification:', storedToken); // Debug log
    console.log('Stored ID verification:', storedId); // Debug log

    return data;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

// Admin API functions
export const getAllUsers = async () => {
  console.log('Fetching all users...'); // Debug log
  const token = getAdminToken();
  const adminId = getAdminId();
  console.log('Token before request:', token); // Debug log
  console.log('Admin ID before request:', adminId); // Debug log
  return makeAuthenticatedRequest('/admin/users');
};

export const getAllProperties = async () => {
  return makeAuthenticatedRequest('/admin/properties');
};

export const getAllBookings = async () => {
  return makeAuthenticatedRequest('/admin/bookings');
};

export const getDashboardStats = async () => {
  return makeAuthenticatedRequest('/admin/dashboard/stats');
};

export const updateAdminProfile = async (profileData) => {
  return makeAuthenticatedRequest('/admin/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
};

export const changeAdminPassword = async (passwordData) => {
  return makeAuthenticatedRequest('/admin/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwordData)
  });
}; 