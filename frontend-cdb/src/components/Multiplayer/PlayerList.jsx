import './PlayerList.css'

const PlayerList = ({ players, currentChallenge }) => {
  return (
    <div className="player-list">
      <h3>Players</h3>
      <ul>
        {players.map((player, index) => {
          const badge = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
          return (
            <li key={player._id} className="player-item">
              <div className="player-info">
                <span className="username">{badge} {player.username}</span>
                <span className="score">🎯 {player.score || 0}</span>
              </div>
              {currentChallenge !== undefined && (
                <div className="challenge-status">
                  {player.submissions.some(s =>
                    s.challengeId === currentChallenge && s.correct
                  ) ? '✓ Solved' : '❌ Unsolved'}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PlayerList;


// const PlayerList = ({ players, currentChallenge }) => {
//     return (
//       <div className="player-list">
//         <h3>Players</h3>
//         <ul>
//           {players.map(player => (
//             <li key={player._id} className="player-item">
//               <div className="player-info">
//                 <span className="username">{player.username}</span>
//                 <span className="score">Score: {player.score || 0}</span>
//               </div>
//               {currentChallenge !== undefined && (
//                 <div className="challenge-status">
//                   {player.submissions.some(s => 
//                     s.challengeId === currentChallenge && s.correct
//                   ) ? '✓ Solved' : '❌ Unsolved'}
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   };

//   export default PlayerList;