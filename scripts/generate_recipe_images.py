#!/usr/bin/env python3
"""
Recipe Image Generator
Generates overhead and exploded-view images for all recipes using Nano Banana Pro.

This script processes all 65 recipes from data/recipes.json and generates two images per recipe:
1. Overhead shot - Traditional top-down food photography
2. Exploded-view diagram - Educational ingredient breakdown with annotations

Usage:
    uv run python scripts/generate_recipe_images.py
    uv run python scripts/generate_recipe_images.py --batch-size 4 --batch-delay 3
    uv run python scripts/generate_recipe_images.py --overhead-only
    uv run python scripts/generate_recipe_images.py --exploded-only
"""

import argparse
import json
import re
import shutil
import subprocess
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple


# =============================================================================
# Ingredient Extraction Functions
# =============================================================================

def extract_ingredients(recipe: Dict) -> List[str]:
    """
    Extract all ingredients from both ingredients and how_to_cook arrays.

    Many recipes have ingredients hidden in how_to_cook under labels like:
    - "Prykrashaemo:" (We decorate:)
    - "Variant 1:", "Variant 2:" (Option 1, Option 2)
    - "30g namazky:" (30g spread:)

    Args:
        recipe: Recipe dictionary with 'ingredients' and 'how_to_cook' arrays

    Returns:
        Combined list of all ingredients with duplicates removed
    """
    ingredients = []

    # Add all from ingredients array
    for ing in recipe.get('ingredients', []):
        if ing and ing.strip():
            cleaned = clean_ingredient_text(ing)
            if cleaned:
                ingredients.append(cleaned)

    # Extract ingredient-like items from how_to_cook
    how_to_cook = recipe.get('how_to_cook', [])
    for item in how_to_cook:
        if not item or not item.strip():
            continue

        # Skip section headers (end with colon)
        if item.strip().endswith(':'):
            continue

        # Skip pure instruction lines
        if is_instruction(item):
            continue

        # Check if item looks like an ingredient (contains weight patterns)
        if looks_like_ingredient(item):
            cleaned = clean_ingredient_text(item)
            if cleaned and cleaned not in ingredients:
                ingredients.append(cleaned)

    return ingredients


def clean_ingredient_text(text: str) -> str:
    """
    Clean ingredient text by removing bullets, trailing commas, and extra whitespace.

    Args:
        text: Raw ingredient text

    Returns:
        Cleaned ingredient text
    """
    # Remove bullet points at the start
    text = re.sub(r'^[*\-]\s*', '', text).strip()

    # Remove trailing comma
    text = text.rstrip(',')

    # Replace narrow no-break space with regular space
    text = text.replace('\u202f', ' ')

    # Normalize multiple spaces to single space
    text = re.sub(r'\s+', ' ', text).strip()

    return text


def looks_like_ingredient(text: str) -> bool:
    """
    Check if text looks like an ingredient.

    Args:
        text: Line of text to classify

    Returns:
        True if the text looks like an ingredient
    """
    text = text.strip()
    if not text:
        return False

    # Replace narrow no-break space with regular space for matching
    text = text.replace('\u202f', ' ')

    # Skip single digit variant separators
    if re.match(r'^\d$', text):
        return False

    # Pattern 1: Starts with number and Ukrainian unit (г, мл, шт, ч.л, ст.л)
    if re.match(r'^\d+[\-\d]*\s*(г|мл|шт|ч\.?\s*л|ст\.?\s*л)', text, re.IGNORECASE):
        return True

    # Pattern 2: Contains Ukrainian weight pattern anywhere (e.g., "пюре банану 245г")
    if re.search(r'\d+\s*г\b', text) and len(text) < 100:
        return True

    # Pattern 3: Starts with number followed by food word
    if re.match(r'^\d+[\-\d]*\s+\w', text):
        # But exclude time patterns like "15-20хв"
        if not re.search(r'хв|хвилин|градус|°C', text, re.IGNORECASE):
            return True

    # Pattern 4: Common ingredient starters (Ukrainian)
    ingredient_starters = [
        r'^яйце\s',
        r'^яєчн',
        r'^білок\s',
        r'^банан',
        r'^скибка\s',
        r'^шматочок\s',
        r'^омлет\s',
        r'^хлібц',
        r'^мікрогрін',
        r'^спеції',
        r'^трошки\s',
        r'^щіпка\s',
        r'^стевію?\s',
        r'^цедра\s',
        r'^сік\s',
        r'^корице',
        r'^ягоди\s',
        r'^пюре\s',
        r'^оливкова\s',
    ]

    for pattern in ingredient_starters:
        if re.match(pattern, text, re.IGNORECASE):
            return True

    return False


def is_instruction(text: str) -> bool:
    """
    Check if text is a cooking instruction.

    Args:
        text: Line of text to classify

    Returns:
        True if the text is an instruction
    """
    text = text.strip()
    if not text:
        return False

    check_text = text.lower()

    # Ukrainian cooking verbs
    cooking_verbs = [
        'змішуємо', 'замішуємо', 'збиваємо', 'варимо', 'готуємо',
        'випікаємо', 'смажимо', 'тушимо', 'додаємо', 'нарізаємо',
        'перемішуємо', 'викладаємо', 'накриваємо', 'формуємо',
        'поливаємо', 'посипаємо', 'прикрашаємо', 'запікаємо',
        'розігріваємо', 'маринуємо', 'кидаємо', 'кладемо',
        'звертаємо', 'обсмажуємо', 'підсмажуємо', 'накладаємо',
        'перебиваємо', 'збиті', 'змішати', 'варити', 'готувати',
        'випікати', 'смажити', 'тушити', 'додати', 'нарізати',
        'розімʼяти', 'розіминажмо', 'поламай', 'обваляй',
        'розклади', 'постав', 'настоятись', 'застигне'
    ]

    for verb in cooking_verbs:
        if verb in check_text:
            return True

    # Check for temperature patterns (Ukrainian)
    if re.search(r'\d+\s*(градус|°C|°)', text, re.IGNORECASE):
        return True

    # Check for time patterns (Ukrainian)
    if re.search(r'\d+[\-\d]*\s*(хв|хвилин|секунд|годин)', text, re.IGNORECASE):
        return True

    # Check for instruction keywords (Ukrainian)
    instruction_keywords = [
        'спосіб приготування', 'приготування:', 'опис:',
        'кидаємо в духовку', 'кладемо в морозилку',
        'на сухій сковорідці', 'на водичці',
        'все змішуємо', 'все замішуємо', 'окремо варимо',
        'поки готується', 'поки вариться', 'коли млинець'
    ]

    for keyword in instruction_keywords:
        if keyword in check_text:
            return True

    return False


# =============================================================================
# Prompt Building Functions
# =============================================================================

def build_overhead_prompt(title: str, ingredients: List[str]) -> str:
    """
    Build overhead shot prompt with actual ingredients.

    Args:
        title: Recipe title
        ingredients: List of ingredients

    Returns:
        Complete prompt for overhead shot image generation
    """
    # Join ingredients, limiting to first 10 for prompt length
    ingredient_list = ', '.join(ingredients[:10])
    if len(ingredients) > 10:
        ingredient_list += f' and {len(ingredients) - 10} more ingredients'

    return f"""Overhead, top-down food photography of {title} on a light beige stone surface.
A shallow ceramic bowl/plate containing: {ingredient_list}.
Natural soft daylight from above, minimal shadows, clean editorial food styling.
Sharp focus, high detail, realistic textures, fresh and appetizing.
Modern cookbook / Instagram food photography aesthetic.
No hands, no text, no branding, no clutter."""


def build_exploded_view_prompt(title: str, ingredients: List[str]) -> str:
    """
    Build exploded-view diagram prompt with ingredient layers.

    Args:
        title: Recipe title
        ingredients: List of ingredients

    Returns:
        Complete prompt for exploded-view image generation
    """
    # Format ingredients as numbered list (limit to 12 for reasonable layout)
    display_ingredients = ingredients[:12]
    ingredient_layers = '\n'.join([f"{i+1}. {ing}" for i, ing in enumerate(display_ingredients)])

    if len(ingredients) > 12:
        ingredient_layers += f'\n... and {len(ingredients) - 12} more ingredients'

    return f"""Create a clean, vertically stacked exploded-view visualization of {title}.
The ingredients are arranged in a strict bottom-to-top order, evenly spaced along a single centered vertical axis, with symmetry, alignment, and visual balance.

Ingredients (bottom to top):
{ingredient_layers}

All ingredient layers are parallel, evenly spaced, and centered, with no rotation, tilt, or perspective distortion.
Ingredients appear to float gently while maintaining realistic textures and color accuracy.
Add short, minimal annotations with thin leader lines.
Alternate caption placement from left to right as you move up the stack.

Background is pure white or very light neutral, matte and distraction-free.
Lighting is soft, even, and shadow-minimized with a clean editorial food-photography feel.
Style is premium food photography combined with a technical exploded diagram.
No hands, no bowl, no clutter, no branding, no dramatic shadows."""


# =============================================================================
# Image Generation Functions
# =============================================================================

def generate_image(prompt: str, output_path: Path, skill_dir: Path) -> bool:
    """
    Generate a single image using the image-generator skill.

    Args:
        prompt: The generation prompt
        output_path: Desired output path for the image
        skill_dir: Path to the image-generator skill directory

    Returns:
        True if successful, False otherwise
    """
    try:
        # Create a temporary output directory for this generation
        temp_output_dir = output_path.parent / '.temp_gen'
        temp_output_dir.mkdir(parents=True, exist_ok=True)

        # Call the image generation skill
        result = subprocess.run(
            [
                'uv', 'run', '--directory', str(skill_dir),
                'python', 'generate_image.py',
                prompt,
                '--resolution', '2K',
                '--aspect', '16:9',
                '--output', str(temp_output_dir)
            ],
            capture_output=True,
            text=True,
            timeout=120  # 2 minute timeout
        )

        # Check for errors
        if result.returncode != 0:
            print(f"      Error: {result.stderr}")
            return False

        # Parse output to find generated file
        generated_file = None
        for line in result.stdout.split('\n'):
            if 'Saved:' in line:
                path_str = line.split('Saved:')[1].strip()
                generated_file = Path(path_str)
                break

        if generated_file and generated_file.exists():
            # Move to desired location
            shutil.move(str(generated_file), str(output_path))

            # Cleanup temp directory
            try:
                shutil.rmtree(temp_output_dir)
            except Exception:
                pass

            return True
        else:
            print(f"      Warning: No image file found in output")
            return False

    except subprocess.TimeoutExpired:
        print(f"      Error: Image generation timed out")
        return False
    except subprocess.CalledProcessError as e:
        print(f"      Error generating image: {e}")
        return False
    except Exception as e:
        print(f"      Unexpected error: {e}")
        return False


def process_recipe(
    recipe: Dict,
    category_id: str,
    output_dir: Path,
    overhead_dir: Path,
    skill_dir: Path,
    generate_overhead: bool = True,
    generate_exploded: bool = True
) -> Tuple[str, bool, bool]:
    """
    Process a single recipe: extract ingredients, generate both images.

    Args:
        recipe: Recipe dictionary
        category_id: Category identifier (breakfast, lunch_dinner, desserts)
        output_dir: Directory for exploded-view images
        overhead_dir: Directory for overhead shot images
        skill_dir: Path to the image-generator skill
        generate_overhead: Whether to generate overhead shots
        generate_exploded: Whether to generate exploded-view images

    Returns:
        Tuple of (recipe_id, overhead_success, exploded_success)
    """
    recipe_id = recipe['id']
    title = recipe['title']
    recipe_key = f"{category_id}_{recipe_id}"

    print(f"  Processing {recipe_key}: {title}")

    # Extract ingredients
    ingredients = extract_ingredients(recipe)

    if not ingredients:
        print(f"    Warning: No ingredients found for {recipe_key}")
        ingredients = [title]  # Fallback to title

    # Define output paths
    exploded_path = output_dir / f"{recipe_key}.jpeg"
    overhead_path = overhead_dir / f"{recipe_key}.jpeg"

    # Check what needs to be generated
    overhead_exists = overhead_path.exists()
    exploded_exists = exploded_path.exists()

    # Skip if both already exist
    if overhead_exists and exploded_exists:
        print(f"    Skipping {recipe_key} (both images already exist)")
        return (recipe_key, True, True)

    overhead_success = overhead_exists or not generate_overhead
    exploded_success = exploded_exists or not generate_exploded

    # Generate overhead shot
    if generate_overhead and not overhead_exists:
        overhead_prompt = build_overhead_prompt(title, ingredients)
        print(f"    Generating overhead shot...")
        overhead_success = generate_image(overhead_prompt, overhead_path, skill_dir)
        if overhead_success:
            print(f"    [OK] Overhead shot saved")
        else:
            print(f"    [FAIL] Overhead shot failed")
        time.sleep(1)  # Small delay between images

    # Generate exploded-view
    if generate_exploded and not exploded_exists:
        exploded_prompt = build_exploded_view_prompt(title, ingredients)
        print(f"    Generating exploded-view...")
        exploded_success = generate_image(exploded_prompt, exploded_path, skill_dir)
        if exploded_success:
            print(f"    [OK] Exploded-view saved")
        else:
            print(f"    [FAIL] Exploded-view failed")

    return (recipe_key, overhead_success, exploded_success)


# =============================================================================
# Data Loading Functions
# =============================================================================

def load_recipes(recipes_path: Path) -> Dict:
    """
    Load recipes from JSON file.

    Args:
        recipes_path: Path to recipes.json

    Returns:
        Parsed JSON data
    """
    with open(recipes_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def collect_all_recipes(data: Dict) -> List[Tuple[str, Dict]]:
    """
    Collect all recipes from all categories.

    Args:
        data: Parsed JSON data with categories

    Returns:
        List of (category_id, recipe) tuples
    """
    all_recipes = []
    for category in data['categories']:
        category_id = category['id']
        for recipe in category['recipes']:
            all_recipes.append((category_id, recipe))
    return all_recipes


# =============================================================================
# Main Execution
# =============================================================================

def main():
    """Main entry point for recipe image generation."""
    parser = argparse.ArgumentParser(
        description="Generate recipe images using Nano Banana Pro",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument(
        '--recipes',
        default='data/recipes.json',
        help='Path to recipes.json (relative to project root)'
    )
    parser.add_argument(
        '--batch-size',
        type=int,
        default=4,
        help='Number of recipes to process in parallel'
    )
    parser.add_argument(
        '--batch-delay',
        type=int,
        default=3,
        help='Delay in seconds between batches'
    )
    parser.add_argument(
        '--overhead-only',
        action='store_true',
        help='Generate only overhead shots'
    )
    parser.add_argument(
        '--exploded-only',
        action='store_true',
        help='Generate only exploded-view images'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be generated without actually generating'
    )
    parser.add_argument(
        '--category',
        choices=['breakfast', 'lunch_dinner', 'desserts'],
        help='Process only a specific category'
    )
    parser.add_argument(
        '--recipe-id',
        type=int,
        help='Process only a specific recipe ID (requires --category)'
    )

    args = parser.parse_args()

    # Setup paths
    project_root = Path(__file__).parent.parent
    recipes_path = project_root / args.recipes
    output_dir = project_root / 'public' / 'recipe_images'
    overhead_dir = output_dir / 'overhead'
    skill_dir = project_root / '.claude' / 'skills' / 'image-generator-nano-banana-pro'

    # Determine what to generate
    generate_overhead = not args.exploded_only
    generate_exploded = not args.overhead_only

    # Print header
    print("=" * 60)
    print("Recipe Image Generator - Nano Banana Pro")
    print("=" * 60)
    print(f"Start time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Recipes file: {recipes_path}")
    print(f"Output directory: {output_dir}")
    print(f"Overhead directory: {overhead_dir}")
    print(f"Skill directory: {skill_dir}")
    print(f"Batch size: {args.batch_size}")
    print(f"Batch delay: {args.batch_delay}s")
    print(f"Generate overhead: {generate_overhead}")
    print(f"Generate exploded: {generate_exploded}")

    # Create overhead directory
    overhead_dir.mkdir(parents=True, exist_ok=True)
    print(f"[OK] Overhead directory ready: {overhead_dir}")

    # Validate skill directory
    if not skill_dir.exists():
        print(f"[FAIL] Skill directory not found: {skill_dir}")
        return 1

    generate_script = skill_dir / 'generate_image.py'
    if not generate_script.exists():
        print(f"[FAIL] Generate script not found: {generate_script}")
        return 1
    print(f"[OK] Image generation skill ready")

    # Load recipes
    print(f"\nLoading recipes from {recipes_path}...")
    try:
        data = load_recipes(recipes_path)
    except FileNotFoundError:
        print(f"[FAIL] Recipes file not found: {recipes_path}")
        return 1
    except json.JSONDecodeError as e:
        print(f"[FAIL] Invalid JSON in recipes file: {e}")
        return 1

    # Collect all recipes
    all_recipes = collect_all_recipes(data)

    # Filter by category if specified
    if args.category:
        all_recipes = [(cat_id, recipe) for cat_id, recipe in all_recipes if cat_id == args.category]
        print(f"Filtered to category: {args.category}")

    # Filter by recipe ID if specified
    if args.recipe_id:
        if not args.category:
            print("[FAIL] --recipe-id requires --category to be specified")
            return 1
        all_recipes = [(cat_id, recipe) for cat_id, recipe in all_recipes if recipe['id'] == args.recipe_id]
        print(f"Filtered to recipe ID: {args.recipe_id}")

    total_recipes = len(all_recipes)
    print(f"[OK] Found {total_recipes} recipes to process")

    if total_recipes == 0:
        print("[WARN] No recipes to process")
        return 0

    # Dry run mode
    if args.dry_run:
        print("\n[DRY RUN] Would generate the following images:")
        for category_id, recipe in all_recipes:
            recipe_key = f"{category_id}_{recipe['id']}"
            title = recipe['title']
            ingredients = extract_ingredients(recipe)

            exploded_path = output_dir / f"{recipe_key}.jpeg"
            overhead_path = overhead_dir / f"{recipe_key}.jpeg"

            exploded_exists = "EXISTS" if exploded_path.exists() else "GENERATE"
            overhead_exists = "EXISTS" if overhead_path.exists() else "GENERATE"

            print(f"  {recipe_key}: {title}")
            print(f"    Ingredients: {len(ingredients)}")
            if generate_overhead:
                print(f"    Overhead: {overhead_exists}")
            if generate_exploded:
                print(f"    Exploded: {exploded_exists}")

        return 0

    # Process in batches
    total_batches = (total_recipes + args.batch_size - 1) // args.batch_size
    results = []

    print(f"\nProcessing {total_recipes} recipes in {total_batches} batches...")
    print("-" * 60)

    for batch_num in range(total_batches):
        start_idx = batch_num * args.batch_size
        end_idx = min(start_idx + args.batch_size, total_recipes)
        batch = all_recipes[start_idx:end_idx]

        batch_start_time = time.time()
        print(f"\nBatch {batch_num + 1}/{total_batches} (recipes {start_idx + 1}-{end_idx})...")

        # Process batch in parallel
        with ThreadPoolExecutor(max_workers=args.batch_size) as executor:
            futures = []
            for category_id, recipe in batch:
                future = executor.submit(
                    process_recipe,
                    recipe,
                    category_id,
                    output_dir,
                    overhead_dir,
                    skill_dir,
                    generate_overhead,
                    generate_exploded
                )
                futures.append(future)

            # Collect results
            for future in as_completed(futures):
                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    print(f"    [FAIL] Exception in worker: {e}")
                    results.append(("unknown", False, False))

        batch_duration = time.time() - batch_start_time
        print(f"  Batch completed in {batch_duration:.1f}s")

        # Delay between batches (except for last batch)
        if batch_num < total_batches - 1:
            print(f"  Waiting {args.batch_delay}s before next batch...")
            time.sleep(args.batch_delay)

    # Summary
    print("\n" + "=" * 60)
    print("GENERATION SUMMARY")
    print("=" * 60)

    total = len(results)
    overhead_success = sum(1 for _, oh, _ in results if oh)
    exploded_success = sum(1 for _, _, ex in results if ex)

    print(f"Total recipes processed: {total}")
    if generate_overhead:
        print(f"Overhead shots successful: {overhead_success}/{total}")
    if generate_exploded:
        print(f"Exploded-views successful: {exploded_success}/{total}")

    # List failures
    failures = []
    for recipe_id, oh, ex in results:
        if generate_overhead and not oh:
            failures.append((recipe_id, "overhead"))
        if generate_exploded and not ex:
            failures.append((recipe_id, "exploded-view"))

    if failures:
        print(f"\nFailed generations ({len(failures)}):")
        for recipe_id, img_type in failures:
            print(f"  {recipe_id}: {img_type}")
    else:
        print("\nAll images generated successfully!")

    print(f"\nOutput directories:")
    print(f"  Exploded-views: {output_dir}")
    print(f"  Overhead shots: {overhead_dir}")
    print(f"\nEnd time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    # Return exit code based on success
    return 0 if not failures else 1


if __name__ == '__main__':
    exit(main())
