import React,{useState} from 'react';
import { FaLongArrowAltLeft, FaLongArrowAltRight, FaHome } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { IoSpeedometer } from "react-icons/io5";
import { IoMdColorPalette } from "react-icons/io";
import { FaBoltLightning } from "react-icons/fa6";
import { MdOutlineMenu } from "react-icons/md";


function Sidebar({ pages, games, selectedPage, onSelectPage, selectedGame, onSelectGame, onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const pageEmojis = {
  'Home': <FaHome />,
  'Stats': <GoGraph />,
  // 'Profile': '👤',
  // 'Settings': '⚙️',
  // 'Leaderboards': '🏆',
  // 'About': 'ℹ️',
  };

  const gameEmojis = {
    'Reaction Speed': <IoSpeedometer />,
    'Color Match': <IoMdColorPalette />,
    'Reflex Challenge': <FaBoltLightning />,
  };

  const logoutButtonStyle = {
    padding: '10px 15px',
    backgroundColor: '#e63946',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: 'auto',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={{
      width: isCollapsed ? '60px' : '220px',
      backgroundColor: '#222',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      transition: 'width 0.3s ease',
      overflow: 'hidden',
    }}>
      <div 
        onClick={handleToggle} 
        style={{
          cursor: 'pointer',
          textAlign: 'right',
          fontSize: '24px',
          marginBottom: '20px',
        }}
      >
        {isCollapsed ? <FaLongArrowAltRight /> : <FaLongArrowAltLeft />}
      </div>
        {isCollapsed ? (
        <>
          <h2 style={{ marginBottom: '20px', fontSize: '18px', textAlign: 'center' }}><MdOutlineMenu /></h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {pages.map((page) => (
              <li
                key={page}
                onClick={() => onSelectPage(page)}
                style={{
                  padding: '12px 0',
                  cursor: 'pointer',
                  textAlign: 'center',
                  color: page === selectedPage ? '#00d1b2' : 'white',
                }}
              >
                <span role="img" aria-label={page} style={{ fontSize: '24px' }}>
                  {pageEmojis[page] || '📄'} {/* Fallback emoji */}
                </span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '30px' }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {games.map((game) => (
                <li
                  key={game}
                  onClick={() => onSelectGame(game)}
                  style={{
                    padding: '12px 0',
                    cursor: 'pointer',
                    textAlign: 'center',
                    color: game === selectedGame ? '#00d1b2' : 'white',
                  }}
                >
                  <span role="img" aria-label={game} style={{ fontSize: '24px' }}>
                    {gameEmojis[game] || '🎮'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <button 
            onClick={onLogout} 
            style={{ ...logoutButtonStyle, padding: '10px', fontSize: '18px' }}
          >
            &#x2192;
          </button>
        </>
      ) : (
        // Expanded View (Full Text)
        <>
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
                  <span role="img" aria-label={page} style={{ marginRight: '10px' }}>
                    {pageEmojis[page] || '📄'}
                  </span>
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
                  <span role="img" aria-label={game} style={{ marginRight: '10px' }}>
                    {gameEmojis[game] || '🎮'}
                  </span>
                  {game}
                </li>
              ))}
            </ul>
          </div>
          <button 
            onClick={onLogout} 
            style={logoutButtonStyle}
          >
            Log Out
          </button>
        </>
      )}
    </div>
  );
}

export default Sidebar;
