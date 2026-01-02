import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Layout from './components/Layout';
import Lobby from './pages/Lobby';
import WaitingRoom from './pages/WaitingRoom';
import RoleReveal from './pages/RoleReveal';
import Playing from './pages/Playing';
import Voting from './pages/Voting';
import GameEnd from './pages/GameEnd';

const GameRouter = () => {
  const { gameState } = useGame();

  switch (gameState) {
    case 'lobby':
      return <Lobby />;
    case 'waiting':
      return <WaitingRoom />;
    case 'role-reveal':
      return <RoleReveal />;
    case 'playing':
      return <Playing />;
    case 'voting':
      return <Voting />;
    case 'ended':
      return <GameEnd />;
    default:
      return <Lobby />;
  }
};

function App() {
  return (
    <GameProvider>
      <Layout>
        <GameRouter />
      </Layout>
    </GameProvider>
  );
}

export default App;