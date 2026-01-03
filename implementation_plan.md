# Perfume Collection Radar Chart Visualization

Interactive web application to visualize perfume suitability across 8 axes (Season × Time combinations) with data from Fragrantica community voting.

## User Review Required

> [!IMPORTANT]
> **Shareability Feature**: The app will include an "Add Perfume" feature allowing users to input their own Fragrantica perfume data. Since Fragrantica blocks server-side scraping, users will manually enter the voting percentages via a guided form.

---

## Technology Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Framework** | Vanilla JS + HTML/CSS | Single-file, no build step, instant deployment, maximum portability |
| **Charting** | **Chart.js** with Radar plugin | Lightweight (~60KB), native radar chart, excellent animation/interactivity, well-documented |
| **Styling** | CSS Variables + Glassmorphism | Modern aesthetic, dark mode, dynamic gradients |

**Why Chart.js over D3.js?** D3 offers more flexibility but requires significantly more code for radar charts. Chart.js provides production-ready radar visualization out-of-the-box with built-in tooltips, legends, and animations.

---

## Mathematical Formula: Suitability Score

### Current Approach (Weighted Average)
```
Score = ((Season_% × 0.7) + (Time_% × 0.3)) × (5/100)
```

### Proposed Improvement: Harmonic Mean with Penalty

The weighted average fails to penalize "mismatched" combinations (e.g., high summer % but low day %). I propose using a **modified harmonic mean** which naturally penalizes low values:

```
Score = 5 × (2 × Season_% × Time_%) / (Season_% + Time_% + ε)
```

Where `ε = 1` prevents division by zero.

**Properties:**
- If either value is very low → score drops significantly
- Both values must be reasonably high for a good score
- Scale: 0-5 (matching original spec)

### Longevity & Sillage Normalization

Convert vote counts to weighted 0-100 score:

| Longevity | Weight | | Sillage | Weight |
|-----------|--------|-|---------|--------|
| Very Weak | 0 | | Intimate | 25 |
| Weak | 25 | | Moderate | 50 |
| Moderate | 50 | | Strong | 75 |
| Long Lasting | 75 | | Enormous | 100 |
| Eternal | 100 | | | |

```
Longevity_Score = Σ(votes_i × weight_i) / Σ(votes_i)
```

---

## Proposed Changes

### [NEW] [index.html](file:///C:/Users/Pato/.gemini/antigravity/scratch/perfume-radar/index.html)

Complete single-file web application containing:

**Structure:**
- Header with title and dark/light mode toggle
- Main content: Radar chart (left) + Perfume list sidebar (right)
- "Add Perfume" modal with guided data entry form
- Tooltips showing perfume details on hover

**Features:**
1. **Radar Chart (8 axes)**: Summer Day/Night, Autumn Day/Night, Winter Day/Night, Spring Day/Night
2. **Perfume Toggle List**: Checkboxes to show/hide individual perfumes
3. **Focus Mode**: Click axis label to highlight only that axis comparison
4. **Collision Handling**: Offset overlapping data points by 2-3px
5. **Rich Tooltips**: Name, Score, Longevity %, Sillage %, thumbnail image
6. **Add Perfume Modal**: Form with instructions for extracting Fragrantica data
7. **Preset Data**: 9 perfumes pre-loaded with extracted community voting data

**Styling:**
- Dark mode default with glassmorphism cards
- Vibrant gradient accent colors per perfume
- Smooth micro-animations on interactions
- Responsive layout (mobile-friendly)

---

## Data Extraction (Simulated Scraping)

Since Fragrantica blocks automated requests, I will:

1. **Manually extract** the 9 preset perfumes' data using the browser subagent
2. **Document the extraction logic** for users who want to add their own perfumes:

```javascript
// Seasonality: Find bars with class containing 'voting-small-chart-size'
// Each bar's inline width: XX% is the percentage

// Longevity/Sillage: Located in vote count format
// Extract counts next to labels: "very weak", "weak", "moderate", etc.
```

**User-facing instructions** will be displayed in the "Add Perfume" modal.

---

## Verification Plan

### Automated Tests
- Open the app in browser and verify all 9 perfumes render on the radar chart
- Test toggle functionality for each perfume
- Test focus mode by clicking axis labels
- Verify tooltips display correct data on hover
- Test "Add Perfume" modal opens and form validates input

### Manual Verification
- Cross-check a sample perfume's calculated score against manual calculation
- Verify collision offset works when multiple perfumes have identical scores
- Test responsive layout on mobile viewport sizes

