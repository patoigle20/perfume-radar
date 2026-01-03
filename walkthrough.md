# Perfume Picker - Walkthrough

## What Was Built

A **web application** that helps choose the best perfume based on **season** and **time of day**, using data extracted from Fragrantica.

## Features

- **Season Selector**: Winter, Spring, Summer, Fall
- **Time Selector**: Day, Night  
- **Smart Ranking**: Calculates score using Harmonic Mean + rating bonus
- **Detail Modal**: Shows longevity, sillage, and Fragrantica link
- **Modern UI**: Dark theme with gradient accents

## Scoring Algorithm

```
harmonicMean = (2 × season% × time%) / (season% + time%)
ratingBonus = 1 + (ratingScore / 500)
finalScore = harmonicMean × ratingBonus
```

This ensures perfumes that match BOTH season AND time rank higher than those with extreme values in only one dimension.

## Files Created

- [index.html](file:///C:/Users/Pato/.gemini/antigravity/scratch/perfume-picker/index.html) - HTML structure
- [styles.css](file:///C:/Users/Pato/.gemini/antigravity/scratch/perfume-picker/styles.css) - Dark theme styling
- [app.js](file:///C:/Users/Pato/.gemini/antigravity/scratch/perfume-picker/app.js) - Logic & data
- [perfumes.json](file:///C:/Users/Pato/.gemini/antigravity/scratch/perfume-picker/data/perfumes.json) - Raw data

## Demo Recording

![App demo showing season/time selection and perfume ranking](C:/Users/Pato/.gemini/antigravity/brain/59455d3c-4bda-48e8-becf-76e6b118d4c2/perfume_app_demo_1766698401873.webp)

## Verification Results

- ✅ App loads correctly with dark modern UI
- ✅ Season/time selectors work and update rankings instantly
- ✅ Spicebomb Infrared ranks #1 for Winter Night (as expected)
- ✅ Detail modal shows all longevity/sillage data
- ✅ Fragrantica link opens correctly
