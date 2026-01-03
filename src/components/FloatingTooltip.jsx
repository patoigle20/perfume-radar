import { Star, Sun, Moon } from 'lucide-react';
import { calculateStarRating, RADAR_AXES } from '../utils/radarCalculations';

export default function FloatingTooltip({ perfume, mousePosition }) {
    if (!perfume || !mousePosition) return null;

    const starRating = calculateStarRating(perfume.rating);
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating - fullStars >= 0.5;

    // Calculate seasonality breakdown
    const seasons = ['summer', 'fall', 'winter', 'spring'];
    const seasonData = seasons.map((season) => ({
        name: season.charAt(0).toUpperCase() + season.slice(1),
        value: perfume.seasonality[season],
        color: RADAR_AXES.find((a) => a.season === season)?.color || '#888',
    }));

    // Time of day data
    const timeData = [
        { name: 'Day', value: perfume.seasonality.day, icon: Sun, color: '#f59e0b' },
        { name: 'Night', value: perfume.seasonality.night, icon: Moon, color: '#6366f1' },
    ];

    // Position tooltip with offset to avoid cursor overlap
    const tooltipStyle = {
        position: 'fixed',
        left: mousePosition.x + 16,
        top: mousePosition.y + 16,
        zIndex: 1000,
        pointerEvents: 'none',
    };

    // Adjust if too close to right edge
    if (mousePosition.x > window.innerWidth - 280) {
        tooltipStyle.left = mousePosition.x - 260;
    }

    // Adjust if too close to bottom edge
    if (mousePosition.y > window.innerHeight - 340) { // Increased height check
        tooltipStyle.top = mousePosition.y - 320;
    }

    return (
        <div
            style={tooltipStyle}
            className="w-64 p-4 glass-modal animate-in fade-in duration-200"
        >
            {/* Image */}
            <div className="w-full h-32 rounded-lg overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                <img
                    src={perfume.image}
                    alt={perfume.name}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Name */}
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">
                {perfume.name}
            </h3>

            {/* Star Rating */}
            <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className={`transition-colors ${i < fullStars
                            ? 'fill-amber-400 text-amber-400'
                            : i === fullStars && hasHalfStar
                                ? 'fill-amber-400/50 text-amber-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                    />
                ))}
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                    ({starRating.toFixed(1)})
                </span>
            </div>

            {/* Seasonality Breakdown */}
            <div className="space-y-2 mb-3">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Seasonality
                </p>
                <div className="space-y-1.5">
                    {seasonData.map((season) => (
                        <div key={season.name} className="flex items-center gap-2">
                            <span className="text-xs text-slate-600 dark:text-slate-300 w-14">
                                {season.name}
                            </span>
                            <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{
                                        width: `${season.value}%`,
                                        backgroundColor: season.color,
                                    }}
                                />
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 w-7 text-right">
                                {Math.round(season.value)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Day / Night Breakdown */}
            <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Time of Day
                </p>
                <div className="space-y-1.5">
                    {timeData.map((time) => (
                        <div key={time.name} className="flex items-center gap-2">
                            <div className="w-14 flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                <time.icon size={12} className={time.name === 'Day' ? 'text-amber-500' : 'text-indigo-400'} />
                                <span className="text-xs">{time.name}</span>
                            </div>
                            <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{
                                        width: `${time.value}%`,
                                        backgroundColor: time.color,
                                    }}
                                />
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 w-7 text-right">
                                {Math.round(time.value)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
