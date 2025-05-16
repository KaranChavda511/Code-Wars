import { ERROR_MESSAGES } from './constants.js';
import { toast } from 'react-hot-toast';

export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  const message = error.response?.data?.message || 
    error.message || 
    ERROR_MESSAGES.DEFAULT;

  toast.error(message);
  return message;
};

export const handleSocketError = (error) => {
  console.error('Socket Error:', error);
  toast.error(ERROR_MESSAGES.DEFAULT);
};

export const handleValidationError = (errors) => {
  Object.values(errors).forEach(error => toast.error(error));
};

export const handleSuccess = (message) => {
  toast.success(message);
};