# Plan: Steak Salad Video Slides Generation

## Task Description
Generate two high-quality food photography images using the image-generator-nano-banana-pro skill that will serve as starting and finishing slides for a video. The images must share visual consistency (same background aesthetic) and be generated in parallel for efficiency.

## Objective
Generate two 16:9 aspect ratio images:
1. **Image 1 (Starting Slide)**: Overhead food photography of a steak salad bowl
2. **Image 2 (Finishing Slide)**: Exploded-view visualization of the same salad with ingredient annotations

Both images will maintain visual consistency and can later replace existing food images in the recipe book.

## Problem Statement
The recipe book needs professional video content with cohesive visual branding. Two complementary images are needed:
- A traditional food photography shot for the opening
- An educational exploded-view diagram for the closing

## Solution Approach
Use the existing `image-generator-nano-banana-pro` skill (Gemini 3 Pro Image) to generate both images in parallel using the Task tool with parallel subagents. The skill supports 16:9 aspect ratio and can generate high-quality food photography.

## Relevant Files

### Existing Files
- `.claude/skills/image-generator-nano-banana-pro/generate_image.py` - Main image generation script
- `.claude/skills/image-generator-nano-banana-pro/SKILL.md` - Skill documentation and prompting guide
- `data/recipes.json` - Recipe data containing ingredients (for reference)

### Output Locations
- Generated images will be saved to: `.claude/skills/image-generator-nano-banana-pro/generated_images/`
- Images can later be moved to: `public/recipe_images/` when replacing existing food images

## Implementation Phases

### Phase 1: Preparation
- Verify skill environment is ready
- Confirm GEMINI_API_KEY is available

### Phase 2: Parallel Image Generation
- Generate both images simultaneously using parallel Task agents
- Each agent runs the image generation skill with its specific prompt

### Phase 3: Verification
- Verify both images were generated successfully
- Display paths to generated images

## Step by Step Tasks

### 1. Verify Skill Environment
- Ensure the image-generator-nano-banana-pro skill directory exists
- Confirm dependencies are available

### 2. Generate Image 1 (Starting Slide) - Run in Parallel
Execute the image generation with:
```bash
uv run --directory .claude/skills/image-generator-nano-banana-pro python generate_image.py "Overhead, top-down food photography of a vibrant, healthy steak salad bowl on a light beige stone surface. A shallow ceramic bowl filled with finely chopped curly kale as the base. Medium-rare sliced steak arranged neatly across the center, pink interior with seared edges and visible seasoning. On one side, fanned avocado slices with cracked black pepper. Bright red diced bell peppers, crumbled white cheese (feta-style), and finely chopped greens distributed evenly around the bowl. A lemon wedge tucked against the edge of the bowl. A blue-handled fork resting inside the bowl, angled slightly toward the center. Natural soft daylight from above, minimal shadows, clean editorial food styling. Sharp focus, high detail, realistic textures, fresh and appetizing. Modern cookbook / Instagram food photography aesthetic. No hands, no text, no branding, no clutter." --aspect 16:9 --resolution 2K
```

### 3. Generate Image 2 (Finishing Slide) - Run in Parallel
Execute the image generation with:
```bash
uv run --directory .claude/skills/image-generator-nano-banana-pro python generate_image.py "Using the original steak salad image as the sole ingredient reference, create a clean, vertically stacked exploded-view visualization of the same salad. The ingredients are arranged in a strict bottom-to-top order, evenly spaced along a single centered vertical axis, with symmetry, alignment, and visual balance. Bottom layer (base of the salad): Finely chopped curly kale and mixed leafy greens, forming a soft, natural pile that anchors the composition. Middle layers (core ingredients), stacked upward in this order: Diced red bell peppers and chopped greens, evenly distributed. Crumbled white cheese (feta-style), centered and proportionally scaled. Medium-rare sliced steak, laid flat and neatly fanned, pink interior visible. Avocado slices, evenly cut and symmetrically fanned. Top layer (finishing elements): Lemon wedge and light vinaigrette droplets, placed delicately at the top of the image to signal freshness and completion. All ingredient layers are parallel, evenly spaced, and centered, with no rotation, tilt, or perspective distortion. Ingredients appear to float gently while maintaining realistic textures and color accuracy. Add short, minimal annotations with thin leader lines. Alternate caption placement from left to right as you move up the stack to create visual balance and avoid crowding. Example annotations: Leafy greens: Fresh base, rich in nutrients. Steak: High-quality protein. Avocado: Healthy fats, creamy balance. Red pepper: Natural sweetness and antioxidants. Lemon and vinaigrette: Light finish enhancing natural flavors. Background is pure white or very light neutral, matte and distraction-free. Lighting is soft, even, and shadow-minimized with a clean editorial food-photography feel. Style is premium food photography combined with a technical exploded diagram, suitable for marketing, nutrition education, or app UI. No hands, no bowl, no clutter, no branding, no dramatic shadows." --aspect 16:9 --resolution 2K
```

### 4. Verify Generated Images
- Check that both images were created in the output directory
- Display the file paths to the user

## Testing Strategy
- Visual inspection of generated images for quality and consistency
- Verify both images have correct 16:9 aspect ratio
- Ensure images are saved with proper timestamps in the output directory

## Acceptance Criteria
- [ ] Both images are generated successfully
- [ ] Images are in 16:9 aspect ratio
- [ ] Image 1 shows overhead steak salad bowl photography
- [ ] Image 2 shows exploded-view ingredient diagram with annotations
- [ ] Both images have consistent visual quality suitable for video slides
- [ ] File paths are provided for both generated images

## Validation Commands
Execute these commands to validate the task is complete:

```bash
# Check generated images exist
ls -la .claude/skills/image-generator-nano-banana-pro/generated_images/

# Verify image dimensions (macOS)
sips -g pixelWidth -g pixelHeight .claude/skills/image-generator-nano-banana-pro/generated_images/*.png
```

## Notes

### Recipe Ingredients Reference (from data/recipes.json)
The recipe book contains 65+ recipes with ingredients stored in both `ingredients` array and sometimes within `how_to_cook` array. Example steak salad ingredients:
- Curly kale (leafy greens base)
- Medium-rare sliced steak
- Avocado slices
- Red bell peppers
- Feta-style white cheese
- Lemon wedge
- Vinaigrette

### Parallel Execution
Both image generations should be launched simultaneously using parallel Task agents to maximize efficiency. Each generation typically takes 10-30 seconds.

### Background Consistency
- Image 1: Light beige stone surface
- Image 2: Pure white/light neutral background

While not identical backgrounds, both use neutral, clean backgrounds that complement each other for video transition.

### Future Use
These images will later replace existing food images in `public/recipe_images/` directory for the recipe book application.
