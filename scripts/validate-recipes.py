#!/usr/bin/env python3
"""
Script to validate recipe data integrity in recipes.json.

This validator checks:
1. JSON structure is valid
2. All recipes have required fields
3. No cooking instructions in ingredients field
4. No ingredients in how_to_cook field (except section headers)
5. All recipes have nutrition data with valid values
6. All recipes have image paths

Usage:
    uv run python scripts/validate-recipes.py
"""

import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple


# =============================================================================
# Classification Helper Functions
# =============================================================================

def is_ingredient(text: str) -> bool:
    """
    Check if text looks like an ingredient.

    Ingredient patterns:
    - Starts with number and unit: "75g lohyny", "1 egg", "50ml water"
    - Weight/volume format: r'^\d+[\-\d]*\s*(g|ml|sht|ch.l|st.l)'
    - Specific food words at start

    Args:
        text: The text to classify

    Returns:
        True if text looks like an ingredient
    """
    if not text or not text.strip():
        return False

    text_clean = text.strip()

    # Pattern 1: Starts with number and unit (Ukrainian)
    # Examples: "75g lohyny", "100ml moloka", "2 sht yayets"
    units_pattern = r'^(\d+[\-\d]*)\s*(г|мл|шт|ч\.л|ст\.л)'
    if re.match(units_pattern, text_clean, re.IGNORECASE):
        return True

    # Pattern 2: Starts with number followed by ingredient name
    # Examples: "1 yaitso", "2 banana", "3 styhli banany"
    number_start_pattern = r'^\d+[\-\d]*\s+(?!хв|градус|°)'
    if re.match(number_start_pattern, text_clean, re.IGNORECASE):
        # Make sure it's not a time/temperature indicator
        if not any(word in text_clean.lower() for word in ['хв', 'градус', '°c', 'секунд']):
            return True

    # Pattern 3: Common ingredient prefixes (food items without quantities)
    ingredient_starters = [
        'яйце', 'яєчн', 'банан', 'білок', 'жовт', 'молок', 'вершк',
        'сир ', 'творог', 'йогурт', 'кефір', 'вівсян', 'борошн',
        'цукор', 'стевія', 'мед', 'олія', 'масло', 'сіль', 'спеці',
        'шматочок', 'скибка', 'щіпка', 'трохи', 'трошки'
    ]
    text_lower = text_clean.lower()
    if any(text_lower.startswith(starter) for starter in ingredient_starters):
        return True

    # Pattern 4: Bullet point ingredients
    if text_clean.startswith('•') or text_clean.startswith('-'):
        # Check if what follows looks like an ingredient
        stripped = text_clean.lstrip('•- ')
        if re.match(r'^\d+', stripped):
            return True

    return False


def is_instruction(text: str) -> bool:
    """
    Check if text looks like a cooking instruction.

    Instruction patterns:
    - Contains cooking verbs
    - Contains temperature indicators
    - Contains time durations
    - Contains action words

    Args:
        text: The text to classify

    Returns:
        True if text looks like an instruction
    """
    if not text or not text.strip():
        return False

    text_clean = text.strip()
    text_lower = text_clean.lower()

    # Skip very short text (likely not instructions)
    if len(text_clean) < 10:
        return False

    # Pattern 1: Cooking verbs (Ukrainian)
    cooking_verbs = [
        'змішу', 'перемішу', 'збива', 'вари', 'готу', 'випіка',
        'смажи', 'тушку', 'печем', 'кидає', 'накрива', 'додає',
        'нарізає', 'подає', 'розмина', 'замішу', 'блендер',
        'маринува', 'ставим', 'виклада', 'розігрі', 'поли',
        'посипа', 'прикраша', 'подріб', 'формує', 'звертає',
        'об смажу', 'підсмаж', 'накладає', 'перебива'
    ]
    if any(verb in text_lower for verb in cooking_verbs):
        return True

    # Pattern 2: Temperature indicators
    temp_patterns = [
        r'\d+\s*градус', r'\d+\s*°[cс]?', r'180\s*-?\s*190',
        r'170\s*°', r'духов', r'мікрохвильов'
    ]
    for pattern in temp_patterns:
        if re.search(pattern, text_lower):
            return True

    # Pattern 3: Time indicators (minutes/hours)
    time_patterns = [
        r'\d+\s*-?\s*\d*\s*хв', r'\d+\s*хвилин', r'\d+\s*годин',
        r'\d+\s*секунд', r'на\s+годин'
    ]
    for pattern in time_patterns:
        if re.search(pattern, text_lower):
            return True

    # Pattern 4: Instruction phrases
    instruction_phrases = [
        'спосіб приготування', 'приготування:', 'все змішуємо',
        'все замішуємо', 'кидаємо в духовку', 'кладемо в морозилку',
        'поки готується', 'поки вариться', 'окремо варимо',
        'на сухій сковорідц', 'на водичці'
    ]
    if any(phrase in text_lower for phrase in instruction_phrases):
        return True

    return False


def is_section_header(text: str) -> bool:
    """
    Check if text is a section header (ends with colon).

    Examples: "Prykrashaemo:", "Nachynka:", "Sous:", "Opys:"

    Args:
        text: The text to classify

    Returns:
        True if text is a section header
    """
    if not text or not text.strip():
        return False

    text_clean = text.strip()

    # Section headers end with ":"
    if text_clean.endswith(':'):
        # Make sure it's not too long (headers are usually short)
        if len(text_clean) < 50:
            return True

    return False


# =============================================================================
# Validation Functions
# =============================================================================

def validate_json_structure(data: Dict) -> List[str]:
    """
    Validate the overall JSON structure.

    Args:
        data: Parsed JSON data

    Returns:
        List of error messages
    """
    errors = []

    if 'categories' not in data:
        errors.append("Missing 'categories' field in root object")
        return errors

    if not isinstance(data['categories'], list):
        errors.append("'categories' must be an array")
        return errors

    return errors


def validate_recipe(recipe: Dict, category_name: str, recipe_idx: int) -> Tuple[List[str], List[str]]:
    """
    Validate a single recipe.

    Args:
        recipe: Recipe dictionary
        category_name: Name of the category (for error messages)
        recipe_idx: Index of recipe in category (for error messages)

    Returns:
        Tuple of (errors, warnings)
    """
    errors = []
    warnings = []

    recipe_title = recipe.get('title', f'Recipe #{recipe_idx}')
    prefix = f"{category_name} - \"{recipe_title}\""

    # Check required fields
    required_fields = ['id', 'title', 'ingredients', 'how_to_cook', 'image_path']
    for field in required_fields:
        if field not in recipe:
            errors.append(f"{prefix}: Missing required field '{field}'")

    # Validate ingredients - check for instructions
    ingredients = recipe.get('ingredients', [])
    if not isinstance(ingredients, list):
        errors.append(f"{prefix}: 'ingredients' must be an array")
    else:
        for ing in ingredients:
            if isinstance(ing, str) and is_instruction(ing):
                errors.append(f"{prefix}: Instruction found in ingredients: \"{ing[:60]}...\"" if len(ing) > 60 else f"{prefix}: Instruction found in ingredients: \"{ing}\"")

        # Check for suspicious entries (numbers only)
        for ing in ingredients:
            if isinstance(ing, str) and re.match(r'^[0-9]+$', ing.strip()):
                warnings.append(f"{prefix}: Suspicious ingredient (number only): \"{ing}\"")

    # Validate how_to_cook - check for ingredients (except after section headers)
    # Section headers like "Прикрашаємо:", "Соус:", "Начинка:" introduce decoration/garnish
    # ingredients that are INTENTIONALLY placed in how_to_cook
    how_to_cook = recipe.get('how_to_cook', [])
    if not isinstance(how_to_cook, list):
        errors.append(f"{prefix}: 'how_to_cook' must be an array")
    else:
        in_section = False  # Track if we're inside a section (after a header)
        for step in how_to_cook:
            if isinstance(step, str):
                # Check if this is a section header - marks the start of a section
                if is_section_header(step):
                    in_section = True
                    continue

                # Check if this is an instruction - ends the section context
                # (ingredients should not appear after real cooking instructions)
                if is_instruction(step):
                    in_section = False
                    continue

                # Check if step looks like an ingredient
                if is_ingredient(step):
                    # Only flag as error if NOT inside a section
                    # Ingredients after section headers (like "Прикрашаємо:") are allowed
                    if not in_section:
                        step_display = f"\"{step[:60]}...\"" if len(step) > 60 else f"\"{step}\""
                        errors.append(f"{prefix}: Ingredient found in how_to_cook: {step_display}")

    # Validate nutrition data
    if 'nutrition' not in recipe:
        errors.append(f"{prefix}: Missing nutrition data")
    else:
        nutrition = recipe['nutrition']
        if not isinstance(nutrition, dict):
            errors.append(f"{prefix}: 'nutrition' must be an object")
        else:
            # Check required nutrition fields
            required_nutrition = ['serving_type', 'calories', 'protein', 'fat', 'carbs']
            for field in required_nutrition:
                if field not in nutrition:
                    errors.append(f"{prefix}: Missing nutrition field '{field}'")
                elif field == 'serving_type':
                    valid_types = ['per_100g', 'per_serving']
                    if nutrition[field] not in valid_types:
                        errors.append(f"{prefix}: Invalid serving_type '{nutrition[field]}', must be one of {valid_types}")
                else:
                    # Check numeric fields
                    value = nutrition[field]
                    if not isinstance(value, (int, float)):
                        errors.append(f"{prefix}: Nutrition field '{field}' must be a number, got {type(value).__name__}")
                    elif value < 0:
                        errors.append(f"{prefix}: Nutrition field '{field}' cannot be negative: {value}")
                    elif value == 0 and field == 'calories':
                        warnings.append(f"{prefix}: Unusual nutrition value: calories = 0")

    # Validate image_path
    image_path = recipe.get('image_path', '')
    if not image_path:
        errors.append(f"{prefix}: Empty or missing image_path")

    return errors, warnings


def validate_category_counts(data: Dict) -> Tuple[List[str], List[str]]:
    """
    Validate category recipe counts.

    Expected:
    - Breakfast (Sniduky): 20 recipes
    - Lunch/Dinner (Obid/vecherya): 25 recipes
    - Desserts (Desertu): 20 recipes
    - Total: 65 recipes

    Args:
        data: Parsed JSON data

    Returns:
        Tuple of (errors, warnings)
    """
    errors = []
    warnings = []

    expected_counts = {
        'breakfast': 20,
        'lunch_dinner': 25,
        'desserts': 20
    }

    total_recipes = 0
    category_info = []

    for category in data.get('categories', []):
        cat_id = category.get('id', 'unknown')
        cat_name = category.get('name_uk', cat_id)
        recipes = category.get('recipes', [])
        count = len(recipes)
        total_recipes += count

        category_info.append(f"{cat_name}: {count}")

        if cat_id in expected_counts:
            expected = expected_counts[cat_id]
            if count != expected:
                warnings.append(f"Category '{cat_name}' has {count} recipes, expected {expected}")

    # Check total
    if total_recipes != 65:
        warnings.append(f"Total recipes: {total_recipes}, expected 65")

    return errors, warnings, total_recipes, category_info


def check_image_files_exist(data: Dict, base_dir: Path) -> List[str]:
    """
    Optional check: verify image files exist.

    Args:
        data: Parsed JSON data
        base_dir: Base directory for relative paths

    Returns:
        List of warning messages for missing images
    """
    warnings = []

    for category in data.get('categories', []):
        cat_name = category.get('name_uk', 'Unknown')
        for recipe in category.get('recipes', []):
            image_path = recipe.get('image_path', '')
            if image_path:
                full_path = base_dir / image_path
                if not full_path.exists():
                    warnings.append(f"{cat_name} - \"{recipe.get('title', 'Unknown')}\": Image file not found: {image_path}")

    return warnings


# =============================================================================
# Main Validation Runner
# =============================================================================

def run_validation(json_path: Path) -> Tuple[bool, int, int]:
    """
    Run all validation checks and print results.

    Args:
        json_path: Path to recipes.json

    Returns:
        Tuple of (success, error_count, warning_count)
    """
    print("=" * 60)
    print("Recipe Data Validation Report")
    print("=" * 60)

    all_errors = []
    all_warnings = []

    # Step 1: Load and validate JSON structure
    print("\n[1/5] Validating JSON structure...")
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print("   [OK] JSON is valid")
    except json.JSONDecodeError as e:
        print(f"   [FAIL] Invalid JSON: {e}")
        return False, 1, 0
    except FileNotFoundError:
        print(f"   [FAIL] File not found: {json_path}")
        return False, 1, 0

    structure_errors = validate_json_structure(data)
    if structure_errors:
        for err in structure_errors:
            print(f"   [FAIL] {err}")
        return False, len(structure_errors), 0

    # Validate counts
    count_errors, count_warnings, total_recipes, category_info = validate_category_counts(data)
    print(f"   [OK] Total recipes: {total_recipes}")
    print(f"   [OK] Categories: {len(data['categories'])} ({', '.join(category_info)})")

    all_errors.extend(count_errors)
    all_warnings.extend(count_warnings)

    # Step 2: Validate ingredients fields
    print("\n[2/5] Validating ingredients fields...")
    ingredient_errors = []
    ingredient_warnings = []

    for category in data['categories']:
        cat_name = category.get('name_uk', 'Unknown')
        for idx, recipe in enumerate(category.get('recipes', []), 1):
            errors, warnings = validate_recipe(recipe, cat_name, idx)
            # Filter only ingredient-related errors
            ing_errs = [e for e in errors if 'Instruction found in ingredients' in e or 'Suspicious ingredient' in e]
            ing_warns = [w for w in warnings if 'Suspicious ingredient' in w]
            ingredient_errors.extend(ing_errs)
            ingredient_warnings.extend(ing_warns)

    if ingredient_errors:
        print(f"   [FAIL] Found {len(ingredient_errors)} issues in ingredients:")
        for err in ingredient_errors:
            print(f"      - {err}")
    else:
        print("   [OK] All ingredients are valid")

    all_errors.extend(ingredient_errors)
    all_warnings.extend(ingredient_warnings)

    # Step 3: Validate how_to_cook fields
    print("\n[3/5] Validating how_to_cook fields...")
    how_to_cook_errors = []

    for category in data['categories']:
        cat_name = category.get('name_uk', 'Unknown')
        for idx, recipe in enumerate(category.get('recipes', []), 1):
            errors, warnings = validate_recipe(recipe, cat_name, idx)
            # Filter only how_to_cook-related errors
            cook_errs = [e for e in errors if 'Ingredient found in how_to_cook' in e]
            how_to_cook_errors.extend(cook_errs)

    if how_to_cook_errors:
        print(f"   [FAIL] Found {len(how_to_cook_errors)} issues in how_to_cook:")
        for err in how_to_cook_errors:
            print(f"      - {err}")
    else:
        print("   [OK] All cooking instructions are valid")

    all_errors.extend(how_to_cook_errors)

    # Step 4: Validate nutrition data
    print("\n[4/5] Validating nutrition data...")
    nutrition_errors = []
    nutrition_warnings = []

    for category in data['categories']:
        cat_name = category.get('name_uk', 'Unknown')
        for idx, recipe in enumerate(category.get('recipes', []), 1):
            errors, warnings = validate_recipe(recipe, cat_name, idx)
            # Filter nutrition-related errors
            nutr_errs = [e for e in errors if 'nutrition' in e.lower() or 'serving_type' in e.lower()]
            nutr_warns = [w for w in warnings if 'nutrition' in w.lower() or 'calories' in w.lower()]
            nutrition_errors.extend(nutr_errs)
            nutrition_warnings.extend(nutr_warns)

    if nutrition_errors:
        print(f"   [FAIL] Missing or invalid nutrition data:")
        for err in nutrition_errors:
            print(f"      - {err}")
    else:
        print("   [OK] All recipes have nutrition data")

    if nutrition_warnings:
        for warn in nutrition_warnings:
            print(f"   [WARN] {warn}")

    all_errors.extend(nutrition_errors)
    all_warnings.extend(nutrition_warnings)

    # Step 5: Validate image paths
    print("\n[5/5] Validating image paths...")
    image_errors = []

    for category in data['categories']:
        cat_name = category.get('name_uk', 'Unknown')
        for idx, recipe in enumerate(category.get('recipes', []), 1):
            errors, warnings = validate_recipe(recipe, cat_name, idx)
            # Filter image-related errors
            img_errs = [e for e in errors if 'image_path' in e.lower()]
            image_errors.extend(img_errs)

    if image_errors:
        print(f"   [FAIL] Missing image paths:")
        for err in image_errors:
            print(f"      - {err}")
    else:
        print("   [OK] All recipes have image paths")

    # Optional: Check if image files exist
    base_dir = json_path.parent.parent  # Go up from data/ to project root
    missing_images = check_image_files_exist(data, base_dir)
    if missing_images:
        print(f"   [WARN] {len(missing_images)} image files not found on disk")
        all_warnings.extend(missing_images)

    all_errors.extend(image_errors)

    # Final Summary
    print("\n" + "=" * 60)
    total_errors = len(all_errors)
    total_warnings = len(all_warnings)

    if total_errors == 0:
        print(f"Validation Result: PASSED")
        print(f"Total: {total_errors} errors, {total_warnings} warnings")
    else:
        print(f"Validation Result: FAILED")
        print(f"Total: {total_errors} errors, {total_warnings} warnings")

    print("=" * 60)

    return total_errors == 0, total_errors, total_warnings


def main():
    """Main execution function."""
    # Define paths
    base_dir = Path(__file__).parent.parent
    json_path = base_dir / 'data' / 'recipes.json'

    # Run validation
    success, errors, warnings = run_validation(json_path)

    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
