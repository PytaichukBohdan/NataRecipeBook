---
name: piapi-video-generator
description: Generates AI videos using PiAPI (Kling 2.5 Turbo) with first-frame and last-frame control.
  Pay-as-you-go pricing at ~$0.33 per 5-second video. Use when user asks to create videos,
  generate video transitions, animate between images, or create recipe transformation videos.
---

# PiAPI Video Generator Skill

## Overview

This skill uses PiAPI to access Kling AI Video generation with **Kling 2.5 Turbo** as the default model. PiAPI is a reseller that offers affordable pay-as-you-go pricing without the $4,200 minimum of the official API.

**Pricing:** ~$0.33 per 5-second video (pro mode)

Perfect for creating:
- Recipe transformation videos (ingredients to finished dish)
- Morphing transitions between scenes
- Product transformation sequences
- Timelapse-style animations

## Prerequisites

- Environment variable `PIAPI_API_KEY` must be set
- Get your API key at: https://piapi.ai
- Can be set in the project root `.env` file

## Usage

Generate videos with the following command:

```bash
cd .claude/skills/piapi-video-generator && uv run python generate_video.py \
  --start-image <path_or_url> \
  --end-image <path_or_url> \
  --prompt "Description of the transition" \
  --version 2.5 \
  --duration 5 \
  --output ./generated_videos
```

### Required Arguments

- `--start-image`: Path to local image file or URL for the starting frame
- `--prompt`: Description of the video content/transition

### Optional Arguments

- `--end-image`: Path or URL to the ending frame image (for controlled transitions)
- `--version`: Kling model version (default: `2.5` for Kling 2.5 Turbo)
  - Available: `1.5`, `1.6`, `2.1`, `2.1-master`, `2.5`, `2.6`
- `--duration`: Video duration in seconds, 5 or 10 (default: 5)
- `--mode`: Quality mode, `std` or `pro` (default: pro, auto-set to pro when using end-image)
- `--output`: Output directory (default: ./generated_videos)

## Examples

### Example 1: Recipe Transformation Video

Create a video showing ingredients transforming into a finished dish:

```bash
cd .claude/skills/piapi-video-generator && uv run python generate_video.py \
  --start-image ./ingredients.png \
  --end-image ./finished_dish.png \
  --prompt "Transform breakfast ingredients into delicious cottage cheese pancakes with blueberries and banana" \
  --version 2.5 \
  --duration 5 \
  --output ./recipe_videos
```

### Example 2: Simple Image Animation (no end frame)

Animate a single image without end frame:

```bash
cd .claude/skills/piapi-video-generator && uv run python generate_video.py \
  --start-image ./product.jpg \
  --prompt "Slowly rotate the product with soft lighting changes" \
  --version 2.5 \
  --duration 5
```

### Example 3: Recipe Video from VIDEO_INDEX.md

```bash
cd .claude/skills/piapi-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/breakfast_6.jpeg \
  --end-image public/recipe_images/overhead/breakfast_6.jpeg \
  --prompt "A high-angle, cinematic studio shot of a balanced breakfast in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/piapi_*.mp4 public/recipe_images/videos/breakfast_6.mp4
```

## Output

- Videos are saved to the specified output directory
- Filename format: `piapi_YYYYMMDD_HHMMSS.mp4`
- Progress updates are printed during generation

## API Details

- **Provider**: PiAPI (reseller for Kling AI)
- **Base URL**: https://api.piapi.ai/api/v1
- **Endpoint**: `/task` (POST to create, GET to check status)
- **Authentication**: API key header (`x-api-key`)
- **Typical generation time**: 2-4 minutes depending on duration and mode

## Model Comparison

| Version | Name | Quality | Speed | End Frame |
|---------|------|---------|-------|-----------|
| **2.5** | Kling 2.5 Turbo | High | Fast | Yes |
| 2.6 | Kling 2.6 | Highest | Medium | Yes |
| 2.1-master | Master | Very High | Slow | Yes |
| 2.1 | Standard | Good | Medium | Yes |
| 1.6 | Legacy | Standard | Fast | Yes |

## Pricing (PiAPI)

| Mode | Duration | Cost |
|------|----------|------|
| Pro | 5s | ~$0.33 |
| Pro | 10s | ~$0.66 |
| Std | 5s | ~$0.20 |
| Std | 10s | ~$0.40 |

## Prompting Tips

For best results with start/end frame videos:
- Describe the transformation, not just the final state
- Mention camera movement if desired (zoom, pan, rotate)
- Include style guidance (cinematic, smooth, dynamic)
- Keep prompts concise but descriptive

## Limitations

- Maximum video duration: 10 seconds
- Image resolution: Supports up to 1080p (min 300px)
- Maximum image size: 10MB
- Processing time varies based on server load

## Comparison with Official Kling API

| Feature | PiAPI | Official Kling API |
|---------|-------|-------------------|
| Minimum purchase | None (pay-as-you-go) | $4,200 |
| Per-video cost | ~$0.33 | ~$0.35 |
| Credit validity | 180 days | 30 days |
| Concurrent jobs | 20+ | 5 |
| API complexity | Simple key | JWT tokens |
