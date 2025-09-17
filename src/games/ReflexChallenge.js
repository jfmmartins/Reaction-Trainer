import React, { useState, useEffect } from 'react';
import { saveTimes, loadTimes } from '../utils/storage';
import GameWrapper from './GameWrapper';
import ReflexChallengeVideo from '../assets/Reflex_Challenge.mp4';



const COLORS = ['red', 'green', 'blue', 'yellow'];

function ReflexChallenge({ selectedGame = 'Reflex Challenge' , userId}) {
  const [color, setColor] = useState(COLORS[0]);
  const [startTime, setStartTime] = useState(null);
  const [times, setTimes] = useState([]);
  const [flashColor, setFlashColor] = useState(null);
  const [lastTime, setLastTime] = useState(null);
  const [lastScore, setLastScore] = useState(null);

  const PENALTY_TIME = 200; 
  

  const nextColor = () => {
    let newColor;
    do {
      newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    } while (newColor === color);
    setColor(newColor);
    setStartTime(Date.now());
  };

  const handleClick = (clickedColor) => {
    if (startTime === null) return; // Prevent clicks before the game starts

    if (clickedColor === color) {
      const reactionTime = Date.now() - startTime;
      const newTimes = [...times, reactionTime];
      setTimes(newTimes);
      setLastTime(reactionTime);
      saveTimes(selectedGame, newTimes, userId);
      setFlashColor('green');
      setTimeout(() => setFlashColor(null), 200);
      setTimeout(() => nextColor(), 200);
    } else {
      setStartTime(prevStartTime => prevStartTime - PENALTY_TIME);
      setFlashColor('red');
      setTimeout(() => setFlashColor(null), 200);
    }
  };

  const handleStart = () => {
    nextColor();
  };

  const handleStop = () => {
    // Calculate the average time before ending the game
    if (times.length > 0) {
      const totalTime = times.reduce((sum, time) => sum + time, 0);
      const avgTime = Math.round(totalTime / times.length);
      setLastScore(avgTime);
    }
    else {
      setLastScore(null);
    }
    return null;
  };

  return (
      <GameWrapper
        onStart={handleStart}
        onStop={handleStop}
        videoSrc={ReflexChallengeVideo}
        selectedGame={selectedGame}
        lastScore={lastScore} // Pass the lastTime score
        userId={userId} // Pass the userId
      >
    <div className="card" style={{
      textAlign: 'center',
      padding: '20px',
      backgroundColor: flashColor || '#f8f9fa',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      margin: 'auto',
      maxWidth: '500px',
      transition: 'background-color 0.2s ease-in-out',
    }}>
      <h1 style={{ fontSize: '2em', marginBottom: '10px' }}>{selectedGame}</h1>
      <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '30px' }}>Click the <strong>{color.toUpperCase()}</strong> button!</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => handleClick(c)}
            style={{
              backgroundColor: c,
              width: '80px', // Larger size
              height: '80px',
              borderRadius: '50%', // Perfect circle
              border: '4px solid #fff',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              transition: 'transform 0.1s, box-shadow 0.1s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          />
        ))}
      </div>
    </div>
  </GameWrapper>
  );
}

export default ReflexChallenge;
