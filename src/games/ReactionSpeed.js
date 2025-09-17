import React, { useState, useEffect, useRef } from 'react';
import { saveTimes, loadTimes } from '../utils/storage';
import GameWrapper from './GameWrapper';
import reactionSpeedVideo from '../assets/Reaction_Speed.mp4';
import { loadUserToken } from '../utils/storage';


const API_URL = 'http://localhost:5000/api';


function ReactionSpeed({ selectedGame = 'Reaction Speed' , userId}) {
  const [position, setPosition] = useState({ top: 0, left: 0, display: 'none' });
  const [startTime, setStartTime] = useState(null);
  const [times, setTimes] = useState([]);
  const [lastTime, setLastTime] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [flashColor, setFlashColor] = useState(null);

  const PENALTY_TIME = 200; 
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

  const handleStimulusClick = (event) => {
    event.stopPropagation();
    
    if (!startTime) return;

    const reactionTime = Date.now() - startTime;
    setLastTime(reactionTime);

    const newTimes = [...times, reactionTime];
    setTimes(newTimes);

    console.log("New reaction time recorded:", reactionTime);
    console.log("All times:", newTimes);

    console.log(`Saving stats to local storage for user: ${userId} and game: ${selectedGame}`);
    saveTimes(selectedGame, newTimes, userId);

    setFlashColor('green');
    setTimeout(() => setFlashColor(null), 200);

    setPosition(prev => ({ ...prev, display: 'none' }));
    showStimulus();
  };

  const handleGameAreaClick = () => {
    if (startTime) {
      setStartTime(prevStartTime => prevStartTime - PENALTY_TIME);
      setFlashColor('red');
      setTimeout(() => setFlashColor(null), 200);
    }
  };

  useEffect(() => {
    console.log(`Loading stats from local storage for user: ${userId} and game: ${selectedGame}`);
    const loaded = loadTimes(selectedGame, userId);
    setTimes(Array.isArray(loaded) ? loaded : []);
    setLastTime(null);
  }, [selectedGame, userId]);
  
  const handleStart = () => {
    setShowPopup(true);
    setLastTime(null);
    showStimulus();
  };

  const handleStop = () => {
    setShowPopup(false);
    setStartTime(null);
    setPosition({ top: 0, left: 0, display: 'none' });
  };

  console.log(`Passing lastScore: ${lastTime} and userId: ${userId} to GameWrapper`);


  return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: 'calc(100vh - 100px)',
          position: 'relative',
        }}
      >
        

      <GameWrapper
        onStart={handleStart}
        onStop={handleStop}
        videoSrc={reactionSpeedVideo}
        selectedGame={selectedGame}
        lastScore={lastTime} // Pass the lastTime score
        userId={userId} // Pass the userId
      />
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            ref={gameAreaRef}
            onClick={handleGameAreaClick}
            style={{
              width: '90%',
              height: '90%',
              backgroundColor: flashColor || '#f8f9fa',
              transition: 'background-color 0.2s ease-in-out',
              border: '2px solid #333',
              borderRadius: '12px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            {/* Close button/icon for the popup */}
            <button 
              onClick={handleStop} // Use handleStop to close the popup
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#667',
                fontSize: '30px',
                cursor: 'pointer',
                zIndex: 1001,
                lineHeight: 1,
              }}
            >
              &times;
            </button>
            <div
              className="stimulus"
              onClick={handleStimulusClick}
              style={{
                position: 'absolute',
                width: STIM_SIZE + 'px',
                height: STIM_SIZE + 'px',
                borderRadius: '50%',
                backgroundColor: startTime ? '#00d1b2' : 'grey',
                top: position.top,
                left: position.left,
                display: position.display,
                cursor: 'pointer',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                transition: 'background-color 0.2s ease-in-out',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ReactionSpeed;