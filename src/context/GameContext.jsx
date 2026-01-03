import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const GameContext = createContext();

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame debe ser usado dentro de GameProvider');
    }
    return context;
};

export const GameProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [room, setRoom] = useState(null);
    const [playerId, setPlayerId] = useState(null);
    const [playerName, setPlayerName] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [gameState, setGameState] = useState('lobby');
    const [role, setRole] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [gameResult, setGameResult] = useState(null);
    const [error, setError] = useState(null);
    const [turnOrder, setTurnOrder] = useState([]);
    const [currentTurnIndex, setCurrentTurnIndex] = useState(0);

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3001', {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 10
        });

        setSocket(newSocket);
        setPlayerId(newSocket.id);

        newSocket.on('connect', () => {
            console.log('✅ Conectado:', newSocket.id);
            setPlayerId(newSocket.id);

            // Intentar reconectar si hay datos guardados
            const savedData = localStorage.getItem('gameSession');
            if (savedData) {
                const { roomCode, playerName: savedPlayerName } = JSON.parse(savedData);
                console.log('🔄 Intentando reconexión...', { roomCode, savedPlayerName });

                newSocket.emit('reconnect-to-room',
                    { roomCode, playerName: savedPlayerName },
                    (response) => {
                        if (response.success) {
                            console.log('✅ Reconectado exitosamente');
                            console.log('📊 Datos recibidos:', response);

                            setPlayerName(savedPlayerName);
                            setIsAdmin(response.isAdmin);

                            // Recuperar turnOrder si existe
                            if (response.turnOrder && response.turnOrder.length > 0) {
                                console.log('✅ TurnOrder establecido:', response.turnOrder);
                                setTurnOrder(response.turnOrder);
                                setCurrentTurnIndex(response.currentTurnIndex || 0);
                            }

                            // Establecer el estado del juego
                            if (response.gameState === 'started' && response.role) {
                                setRole(response.role);
                                // Esperar un momento para que room-update llegue antes de cambiar a playing
                                setTimeout(() => {
                                    setGameState('playing');
                                }, 500);
                            } else if (response.gameState === 'voting') {
                                setGameState('voting');
                            } else if (response.gameState === 'ended') {
                                setGameState('ended');
                            } else {
                                setGameState('waiting');
                            }
                        } else {
                            console.log('❌ Error reconectando:', response.error);
                            localStorage.removeItem('gameSession');
                        }
                    }
                );
            }
        });

        newSocket.on('room-update', (updatedRoom) => {
            console.log('📦 room-update recibido:', updatedRoom);
            const clonedRoom = JSON.parse(JSON.stringify(updatedRoom));
            setRoom(clonedRoom);

            const player = clonedRoom.players.find(p => p.id === newSocket.id);
            if (player) {
                setIsAdmin(player.isAdmin);
            }

            // Actualizar turnOrder si existe en la sala
            if (clonedRoom.turnOrder && clonedRoom.turnOrder.length > 0) {
                console.log('📊 Actualizando turnOrder desde room-update:', clonedRoom.turnOrder);
                setTurnOrder(clonedRoom.turnOrder);
                setCurrentTurnIndex(clonedRoom.currentTurnIndex || 0);
            } else {
                console.log('⚠️ room-update sin turnOrder');
            }
        });

        newSocket.on('role-assigned', (roleData) => {
            setRole(roleData);
            setGameState('role-reveal');

            setTimeout(() => {
                setGameState('playing');
            }, 5000);
        });

        newSocket.on('game-started', (data) => {
            setTurnOrder(data.turnOrder);
            setCurrentTurnIndex(data.currentTurnIndex);
        });

        newSocket.on('turn-updated', (data) => {
            setTurnOrder(data.turnOrder);
            // Mostrar notificación del nuevo turno
            const notification = `Turno de: ${data.currentPlayerName}`;
            console.log(notification);
        });

        newSocket.on('game-paused', (data) => {
            setIsPaused(data.isPaused);
        });

        newSocket.on('voting-started', (updatedRoom) => {
            const clonedRoom = JSON.parse(JSON.stringify(updatedRoom));
            setRoom(clonedRoom);
            setGameState('voting');
        });

        newSocket.on('voting-tie', (data) => {
            setError(`¡Empate! Votación entre: ${data.tiedPlayers.map(p => p.name).join(', ')}`);
            setTimeout(() => setError(null), 5000);
        });

        newSocket.on('game-ended', (result) => {
            setGameResult(result);
            setGameState('ended');
        });

        newSocket.on('error', (data) => {
            setError(data.message);
            setTimeout(() => setError(null), 5000);
        });

        newSocket.on('player-disconnected', (data) => {
            setError(`${data.playerName} se desconectó temporalmente`);
            setTimeout(() => setError(null), 3000);
        });

        newSocket.on('player-left', (data) => {
            setError(`${data.playerName} salió del juego`);
            setTimeout(() => setError(null), 3000);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const createRoom = (name) => {
        return new Promise((resolve, reject) => {
            socket.emit('create-room', { playerName: name }, (response) => {
                if (response.success) {
                    setPlayerName(name);
                    setIsAdmin(true);
                    setGameState('waiting');

                    // Guardar sesión para reconexión
                    localStorage.setItem('gameSession', JSON.stringify({
                        roomCode: response.roomCode,
                        playerName: name
                    }));

                    resolve(response.roomCode);
                } else {
                    setError(response.error);
                    reject(response.error);
                }
            });
        });
    };

    const joinRoom = (roomCode, name) => {
        return new Promise((resolve, reject) => {
            socket.emit('join-room', { roomCode, playerName: name }, (response) => {
                if (response.success) {
                    setPlayerName(name);
                    setIsAdmin(response.isAdmin);
                    setGameState('waiting');

                    // Guardar sesión para reconexión
                    localStorage.setItem('gameSession', JSON.stringify({
                        roomCode,
                        playerName: name
                    }));

                    resolve();
                } else {
                    setError(response.error);
                    reject(response.error);
                }
            });
        });
    };

    const updateSettings = (settings) => {
        if (!room) return;
        socket.emit('update-settings', { roomCode: room.roomCode, settings });
    };

    const startGame = () => {
        if (!room) return;
        socket.emit('start-game', { roomCode: room.roomCode });
    };

    const startVoting = () => {
        if (!room) return;
        socket.emit('start-voting', { roomCode: room.roomCode });
    };

    const nextTurn = () => {
        if (!room) return;
        socket.emit('next-turn', { roomCode: room.roomCode });
    };

    const vote = (votedPlayerId) => {
        if (!room) return;
        socket.emit('vote', { roomCode: room.roomCode, votedPlayerId });
    };

    const restartGame = () => {
        if (!room) return;
        socket.emit('restart-game', { roomCode: room.roomCode });
        setGameState('waiting');
        setRole(null);
        setIsPaused(false);
        setGameResult(null);
        setTurnOrder([]);
        setCurrentTurnIndex(0);
    };

    const leaveGame = () => {
        if (room && socket) {
            // Notificar al servidor que estamos saliendo intencionalmente
            socket.emit('leave-game', { roomCode: room.roomCode });
        }

        // Limpiar localStorage
        localStorage.removeItem('gameSession');

        // Esperar un momento para que el servidor procese la salida
        setTimeout(() => {
            window.location.reload();
        }, 300);
    };

    const value = {
        socket,
        room,
        playerId,
        playerName,
        isAdmin,
        gameState,
        role,
        isPaused,
        gameResult,
        error,
        turnOrder,
        currentTurnIndex,
        createRoom,
        joinRoom,
        updateSettings,
        startGame,
        startVoting,
        nextTurn,
        vote,
        restartGame,
        leaveGame,
        setError
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};