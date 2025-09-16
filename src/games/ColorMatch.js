import React, { useState, useEffect } from 'react';
import { saveTimes, loadTimes } from '../utils/storage';
import GameWrapper from './GameWrapper';


const COLORS = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];

function ColorMatch({ selectedGame = 'Color Match', userId }) {
  const [word, setWord] = useState('');
  const [color, setColor] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [lastTime, setLastTime] = useState(null);
  const [feedback, setFeedback] = useState('');

  const nextChallenge = () => {
    const newWord = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setWord(newWord);
    setColor(newColor);
    setStartTime(Date.now());
  };

  const handleEvaluation = (userThinksMatch) => {
    if (!startTime) return;

    const actualMatch = word === color;
    const reactionTime = Date.now() - startTime;

    if (userThinksMatch === actualMatch) {
      setFeedback('Right');
    } else {
      setFeedback('Wrong');
    }

    const saved = loadTimes(selectedGame, userId);
    const newTimes = Array.isArray(saved) ? [...saved, reactionTime] : [reactionTime];

    saveTimes(selectedGame, newTimes, userId);

    setTimeout(() => setFeedback(''), 700);
    nextChallenge();
  };

  useEffect(() => {
    loadTimes(selectedGame, userId);
    nextChallenge();
  }, [selectedGame, userId]);

  return (
    <GameWrapper   
      onStart={() => setStartTime(Date.now())} 
      onStop={() => setStartTime(null)}
    >
      <div className="card" style={{ textAlign: 'center', userSelect: 'none' }}>
        <h1>{selectedGame}</h1>
        {lastTime !== null && <p>Last Reaction: {lastTime} ms</p>}

        <p>Decide if the <strong>word matches the color</strong>!</p>

        <div
          style={{
            fontSize: '60px',
            fontWeight: 'bold',
            color: color,
            margin: '20px 0',
          }}
        >
          {word.toUpperCase()}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            fontSize: '50px',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', gap: '50px' }}>
            <span onClick={() => handleEvaluation(true)}>✅</span>
            <span onClick={() => handleEvaluation(false)}>❌</span>
          </div>

          {feedback && (
            <div style={{ fontSize: '48px', marginTop: '10px' }}>
              {feedback}
            </div>
          )}
        </div>
      </div>
    </GameWrapper>
  );
}

export default ColorMatch;
