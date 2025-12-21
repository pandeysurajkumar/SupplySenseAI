// Date formatting utility for consistent date display across the app
export const formatDate = (dateString, format = null) => {
  if (!dateString) return '';

  // Get format from localStorage or use default
  const userFormat = format || localStorage.getItem('dateFormat') || 'MM/DD/YYYY';

  const date = new Date(dateString);

  switch (userFormat) {
    case 'DD/MM/YYYY':
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    case 'YYYY-MM-DD':
      return date.toISOString().split('T')[0];
    case 'MM/DD/YYYY':
    default:
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
  }
};

// Listen for date format changes and notify components
export const addDateFormatListener = (callback) => {
  const handleStorageChange = (e) => {
    if (e.key === 'dateFormat') {
      callback(e.newValue);
    }
  };

  window.addEventListener('storage', handleStorageChange);

  // Also listen for custom events
  window.addEventListener('dateFormatChanged', (e) => {
    callback(e.detail);
  });

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('dateFormatChanged', callback);
  };
};

// Dispatch date format change event
export const notifyDateFormatChange = (newFormat) => {
  window.dispatchEvent(new CustomEvent('dateFormatChanged', {
    detail: newFormat
  }));
};