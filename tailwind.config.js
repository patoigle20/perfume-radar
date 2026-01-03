/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Semantic season colors
                summer: {
                    day: '#f59e0b',    // amber-500
                    night: '#d97706',  // amber-600
                },
                fall: {
                    day: '#ef4444',    // red-500
                    night: '#b91c1c',  // red-700
                },
                winter: {
                    day: '#3b82f6',    // blue-500
                    night: '#4f46e5',  // indigo-600
                },
                spring: {
                    day: '#ec4899',    // pink-500
                    night: '#9333ea',  // purple-600
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
