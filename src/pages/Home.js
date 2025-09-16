import ReactionSpeed from '../games/ReactionSpeed';
import ReflexChallenge from '../games/ReflexChallenge';
import ColorMatch from '../games/ColorMatch';

function Home({ selectedGame }) {
  const renderGame = () => {
    switch(selectedGame) {
      case 'Reaction Speed': return <ReactionSpeed />;
      case 'Reflex Challenge': return <ReflexChallenge />;
      case 'Color Match': return <ColorMatch />;
      default: return <ReactionSpeed />;
    }
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',   // horizontal centering
        alignItems: 'flex-start',   // top alignment
        paddingTop: '40px',         // space from top
        position: 'relative',
      }}
    >
      {renderGame()}
    </div>
  );
}

export default Home;
