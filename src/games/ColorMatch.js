import React, { useState, useEffect } from 'react';

import { saveTimes, loadTimes } from '../utils/storage';
import GameWrapper from './GameWrapper';
import colorMatchVideo from '../assets/Color_Match.mp4';

const COLORS = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];

function ColorMatch({ selectedGame = 'Color Match', userId }) {
  const [word, setWord] = useState('');
  const [color, setColor] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [times, setTimes] = useState([]); // Use this to store all times
  const [feedback, setFeedback] = useState('');
  const [flashColor, setFlashColor] = useState(null);

  const PENALTY_TIME = 200;

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
      setFlashColor('green');
    } else {
      setStartTime((prevStartTime) => prevStartTime - PENALTY_TIME);
      setFlashColor('red');
    }

    setTimeout(() => setFlashColor(null), 200);

    const saved = loadTimes(selectedGame, userId);
    const newTimes = Array.isArray(saved) ? [...saved, reactionTime] : [reactionTime];

    saveTimes(selectedGame, newTimes, userId);

    setTimeout(() => setFeedback(''), 700);
    nextChallenge();
  };

  const handleStart = () => {
    nextChallenge();
  };

  const handleStop = () => {
    // Calculate and return the average score from all attempts
    if (times.length > 0) {
      const totalTime = times.reduce((sum, time) => sum + time, 0);
      const avgTime = Math.round(totalTime / times.length);
      return avgTime;
    }
    return null;
  };

  useEffect(() => {
    const loaded = loadTimes(selectedGame, userId);
    if (Array.isArray(loaded)) {
      setTimes(loaded);
    }
    // nextChallenge() is handled by the GameWrapper's onStart prop
  }, [selectedGame, userId]);

  return (
    <GameWrapper
      onStart={handleStart}
      onStop={handleStop}
      videoSrc={colorMatchVideo}
      selectedGame={selectedGame}
      lastScore={
        times.length > 0
          ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
          : null
      }
      userId={userId} // Pass the userId
    >
      <div
        className="card"
        style={{
          textAlign: 'center',
          userSelect: 'none',
          backgroundColor: flashColor || 'white',
          transition: 'background-color 0.2s ease-in-out',
          padding: '20px',
          borderRadius: '12px',
        }}
      >
        <h1>{selectedGame}</h1>

        <p>
          Decide if the <strong>word matches the color</strong>!
        </p>

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
            <div style={{ fontSize: '48px', marginTop: '10px' }}>{feedback}</div>
          )}
        </div>
      </div>
    </GameWrapper>
  );
}

export default ColorMatch;
