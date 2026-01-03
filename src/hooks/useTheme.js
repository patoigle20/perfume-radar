import { useState, useEffect } from 'react';

export function useTheme() {
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage or system preference
        const stored = localStorage.getItem('perfume-radar-theme');
        if (stored) {
            return stored === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('perfume-radar-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(prev => !prev);

    return { darkMode, toggleTheme };
}
