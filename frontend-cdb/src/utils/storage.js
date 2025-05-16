// Enhanced localStorage utilities
export const storage = {
    get: (key, defaultValue = null) => {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
      } catch (error) {
        console.error('Storage get error:', error);
        return defaultValue;
      }
    },
  
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Storage set error:', error);
        return false;
      }
    },
  
    remove: (key) => {
      localStorage.removeItem(key);
    },
  
    clear: () => {
      localStorage.clear();
    },
  
    // Session-specific storage (clears when tab closes)
    session: {
      get: (key, defaultValue = null) => {
        try {
          const value = sessionStorage.getItem(key);
          return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
          return defaultValue;
        }
      },
      set: (key, value) => {
        sessionStorage.setItem(key, JSON.stringify(value));
      },
      remove: (key) => {
        sessionStorage.removeItem(key);
      }
    }
  };