import React,{ useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useChallenges } from '../contexts/ChallengeContext.jsx';
import ChallengeView from '../components/Challenges/ChallengeView.jsx';
import LoadingSpinner from '../components/Shared/LoadingSpinner.jsx';
import './ChallengePage.css';

// const ChallengePage = () => {
//   const { id } = useParams();
//   console.log("Challenge ID from route:", id);
//   const { currentChallenge, getChallengeById, isLoading } = useChallenges();

//   // console.log("Challenge ID:", id);

//   useEffect(() => {
//     if (!id) return; // 🔒 Prevent API call if ID is undefined
//     getChallengeById(id);
//   // }, [id, getChallengeById]);
//   }, [id]);

  // useDocumentTitle(
  //   currentChallenge 
  //     ? `${currentChallenge.title} - CDB` 
  //     : 'Challenge - CDB'
  // );

//   if (!id) return <div>❌ Challenge ID not provided</div>;
//   if (isLoading) return <LoadingSpinner />;
//   if (!currentChallenge) return <div>Challenge not found</div>;

//   console.log(currentChallenge)

//   return (
//     <div className="challenge-page">
//       <ChallengeView challenge={currentChallenge} />
//     </div>
//   );
// };

// export default ChallengePage;






// upper vale code se ek hi challenge load ho raha tha but now niche vale code se saare challenges load ho rahe hai.


// import React, { useEffect } from 'react';
// import useDocumentTitle from '../hooks/useDocumentTitle.js';
// import { useChallenges } from '../contexts/ChallengeContext.jsx';
// import ChallengeView from '../components/Challenges/ChallengeView.jsx';
// import LoadingSpinner from '../components/Shared/LoadingSpinner.jsx';
// import './ChallengePage.css';

// const ChallengePage = () => {
//   const { challenges, fetchChallenges, isLoading } = useChallenges();

//   useEffect(() => {
//     fetchChallenges();
//   }, []);

//   useDocumentTitle('All Challenges - CDB');

//   if (isLoading) return <LoadingSpinner />;
//   if (!challenges || challenges.length === 0) return <div>No challenges found</div>;

//   return (
//     <div className="challenge-page">
//       {challenges.map((challenge) => (
//         <ChallengeView key={challenge._id} challenge={challenge} />
//       ))}
//     </div>
//   );
// };

// export default ChallengePage;




// // this code writtenafter splitting challengePage.jsx into AllChallengeList.jsx and ChallengePage.jsx
// const ChallengePage = () => {
//   const { id } = useParams();
//   const { getChallengeById } = useChallenges();

//   const currentChallenge = getChallengeById(id);

//   useEffect(() => {
//     // console.log("Challenge ID from route:", id);
//   }, [id]);

//   if (!currentChallenge) return <div>Challenge not found</div>;

//   return <ChallengeView challenge={currentChallenge} />;
// };

// export default ChallengePage;





const ChallengePage = () => {
  const { id } = useParams();
  const { getChallengeById } = useChallenges(); // ✅ using custom hook
  const [challenge, setChallenge] = useState(null);
  
  
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        console.log("Fetching challenge... : ")
        const data = await getChallengeById(id);
        setChallenge(data);
        
      } catch (err) {
        console.error("Failed to fetch challenge:", err);
      }
    };

    fetchChallenge();
  }, [id, getChallengeById]);

  

  if (!challenge) return <div>Loading challenge...</div>;

  return <ChallengeView challenge={challenge} />;
};

export default ChallengePage;
