/**
 * Authentication and user management utilities
 */

/**
 * Save user data to localStorage after successful login
 * @param {Object} userData - User data from login response
 * @param {string} token - Authentication token
 * @param {string} userType - User type/role (tenant, landlord, admin)
 */
export const saveUserData = (userData, token, userType) => {
  if (!userData) return false;
  
  // Ensure userType is consistently formatted (lowercase)
  const formattedUserType = userType?.toLowerCase() || 
                           userData.userType?.toLowerCase() || 
                           userData.role?.toLowerCase() || 
                           'user';
  
  const userDataToStore = {
    userId: userData.userId || userData._id || userData.id,
    username: userData.username || userData.name,
    email: userData.email,
    phone: userData.phone || '',
    userType: formattedUserType,
    token: token || userData.token,
    isLoggedIn: true,
    lastLogin: new Date().toISOString()
  };
  
  // Log what's being stored for debugging
  console.log('Storing user data in localStorage:', userDataToStore);
  
  localStorage.setItem("user", JSON.stringify(userDataToStore));
  return true;
};

/**
 * Get the current user data from localStorage
 * @returns {Object|null} User data or null if not logged in
 */
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export const isLoggedIn = () => {
  const user = getCurrentUser();
  return !!user?.isLoggedIn;
};

/**
 * Get user's type/role
 * @returns {string|null} User type (tenant, landlord, admin) or null if not logged in
 */
export const getUserType = () => {
  const user = getCurrentUser();
  return user?.userType || null;
};

/**
 * Check if current user is of specified type
 * @param {string} type - User type to check (tenant, landlord, admin)
 * @returns {boolean} True if user is of specified type
 */
export const isUserType = (type) => {
  const userType = getUserType();
  return userType === type?.toLowerCase();
};

/**
 * Get user's dashboard route based on user type
 * @returns {string} Dashboard route
 */
export const getUserDashboardRoute = () => {
  const userType = getUserType();
  
  // Log current user type for debugging
  console.log('Getting dashboard route for user type:', userType);
  
  if (userType === 'tenant') {
    return '/tenant/dashboard';
  } else if (userType === 'landlord') {
    return '/landlord/dashboard';
  } else if (userType === 'admin') {
    return '/admin/dashboard';
  }
  
  // Default route if type is unknown
  return '/dashboard';
};

/**
 * Logout user by removing data from localStorage
 */
export const logout = () => {
  localStorage.removeItem("user");
  // You can also clear other app-specific data if needed
  sessionStorage.removeItem("signupData");
};

/**
 * Get authentication token
 * @returns {string|null} Authentication token or null if not available
 */
export const getToken = () => {
  const user = getCurrentUser();
  return user?.token || null;
};

/**
 * Extract user ID from stored user data
 * @returns {string|null} User ID or null if not available
 */
export const getUserId = () => {
  const user = getCurrentUser();
  return user?.userId || null;
};

/**
 * Check if authentication token is expired
 * This is a placeholder - actual implementation depends on your token structure
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = () => {
  // Implement token expiration check based on your token structure
  // This could check a JWT expiration time or similar
  return false;
};

/**
 * Get the username of the current user
 * @returns {string|null} Username or null if not available
 */
export const getUsername = () => {
  const user = getCurrentUser();
  return user?.username || null;
};

/**
 * Debug function to check what's currently in localStorage
 * @returns {Object} Debug information
 */
export const debugAuthStorage = () => {
  try {
    const user = localStorage.getItem("user");
    const signupData = sessionStorage.getItem("signupData");
    
    return {
      hasUserData: !!user,
      userData: user ? JSON.parse(user) : null,
      hasSignupData: !!signupData,
      signupData: signupData ? JSON.parse(signupData) : null,
      allLocalStorageKeys: Object.keys(localStorage),
      allSessionStorageKeys: Object.keys(sessionStorage)
    };
  } catch (error) {
    return {
      error: error.message,
      stack: error.stack
    };
  }
}; 