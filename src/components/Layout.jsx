import React from 'react';
import { useGame } from '../context/GameContext';
import { AlertCircle } from 'lucide-react';

const Layout = ({ children }) => {
    const { error } = useGame();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            {error && (
                <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce z-50">
                    <AlertCircle size={20} />
                    <span className="font-semibold">{error}</span>
                </div>
            )}

            <div className="w-full max-w-4xl">
                {children}
            </div>
        </div>
    );
};

export default Layout;