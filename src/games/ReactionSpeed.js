import React, { useState, useEffect, useRef } from 'react';
import { saveTimes, loadTimes } from '../utils/storage';
import GameWrapper from './GameWrapper';

function ReactionSpeed({ selectedGame = 'Reaction Speed' }, userId) {
  const [position, setPosition] = useState({ top: 0, left: 0, display: 'none' });
  const [startTime, setStartTime] = useState(null);
  const [times, setTimes] = useState([]);
  const [lastTime, setLastTime] = useState(null);

  const gameAreaRef = useRef(null);
  const STIM_SIZE = 50;

  const randomPosition = () => {
    const container = gameAreaRef.current;
    if (!container || container.clientHeight === 0) return { top: 0, left: 0, display: 'none' };

    const { clientWidth, clientHeight } = container;
    const top = Math.random() * (clientHeight - STIM_SIZE);
    const left = Math.random() * (clientWidth - STIM_SIZE);

    return { top: top + 'px', left: left + 'px', display: 'block' };
  };

  const showStimulus = () => {
    const delay = Math.random() * 2000 + 500;
    setTimeout(() => {
      setPosition(randomPosition());
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (!startTime) return;

    const reactionTime = Date.now() - startTime;
    setLastTime(reactionTime);

    const newTimes = [...times, reactionTime];
    setTimes(newTimes);
    saveTimes(selectedGame, newTimes, userId);

    setPosition(prev => ({ ...prev, display: 'none' }));
    showStimulus();
  };

  useEffect(() => {
    const loaded = loadTimes(selectedGame, userId);
    setTimes(Array.isArray(loaded) ? loaded : []);
    setLastTime(null);
  }, [selectedGame, userId]);
  
  const handleStart = () => {
    setTimes([]);
    setLastTime(null);
    showStimulus();
  };

  const handleStop = () => {
    setStartTime(null);
    setPosition({ top: 0, left: 0, display: 'none' });
  };

  return (
    <GameWrapper onStart={handleStart} onStop={handleStop}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: 'calc(100vh - 100px)',
          position: 'relative',
        }}
      >
        <h1 style={{ 
          textAlign: 'center', 
          flexShrink: 0,
          margin: '10px 0',
          fontSize: '24px'
        }}>
          {selectedGame}
        </h1>
        
        {lastTime !== null && (
          <p style={{ 
            textAlign: 'center', 
            flexShrink: 0, 
            margin: '5px 0 15px',
            color: '#666'
          }}>
            Last Reaction: {lastTime} ms
          </p>
        )}

        {/* This is the game area that needs to expand */}
        <div
          ref={gameAreaRef}
          style={{
            flexGrow: 1,
            position: 'fixed', // Break out of parent constraints
            top: '30%', // Adjust based on your header height
            left: '18%', // Adjust to your sidebar width
            right: '1%', // Right margin
            bottom: '1%', // Bottom margin
            border: '2px solid #333',
            borderRadius: '12px',
            backgroundColor: '#f8f9fa',
            overflow: 'hidden',
            zIndex: 999,
          }}
        >
          <div
            className="stimulus"
            style={{
              position: 'absolute',
              width: STIM_SIZE + 'px',
              height: STIM_SIZE + 'px',
              borderRadius: '50%',
              backgroundColor: startTime ? 'green' : 'grey',
              top: position.top,
              left: position.left,
              display: position.display,
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
              transition: 'background-color 0.2s ease-in-out',
            }}
            onClick={handleClick}
          />
        </div>
      </div>
    </GameWrapper>
  );
}

export default ReactionSpeed;