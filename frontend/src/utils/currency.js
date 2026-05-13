/**
 * Format currency to Indian Rupees
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string with ₹
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
};

/**
 * Format large numbers with commas
 * @param {number} num - The number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  return num.toLocaleString('en-IN');
};