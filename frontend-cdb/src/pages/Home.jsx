// import React from 'react';
// import { Link } from 'react-router-dom';
// import useDocumentTitle from '../hooks/useDocumentTitle.js';
// import { useAuth } from '../contexts/AuthContext.jsx';
// import { useChallenges } from '../contexts/ChallengeContext.jsx';
// import ChallengeCard from '../components/Challenges/ChallengeCard.jsx';
// import './Home.css'

// const Home = () => {
//   useDocumentTitle('Home - CDB');
//   const { user } = useAuth();
//   const { challenges, isLoading } = useChallenges();

//   return (
//     <div className="home-page">
//       <section className="hero-section">
//         <h1 className='homeHeading'>Code Debugging Battle</h1>
//         <p>Test your coding skills against challenges and other developers</p>
//         {!user && (
//           <div className="auth-actions">
//             <Link to="/login" className="btn-primary">Login</Link>
//             <Link to="/signup" className="btn-secondary">Sign Up</Link>
//           </div>
//         )}
//       </section>

//       <section className="featured-challenges">
//         <h2>Featured Challenges</h2>
//         {isLoading ? (
//           <div className="loading">Loading challenges...</div>
//         ) : (
//           <div className="challenges-grid">
//             {challenges.slice(0, 3).map(challenge => (
//               <ChallengeCard key={challenge._id} challenge={challenge} />
//             ))}
//           </div>
//         )}
//         <Link to="/challenges" className="view-all">View All Challenges →</Link>
//       </section>

//       <section className="how-it-works">
//         <h2>How It Works</h2>
//         <div className="steps">
//           <div className="step">
//             <div className="step-number">1</div>
//             <h3>Solve Challenges</h3>
//             <p>Complete coding challenges to earn points and improve your skills</p>
//           </div>
//           <div className="step">
//             <div className="step-number">2</div>
//             <h3>Battle Others</h3>
//             <p>Compete in real-time multiplayer coding battles</p>
//           </div>
//           <div className="step">
//             <div className="step-number">3</div>
//             <h3>Climb Leaderboard</h3>
//             <p>Rise through the ranks by solving challenges faster</p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;




// css vala code



import React from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useChallenges } from '../contexts/ChallengeContext.jsx';
import ChallengeCard from '../components/Challenges/ChallengeCard.jsx';
import './Home.css';

const Home = () => {
  useDocumentTitle('Home - CDB');
  const { user } = useAuth();
  const { challenges, isLoading } = useChallenges([]); // yaha per hook ke andar array nahi diya tha vo baad me de diya.

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title">Code Debugging Battle</h1>
        <p className="hero-subtitle">
          Hone your coding skills by solving challenges and competing with developers across the globe.
        </p>
        {!user && (
          <div className="auth-buttons">
            <Link to="/login" className="btn login-btn">Login</Link>
            <Link to="/signup" className="btn signup-btn">Join Now</Link>
          </div>
        )}
      </section>

      <section className="featured-challenges">
        <h2 className="section-title">🔥 Featured Challenges</h2>
        {isLoading ? (
          <div className="loading">Loading challenges...</div>
        ) : (
          <div className="challenges-grid">
            {/* {challenges.slice(0, 3).map(challenge => ( */}
            {/* upper vali line se error aa rahi thi isiliye niche vali line likhi hai. */}
            {Array.isArray(challenges) && challenges.slice(0, 3).map(challenge => (
              <ChallengeCard key={challenge._id} challenge={challenge} />
            ))}
          </div>
        )}
        <Link to="/challenges" className="view-all">View All Challenges →</Link>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">🚀 How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3 className="step-title">Take on Real Coding Challenges</h3>
            <p>Fix broken code snippets and sharpen your problem-solving skills in a practical way.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3 className="step-title">Battle with Coders</h3>
            <p>Join exciting real-time multiplayer matches and climb your way to the top.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3 className="step-title">Earn Rewards & Reputation</h3>
            <p>Get recognized on the leaderboard and build a strong coding profile.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
