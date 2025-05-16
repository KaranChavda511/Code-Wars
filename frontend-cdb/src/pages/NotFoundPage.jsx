import React from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import './NotFoundPage.css';

const NotFoundPage = () => {
  useDocumentTitle('Page Not Found - CDB');

  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div className="suggestions">
        <p>Here are some helpful links:</p>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/challenges">Challenges</Link></li>
          <li><Link to="/leaderboard">Leaderboard</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default NotFoundPage;