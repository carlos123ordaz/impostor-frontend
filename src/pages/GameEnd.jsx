import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Skull, PartyPopper, RefreshCw, LogOut } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const GameEnd = () => {
    const { gameResult, role, isAdmin, restartGame, leaveGame } = useGame();

    if (!gameResult) return null;

    const playerWon = role.isImpostor ? !gameResult.impostorFound : gameResult.impostorFound;
    const resultTitle = gameResult?.impostorFound
        ? '¡Los Jugadores Ganaron!'
        : '¡El Impostor Ganó!';


    return (
        <>
            <SEOHead
                title={`${resultTitle} - Resultado Final | Impostor Game`}
                description={`La ronda ha terminado. ${resultTitle} Juega de nuevo en Impostor Game.`}
                keywords="resultado juego, final impostor, siguiente ronda"
                image="/og-image-gameend.png"
                url={`https://impostor.lat/game/${room?.roomCode}/result`}
                type="article"
            />

            <div className="space-y-6">
                {/* Resultado principal */}
                <div className={`
        rounded-3xl shadow-2xl p-12 text-center text-white
        ${gameResult.impostorFound
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                        : 'bg-gradient-to-br from-red-500 to-pink-600'}
      `}>
                    <div className="inline-block p-6 bg-white/20 rounded-full mb-6 animate-bounce">
                        {gameResult.impostorFound ? (
                            <Trophy size={64} />
                        ) : (
                            <Skull size={64} />
                        )}
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black mb-4">
                        {gameResult.impostorFound ? '¡JUGADORES GANAN!' : '¡IMPOSTOR GANA!'}
                    </h1>

                    <p className="text-2xl opacity-90 mb-8">
                        {gameResult.impostorFound
                            ? '¡Encontraron al impostor!'
                            : '¡El impostor no fue descubierto!'}
                    </p>

                    {/* Tu resultado personal */}
                    <div className={`
          inline-block px-8 py-4 rounded-2xl font-bold text-xl
          ${playerWon ? 'bg-yellow-400 text-yellow-900' : 'bg-white/20'}
        `}>
                        {playerWon ? (
                            <span className="flex items-center gap-2">
                                <PartyPopper size={24} />
                                ¡GANASTE!
                            </span>
                        ) : (
                            '¡PERDISTE!'
                        )}
                    </div>
                </div>

                {/* Información del juego */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Información del Juego</h3>

                    {/* Votado */}
                    {gameResult.votedOutPlayer && (
                        <div className="mb-6 p-6 bg-red-50 rounded-2xl">
                            <p className="text-sm text-gray-600 mb-2">Jugador Votado:</p>
                            <div className="flex items-center justify-between">
                                <p className="text-2xl font-black text-red-600">
                                    {gameResult.votedOutPlayer.name}
                                </p>
                                <span className={`
                px-4 py-2 rounded-full font-bold text-sm
                ${gameResult.votedOutPlayer.isImpostor
                                        ? 'bg-red-600 text-white'
                                        : 'bg-blue-600 text-white'}
              `}>
                                    {gameResult.votedOutPlayer.isImpostor ? 'IMPOSTOR' : 'JUGADOR'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Impostores */}
                    <div className="mb-6 p-6 bg-purple-50 rounded-2xl">
                        <p className="text-sm text-gray-600 mb-3">
                            {gameResult.impostors.length > 1 ? 'Los Impostores eran:' : 'El Impostor era:'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {gameResult.impostors.map((impostorName, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-red-600 text-white rounded-full font-bold"
                                >
                                    {impostorName}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Palabra */}
                    <div className="p-6 bg-blue-50 rounded-2xl">
                        <p className="text-sm text-gray-600 mb-2">La Palabra era:</p>
                        <p className="text-4xl font-black text-blue-600">
                            {gameResult.word}
                        </p>
                    </div>

                    {/* Resultados de votación */}
                    {gameResult.voteCounts && Object.keys(gameResult.voteCounts).length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-bold text-gray-800 mb-4">Resultados de la Votación:</h4>
                            <div className="space-y-2">
                                {Object.entries(gameResult.voteCounts)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([playerId, votes]) => {
                                        return (
                                            <div
                                                key={playerId}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <span className="font-semibold text-gray-700">Jugador</span>
                                                <span className="font-bold text-purple-600">{votes} votos</span>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4">
                    {isAdmin ? (
                        <>
                            <button
                                onClick={restartGame}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:scale-105 transform transition-all shadow-lg flex items-center justify-center gap-3"
                            >
                                <RefreshCw size={24} />
                                Jugar de Nuevo
                            </button>
                            <button
                                onClick={leaveGame}
                                className="flex-1 bg-gray-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:scale-105 transform transition-all shadow-lg flex items-center justify-center gap-3"
                            >
                                <LogOut size={24} />
                                Salir
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex-1 text-center p-6 bg-yellow-50 rounded-2xl">
                                <p className="text-yellow-800 font-semibold">
                                    Esperando a que el administrador decida...
                                </p>
                            </div>
                            <button
                                onClick={leaveGame}
                                className="bg-gray-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:scale-105 transform transition-all shadow-lg flex items-center justify-center gap-3"
                            >
                                <LogOut size={24} />
                                Salir
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default GameEnd;