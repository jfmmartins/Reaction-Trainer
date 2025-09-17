import ReactionSpeed from '../games/ReactionSpeed';
import ReflexChallenge from '../games/ReflexChallenge';
import ColorMatch from '../games/ColorMatch';

function Home({ selectedGame, userId }) {
  const renderGame = () => {
    switch(selectedGame) {
      case 'Reaction Speed':
        return <ReactionSpeed userId={userId} />;
      case 'Color Match':
        return <ColorMatch userId={userId} />;
      case 'Reflex Challenge':
        return <ReflexChallenge userId={userId} />;
      default: return <ReactionSpeed />;
    }
  }

  console.log(`Home: ${userId} and game: ${selectedGame}`);


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
