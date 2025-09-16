import React, { useState, useEffect } from 'react';
import { saveTimes, loadTimes } from '../utils/storage';
import GameWrapper from './GameWrapper';


const COLORS = ['red', 'green', 'blue', 'yellow'];

function ReflexChallenge({ selectedGame = 'Reflex Challenge' }, userId) {
  const [color, setColor] = useState(COLORS[0]);
  const [startTime, setStartTime] = useState(null);
  const [times, setTimes] = useState([]);

  const nextColor = () => {
    const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setColor(newColor);
    setStartTime(Date.now());
  };

  const handleClick = (clickedColor) => {
    if(clickedColor === color) {
      const reactionTime = Date.now() - startTime;
      const newTimes = [...times, reactionTime];
      setTimes(newTimes);
      saveTimes(selectedGame, newTimes, userId);
      nextColor();
    }
  };

  useEffect(() => {
    const loaded = loadTimes(selectedGame, userId);
    setTimes(loaded);
    nextColor();
  }, [selectedGame, userId]);

  return (
    <GameWrapper   
      onStart={() => setStartTime(Date.now())} 
      onStop={() => setStartTime(null)}
    >
    <div className="card">
        <h1>{selectedGame}</h1>
        <p>Click the <strong>{color.toUpperCase()}</strong> button!</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => handleClick(c)}
              style={{ backgroundColor: c, color: '#fff', padding: '15px 25px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </GameWrapper>
  );
}

export default ReflexChallenge;
