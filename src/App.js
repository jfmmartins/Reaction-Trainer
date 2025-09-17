// src/App.js

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Auth from './components/Auth';
import { loadUserToken } from './utils/storage';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [selectedPage, setSelectedPage] = useState('Home');
  const [selectedGame, setSelectedGame] = useState('Reaction Speed');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = loadUserToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded.user);
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('userToken'); 
      }
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setSelectedPage('Home');
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
    setSelectedPage('Home');
  };

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  console.log(`App.js: ${user.id} and game: ${selectedGame}`);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <Sidebar
        pages={['Home', 'Stats']}
        games={['Reaction Speed', 'Color Match', 'Reflex Challenge']}
        selectedPage={selectedPage}
        onSelectPage={setSelectedPage}
        selectedGame={selectedGame}
        onSelectGame={setSelectedGame}
        onLogout={handleLogout}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '20px', backgroundColor: '#f4f4f4' }}>
        {selectedPage === 'Home' && <Home selectedGame={selectedGame} userId={user.id} />}
        {selectedPage === 'Stats' && <Stats selectedGame={selectedGame} userId={user.id} />}
      </div>
    </div>
  );
}

export default App;