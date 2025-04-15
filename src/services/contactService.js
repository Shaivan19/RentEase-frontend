import axios from 'axios';

// Mock API URL - replace with real API when available
const API_URL = '/api';

/**
 * Send contact form data to the backend
 * @param {Object} formData - Contact form data
 * @returns {Promise} - Promise with the response
 */
export const sendContactForm = async (formData) => {
  // For development/demo purposes, simulate a successful API call
  // Remove this when real backend is connected
  if (process.env.NODE_ENV === 'development' || !API_URL.startsWith('http')) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log the form data
    console.log('Contact form submitted:', formData);
    
    // Return a simulated successful response
    return {
      status: 200,
      data: {
        success: true,
        message: 'Message sent successfully! We\'ll get back to you soon.'
      }
    };
  }
  
  // This will be used when a real backend is available
  return axios.post(`${API_URL}/contact`, formData);
}; 