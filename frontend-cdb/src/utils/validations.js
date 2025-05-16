import { AUTH_VALIDATION } from './constants.js';

export const validatePassword = (password) => {
  return password.length >= AUTH_VALIDATION.PASSWORD_MIN_LENGTH;
};

export const validateUsername = (username) => {
  return username.length >= AUTH_VALIDATION.USERNAME_MIN_LENGTH;
};

export const validateChallengeForm = (data) => {
  const errors = {};
  
  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  }
  
  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  }
  
  if (!data.functionName?.trim()) {
    errors.functionName = 'Function name is required';
  }
  
  if (!data.testCases?.length) {
    errors.testCases = 'At least one test case is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateCodeSubmission = (code) => {
  return code.trim().length > 0 && code.includes('function');
};