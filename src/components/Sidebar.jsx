import { useMemo } from 'react';
import PerfumeCard from './PerfumeCard';
import { RADAR_AXES, calculateAxisValue, calculateRawSentimentScore } from '../utils/radarCalculations';

export default function Sidebar({
    perfumes,
    visiblePerfumes,
    setVisiblePerfumes,
    hoveredPerfume,
    setHoveredPerfume,
    selectedAxis,
}) {
    const handleSelectAll = () => {
        setVisiblePerfumes(perfumes.map((p) => p.id));
    };

    const handleUnselectAll = () => {
        setVisiblePerfumes([]);
    };

    const toggleVisibility = (id) => {
        setVisiblePerfumes((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // Sort perfumes by selected axis score (descending) or Raw Sentiment in Overview
    const sortedPerfumes = useMemo(() => {
        // Determine the scoring function and source based on mode
        const getScore = selectedAxis === null
            ? (p) => calculateRawSentimentScore(p.rating)
            : (p) => calculateAxisValue(p, selectedAxis);

        // Calculate scores and sort descending
        return [...perfumes]
            .map((p) => ({
                ...p,
                displayScore: getScore(p),
            }))
            .sort((a, b) => b.displayScore - a.displayScore);
    }, [perfumes, selectedAxis]);

    const subHeaderText = selectedAxis !== null
        ? `Ranking: ${RADAR_AXES[selectedAxis]?.label}`
        : "Sorted by: Raw Sentiment";

    return (
        <div className="flex flex-col h-full p-4">
            {/* Header with fixed layout */}
            <div className="flex items-start justify-between mb-2">
                <div>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        Perfumes
                    </h2>
                    {/* Fixed height sub-header to prevent layout shift */}
                    <div className="h-5 flex items-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {subHeaderText}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 pt-1">
                    <button
                        onClick={handleSelectAll}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg
                       bg-slate-100 dark:bg-slate-800
                       text-slate-600 dark:text-slate-300
                       hover:bg-slate-200 dark:hover:bg-slate-700
                       transition-all duration-300"
                    >
                        All
                    </button>
                    <button
                        onClick={handleUnselectAll}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg
                       bg-slate-100 dark:bg-slate-800
                       text-slate-600 dark:text-slate-300
                       hover:bg-slate-200 dark:hover:bg-slate-700
                       transition-all duration-300"
                    >
                        None
                    </button>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 dark:bg-slate-800 mb-2 w-full" />

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 -mr-1">
                {sortedPerfumes.map((perfume, index) => (
                    <PerfumeCard
                        key={perfume.id}
                        perfume={perfume}
                        isVisible={visiblePerfumes.includes(perfume.id)}
                        isHovered={hoveredPerfume === perfume.id}
                        onToggleVisibility={() => toggleVisibility(perfume.id)}
                        onMouseEnter={() => setHoveredPerfume(perfume.id)}
                        onMouseLeave={() => setHoveredPerfume(null)}
                        score={perfume.displayScore}
                        rank={selectedAxis !== null ? index + 1 : null}
                    />
                ))}
            </div>
        </div>
    );
}
