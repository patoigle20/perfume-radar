import { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import perfumeData from './data/perfumes.json';

import Header from './components/Header';
import RadarChart from './components/RadarChart';
import Sidebar from './components/Sidebar';
import FloatingTooltip from './components/FloatingTooltip';
import MethodologyModal from './components/MethodologyModal';

const perfumes = perfumeData.perfumes;

export default function App() {
    const { darkMode, toggleTheme } = useTheme();

    // Visibility state - which perfumes are shown on the chart
    const [visiblePerfumes, setVisiblePerfumes] = useState(
        perfumes.map((p) => p.id)
    );

    // Hover state - which perfume is currently hovered
    const [hoveredPerfume, setHoveredPerfume] = useState(null);

    // Mouse position for tooltip
    const [mousePosition, setMousePosition] = useState(null);

    // Selected axis for focus mode and sorting
    const [selectedAxis, setSelectedAxis] = useState(null);

    // Modal state
    const [showMethodologyModal, setShowMethodologyModal] = useState(false);

    // Track mouse position for tooltip
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Get hovered perfume data for tooltip
    const hoveredPerfumeData = hoveredPerfume
        ? perfumes.find((p) => p.id === hoveredPerfume)
        : null;

    return (
        <div className={`min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300`}>
            {/* Background gradient */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 -z-10" />

            {/* Main container */}
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                {/* Glass card - no padding on right for sidebar */}
                <div className="glass-card overflow-hidden">
                    {/* Content wrapper */}
                    <div className="flex flex-col lg:flex-row">
                        {/* Main content area */}
                        <div className="flex-1 p-6 md:p-8">
                            <Header
                                darkMode={darkMode}
                                toggleTheme={toggleTheme}
                                onInfoClick={() => setShowMethodologyModal(true)}
                            />

                            {/* Radar Chart */}
                            <div className="mt-6 flex items-center justify-center">
                                <RadarChart
                                    perfumes={perfumes}
                                    visiblePerfumes={visiblePerfumes}
                                    hoveredPerfume={hoveredPerfume}
                                    setHoveredPerfume={setHoveredPerfume}
                                    selectedAxis={selectedAxis}
                                    setSelectedAxis={setSelectedAxis}
                                />
                            </div>

                            {/* Hint text */}
                            <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-6">
                                Hover perfumes to highlight • Click axis label to sort • Toggle visibility with eye icon
                            </p>
                        </div>

                        {/* Sidebar - Fixed width panel */}
                        <div className="w-full lg:w-80 lg:max-h-[700px] 
                          bg-white dark:bg-slate-900
                          border-t lg:border-t-0 lg:border-l 
                          border-slate-200 dark:border-slate-800
                          lg:rounded-r-3xl">
                            <Sidebar
                                perfumes={perfumes}
                                visiblePerfumes={visiblePerfumes}
                                setVisiblePerfumes={setVisiblePerfumes}
                                hoveredPerfume={hoveredPerfume}
                                setHoveredPerfume={setHoveredPerfume}
                                selectedAxis={selectedAxis}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Tooltip */}
            <FloatingTooltip
                perfume={hoveredPerfumeData}
                mousePosition={mousePosition}
            />

            {/* Methodology Modal */}
            <MethodologyModal
                isOpen={showMethodologyModal}
                onClose={() => setShowMethodologyModal(false)}
            />
        </div>
    );
}
