import React from 'react';
import { Link } from 'react-router-dom';
import DifficultyBadge from '../Shared/DifficultyBadge.jsx';
import './ChallengeCard.css'

const ChallengeCard = ({ challenge }) => {

  // console.log("Challenge in Card:", challenge);

  return (
    <div className="challenge-card">
      <div className="card-header">
        <h3>
          {/* <Link to={`/challenges/${challenge._id}`}>{challenge.title}</Link> */}
          <Link to={challenge._id ? `/challenges/${challenge._id}` : "#"}>{challenge.title}</Link>
        </h3>
        {/* niche vali line se Difficulty pata chalti hai joki abhi Unknown dikha raha hai isliye hata diya */}
        {/* <DifficultyBadge difficulty={challenge.difficulty} /> */}
      </div>
      <p className="description">{challenge.description}</p>
      <div className="card-footer">
        {/* niche vali lines kitne logo ne ye challenge solve kiya hai vo batata hai but abhi uska logic nahi likha hai so vo abhi hata deta hu */}
        <span className="solved-count">
          {challenge.solvedBy || 0} solvers
        </span>
        <Link 
          to={`/challenges/${challenge._id}`} 
          className="solve-btn"
        >
          Solve Challenge
        </Link>
      </div>
    </div>
  );
};

export default ChallengeCard;