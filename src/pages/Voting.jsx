import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { Vote, CheckCircle, User } from 'lucide-react';

const Voting = () => {
    const { room, playerId, vote } = useGame();
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);

    // Usar useMemo para recalcular cuando room cambie
    const votedCount = useMemo(() => {
        if (!room) return 0;
        return room.players.filter(p => p.hasVoted).length;
    }, [room]);

    const totalPlayers = useMemo(() => {
        if (!room) return 0;
        return room.players.length;
    }, [room]);

    // Sincronizar hasVoted con el estado del servidor
    useEffect(() => {
        if (room && playerId) {
            const currentPlayer = room.players.find(p => p.id === playerId);
            const votedCount = room.players.filter(p => p.hasVoted).length;
            const totalPlayers = room.players.length;

            console.log('🔍 Verificando estado de voto...', {
                votedCount,
                totalPlayers,
                roomPlayers: room.players.map(p => ({ name: p.name, hasVoted: p.hasVoted })),
                myId: playerId
            });

            console.log('👤 Mi estado:', currentPlayer);

            if (currentPlayer?.hasVoted) {
                console.log('✅ Ya voté, actualizando UI');
                setHasVoted(true);
                // Guardar por quién voté
                if (currentPlayer.votedFor) {
                    setSelectedPlayer(currentPlayer.votedFor);
                }
            } else {
                console.log('⏳ Aún no he votado');
                setHasVoted(false);
            }
        }
    }, [room, playerId]);

    if (!room) return null;

    const currentPlayer = room.players.find(p => p.id === playerId);

    const handleVote = () => {
        if (!selectedPlayer) return;
        console.log('📤 Enviando voto por:', selectedPlayer);
        vote(selectedPlayer);
        setHasVoted(true);
    };

    console.log('📊 Estado de votación:', { votedCount, totalPlayers, hasVoted, currentPlayer: room?.players.find(p => p.id === playerId) });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl shadow-2xl p-8 text-white text-center">
                <div className="inline-block p-4 bg-white/20 rounded-full mb-4 animate-bounce">
                    <Vote size={48} />
                </div>
                <h1 className="text-4xl font-black mb-2">¡HORA DE VOTAR!</h1>
                <p className="text-xl opacity-90">
                    ¿Quién crees que es el impostor?
                </p>
            </div>

            {/* Progreso de votación */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-700">Progreso de Votación</span>
                    <span className="font-bold text-purple-600">{votedCount}/{totalPlayers}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(votedCount / totalPlayers) * 100}%` }}
                    />
                </div>
            </div>

            {/* Panel de votación */}
            {!hasVoted && !currentPlayer?.hasVoted ? (
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Selecciona a quién votar
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {room.players
                            .filter(p => p.id !== playerId)
                            .map((player) => (
                                <button
                                    key={player.id}
                                    onClick={() => setSelectedPlayer(player.id)}
                                    className={`
                    p-6 rounded-2xl border-2 transition-all transform hover:scale-105
                    ${selectedPlayer === player.id
                                            ? 'border-red-500 bg-red-50 shadow-lg scale-105'
                                            : 'border-gray-200 hover:border-red-300 bg-gray-50'}
                  `}
                                >
                                    <div className={`
                    w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 transition-all
                    ${selectedPlayer === player.id
                                            ? 'bg-gradient-to-br from-red-500 to-pink-600 animate-pulse'
                                            : 'bg-gradient-to-br from-gray-400 to-gray-500'}
                  `}>
                                        <User size={32} className="text-white" />
                                    </div>
                                    <p className={`
                    font-bold text-center transition-colors
                    ${selectedPlayer === player.id ? 'text-red-600' : 'text-gray-700'}
                  `}>
                                        {player.name}
                                    </p>
                                    {player.hasVoted && (
                                        <p className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                                            <CheckCircle size={12} />
                                            Ya votó
                                        </p>
                                    )}
                                </button>
                            ))}
                    </div>

                    <button
                        onClick={handleVote}
                        disabled={!selectedPlayer}
                        className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:scale-105 transform transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                    >
                        <Vote size={24} />
                        Confirmar Voto
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-2xl p-12 text-center animate-fade-in">
                    <div className="inline-block p-6 bg-green-100 rounded-full mb-6 animate-bounce">
                        <CheckCircle size={64} className="text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-3">
                        ¡Voto Registrado!
                    </h3>
                    <p className="text-lg text-gray-600 mb-2">
                        Esperando a que los demás jugadores voten...
                    </p>

                    {selectedPlayer && (
                        <div className="mt-4 inline-block bg-red-50 px-6 py-3 rounded-xl">
                            <p className="text-sm text-gray-600">Votaste por:</p>
                            <p className="text-xl font-bold text-red-600">
                                {room.players.find(p => p.id === selectedPlayer)?.name || 'Jugador'}
                            </p>
                        </div>
                    )}

                    <div className="mt-8 inline-block">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de quién votó */}
            <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-700 mb-4">Estado de votos:</h4>
                <div className="space-y-2">
                    {room.players.map((player) => (
                        <div
                            key={player.id}
                            className="flex items-center justify-between p-3 bg-white rounded-lg"
                        >
                            <span className="font-semibold text-gray-700">{player.name}</span>
                            {player.hasVoted ? (
                                <span className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                                    <CheckCircle size={16} />
                                    Votó
                                </span>
                            ) : (
                                <span className="text-gray-400 text-sm">Esperando...</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Voting;