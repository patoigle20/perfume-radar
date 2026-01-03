import { Sun, Moon, Info } from 'lucide-react';

export default function Header({ darkMode, toggleTheme, onInfoClick }) {
    return (
        <header className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span className="text-3xl">🌸</span>
                    Perfume Radar
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Find the perfect fragrance for any occasion
                </p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onInfoClick}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 
                     text-slate-600 dark:text-slate-300
                     hover:bg-slate-200 dark:hover:bg-slate-700
                     transition-all duration-300"
                    title="Methodology"
                >
                    <Info size={20} />
                </button>

                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 
                     text-slate-600 dark:text-slate-300
                     hover:bg-slate-200 dark:hover:bg-slate-700
                     transition-all duration-300"
                    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
}
