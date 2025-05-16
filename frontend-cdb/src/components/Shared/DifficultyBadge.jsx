import './DifficultyBadge.css';

const DifficultyBadge = ({ difficulty }) => {
    const getDifficultyClass = () => {
      switch (difficulty?.toLowerCase()) {
        case 'easy':
          return 'easy';
        case 'medium':
          return 'medium';
        case 'hard':
          return 'hard';
        default:
          return '';
      }
    };
  
    return (
      <span className={`difficulty-badge ${getDifficultyClass()}`}>
        {difficulty || 'Unknown'}
      </span>
    );
  };
  
  export default DifficultyBadge;