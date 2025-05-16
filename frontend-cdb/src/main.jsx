import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx';
import { ChallengeProvider } from './contexts/ChallengeContext.jsx';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ChallengeProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </ChallengeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);