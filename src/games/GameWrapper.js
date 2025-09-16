// components/GameWrapper.js
import React, { useState, useEffect } from 'react';

function GameWrapper({ children, onStart, onStop }) {
  const [countdown, setCountdown] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const startGame = () => {
    setCountdown(3);
    setIsRunning(false);
  };

  const stopGame = () => {
    setCountdown(null);
    setIsRunning(false);
    if (onStop) onStop();
  };

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
  }, [countdown]);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {!isRunning && countdown === null && (
        <button onClick={startGame} style={btnStyle}>Start</button>
      )}
      {isRunning && (
        <button onClick={stopGame} style={btnStyle}>Stop</button>
      )}
      {countdown !== null && (
        <h2 style={{ fontSize: '48px', marginTop: '20px' }}>
          {countdown > 0 ? countdown : 'GO!'}
        </h2>
      )}

      {/* Render children game only when running */}
      {isRunning && children}
    </div>
  );
}

const btnStyle = {
  backgroundColor: '#6200ea',
  color: 'white',
  border: 'none',
  borderRadius: '12px',       // slightly rounder
  padding: '16px 32px',       // bigger size
  fontSize: '24px',           // bigger text
  cursor: 'pointer',
  marginBottom: '20px',
  display: 'inline-block',    // ensures proper centering
};

export default GameWrapper;
