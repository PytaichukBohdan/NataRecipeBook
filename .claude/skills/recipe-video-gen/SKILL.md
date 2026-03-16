---
name: recipe-video-generation
description: Generate or regenerate recipe videos for NataRecipeBook using PiAPI (Nano Banana Pro for images, Kling 2.5 Turbo for video). Use when Ната asks to create, regenerate, or modify recipe videos/animations.
---

# Recipe Video Generation Skill

## Purpose

Generate animated recipe videos that transition between two frames (e.g., finished dish → ingredients explosion, or ingredients → assembled dish). Used for NataRecipeBook recipe previews.

## Pipeline Overview

```
Recipe Data (ingredients) 
  → Image Generation (Nano Banana Pro via PiAPI)
    → Frame 1: Finished dish OR ingredients layout
    → Frame 2: Exploded ingredients view OR finished dish
  → Video Generation (Kling 2.5 Turbo via PiAPI)
    → Start frame + End frame → Animated video
  → Deploy to app (replace in public/recipe_images/videos/)
```

## API: PiAPI

Base URL: `https://api.piapi.ai`
Auth: `x-api-key: $PIAPI_API_KEY` (from .env)

### Image Generation (Nano Banana Pro)

```bash
curl -X POST "https://api.piapi.ai/api/v1/task" \
  -H "x-api-key: $PIAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nano-banana-pro",
    "task_type": "txt2img",
    "input": {
      "prompt": "<image prompt>",
      "width": 1280,
      "height": 720
    }
  }'
```

For image-to-image (using existing dish photo as reference):
```bash
curl -X POST "https://api.piapi.ai/api/v1/task" \
  -H "x-api-key: $PIAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nano-banana-pro",
    "task_type": "img2img",
    "input": {
      "prompt": "<image prompt>",
      "image_url": "<url of existing dish image>",
      "width": 1280,
      "height": 720
    }
  }'
```

### Video Generation (Kling 2.5 Turbo)

```bash
curl -X POST "https://api.piapi.ai/api/v1/task" \
  -H "x-api-key: $PIAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kling",
    "task_type": "video_generation",
    "input": {
      "prompt": "<video motion prompt>",
      "image_url": "<start frame URL>",
      "image_tail_url": "<end frame URL>",
      "duration": 5,
      "mode": "pro",
      "version": "2.5"
    }
  }'
```

### Check Task Status

```bash
curl -X GET "https://api.piapi.ai/api/v1/task/<task_id>" \
  -H "x-api-key: $PIAPI_API_KEY"
```

Poll until `status` is `completed`. Result URL in `output.video_url` or `output.image_url`.

## Workflow

### 1. Identify Recipe
- Find recipe in `data/recipes.json` by category + id
- Extract: title, ingredients list
- Check existing assets: `public/recipe_images/{category}_{id}.jpeg` (dish photo), `public/recipe_images/videos/{category}_{id}.mp4` (current video)

### 2. Generate Frames

**Frame A — Finished Dish (overhead shot):**
```
Overhead, top-down food photography of a vibrant, healthy [DISH TITLE] on a light beige stone surface. A shallow ceramic bowl/plate with [describe dish using ingredients]. [List each ingredient with visual description and placement]. Natural soft daylight from above, minimal shadows, clean editorial food styling. Sharp focus, high detail, realistic textures, fresh and appetizing. Modern cookbook / Instagram food photography aesthetic. No hands, no text, no branding, no clutter.
```

**Frame B — Exploded Ingredients View:**
```
Using the original [DISH TITLE] image as the sole ingredient reference, create a clean, vertically stacked exploded-view visualization. The ingredients are arranged in a strict bottom-to-top order, evenly spaced along a single centered vertical axis, with symmetry, alignment, and visual balance.

Bottom layer (base): [BASE INGREDIENT], forming a soft, natural pile.
Middle layers stacked upward:
- [INGREDIENT 1 with visual description]
- [INGREDIENT 2 with visual description]  
- [MAIN INGREDIENT with visual description]
- [INGREDIENT 3 with visual description]
Top layer: [GARNISH/FINISHING elements].

All layers parallel, evenly spaced, centered. No rotation, tilt, or perspective distortion. Ingredients float gently with realistic proportions and textures.

Add short minimal annotations with thin leader lines, alternating left-right.

Background pure white or light neutral, matte. Soft even lighting, minimal shadows. Premium food photography + technical exploded diagram style. No hands, no bowl, no clutter, no branding.
```

**Variation — Raw Ingredients:**
If Ната asks for "сирі інгредієнти" (raw ingredients), replace the exploded view with raw uncooked versions of each ingredient (e.g., raw steak instead of seared, whole avocado instead of sliced, etc.)

### 3. Generate Video (Kling 2.5 Turbo)

**Video prompt (dish → exploded ingredients):**
```
A high-angle, cinematic studio shot of a fresh [DISH TITLE] in a white ceramic bowl, centered on a clean white background. The dish is fully assembled: [list all ingredients as they appear]. After a brief moment of stillness, the dish bursts upward in a controlled, elegant explosion, with each ingredient separating cleanly and moving upward along a vertical axis. The motion is smooth, slow, and weightless—no chaos, no spinning—creating a precise, visually satisfying deconstruction. The ingredients settle into a perfectly aligned exploded-view composition, hovering in mid-air in distinct horizontal layers, evenly spaced and centered:
[list ingredients bottom to top]
Once fully separated and stable, minimal technical annotation lines and labels fade in, alternating left and right. Text is clean, modern, readable with thin leader lines. Lighting is soft and diffuse, studio-style, minimal shadows. Motion is slow-motion and cinematic. Ultra-realistic food textures, high detail, premium editorial aesthetic. Camera locked and steady. No hands, no people, no clutter, no branding, no background movement. End on the fully exploded, labeled ingredient view.
```

**Direction options:**
- `dish → ingredients` (default): Start frame = finished dish, End frame = exploded view
- `ingredients → dish`: Start frame = exploded/raw ingredients, End frame = finished dish

### 4. Download & Replace

```bash
# Download generated video
curl -o public/recipe_images/videos/{category}_{id}.mp4 "<video_url>"
```

### 5. Validate, Commit, Deploy
- Verify video plays correctly
- `git add && git commit && git push`
- Trigger Vercel production deploy via API
- Verify deployment
- Send link to Ната

## File Locations

- Recipe data: `data/recipes.json`
- Dish photos: `public/recipe_images/{category}_{id}.jpeg`  
- Videos: `public/recipe_images/videos/{category}_{id}.mp4`
- Video posters: same as dish photos

## Important Notes

- PIAPI_API_KEY is in `.env`
- Always poll task status — generation takes 30s-3min for images, 1-5min for videos
- Keep video files reasonable size (< 5MB ideally)
- Ната may ask in Ukrainian — "перегенеруй відео", "зроби сирі інгредієнти", "поміняй фрейми" etc.
- When Ната asks to regenerate — understand which recipe, which direction, any special requests
