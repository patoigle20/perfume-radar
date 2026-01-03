import { Eye, EyeOff, ExternalLink } from 'lucide-react';
import { calculateLongevityScore, calculateSillageScore } from '../utils/radarCalculations';

export default function PerfumeCard({
    perfume,
    isVisible,
    isHovered,
    onToggleVisibility,
    onMouseEnter,
    onMouseLeave,
    score,
    rank,
}) {
    const longevityPct = calculateLongevityScore(perfume.longevity);
    const sillagePct = calculateSillageScore(perfume.sillage);

    return (
        <div
            className={`p-3 rounded-xl transition-all duration-300 cursor-pointer
                  ${isHovered
                    ? 'bg-slate-100 dark:bg-slate-800 shadow-md'
                    : 'bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                }
                  ${!isVisible ? 'opacity-50' : 'opacity-100'}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="flex items-start gap-3">
                {/* Rank badge (when axis selected) */}
                {rank !== null && (
                    <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: perfume.color }}
                    >
                        {rank}
                    </div>
                )}

                {/* Circular image */}
                <div
                    className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2"
                    style={{ '--tw-ring-color': perfume.color }}
                >
                    <img
                        src={perfume.image}
                        alt={perfume.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
                            {perfume.name}
                        </h3>
                        {/* Score badge (Axis score or Raw Sentiment score) */}
                        {score !== null && score !== undefined && (
                            <span
                                className="px-1.5 py-0.5 text-[10px] font-bold rounded-md text-white flex-shrink-0"
                                style={{ backgroundColor: perfume.color }}
                            >
                                {/* Check if score is a valid number */}
                                {typeof score === 'number' && !isNaN(score) ? score.toFixed(2) : score}
                            </span>
                        )}
                    </div>

                    {/* Progress bars */}
                    <div className="space-y-1">
                        {/* Longevity */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 w-14">
                                Longevity
                            </span>
                            <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-teal-500 rounded-full transition-all duration-500"
                                    style={{ width: `${longevityPct}%` }}
                                />
                            </div>
                        </div>

                        {/* Sillage */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 w-14">
                                Sillage
                            </span>
                            <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                                    style={{ width: `${sillagePct}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-0.5">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleVisibility();
                        }}
                        className={`p-1 rounded-lg transition-all duration-300
                       ${isVisible
                                ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                : 'text-slate-400 dark:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                        title={isVisible ? 'Hide from chart' : 'Show on chart'}
                    >
                        {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>

                    <a
                        href={perfume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-lg text-slate-600 dark:text-slate-300
                       hover:bg-slate-200 dark:hover:bg-slate-700
                       transition-all duration-300"
                        title="View on Fragrantica"
                    >
                        <ExternalLink size={14} />
                    </a>
                </div>
            </div>
        </div>
    );
}
