
import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api.js';
import { toast } from 'react-hot-toast';
import { redirect } from 'react-router-dom';

const ChallengeContext = createContext();

export const ChallengeProvider = ({ children }) => {
  const [currentChallenge, setCurrentChallenge] = useState(null);
  // const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // const fetchChallenges = async () => {
  //   setIsLoading(true);
  //   try {
  //     const { data } = await API.get('/challenges/');
  //     // console.log(data)
  //     // setChallenges(data.challenges);
  //     setChallenges(data);
  //   } catch (error) {
  //     toast.error('Failed to load challenges');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // uppper vale code se ek hi challenge mil raha the now niche vala code dekhte hai.

  // ChallengeContext.jsx ke andar
  const [challenges, setChallenges] = useState([]);
  // const fetchChallenges = async () => {
  //   setIsLoading(true);
  //   try {
  //     const res = await fetch('/api/challenges'); // ya Appwrite call
  //     // console.log(res)
  //     const data = await res.json();
  //     // console.log(data)
  //     setChallenges(data);


  //     // const res = await fetch('/api/challenges');
  //     // console.log("Raw response:", res);
  //     // const text = await res.text();  // <-- 👈 change kiya
  //     // console.log("Raw text response:", text);  // <-- 👈 yaha dekhna kya aa raha hai
  //     // const data = JSON.parse(text);  // <-- 👈 manually parse karo
  //     // console.log("Parsed data:", data);
  //     // setChallenges(data);


  //   } catch (err) {
  //     console.error(err);
  //   }
  //   setIsLoading(false);
  // };



  const fetchChallenges = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/challenges');
      
      // Check for 429 or invalid JSON
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      const data = await res.json();
      setChallenges(data);
    } catch (err) {
      console.error("Error while fetching challenges:", err);
    }
    setIsLoading(false);
  };



  // console.log(challenges)

  // const getChallengeById = async (id) => {
  //   try {
  //     // const { data } = await API.get(`/challenges/${id}`);
  //     // const { data } = await API.get(`/challenges/`);
  //     // console.log("API Response:", data); // Ye line add karo
  //     // setCurrentChallenge(data); // Ya data.challenge, depending on response

  //     const { data } = await API.get(`/challenges/${id}`);
  //     setCurrentChallenge(data.challenge); // or setCurrentChallenge(data)

  //     // setCurrentChallenge(data);
  //     // console.log("CHALLENGE RESPONSE:", data);
  //     // setCurrentChallenge(data.challenge);
  //     return data;
  //     // return data.challenge;
  //   } catch (error) {
  //     toast.error('Failed to load challenge');
  //     return null;
  //   }
  // };


  // const getChallengeById = async (id) => {
  //   // console.log("API Call with ID:", id);
  //   try {
  //     const { data } = await API.get(`/challenges/${id}`);
  //     // setCurrentChallenge(data.challenge); // or setCurrentChallenge(data) based on API
  //     setCurrentChallenge(data); // or setCurrentChallenge(data) based on API
  //     // return data.challenge;
  //     return data;
  //   } catch (error) {
  //     toast.error('Failed to load challenge');
  //     return null;
  //   }
  // };



  const getChallengeById = async (id) => {
    try {
      const { data } = await API.get(`/challenges/${id}`);
      return data;
    } catch (error) {
      toast.error('Failed to load challenge');
      return null;
    }
  };



  const createChallenge = async (challengeData) => {
    try {
      const { data } = await API.post('/challenges', challengeData);
      setChallenges(prev => [...prev, data.challenge]);
      toast.success('Challenge created successfully');
      return data.challenge;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create challenge');
      throw error;
    }
  };

  // useEffect(() => {
  //   fetchChallenges();
  // }, []);

  useEffect(() => {
    if (challenges.length === 0) {
      fetchChallenges();
    }
  }, []);

  const filteredChallenges = filter === 'all'
    ? challenges
    : challenges.filter(c => c.difficulty === filter);

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
        refreshChallenges: fetchChallenges
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