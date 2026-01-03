import { useMemo } from 'react';
import {
    RADAR_AXES,
    calculateAxisValue,
    polarToCartesian,
    getPolygonPoints,
    getLabelPosition,
    getTextAnchor,
} from '../utils/radarCalculations';

// Increased SVG size with more padding for labels
const SVG_SIZE = 500;
const CENTER = SVG_SIZE / 2;
const MAX_RADIUS = 150;
const LABEL_RADIUS = MAX_RADIUS + 35;

export default function RadarChart({
    perfumes,
    visiblePerfumes,
    hoveredPerfume,
    setHoveredPerfume,
    selectedAxis,
    setSelectedAxis,
}) {
    const numAxes = RADAR_AXES.length;
    const gridLevels = [1, 2, 3, 4, 5];

    // Generate grid circles
    const gridCircles = useMemo(() => {
        return gridLevels.map((level) => {
            const radius = (level / 5) * MAX_RADIUS;
            return (
                <circle
                    key={level}
                    cx={CENTER}
                    cy={CENTER}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="text-slate-200 dark:text-slate-700"
                />
            );
        });
    }, []);

    // Generate axis lines
    const axisLines = useMemo(() => {
        return RADAR_AXES.map((axis, i) => {
            const { x, y } = polarToCartesian(5, i, numAxes, CENTER, CENTER, MAX_RADIUS);
            return (
                <line
                    key={i}
                    x1={CENTER}
                    y1={CENTER}
                    x2={x}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-slate-300 dark:text-slate-600"
                />
            );
        });
    }, [numAxes]);

    // Generate axis labels with dynamic positioning
    const axisLabels = useMemo(() => {
        return RADAR_AXES.map((axis, i) => {
            const { x, y, angle } = getLabelPosition(i, numAxes, CENTER, CENTER, LABEL_RADIUS);
            const isSelected = selectedAxis === i;

            // Use dynamic text anchor based on angle
            const textAnchor = getTextAnchor(angle);

            // Calculate vertical alignment based on position
            let dy = '0.35em';
            if (y < CENTER - 100) dy = '1em';        // Top labels
            else if (y > CENTER + 100) dy = '-0.3em'; // Bottom labels

            return (
                <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor={textAnchor}
                    dy={dy}
                    className={`text-[11px] cursor-pointer transition-all duration-300 select-none
                      ${isSelected
                            ? 'font-bold fill-current'
                            : 'font-medium fill-current text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    style={isSelected ? { fill: axis.color } : undefined}
                    onClick={() => setSelectedAxis(isSelected ? null : i)}
                >
                    {axis.label}
                </text>
            );
        });
    }, [numAxes, selectedAxis, setSelectedAxis]);

    // Generate polygons for each visible perfume
    const polygons = useMemo(() => {
        if (selectedAxis !== null) return null;

        return perfumes
            .filter((p) => visiblePerfumes.includes(p.id))
            .map((perfume) => {
                const points = getPolygonPoints(perfume, CENTER, CENTER, MAX_RADIUS);
                const isHovered = hoveredPerfume === perfume.id;

                return (
                    <polygon
                        key={perfume.id}
                        points={points}
                        fill={perfume.color}
                        stroke={perfume.color}
                        strokeWidth={isHovered ? 3 : 1.5}
                        fillOpacity={isHovered ? 0.4 : 0.15}
                        strokeOpacity={isHovered ? 1 : 0.6}
                        className={`transition-all duration-300 cursor-pointer
                       ${hoveredPerfume && !isHovered ? 'opacity-20' : 'opacity-100'}`}
                        onMouseEnter={() => setHoveredPerfume(perfume.id)}
                        onMouseLeave={() => setHoveredPerfume(null)}
                    />
                );
            });
    }, [perfumes, visiblePerfumes, hoveredPerfume, selectedAxis, setHoveredPerfume]);

    // Generate focus mode dots (when an axis is selected)
    const focusDots = useMemo(() => {
        if (selectedAxis === null) return null;

        const visiblePerfumeList = perfumes.filter((p) => visiblePerfumes.includes(p.id));

        // Calculate scores and sort by value for this axis
        const perfumesWithScores = visiblePerfumeList.map((p) => ({
            ...p,
            score: calculateAxisValue(p, selectedAxis),
        }));

        // Sort by score descending
        perfumesWithScores.sort((a, b) => b.score - a.score);

        return perfumesWithScores.map((perfume, index) => {
            const { x, y } = polarToCartesian(
                perfume.score,
                selectedAxis,
                numAxes,
                CENTER,
                CENTER,
                MAX_RADIUS
            );

            const isHovered = hoveredPerfume === perfume.id;

            // Offset dots perpendicular to axis to avoid overlap
            const axisAngle = (2 * Math.PI * selectedAxis) / numAxes - Math.PI / 2;
            const perpAngle = axisAngle + Math.PI / 2;
            const offset = (index - (perfumesWithScores.length - 1) / 2) * 14;

            const offsetX = x + offset * Math.cos(perpAngle);
            const offsetY = y + offset * Math.sin(perpAngle);

            return (
                <g key={perfume.id}>
                    {/* Connecting line from dot to axis */}
                    <line
                        x1={x}
                        y1={y}
                        x2={offsetX}
                        y2={offsetY}
                        stroke={perfume.color}
                        strokeWidth="1"
                        strokeOpacity="0.3"
                    />
                    {/* Main dot */}
                    <circle
                        cx={offsetX}
                        cy={offsetY}
                        r={isHovered ? 12 : 8}
                        fill={perfume.color}
                        stroke="#fff"
                        strokeWidth="2"
                        className={`transition-all duration-300 cursor-pointer
                       ${hoveredPerfume && !isHovered ? 'opacity-30' : 'opacity-100'}`}
                        onMouseEnter={() => setHoveredPerfume(perfume.id)}
                        onMouseLeave={() => setHoveredPerfume(null)}
                    />
                    {/* Score label */}
                    {isHovered && (
                        <text
                            x={offsetX}
                            y={offsetY - 18}
                            textAnchor="middle"
                            className="text-xs font-bold fill-current text-slate-700 dark:text-slate-200"
                        >
                            {perfume.score.toFixed(2)}
                        </text>
                    )}
                </g>
            );
        });
    }, [perfumes, visiblePerfumes, selectedAxis, hoveredPerfume, numAxes, setHoveredPerfume]);

    return (
        <div className="relative w-full aspect-square max-w-lg mx-auto">
            {/* Back button for focus mode */}
            {selectedAxis !== null && (
                <button
                    onClick={() => setSelectedAxis(null)}
                    className="absolute top-2 left-2 z-10 px-3 py-1.5 text-sm font-medium
                     bg-slate-100 dark:bg-slate-800 rounded-lg
                     text-slate-600 dark:text-slate-300
                     hover:bg-slate-200 dark:hover:bg-slate-700
                     transition-all duration-300"
                >
                    ← Back to Overview
                </button>
            )}

            <svg
                viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Grid circles */}
                <g>{gridCircles}</g>

                {/* Axis lines */}
                <g>{axisLines}</g>

                {/* Center point */}
                <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={3}
                    className="fill-slate-400 dark:fill-slate-500"
                />

                {/* Perfume polygons or focus dots */}
                <g>{selectedAxis === null ? polygons : focusDots}</g>

                {/* Axis labels */}
                <g>{axisLabels}</g>
            </svg>
        </div>
    );
}
