// src/App.jsx
import { lazy, Suspense } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Layout from './components/Layout';

const Lobby = lazy(() => import('./pages/Lobby'));
const WaitingRoom = lazy(() => import('./pages/WaitingRoom'));
const RoleReveal = lazy(() => import('./pages/RoleReveal'));
const Playing = lazy(() => import('./pages/Playing'));
const Voting = lazy(() => import('./pages/Voting'));
const GameEnd = lazy(() => import('./pages/GameEnd'));

const GameRouter = () => {
  const { gameState } = useGame();

  const componentMap = {
    'lobby': <Lobby />,
    'waiting': <WaitingRoom />,
    'role-reveal': <RoleReveal />,
    'playing': <Playing />,
    'voting': <Voting />,
    'ended': <GameEnd />
  };

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      {componentMap[gameState] || <Lobby />}
    </Suspense>
  );
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