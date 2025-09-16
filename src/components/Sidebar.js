import React from 'react';

function Sidebar({ pages, games, selectedPage, onSelectPage, selectedGame, onSelectGame }) {
  return (
    <div style={{
      width: '220px',
      backgroundColor: '#222',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
    }}>
      <h2 style={{ marginBottom: '20px' }}>Menu</h2>

      <div>
        <h3>Pages</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pages.map((page) => (
            <li
              key={page}
              onClick={() => onSelectPage(page)}
              style={{
                padding: '8px 0',
                cursor: 'pointer',
                color: page === selectedPage ? '#00d1b2' : 'white',
                fontWeight: page === selectedPage ? 'bold' : 'normal',
              }}
            >
              {page}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Games</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {games.map((game) => (
            <li
              key={game}
              onClick={() => onSelectGame(game)}
              style={{
                padding: '8px 0',
                cursor: 'pointer',
                color: game === selectedGame ? '#00d1b2' : 'white',
                fontWeight: game === selectedGame ? 'bold' : 'normal',
              }}
            >
              {game}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
