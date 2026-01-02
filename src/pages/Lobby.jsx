import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Users, Plus, LogIn, Sparkles } from 'lucide-react';

const Lobby = () => {
    const { createRoom, joinRoom, setError } = useGame();
    const [mode, setMode] = useState(null); // null, 'create', 'join'
    const [playerName, setPlayerName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        if (!playerName.trim()) {
            setError('Ingresa tu nombre');
            return;
        }

        setLoading(true);
        try {
            await createRoom(playerName.trim());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        if (!playerName.trim() || !roomCode.trim()) {
            setError('Completa todos los campos');
            return;
        }

        setLoading(true);
        try {
            await joinRoom(roomCode.trim(), playerName.trim());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (mode === null) {
        return (
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
                <div className="mb-8">
                    <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 animate-bounce-slow">
                        <Sparkles size={48} className="text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
                        EL IMPOSTOR
                    </h1>
                    <p className="text-gray-600 text-lg">
                        ¿Quién dice la verdad? ¡Descubre al impostor!
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => setMode('create')}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:scale-105 transform transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                        <Plus size={24} />
                        Crear Sala Nueva
                    </button>

                    <button
                        onClick={() => setMode('join')}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:scale-105 transform transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                        <LogIn size={24} />
                        Unirse a Sala
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Users size={16} />
                        <span>3-10 jugadores</span>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'create') {
        return (
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                <button
                    onClick={() => setMode(null)}
                    className="text-gray-400 hover:text-gray-600 mb-6 text-sm"
                >
                    ← Volver
                </button>

                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                        <Plus size={32} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-800">Crear Sala Nueva</h2>
                    <p className="text-gray-600 mt-2">Serás el administrador de la sala</p>
                </div>

                <form onSubmit={handleCreateRoom} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tu Nombre
                        </label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Ingresa tu nombre"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg"
                            maxLength={15}
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:scale-105 transform transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {loading ? 'Creando...' : 'Crear Sala'}
                    </button>
                </form>
            </div>
        );
    }

    if (mode === 'join') {
        return (
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                <button
                    onClick={() => setMode(null)}
                    className="text-gray-400 hover:text-gray-600 mb-6 text-sm"
                >
                    ← Volver
                </button>

                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                        <LogIn size={32} className="text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-800">Unirse a Sala</h2>
                    <p className="text-gray-600 mt-2">Ingresa el código de la sala</p>
                </div>

                <form onSubmit={handleJoinRoom} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Código de Sala
                        </label>
                        <input
                            type="text"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            placeholder="Ej: ABC123"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg text-center font-bold tracking-wider uppercase"
                            maxLength={6}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tu Nombre
                        </label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Ingresa tu nombre"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                            maxLength={15}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:scale-105 transform transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {loading ? 'Uniéndose...' : 'Unirse a Sala'}
                    </button>
                </form>
            </div>
        );
    }
};

export default Lobby;