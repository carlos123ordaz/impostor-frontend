import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Users, Vote, Eye, EyeOff, ChevronRight, SkipForward, LogOut } from 'lucide-react';

const Playing = () => {
    const { room, role, isAdmin, startVoting, turnOrder, playerId, nextTurn, leaveGame } = useGame();
    const [wordHidden, setWordHidden] = useState(false);

    // Debug: Log cuando cambian los valores importantes
    useEffect(() => {
        console.log('🎮 Playing - Estado actualizado:', {
            hasRoom: !!room,
            hasRole: !!role,
            turnOrderFromContext: turnOrder,
            turnOrderFromRoom: room?.turnOrder,
            playersInRoom: room?.players?.map(p => ({ id: p.id, name: p.name })),
            playerId
        });
    }, [room, role, turnOrder, playerId]);

    // Mostrar pantalla de carga si no hay datos completos
    if (!room || !role) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="inline-block p-6 bg-white rounded-full mb-4 animate-pulse">
                        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-white text-xl font-bold">Sincronizando juego...</p>
                </div>
            </div>
        );
    }

    // Usar turnOrder del contexto o del room como fallback
    const activeTurnOrder = turnOrder && turnOrder.length > 0 ? turnOrder : (room.turnOrder || []);

    // Log para debugging
    console.log('📋 Active TurnOrder:', activeTurnOrder);
    console.log('📋 Players que deberían estar:', room.players.map(p => ({ id: p.id, name: p.name })));

    // Obtener el jugador actual del turno
    const getCurrentTurnPlayer = () => {
        if (!activeTurnOrder || activeTurnOrder.length === 0) return null;
        const currentPlayerId = activeTurnOrder[0]; // El primero es quien debe hablar
        const player = room.players.find(p => p.id === currentPlayerId);
        console.log(`🎯 Turno actual - Buscando ID: ${currentPlayerId}, Encontrado:`, player?.name || 'NO ENCONTRADO');
        return player;
    };

    const currentTurnPlayer = getCurrentTurnPlayer();
    const isMyTurn = currentTurnPlayer && currentTurnPlayer.id === playerId;

    return (
        <div className="space-y-6">
            {/* Botón de salir */}
            <div className="flex justify-end">
                <button
                    onClick={leaveGame}
                    className="flex items-center gap-2 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition-colors text-sm font-semibold shadow-lg"
                >
                    <LogOut size={18} />
                    Salir del Juego
                </button>
            </div>

            {/* Botones de control */}
            <div className="bg-white rounded-3xl shadow-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Botón siguiente turno - Solo visible para quien tiene el turno */}
                    {isMyTurn && (
                        <button
                            onClick={nextTurn}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-lg"
                        >
                            <SkipForward size={24} />
                            Siguiente Turno
                        </button>
                    )}

                    {/* Botón de votación (solo admin) */}
                    {isAdmin && (
                        <button
                            onClick={startVoting}
                            className={`flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-lg ${isMyTurn ? '' : 'md:col-span-2'
                                }`}
                        >
                            <Vote size={24} />
                            Iniciar Votación
                        </button>
                    )}

                    {/* Si no eres admin ni es tu turno, mostrar mensaje */}
                    {!isAdmin && !isMyTurn && (
                        <div className="md:col-span-2 text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-gray-600 font-semibold">
                                Esperando el turno de {currentTurnPlayer?.name || 'otro jugador'}...
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Indicador de turno actual */}
            <div className={`rounded-3xl shadow-2xl p-6 text-white transition-all ${isMyTurn
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse'
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                }`}>
                <div className="flex items-center justify-center gap-3 mb-3">
                    <ChevronRight size={28} className="animate-pulse" />
                    <h2 className="text-2xl font-bold">Turno Actual</h2>
                </div>
                <div className="text-center">
                    {currentTurnPlayer ? (
                        <>
                            <p className="text-4xl font-black">
                                {currentTurnPlayer.name}
                            </p>
                            <p className="text-lg opacity-90 mt-2">
                                {isMyTurn
                                    ? '¡ES TU TURNO! Describe la palabra/pista'
                                    : 'Escucha atentamente'}
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-2xl font-bold mb-2">
                                Preparando turnos...
                            </p>
                            <div className="flex justify-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Tu información */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-3xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        {role.isImpostor ? <EyeOff size={24} /> : <Eye size={24} />}
                        Tu Información
                    </h3>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 relative">
                    <p className="text-sm opacity-90 mb-2">
                        {role.isImpostor
                            ? (role.hint ? 'Tu Pista:' : 'Eres:')
                            : 'La Palabra:'}
                    </p>

                    {!wordHidden ? (
                        <p className="text-3xl font-black mb-3">
                            {role.isImpostor
                                ? (role.hint || 'IMPOSTOR')
                                : role.word}
                        </p>
                    ) : (
                        <p className="text-3xl font-black mb-3 blur-lg select-none">
                            {role.isImpostor
                                ? (role.hint || 'IMPOSTOR')
                                : role.word}
                        </p>
                    )}

                    <button
                        onClick={() => setWordHidden(!wordHidden)}
                        className="flex items-center gap-2 bg-white/30 hover:bg-white/40 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                    >
                        {wordHidden ? (
                            <>
                                <Eye size={16} />
                                Mostrar
                            </>
                        ) : (
                            <>
                                <EyeOff size={16} />
                                Ocultar
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-4 text-sm opacity-90">
                    {role.isImpostor ? (
                        <p>💡 Intenta describir la palabra sin ser descubierto</p>
                    ) : (
                        <p>💡 Escucha atentamente para encontrar al impostor</p>
                    )}
                </div>
            </div>

            {/* Orden de turnos */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="flex items-center gap-2 mb-6">
                    <Users size={24} className="text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-800">
                        Orden de Turnos
                    </h3>
                </div>

                <div className="space-y-3">
                    {activeTurnOrder && activeTurnOrder.map((playerId, index) => {
                        const player = room.players.find(p => p.id === playerId);
                        if (!player) return null;

                        const isCurrentTurn = index === 0;

                        return (
                            <div
                                key={playerId}
                                className={`
                                    flex items-center justify-between p-4 rounded-xl transition-all
                                    ${isCurrentTurn
                                        ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 shadow-lg scale-105'
                                        : 'bg-gray-50'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center font-bold
                                        ${isCurrentTurn
                                            ? 'bg-gradient-to-br from-yellow-500 to-orange-600 text-white animate-pulse'
                                            : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'}
                                    `}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${isCurrentTurn ? 'text-orange-900' : 'text-gray-800'}`}>
                                            {player.name}
                                        </p>
                                        {isCurrentTurn && (
                                            <p className="text-xs text-orange-700 font-semibold">
                                                Hablando ahora
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {isCurrentTurn && (
                                    <ChevronRight size={24} className="text-orange-600 animate-pulse" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Playing;