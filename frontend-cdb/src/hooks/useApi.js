import React,{ useState, useCallback } from 'react';

const useApi = () => {
  const [state, setState] = useState({
    data: null,
    error: null,
    isLoading: false,
    status: 'idle'
  });

  const callApi = useCallback(async (apiFunction, ...args) => {
    setState({
      data: null,
      error: null,
      isLoading: true,
      status: 'loading'
    });

    try {
      const response = await apiFunction(...args);
      setState({
        data: response.data,
        error: null,
        isLoading: false,
        status: 'success'
      });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setState({
        data: null,
        error: errorMessage,
        isLoading: false,
        status: 'error'
      });
      throw error;
    }
  }, []);

  return { ...state, callApi };
};

export default useApi;