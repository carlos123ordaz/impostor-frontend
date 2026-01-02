/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#6366f1',
                secondary: '#ec4899',
                success: '#10b981',
                danger: '#ef4444',
                warning: '#f59e0b',
                dark: '#1e293b',
                light: '#f8fafc'
            },
            fontFamily: {
                game: ['Poppins', 'sans-serif']
            },
            animation: {
                'bounce-slow': 'bounce 2s infinite',
                'pulse-slow': 'pulse 3s infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite',
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                }
            }
        },
    },
    plugins: [],
}