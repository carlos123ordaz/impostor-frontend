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
    const [gameState, setGameState] = useState('lobby'); // lobby, waiting, role-reveal, playing, voting, ended
    const [role, setRole] = useState(null); // { isImpostor, word, hint }
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [gameResult, setGameResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3001');
        setSocket(newSocket);
        setPlayerId(newSocket.id);

        newSocket.on('connect', () => {
            setPlayerId(newSocket.id);
        });

        newSocket.on('room-update', (updatedRoom) => {
            // Clonar el objeto para forzar re-render en React
            const clonedRoom = JSON.parse(JSON.stringify(updatedRoom));
            setRoom(clonedRoom);

            const player = clonedRoom.players.find(p => p.id === newSocket.id);
            if (player) {
                setIsAdmin(player.isAdmin);
            }
        });

        newSocket.on('role-assigned', (roleData) => {
            setRole(roleData);
            setGameState('role-reveal');

            // Después de 5 segundos, cambiar a playing
            setTimeout(() => {
                setGameState('playing');
            }, 5000);
        });

        newSocket.on('game-started', (data) => {
            setTimeRemaining(data.timeRemaining);
        });

        newSocket.on('time-update', (data) => {
            setTimeRemaining(data.timeRemaining);
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

    const togglePause = () => {
        if (!room) return;
        socket.emit('toggle-pause', { roomCode: room.roomCode });
    };

    const startVoting = () => {
        if (!room) return;
        socket.emit('start-voting', { roomCode: room.roomCode });
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
        setTimeRemaining(null);
        setIsPaused(false);
        setGameResult(null);
    };

    const value = {
        socket,
        room,
        playerId,
        playerName,
        isAdmin,
        gameState,
        role,
        timeRemaining,
        isPaused,
        gameResult,
        error,
        createRoom,
        joinRoom,
        updateSettings,
        startGame,
        togglePause,
        startVoting,
        vote,
        restartGame,
        setError
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};