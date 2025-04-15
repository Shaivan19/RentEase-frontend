/**
 * Currency formatting utilities
 */

/**
 * Format a number as INR currency
 * @param {number} amount - The amount to format
 * @param {boolean} [showPaise=true] - Whether to show paise
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showPaise = true) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showPaise ? 2 : 0,
    maximumFractionDigits: showPaise ? 2 : 0
  }).format(amount);
};

/**
 * Parse a currency string to number
 * @param {string} currencyString - The currency string to parse
 * @returns {number} Parsed number
 */
export const parseCurrencyString = (currencyString) => {
  // Remove currency symbols and other non-numeric characters except decimal point
  const numericString = currencyString.replace(/[^0-9.-]/g, '');
  return parseFloat(numericString);
};

/**
 * Format a large number with abbreviations (K, M, B)
 * @param {number} number - The number to format
 * @param {number} [decimals=1] - Number of decimal places
 * @returns {string} Formatted number with abbreviation
 */
export const formatLargeNumber = (number, decimals = 1) => {
  const abbreviations = ['', 'K', 'M', 'B', 'T'];
  const order = Math.floor(Math.log10(Math.abs(number)) / 3);
  
  if (order < 0) return number.toString();
  if (order >= abbreviations.length) return number.toString();
  
  const suffix = abbreviations[order];
  const shortened = number / Math.pow(10, order * 3);
  
  return `₹${shortened.toFixed(decimals)}${suffix}`;
};

/**
 * Format INR with Indian numbering system (with commas)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted amount with Indian numbering system
 */
export const formatIndianSystem = (amount) => {
  const numStr = amount.toString();
  const parts = numStr.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `₹${parts.join('.')}`;
};

/**
 * Format a number as USD currency
 * @param {number} amount - The amount to format
 * @param {boolean} [showCents=true] - Whether to show cents
 * @returns {string} Formatted currency string
 */
export const formatUSD = (amount, showCents = true) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0
  }).format(amount);
};

/**
 * Add currency symbol to a number
 * @param {number} amount - The amount
 * @param {string} symbol - The currency symbol
 * @returns {string} Amount with currency symbol
 */
export const addCurrencySymbol = (amount, symbol = '$') => {
  return `${symbol}${amount.toLocaleString()}`;
}; 