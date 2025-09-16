import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Stats from './pages/Stats';
function App() {
  const [selectedPage, setSelectedPage] = useState('Home');
  const [selectedGame, setSelectedGame] = useState('Reaction Speed');

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <Sidebar
        pages={['Home', 'Stats']}
        games={['Reaction Speed', 'Color Match', 'Reflex Challenge']}
        selectedPage={selectedPage}
        onSelectPage={setSelectedPage}
        selectedGame={selectedGame}
        onSelectGame={setSelectedGame}
      />

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px', backgroundColor: '#f4f4f4' }}>
        {selectedPage === 'Home' && <Home selectedGame={selectedGame} />}
        {selectedPage === 'Stats' && <Stats selectedGame={selectedGame} />}
      </div>
    </div>
  );
}

export default App;