import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api.js';
import { toast } from 'react-hot-toast';

const ChallengeContext = createContext();

export const ChallengeProvider = ({ children }) => {
  const [challenges, setChallenges] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchChallenges = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await API.get('/challenges');
      setChallenges(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error while fetching challenges:', err);
      setChallenges([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getChallengeById = useCallback(async (id) => {
    try {
      const { data } = await API.get(`/challenges/${id}`);
      setCurrentChallenge(data);
      return data;
    } catch (error) {
      toast.error('Failed to load challenge');
      return null;
    }
  }, []);

  const createChallenge = async (challengeData) => {
    try {
      const { data } = await API.post('/challenges', challengeData);
      const created = data.challenge ?? data;
      setChallenges((prev) => [...prev, created]);
      toast.success('Challenge created successfully');
      return created;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create challenge');
      throw error;
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const filteredChallenges =
    filter === 'all' ? challenges : challenges.filter((c) => c.difficulty === filter);

  return (
    <ChallengeContext.Provider
      value={{
        challenges: filteredChallenges,
        currentChallenge,
        isLoading,
        filter,
        setFilter,
        getChallengeById,
        createChallenge,
        refreshChallenges: fetchChallenges,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenges = () => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error('useChallenges must be used within a ChallengeProvider');
  }
  return context;
};
