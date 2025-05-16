import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../services/api.js';
import ChallengeEditor from './ChallengeEditor.jsx';
import { toast } from 'react-hot-toast';
import './ChallengeView.css'

// const ChallengeView = () => {
//   // const ChallengeView = ({ challenge }) => {
//   const { id } = useParams();
//   const [challenge, setChallenge] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // useEffect(() => {
//   //   const fetchChallenge = async () => {
//   //     try {
//   //       // const { data } = await API.get(`/challenges/`);
//   //       // setChallenge(data);

//   //       const { data } = await API.get(`/challenges/${id}`);
//   //       setChallenge(data.challenge); // or setChallenge(data)
//   //     } catch (error) {
//   //       toast.error('Failed to load challenge');
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   };
//   //   fetchChallenge();
//   // }, [id]);

//   useEffect(() => {
//     const fetchChallenge = async () => {
//       try {
//         const { data } = await API.get(`/challenges/${id}`);
//         setChallenge(data.challenge); // or setChallenge(data)
//       } catch (error) {
//         toast.error('Failed to load challenge');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchChallenge();
//   }, [id]);


//   console.log("ChallengeView Data: ",challenge)


//   if (isLoading) return <div>Loading challenge...</div>;
//   if (!challenge) return <div>Challenge not found</div>;

//   return (
//     <div className="challenge-view">
//       <h1>{challenge.title}</h1>
//       <div className="challenge-meta">
//         <span className="difficulty">{challenge.difficulty}</span>
//         <span className="function-signature">
//           function {challenge.functionName}({challenge.parameters?.join(', ')})
//         </span>
//       </div>
//       <div className="challenge-description">
//         <h3>Description</h3>
//         <p>{challenge.description}</p>
//       </div>
//       <ChallengeEditor challenge={challenge} />
//     </div>
//   );
// };

// export default ChallengeView;




// import React from 'react';
// import { useChallenges } from '../../contexts/ChallengeContext.jsx';
// import ChallengeEditor from './ChallengeEditor.jsx';
// import './ChallengeView.css';

const ChallengeView = ({ challenge }) => {

  console.log("ChallengeView Data: ", challenge)

  if (!challenge) return <div>Challenge not found</div>;

  return (
    <div className="challenge-view">
      <h1>{challenge.title}</h1>
      <div className="challenge-meta">
        <span className="difficulty">{challenge.difficulty}</span>
        <span className="function-signature">
          function {challenge.functionName}({challenge.parameters?.join(', ')})
        </span>
      </div>
      <div className="challenge-description">
        <h3>Description</h3>
        <p>{challenge.description}</p>
      </div>
      <div className="challenge-testcases">
        <h3>Test Cases: </h3>
        {challenge.testCases?.length > 0 ? (
          <ul>
            {challenge.testCases.map((test, index) => (
              <li key={test._id}>
                <strong>Input:</strong> {test.input} <br />
                <strong>Expected Output:</strong> {test.output}
              </li>
            ))}
          </ul>
        ) : (
          <p>No test cases provided.</p>
        )}
      </div>
      <ChallengeEditor challenge={challenge} />
    </div>
  );
};

export default ChallengeView;
