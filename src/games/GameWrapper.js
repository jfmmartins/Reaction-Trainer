import React, { useState, useEffect } from 'react';
import { loadUserToken, saveUserToken } from '../utils/storage';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/api';

async function refreshAuthToken() {
  const token = loadUserToken();
  if (!token) return;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Refresh the token if less than 5 minutes remain (300 seconds)
    if (decoded.exp - currentTime < 300) {
      console.log('Token is about to expire, refreshing...');
      const response = await fetch(`${API_URL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const { token: newToken } = await response.json();
        saveUserToken(newToken);
        return newToken;
      } else {
        console.error('Failed to refresh token:', await response.json());
        return null;
      }
    }
  } catch (error) {
    console.error('Token decoding or refresh failed:', error);
    return null;
  }
  
  return token;
}

function GameWrapper({ children, onStart, onStop, videoSrc, selectedGame, lastScore, userId }) {
  const [countdown, setCountdown] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = () => {
    setCountdown(3);
    setIsRunning(false);
    setIsPlaying(true);
  };

  const stopGame = () => {
    setCountdown(null);
    setIsRunning(false);
    setIsPlaying(false);
    if (onStop) onStop();
  };

  // Keep only this first useEffect block for score submission
  useEffect(() => {
    if (lastScore !== null && userId) {
      console.log('Attempting to save score:', { selectedGame, lastScore, userId });

      const saveScore = async () => {
        const token = await refreshAuthToken();

        if (!token) {
          console.error('Could not get a valid token. User may be logged out.');
          return;
        }

        try {
          const response = await fetch(`${API_URL}/score`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              game: selectedGame,
              time: lastScore,
            }),
          });

          if (response.ok) {
            console.log('Score saved successfully!');
          } else {
            const errorData = await response.json();
            console.error('Failed to save score:', errorData);
          }
        } catch (error) {
          console.error('Network error:', error);
        }
      };
      
      saveScore();
    }
  }, [lastScore, selectedGame, userId]);

  // Keep this second useEffect block for the countdown logic
  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCountdown(null);
      setIsRunning(true);
      if (onStart) onStart();
    }
    return () => clearTimeout(timer);
  }, [countdown, onStart]);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {!isPlaying && (
        <div style={flexContainerStyle}>
          <button onClick={startGame} style={btnStyle}>
            Start
          </button>
          {videoSrc && (
            <div style={videoContainerStyle}>
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                style={videoStyle}
              />
            </div>
          )}
        </div>
      )}

      {isPlaying && (
        <button onClick={stopGame} style={btnStyle}>
          Stop
        </button>
      )}

      {countdown !== null && (
        <h2 style={{ fontSize: '48px', marginTop: '20px' }}>
          {countdown > 0 ? countdown : 'GO!'}
        </h2>
      )}

      {isRunning && children}
    </div>
  );
}

const btnStyle = {
  backgroundColor: '#00d1b2',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  padding: '16px 32px',
  fontSize: '24px',
  cursor: 'pointer',
  marginBottom: '20px',
  display: 'inline-block',
};

const videoStyle = {
  width: '100%',
  borderRadius: '12px',
};

const videoContainerStyle = {
  width: '100%',
  maxWidth: '600px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  borderRadius: 20,
  padding: '0',
  margin: '0',
  overflow: 'hidden',
};

const flexContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export default GameWrapper;