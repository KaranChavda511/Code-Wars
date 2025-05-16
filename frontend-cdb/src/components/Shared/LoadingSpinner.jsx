import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium' }) => {
    const getSizeClass = () => {
      switch (size) {
        case 'small':
          return 'spinner-small';
        case 'large':
          return 'spinner-large';
        default:
          return '';
      }
    };
  
    return (
      <div className={`loading-spinner ${getSizeClass()}`}>
        <div className="spinner"></div>
      </div>
    );
  };
  
  export default LoadingSpinner;