/**
 * Radar chart calculation utilities
 */

// Axis configuration for the radar chart
export const RADAR_AXES = [
    { label: '☀️ Summer Day', season: 'summer', time: 'day', color: '#f59e0b' },
    { label: '🌙 Summer Night', season: 'summer', time: 'night', color: '#d97706' },
    { label: '🍂 Fall Day', season: 'fall', time: 'day', color: '#ef4444' },
    { label: '🌑 Fall Night', season: 'fall', time: 'night', color: '#b91c1c' },
    { label: '❄️ Winter Day', season: 'winter', time: 'day', color: '#3b82f6' },
    { label: '🌃 Winter Night', season: 'winter', time: 'night', color: '#4f46e5' },
    { label: '🌷 Spring Day', season: 'spring', time: 'day', color: '#ec4899' },
    { label: '🌸 Spring Night', season: 'spring', time: 'night', color: '#9333ea' },
];

/**
 * Calculate sentiment score from rating votes (0-1 scale)
 * Formula: ((love*4) + (like*3) + (ok*2) + (dislike*1) + (hate*0)) / total_votes / 4
 */
export function calculateSentimentScore(rating) {
    const weights = {
        love: 4,
        like: 3,
        ok: 2,
        dislike: 1,
        hate: 0,
    };

    let totalVotes = 0;
    let weightedSum = 0;

    for (const [key, count] of Object.entries(rating)) {
        totalVotes += count;
        weightedSum += count * (weights[key] || 0);
    }

    if (totalVotes === 0) return 0;

    // Returns 0-1 scale (max is 4, so divide by 4)
    return weightedSum / totalVotes / 4;
}

/**
 * Calculate raw sentiment score (0-4 scale)
 * Formula: ((love*4) + (like*3) + (ok*2) + (dislike*1)) / total_votes
 */
export function calculateRawSentimentScore(rating) {
    const weights = {
        love: 4,
        like: 3,
        ok: 2,
        dislike: 1,
        hate: 0, // Explicitly excluded from numerator in user formula, or 0
    };

    let totalVotes = 0;
    let weightedSum = 0;

    for (const [key, count] of Object.entries(rating)) {
        totalVotes += count;
        weightedSum += count * (weights[key] || 0);
    }

    if (totalVotes === 0) return 0;

    return weightedSum / totalVotes;
}

/**
 * Calculate season score for an axis (0-1 scale)
 * Combines season percentage and time of day
 */
export function calculateSeasonScore(perfume, axisIndex) {
    const axis = RADAR_AXES[axisIndex];
    const seasonPct = perfume.seasonality[axis.season] || 0;
    const timePct = perfume.seasonality[axis.time] || 0;

    // Weighted combination (season 70%, time 30%)
    const combined = (seasonPct * 0.7) + (timePct * 0.3);

    // Return 0-1 scale
    return combined / 100;
}

/**
 * Calculate axis value for a perfume with sentiment integration
 * Formula: (SeasonScore * 0.7) + (SentimentScore * 0.3) normalized to 0-5 scale
 */
export function calculateAxisValue(perfume, axisIndex) {
    const seasonScore = calculateSeasonScore(perfume, axisIndex);
    const sentimentScore = calculateSentimentScore(perfume.rating);

    // Final score combining season and sentiment
    const finalScore = (seasonScore * 0.7) + (sentimentScore * 0.3);

    // Normalize to 0-5 scale
    return finalScore * 5;
}

/**
 * Convert polar coordinates to cartesian (for SVG)
 * @param {number} score - Value from 0-5
 * @param {number} axisIndex - Index of the axis (0-7)
 * @param {number} numAxes - Total number of axes (8)
 * @param {number} centerX - SVG center X
 * @param {number} centerY - SVG center Y
 * @param {number} maxRadius - Maximum radius for score of 5
 */
export function polarToCartesian(score, axisIndex, numAxes, centerX, centerY, maxRadius) {
    // Start from top (12 o'clock) and go clockwise
    const angleOffset = -Math.PI / 2; // Start from top
    const angle = (2 * Math.PI * axisIndex) / numAxes + angleOffset;

    // Radius proportional to score (0-5 maps to 0-maxRadius)
    const radius = (score / 5) * maxRadius;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    return { x, y, angle };
}

/**
 * Get polygon points string for SVG
 */
export function getPolygonPoints(perfume, centerX, centerY, maxRadius) {
    const numAxes = RADAR_AXES.length;
    const points = [];

    for (let i = 0; i < numAxes; i++) {
        const score = calculateAxisValue(perfume, i);
        const { x, y } = polarToCartesian(score, i, numAxes, centerX, centerY, maxRadius);
        points.push(`${x},${y}`);
    }

    return points.join(' ');
}

/**
 * Get label position for an axis (slightly outside the chart)
 */
export function getLabelPosition(axisIndex, numAxes, centerX, centerY, radius) {
    const angleOffset = -Math.PI / 2;
    const angle = (2 * Math.PI * axisIndex) / numAxes + angleOffset;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    return { x, y, angle };
}

/**
 * Get dynamic text anchor based on label position
 * Left-side (90°-270°): "end", Right-side: "start", Top/Bottom: "middle"
 */
export function getTextAnchor(angle) {
    // Normalize angle to 0-2PI
    const normalizedAngle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    // Convert to degrees for easier reasoning
    const degrees = (normalizedAngle * 180) / Math.PI;

    // Top and bottom zones (within 30 degrees of vertical)
    if (degrees < 30 || degrees > 330) return 'middle'; // Top
    if (degrees > 150 && degrees < 210) return 'middle'; // Bottom

    // Left side (90° to 270°)
    if (degrees > 90 && degrees < 270) return 'end';

    // Right side
    return 'start';
}

/**
 * Calculate longevity score as percentage
 */
export function calculateLongevityScore(longevity) {
    const weights = {
        'very weak': 1,
        'weak': 2,
        'moderate': 3,
        'long lasting': 4,
        'eternal': 5,
    };

    let totalVotes = 0;
    let weightedSum = 0;

    for (const [key, count] of Object.entries(longevity)) {
        totalVotes += count;
        weightedSum += count * weights[key];
    }

    if (totalVotes === 0) return 0;

    const score = weightedSum / totalVotes; // 1-5 scale
    return ((score - 1) / 4) * 100; // Normalize to 0-100%
}

/**
 * Calculate sillage score as percentage
 */
export function calculateSillageScore(sillage) {
    const weights = {
        'intimate': 1,
        'moderate': 2,
        'strong': 3,
        'enormous': 4,
    };

    let totalVotes = 0;
    let weightedSum = 0;

    for (const [key, count] of Object.entries(sillage)) {
        totalVotes += count;
        weightedSum += count * weights[key];
    }

    if (totalVotes === 0) return 0;

    const score = weightedSum / totalVotes; // 1-4 scale
    return ((score - 1) / 3) * 100; // Normalize to 0-100%
}

/**
 * Calculate star rating from love/like/ok/dislike/hate
 */
export function calculateStarRating(rating) {
    const weights = {
        love: 5,
        like: 4,
        ok: 3,
        dislike: 2,
        hate: 1,
    };

    let totalVotes = 0;
    let weightedSum = 0;

    for (const [key, count] of Object.entries(rating)) {
        totalVotes += count;
        weightedSum += count * weights[key];
    }

    if (totalVotes === 0) return 0;

    return weightedSum / totalVotes; // Returns 1-5 scale
}
