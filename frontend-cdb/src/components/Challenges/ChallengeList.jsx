// import React,{ useEffect, useState } from 'react';
// import API from '../../services/api.js';
// import ChallengeCard from './ChallengeCard.jsx';
// import { toast } from 'react-hot-toast';
// import './ChallengeList.css'

// const ChallengeList = () => {
//   const [challenges, setChallenges] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     const fetchChallenges = async () => {
//       try {
//         const { data } = await API.get('/challenges');
//         setChallenges(data.challenges);
//       } catch (error) {
//         toast.error('Failed to load challenges');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchChallenges();
//   }, []);

//   const filteredChallenges = filter === 'all' 
//     ? challenges 
//     : challenges.filter(c => c.difficulty === filter);

//   return (
//     <div className="challenge-list">
//       <div className="list-header">
//         <h2>Challenges</h2>
//         <div className="filters">
//           <button 
//             className={filter === 'all' ? 'active' : ''}
//             onClick={() => setFilter('all')}
//           >
//             All
//           </button>
//           <button 
//             className={filter === 'easy' ? 'active' : ''}
//             onClick={() => setFilter('easy')}
//           >
//             Easy
//           </button>
//           <button 
//             className={filter === 'medium' ? 'active' : ''}
//             onClick={() => setFilter('medium')}
//           >
//             Medium
//           </button>
//           <button 
//             className={filter === 'hard' ? 'active' : ''}
//             onClick={() => setFilter('hard')}
//           >
//             Hard
//           </button>
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="loading">Loading challenges...</div>
//       ) : (
//         // <div className="challenges-grid">
//         //   {filteredChallenges.map(challenge => (
//         //     <ChallengeCard key={challenge._id} challenge={challenge} />
//         //   ))}
//         // </div>
//         <div className="challenge-card-grid">
//         {challenges.map(ch => (
//           <ChallengeCard key={ch._id} challenge={ch} />
//         ))}
//       </div>
//       )}
//     </div>
//   );
// };

// export default ChallengeList;







// ye niche ka code skeleton loader ke liye hai.


import React, { useEffect, useState } from 'react';
import API from '../../services/api.js';
import ChallengeCard from './ChallengeCard.jsx';
import { toast } from 'react-hot-toast';
import './ChallengeList.css';

const ChallengeList = () => {
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const { data } = await API.get('/challenges');
        setChallenges(data.challenges);
      } catch (error) {
        toast.error('Failed to load challenges');
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  const filteredChallenges = filter === 'all'
    ? challenges
    : challenges.filter(c => c.difficulty === filter);

  return (
    <div className="challenge-list">
      <div className="list-header">
        <h2>🧩 Challenges</h2>
        <div className="filters">
          {['all', 'easy', 'medium', 'hard'].map(level => (
            <button
              key={level}
              className={filter === level ? 'active' : ''}
              onClick={() => setFilter(level)}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="challenge-card-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="challenge-card-skeleton" key={i}>
              <div className="title" />
              <div className="desc" />
              <div className="desc" />
              <div className="footer" />
            </div>
          ))}
        </div>
      ) : (
        <div className="challenge-card-grid">
          {filteredChallenges.map(ch => (
            <ChallengeCard key={ch._id} challenge={ch} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengeList;
