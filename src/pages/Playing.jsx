import React from 'react';
import { useGame } from '../context/GameContext';
import { Clock, Pause, Play, Users, Vote, Eye, EyeOff } from 'lucide-react';

const Playing = () => {
    const { room, role, timeRemaining, isPaused, isAdmin, togglePause, startVoting } = useGame();

    if (!room || !role) return null;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            {/* Temporizador */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Clock size={32} className="text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Tiempo Restante</h2>
                </div>

                <div className={`
          text-7xl font-black mb-6
          ${timeRemaining <= 30 ? 'text-red-600 animate-pulse' : 'text-purple-600'}
        `}>
                    {formatTime(timeRemaining)}
                </div>

                {isPaused && (
                    <div className="inline-block bg-yellow-100 text-yellow-800 px-6 py-2 rounded-full font-semibold animate-pulse">
                        ⏸ Juego Pausado
                    </div>
                )}

                {isAdmin && (
                    <div className="flex gap-3 justify-center mt-6">
                        <button
                            onClick={togglePause}
                            className="flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-yellow-600 transition-colors"
                        >
                            {isPaused ? <Play size={20} /> : <Pause size={20} />}
                            {isPaused ? 'Reanudar' : 'Pausar'}
                        </button>

                        <button
                            onClick={startVoting}
                            className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors"
                        >
                            <Vote size={20} />
                            Iniciar Votación
                        </button>
                    </div>
                )}
            </div>

            {/* Tu información */}
            <div className={`
        rounded-3xl shadow-2xl p-8
        ${role.isImpostor
                    ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white'
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'}
      `}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        {role.isImpostor ? <EyeOff size={24} /> : <Eye size={24} />}
                        Tu Información
                    </h3>
                    <span className="px-4 py-2 bg-white/20 rounded-full font-bold text-sm">
                        {role.isImpostor ? 'IMPOSTOR' : 'JUGADOR'}
                    </span>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                    <p className="text-sm opacity-90 mb-2">
                        {role.isImpostor ? 'Tu Pista:' : 'La Palabra:'}
                    </p>
                    <p className="text-3xl font-black">
                        {role.isImpostor ? role.hint : role.word}
                    </p>
                </div>

                <div className="mt-4 text-sm opacity-90">
                    {role.isImpostor ? (
                        <p>💡 Intenta describir la palabra sin ser descubierto</p>
                    ) : (
                        <p>💡 Escucha atentamente para encontrar al impostor</p>
                    )}
                </div>
            </div>

            {/* Lista de jugadores */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="flex items-center gap-2 mb-6">
                    <Users size={24} className="text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-800">
                        Jugadores ({room.players.length})
                    </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {room.players.map((player) => (
                        <div
                            key={player.id}
                            className="bg-gray-50 rounded-xl p-4 text-center"
                        >
                            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2">
                                <span className="text-white font-bold text-lg">
                                    {player.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <p className="font-semibold text-gray-800 text-sm">
                                {player.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Instrucciones */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
                <h4 className="font-bold text-purple-900 mb-3">📋 Cómo jugar:</h4>
                <ul className="space-y-2 text-sm text-purple-800">
                    <li>• Cada jugador debe describir la palabra por turnos</li>
                    <li>• El impostor solo tiene una pista, no la palabra completa</li>
                    <li>• Escucha atentamente para identificar al impostor</li>
                    <li>• Al final del tiempo, votarán por quién creen que es el impostor</li>
                </ul>
            </div>
        </div>
    );
};

export default Playing;