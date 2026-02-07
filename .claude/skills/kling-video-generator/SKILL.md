---
name: kling-video-generator
description: Generates AI videos using Kling Video API with first-frame and last-frame control.
  Creates smooth transitions between two images. Use when user asks to create videos,
  generate video transitions, animate between images, or create recipe transformation videos.
---

# Kling Video Generator Skill

## Overview

This skill uses the Kling AI Video API to generate videos with start and end frame control. Perfect for creating:
- Recipe transformation videos (ingredients to finished dish)
- Morphing transitions between scenes
- Product transformation sequences
- Timelapse-style animations

## Prerequisites

- Environment variables `KLING_ACCESS_KEY` and `KLING_SECRET_KEY` must be set
- Can be set in the project root `.env` file

## Usage

Generate videos with the following command:

```bash
uv run --directory . python generate_video.py \
  --start-image <path_or_url> \
  --end-image <path_or_url> \
  --prompt "Description of the transition" \
  --model kling-v1-6 \
  --duration 5 \
  --output ./generated_videos
```

### Required Arguments

- `--start-image`: Path to local image file or URL for the starting frame
- `--prompt`: Description of the video content/transition

### Optional Arguments

- `--end-image`: Path or URL to the ending frame image (for controlled transitions)
- `--model`: Model to use (default: `kling-v1-6`)
  - Models with end-frame support: `kling-v1-5`, `kling-v1-6`, `kling-v2-0-master`, `kling-v2-1-master`
  - `kling-v2-1` does NOT support end-frame
- `--duration`: Video duration in seconds, 5 or 10 (default: 5)
- `--mode`: Quality mode, `std` or `pro` (default: pro, auto-set to pro when using end-image)
- `--output`: Output directory (default: ./generated_videos)

## Examples

### Example 1: Recipe Transformation Video

Create a video showing ingredients transforming into a finished dish:

```bash
uv run --directory . python generate_video.py \
  --start-image ./ingredients.png \
  --end-image ./finished_dish.png \
  --prompt "Transform breakfast ingredients into delicious cottage cheese pancakes with blueberries and banana" \
  --model kling-v1-6 \
  --duration 5 \
  --output ./recipe_videos
```

### Example 2: Simple Image Animation (no end frame)

Animate a single image without end frame:

```bash
uv run --directory . python generate_video.py \
  --start-image ./product.jpg \
  --prompt "Slowly rotate the product with soft lighting changes" \
  --model kling-v2-1 \
  --duration 5
```

### Example 3: High Quality with Master Model

Generate with the master model for higher quality:

```bash
uv run --directory . python generate_video.py \
  --start-image ./scene1.png \
  --end-image ./scene2.png \
  --prompt "Cinematic transition from morning to evening cityscape" \
  --model kling-v2-1-master \
  --duration 10
```

## Output

- Videos are saved to the specified output directory
- Filename format: `kling_YYYYMMDD_HHMMSS.mp4`
- Progress updates are printed during generation

## API Details

- **Base URL**: https://api.klingai.com
- **Endpoint**: `/v1/videos/image2video`
- **Authentication**: JWT token (auto-generated from credentials)
- **Task-based flow**: Submit task -> Poll for completion -> Download video
- **Typical generation time**: 2-4 minutes depending on duration and mode

## Model Comparison

| Model | End Frame Support | Quality | Speed |
|-------|------------------|---------|-------|
| kling-v1-5 | Yes | Standard | Fast |
| kling-v1-6 | Yes | Good | Medium |
| kling-v2-0-master | Yes | High | Slow |
| kling-v2-1-master | Yes | Highest | Slowest |
| kling-v2-1 | No | High | Medium |

## Prompting Tips

For best results with start/end frame videos:
- Describe the transformation, not just the final state
- Mention camera movement if desired (zoom, pan, rotate)
- Include style guidance (cinematic, smooth, dynamic)
- Keep prompts concise but descriptive

## Limitations

- Maximum video duration: 10 seconds
- Image resolution: Supports up to 1080p
- Processing time varies based on server load
- `kling-v2-1` does not support `image_tail` (end frame) parameter
