// General utility functions
import { DIFFICULTY_LEVELS } from './constants.js';

export const formatDate = (dateString, options = {}) => {
  const defaultOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('en-US', {
    ...defaultOptions,
    ...options
  });
};

export const calculateAccuracy = (solved, attempts) => {
  if (attempts === 0) return 0;
  return Math.round((solved / attempts) * 100);
};

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(EMAIL_REGEX);
};

export const truncateText = (text, maxLength = 100) => {
  return text.length > maxLength 
    ? `${text.substring(0, maxLength)}...` 
    : text;
};

export const sortChallenges = (challenges, sortBy) => {
  return [...challenges].sort((a, b) => {
    switch(sortBy) {
      case 'difficulty':
        const difficultyOrder = [
          DIFFICULTY_LEVELS.EASY, 
          DIFFICULTY_LEVELS.MEDIUM, 
          DIFFICULTY_LEVELS.HARD
        ];
        return difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty);
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'popular':
        return b.solvedBy - a.solvedBy;
      default:
        return 0;
    }
  });
};

export const getOrdinalSuffix = (num) => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};

export const generateColorFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
};

// Debounce function for non-hook usage
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};