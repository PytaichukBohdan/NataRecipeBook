# Plan: Recipe Image Generation from Data

## Task Description
Generate high-quality food photography images for each recipe in the recipe book using actual ingredients from `data/recipes.json`. For each recipe, generate two images:
1. **Overhead Shot (Starting Slide)**: Traditional top-down food photography
2. **Exploded-View Diagram (Finishing Slide)**: Educational ingredient breakdown with annotations

The exploded-view diagram replaces the original recipe image in `public/recipe_images/`.

## Objective
- Parse all recipes from `data/recipes.json`
- Extract ingredients (from both `ingredients` array AND `how_to_cook` array)
- Generate 2 images per recipe using `image-generator-nano-banana-pro` skill
- Save exploded-view images to replace originals at `public/recipe_images/{category}_{id}.jpeg`
- Save overhead shots to `public/recipe_images/overhead/{category}_{id}.jpeg`

## Problem Statement
Current recipe images need to be replaced with AI-generated professional food photography that:
- Accurately represents the recipe's actual ingredients
- Provides educational value through exploded-view diagrams
- Maintains consistent visual branding across the recipe book

## Solution Approach
1. Read `data/recipes.json` and parse all recipes
2. For each recipe, extract ALL ingredients (including those in `how_to_cook`)
3. Build dynamic prompts using actual ingredients
4. Generate images in parallel batches
5. Save to appropriate paths, replacing original images

## Relevant Files

### Input Files
- `data/recipes.json` - Source of all recipe data and ingredients

### Skill Files
- `.claude/skills/image-generator-nano-banana-pro/generate_image.py` - Image generation script
- `.claude/skills/image-generator-nano-banana-pro/SKILL.md` - Prompting guide

### Output Locations
- `public/recipe_images/{category}_{id}.jpeg` - Exploded-view (replaces original)
- `public/recipe_images/overhead/{category}_{id}.jpeg` - Overhead shots (new directory)

## Recipe Data Structure

```json
{
  "categories": [
    {
      "id": "breakfast",        // Category ID
      "recipes": [
        {
          "id": 1,              // Recipe ID within category
          "title": "Recipe Name",
          "ingredients": [...], // Primary ingredients
          "how_to_cook": [...], // May contain additional ingredients!
          "image_path": "public/recipe_images/breakfast_1.jpeg"
        }
      ]
    }
  ]
}
```

**Categories:**
- `breakfast` (20 recipes) → `breakfast_1.jpeg` to `breakfast_20.jpeg`
- `lunch_dinner` (25 recipes) → `lunch_dinner_1.jpeg` to `lunch_dinner_25.jpeg`
- `desserts` (20 recipes) → `desserts_1.jpeg` to `desserts_20.jpeg`

## Implementation Phases

### Phase 1: Data Extraction
- Parse `data/recipes.json`
- For each recipe, combine `ingredients` + ingredient-like items from `how_to_cook`
- Create ingredient list for prompt generation

### Phase 2: Prompt Generation
- Build overhead shot prompt with actual ingredients
- Build exploded-view prompt with ingredient annotations

### Phase 3: Parallel Image Generation
- Generate images in batches (e.g., 4-6 recipes in parallel)
- Use Task agents for parallel execution

### Phase 4: Image Placement
- Copy/move exploded-view images to replace originals
- Create `public/recipe_images/overhead/` directory for starting slides

## Prompt Templates

### Overhead Shot Template
```
Overhead, top-down food photography of {RECIPE_TITLE} on a light beige stone surface.
A shallow ceramic bowl/plate containing: {INGREDIENT_LIST}.
Natural soft daylight from above, minimal shadows, clean editorial food styling.
Sharp focus, high detail, realistic textures, fresh and appetizing.
Modern cookbook / Instagram food photography aesthetic.
No hands, no text, no branding, no clutter.
```

### Exploded-View Template
```
Create a clean, vertically stacked exploded-view visualization of {RECIPE_TITLE}.
The ingredients are arranged in a strict bottom-to-top order, evenly spaced along a single centered vertical axis, with symmetry, alignment, and visual balance.

Ingredients (bottom to top):
{INGREDIENT_LAYERS}

All ingredient layers are parallel, evenly spaced, and centered, with no rotation, tilt, or perspective distortion.
Ingredients appear to float gently while maintaining realistic textures and color accuracy.
Add short, minimal annotations with thin leader lines.
Alternate caption placement from left to right as you move up the stack.

Background is pure white or very light neutral, matte and distraction-free.
Lighting is soft, even, and shadow-minimized with a clean editorial food-photography feel.
Style is premium food photography combined with a technical exploded diagram.
No hands, no bowl, no clutter, no branding, no dramatic shadows.
```

## Step by Step Tasks

### 1. Create Helper Script
Create a Python script to:
- Parse recipes.json
- Extract all ingredients per recipe
- Generate prompts from templates
- Execute image generation
- Save to correct paths

### 2. Create Output Directory
```bash
mkdir -p public/recipe_images/overhead
```

### 3. Generate Images Per Category
For each category (breakfast, lunch_dinner, desserts):
- Process recipes in parallel batches
- Generate both image types per recipe
- Save with correct naming convention

### 4. Replace Original Images
- Exploded-view → `public/recipe_images/{category}_{id}.jpeg`
- Overhead → `public/recipe_images/overhead/{category}_{id}.jpeg`

### 5. Verify All Images
- Check all 65 recipes have both images
- Verify image quality and correct ingredient representation

## Example: Recipe Processing

**Input (breakfast recipe #2):**
```json
{
  "id": 2,
  "title": "Ліниві вареники",
  "ingredients": ["200г сир кисломолочний 0,2%", "1 яйце", "10г манка", "15г рисова мука"],
  "how_to_cook": ["Прикрашаємо:", "15г йогурт 1,5%", "10г мигдалю", "5г гарбузовим насінням", "10г родзинок", "1 інжир"],
  "image_path": "public/recipe_images/breakfast_2.jpeg"
}
```

**Extracted Ingredients:**
- сир кисломолочний (cottage cheese)
- яйце (egg)
- манка (semolina)
- рисова мука (rice flour)
- йогурт (yogurt)
- мигдаль (almonds)
- гарбузове насіння (pumpkin seeds)
- родзинки (raisins)
- інжир (fig)

**Output Files:**
- `public/recipe_images/breakfast_2.jpeg` (exploded-view)
- `public/recipe_images/overhead/breakfast_2.jpeg` (overhead shot)

## Testing Strategy
- Visual inspection of sample generated images
- Verify ingredient accuracy in exploded-view annotations
- Check all 65 recipe images are generated
- Confirm correct file paths and naming

## Acceptance Criteria
- [ ] All 65 recipes have exploded-view images at original paths
- [ ] All 65 recipes have overhead shots in `/overhead/` directory
- [ ] Images are 16:9 aspect ratio
- [ ] Ingredient annotations match actual recipe ingredients
- [ ] Images maintain consistent visual style across all recipes

## Validation Commands
```bash
# Check all original images replaced
ls -la public/recipe_images/*.jpeg | wc -l  # Should be 65

# Check overhead directory created and populated
ls -la public/recipe_images/overhead/*.jpeg | wc -l  # Should be 65

# Verify specific recipe image
ls -la public/recipe_images/breakfast_1.jpeg
ls -la public/recipe_images/overhead/breakfast_1.jpeg
```

## Notes

### Ingredient Extraction Logic
Many recipes have ingredients hidden in `how_to_cook` under labels like:
- "Прикрашаємо:" (We decorate:)
- "Варіант 1:", "Варіант 2:" (Option 1, Option 2)
- "30г намазки:" (30g spread:)

The extraction should include ALL ingredient-like items regardless of which array they're in.

### Batch Processing
To avoid API rate limits and optimize cost:
- Process 4-6 recipes in parallel
- Add small delays between batches
- Total: ~130 images (65 recipes × 2 images)

### Image Format
- Output format: JPEG (matching existing images)
- Resolution: 2K
- Aspect ratio: 16:9
