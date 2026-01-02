import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Users, Copy, Check, Settings, Play, Crown, User } from 'lucide-react';

const WaitingRoom = () => {
    const { room, isAdmin, updateSettings, startGame } = useGame();
    const [copied, setCopied] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
        impostorCount: 1,
        roundDuration: 120,
        category: 'all',
        impostorCanSeeHint: false
    });

    // useEffect DEBE estar antes de cualquier return condicional
    useEffect(() => {
        if (room?.settings) {
            setSettings({
                impostorCount: room.settings.impostorCount || 1,
                roundDuration: room.settings.roundDuration || 120,
                category: room.settings.category || 'all',
                impostorCanSeeHint: room.settings.impostorCanSeeHint || false
            });
        }
    }, [room]);

    // Ahora sí podemos hacer el return condicional después de todos los hooks
    if (!room) return null;

    const copyRoomCode = () => {
        navigator.clipboard.writeText(room.roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUpdateSettings = () => {
        updateSettings(settings);
        setShowSettings(false);
    };

    const handleStartGame = () => {
        if (room.players.length < 3) {
            alert('Se necesitan al menos 3 jugadores para iniciar');
            return;
        }
        startGame();
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            {/* Header con código de sala */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Sala de Espera</h2>

                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-2xl">
                    <span className="text-sm text-gray-600 font-semibold">CÓDIGO:</span>
                    <span className="text-3xl font-black text-purple-600 tracking-wider">
                        {room.roomCode}
                    </span>
                    <button
                        onClick={copyRoomCode}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                        {copied ? (
                            <Check size={20} className="text-green-600" />
                        ) : (
                            <Copy size={20} className="text-purple-600" />
                        )}
                    </button>
                </div>

                <p className="text-gray-500 text-sm mt-3">
                    Comparte este código con tus amigos
                </p>
            </div>

            {/* Lista de jugadores */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Users size={20} />
                        Jugadores ({room.players.length})
                    </h3>
                    {isAdmin && (
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="text-purple-600 hover:text-purple-700 p-2"
                        >
                            <Settings size={20} />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {room.players.map((player) => (
                        <div
                            key={player.id}
                            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <User size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">
                                        {player.name}
                                    </p>
                                </div>
                            </div>
                            {player.isAdmin && (
                                <Crown size={16} className="text-yellow-500" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Panel de configuración */}
            {showSettings && isAdmin && (
                <div className="mb-6 p-6 bg-gray-50 rounded-2xl">
                    <h4 className="font-bold text-gray-800 mb-4">Configuración del Juego</h4>

                    <div className="space-y-4">
                        {/* Número de Impostores */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Número de Impostores
                            </label>
                            <select
                                value={settings.impostorCount}
                                onChange={(e) => setSettings({ ...settings, impostorCount: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                            >
                                <option value={1}>1 Impostor</option>
                                <option value={2}>2 Impostores</option>
                                <option value={3}>3 Impostores</option>
                            </select>
                        </div>

                        {/* Duración de la Ronda */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Duración de la Ronda
                            </label>
                            <select
                                value={settings.roundDuration}
                                onChange={(e) => setSettings({ ...settings, roundDuration: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                            >
                                <option value={60}>1 minuto</option>
                                <option value={90}>1:30 minutos</option>
                                <option value={120}>2 minutos</option>
                                <option value={180}>3 minutos</option>
                                <option value={240}>4 minutos</option>
                            </select>
                        </div>

                        {/* Categoría de Palabras */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Categoría de Palabras
                            </label>
                            <select
                                value={settings.category}
                                onChange={(e) => setSettings({ ...settings, category: e.target.value })}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                            >
                                <option value="all">🎲 Todas las Categorías</option>
                                <option value="animales">🦁 Animales</option>
                                <option value="lugares">🏛️ Lugares</option>
                                <option value="objetos">📱 Objetos</option>
                                <option value="comida">🍕 Comida y Bebida</option>
                                <option value="naturaleza">🌊 Naturaleza</option>
                                <option value="emociones">❤️ Emociones y Conceptos</option>
                                <option value="profesiones">👨‍⚕️ Profesiones</option>
                                <option value="deportes">⚽ Deportes</option>
                                <option value="vehiculos">🚗 Vehículos</option>
                                <option value="musica">🎸 Música</option>
                                <option value="tecnologia">💻 Tecnología</option>
                                <option value="varios">🎯 Varios</option>
                            </select>
                        </div>

                        {/* ¿Impostor puede ver la pista? */}
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    ¿El impostor puede ver la pista?
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                    Si está activado, el impostor verá la pista en lugar de la palabra
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.impostorCanSeeHint}
                                    onChange={(e) => setSettings({ ...settings, impostorCanSeeHint: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>

                        <button
                            onClick={handleUpdateSettings}
                            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                        >
                            Guardar Configuración
                        </button>
                    </div>
                </div>
            )}

            {/* Información de configuración actual */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-600">Impostores</p>
                        <p className="text-2xl font-black text-blue-600">
                            {room.settings.impostorCount}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Duración</p>
                        <p className="text-2xl font-black text-blue-600">
                            {Math.floor(room.settings.roundDuration / 60)}:{(room.settings.roundDuration % 60).toString().padStart(2, '0')}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Categoría</p>
                        <p className="text-lg font-black text-blue-600 capitalize">
                            {room.settings.category === 'all' ? '🎲 Todas' :
                                room.settings.category === 'animales' ? '🦁' :
                                    room.settings.category === 'lugares' ? '🏛️' :
                                        room.settings.category === 'objetos' ? '📱' :
                                            room.settings.category === 'comida' ? '🍕' :
                                                room.settings.category === 'naturaleza' ? '🌊' :
                                                    room.settings.category === 'emociones' ? '❤️' :
                                                        room.settings.category === 'profesiones' ? '👨‍⚕️' :
                                                            room.settings.category === 'deportes' ? '⚽' :
                                                                room.settings.category === 'vehiculos' ? '🚗' :
                                                                    room.settings.category === 'musica' ? '🎸' :
                                                                        room.settings.category === 'tecnologia' ? '💻' : '🎯'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Impostor ve pista</p>
                        <p className="text-2xl font-black text-blue-600">
                            {room.settings.impostorCanSeeHint ? '✅' : '❌'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Botón de inicio (solo admin) */}
            {isAdmin && (
                <button
                    onClick={handleStartGame}
                    disabled={room.players.length < 3}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:scale-105 transform transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                    <Play size={24} />
                    {room.players.length < 3 ? 'Se necesitan al menos 3 jugadores' : 'Iniciar Juego'}
                </button>
            )}

            {!isAdmin && (
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                    <p className="text-yellow-800 font-semibold">
                        Esperando a que el administrador inicie el juego...
                    </p>
                </div>
            )}
        </div>
    );
};

export default WaitingRoom;