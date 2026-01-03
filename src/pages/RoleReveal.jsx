import React from 'react';
import { useGame } from '../context/GameContext';
import { Skull, Shield, Eye } from 'lucide-react';

const RoleReveal = () => {
    const { role } = useGame();

    if (!role) return null;

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className={`
        rounded-3xl shadow-2xl p-12 text-center max-w-2xl w-full
        ${role.isImpostor
                    ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white animate-pulse-slow'
                    : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'}
      `}>
                <div className="mb-8">
                    <div className="inline-block p-6 bg-white/20 rounded-full mb-6 animate-bounce">
                        {role.isImpostor ? (
                            <Skull size={64} className="text-white" />
                        ) : (
                            <Shield size={64} className="text-white" />
                        )}
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black mb-4">
                        {role.isImpostor ? '¡ERES EL IMPOSTOR!' : '¡ERES JUGADOR!'}
                    </h1>

                    <p className="text-xl md:text-2xl opacity-90">
                        {role.isImpostor
                            ? 'Tu misión: No ser descubierto'
                            : 'Tu misión: Encuentra al impostor'}
                    </p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Eye size={24} />
                        <h3 className="text-2xl font-bold">
                            {role.isImpostor
                                ? (role.hint ? 'Tu Pista' : 'Eres')
                                : 'La Palabra'}
                        </h3>
                    </div>

                    <p className="text-4xl md:text-5xl font-black tracking-wider">
                        {role.isImpostor
                            ? (role.hint || 'IMPOSTOR')
                            : role.word}
                    </p>
                </div>

                <div className="text-lg opacity-90">
                    {role.isImpostor ? (
                        <p>
                            {role.hint
                                ? 'Los demás jugadores conocen la palabra completa. Usa la pista para fingir que también la conoces.'
                                : 'Los demás jugadores conocen la palabra completa. Intenta actuar como si la conocieras sin ser descubierto.'}
                        </p>
                    ) : (
                        <p>
                            Todos los jugadores conocen esta palabra,<br />
                            excepto el impostor que {role.hint ? 'solo tiene una pista' : 'no la conoce'}.
                        </p>
                    )}
                </div>

                <div className="mt-8 text-sm opacity-75">
                    El juego comenzará en un momento...
                </div>
            </div>
        </div>
    );
};

export default RoleReveal;