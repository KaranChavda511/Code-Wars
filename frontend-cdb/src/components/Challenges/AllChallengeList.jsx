// src/pages/ChallengeListPage.jsx
import React from 'react';
// import { useChallenge } from '../contexts/ChallengeContext';
import { useChallenges } from '../../contexts/ChallengeContext';
// import ChallengeCard from '../components/Challenge/ChallengeCard';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ChallengeCard from './ChallengeCard';

const ChallengeListPage = () => {

  useDocumentTitle('All Challenges - CDB');

  const { challenges, isLoading } = useChallenges();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="challenge-list-page">
      <h2>All Challenges</h2>
      <div className="challenge-list">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge._id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
};

export default ChallengeListPage;
