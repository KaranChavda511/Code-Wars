// Application-wide constants
export const DIFFICULTY_LEVELS = {
    EASY: 'Easy',
    MEDIUM: 'Medium',
    HARD: 'Hard'
  };
  
  export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/users/login',
      SIGNUP: '/users/signup',
      PROFILE: '/users/profile'
    },
    CHALLENGES: '/challenges',
    SUBMISSIONS: '/submissions',
    MULTIPLAYER: '/multiplayer',
    LEADERBOARD: '/leaderboard',
    ADMIN: '/admin'
  };
  
  export const SOCKET_EVENTS = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    ROOM_UPDATE: 'roomUpdate',
    GAME_START: 'gameStart',
    CODE_UPDATE: 'codeUpdate',
    SUBMISSION_RESULT: 'submissionResult',
    LEADERBOARD_UPDATE: 'leaderboardUpdate'
  };
  
  export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    UNAUTHORIZED: 'Session expired. Please login again.',
    FORBIDDEN: 'You are not authorized to perform this action.',
    DEFAULT: 'Something went wrong. Please try again later.'
  };
  
  export const TEST_CASE_STATUS = {
    PASSED: 'passed',
    FAILED: 'failed',
    ERROR: 'error'
  };
  
  export const AUTH_VALIDATION = {
    USERNAME_MIN_LENGTH: 3,
    PASSWORD_MIN_LENGTH: 6,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  };