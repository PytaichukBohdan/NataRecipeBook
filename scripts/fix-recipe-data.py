#!/usr/bin/env python3
"""
Recipe Data Cleanup and Nutrition Sync

This script parses the Ukrainian recipe text file (КнигаРецептівUpdated.txt)
and fixes all data issues in recipes.json. It:
1. Parses the txt file completely (not just nutrition data)
2. Classifies content as ingredients vs instructions vs section headers
3. Synchronizes nutrition (БЖУ) data with the txt file
4. Fixes mixed-up ingredients and instructions
5. Updates ingredient quantities that differ between JSON and txt
"""

import json
import re
import shutil
from pathlib import Path
from typing import Dict, List, Optional, Tuple


def clean_ingredient_text(text: str) -> str:
    """
    Clean ingredient text by removing bullets, trailing commas, and extra whitespace.

    Args:
        text: Raw ingredient text

    Returns:
        Cleaned ingredient text
    """
    # Remove bullet points at the start
    text = re.sub(r'^[•\-]\s*', '', text).strip()

    # Remove trailing comma
    text = text.rstrip(',')

    # Replace narrow no-break space with regular space
    text = text.replace('\u202f', ' ')

    # Normalize multiple spaces to single space
    text = re.sub(r'\s+', ' ', text).strip()

    return text


def is_variant_separator(text: str) -> bool:
    """
    Check if text is a variant separator (like "1", "2" for variant 1, variant 2).

    Args:
        text: Line of text to classify

    Returns:
        True if the text is a variant separator
    """
    text = text.strip()
    # Single digit on its own line
    return re.match(r'^\d$', text) is not None


def is_ingredient(text: str) -> bool:
    """
    Check if text is an ingredient.

    Patterns detected:
    - Starts with number and unit (75г лохини, 50мл води)
    - Starts with number and food (1 яйце, 2 яйця)
    - Named ingredients (Яйце куряче, Білок сирого яйця)
    - Ingredient name with weight (пюре банану 245г)

    Args:
        text: Line of text to classify

    Returns:
        True if the text is an ingredient
    """
    text = text.strip()
    if not text:
        return False

    # Remove bullet points
    text = re.sub(r'^[•\-]\s*', '', text).strip()

    # Replace narrow no-break space with regular space for matching
    text = text.replace('\u202f', ' ')

    # Exclude single digit variant separators
    if is_variant_separator(text):
        return False

    # Pattern 1: Starts with number and unit (г, мл, шт, ч.л, ст.л)
    if re.match(r'^\d+[\-\d]*\s*(г|мл|шт|ч\.?\s*л|ст\.?\s*л)', text):
        return True

    # Pattern 2: Starts with number followed by food word
    # Examples: "1 яйце", "2 яйця", "1 банан", "3 стиглі банани"
    if re.match(r'^\d+[\-\d]*\s+\w', text):
        # But exclude time patterns like "15-20хв"
        if not re.search(r'хв|min|градус|°C', text):
            return True

    # Pattern 3: Contains weight pattern anywhere (e.g., "пюре банану 245г")
    if re.search(r'\d+\s*г\b', text) and len(text) < 100:
        # Check that it's not primarily an instruction
        if not re.search(r'(змішуємо|варимо|готуємо|додаємо|випікаємо|збиваємо)', text, re.IGNORECASE):
            return True

    # Pattern 4: Common ingredient starters
    ingredient_starters = [
        r'^яйце\s',
        r'^яйця?\s',
        r'^білок\s',
        r'^банан',
        r'^скибка\s',
        r'^два\s+тост',
        r'^шматочок\s',
        r'^омлет\s',
        r'^хлібц[іи]\s',
        r'^мікрогрін',
        r'^спеції',
        r'^трошки\s+кори',
        r'^щіпка\s',
        r'^стевію?\s',
        r'^цедра\s',
        r'^сік\s+лимона',
        r'^цедра\s+апельсин',
        r'^корицею\s',
        r'^ягоди\s+на\s+свій',
        r'^пюре\s+',
        r'^оливкова\s+олія',
        r'^яєчний\s+білок',
    ]

    for pattern in ingredient_starters:
        if re.match(pattern, text, re.IGNORECASE):
            return True

    return False


def is_instruction(text: str) -> bool:
    """
    Check if text is a cooking instruction.

    Patterns detected:
    - Contains cooking verbs (змішуємо, варимо, випікаємо)
    - Contains temperature patterns
    - Contains time patterns
    - Contains cooking-related words

    Args:
        text: Line of text to classify

    Returns:
        True if the text is an instruction
    """
    text = text.strip()
    if not text:
        return False

    # Remove parentheses for checking
    check_text = text.lower()

    # Ukrainian cooking verbs
    cooking_verbs = [
        'змішуємо', 'змішую', 'змішати', 'замішуємо', 'замішати',
        'варимо', 'варити', 'вариться',
        'випікаємо', 'випікати', 'випікай',
        'збиваємо', 'збити', 'збивати',
        'маринувати', 'маринуємо',
        'готуємо', 'готується', 'готувати',
        'додаємо', 'додати', 'додайте', 'додай',
        'нарізаємо', 'нарізати',
        'перемішуємо', 'перемішати', 'перемішуючи',
        'викладаємо', 'викласти', 'викладай',
        'тушимо', 'тушити', 'стушити',
        'смажимо', 'смажити', 'обсмажуємо',
        'кидаємо', 'кинути', 'кладемо', 'кладай',
        'полити', 'поливаємо',
        'накриваємо', 'накрити',
        'розімʼяти', 'розіминажмо',
        'формуємо', 'формувати',
        'подати', 'подаємо',
        'посипаємо', 'посипати', 'посипаю',
        'запікаємо', 'запікати', 'спекти',
        'окремо', 'зверху', 'вкінці',
        'звертаємо', 'об\'єднати', 'зʼєднати',
        'поламай', 'обваляй', 'розклади', 'постав',
        'настоятись', 'приготувався', 'застигне',
        'прикрашаємо', 'прикрашати',
        'занурюємо', 'занурити',
    ]

    for verb in cooking_verbs:
        if verb in check_text:
            return True

    # Check for temperature patterns
    if re.search(r'\d+\s*(градус|°C|°)', text, re.IGNORECASE):
        return True

    # Check for time patterns
    if re.search(r'\d+[\-\d]*\s*(хв|хвилин|min)', text, re.IGNORECASE):
        return True

    # Instruction starters
    instruction_patterns = [
        r'^все\s+(як|змішуємо|замішуємо|тушимо|збиваємо)',
        r'^окремо\s+',
        r'^поки\s+',
        r'^коли\s+',
        r'^дати\s+настоятись',
        r'^\(.*змішу|збива|варим|готу.*\)$',  # Instructions in parentheses
    ]

    for pattern in instruction_patterns:
        if re.search(pattern, check_text):
            return True

    return False


def is_section_header(text: str) -> bool:
    """
    Check if text is a section header.

    Section headers end with ":" and introduce a new section
    like "Прикрашаємо:", "Начинка:", "Соус:", "Приготування:"

    Args:
        text: Line of text to classify

    Returns:
        True if the text is a section header
    """
    text = text.strip()
    if not text:
        return False

    # Remove bullet points
    text = re.sub(r'^[•\-]\s*', '', text).strip()

    # Must end with colon
    if not text.endswith(':'):
        return False

    # Common section headers
    section_patterns = [
        r'^прикрашаєм[оu]?:$',
        r'^начинка:$',
        r'^соус:$',
        r'^приготування:$',
        r'^спосіб\s+приготування:$',
        r'^опис:$',
        r'^інгредієнти:$',
        r'^намазка:$',
        r'^запіканка\s+.*:$',
        r'^гранола\s+.*:$',
        r'^приготування\s+граноли:$',
        r'^\d+г\s+.*:$',  # Like "50г Соус:"
        r'^\d+г\s+\w+:$',  # Like "100г млинців:"
    ]

    for pattern in section_patterns:
        if re.match(pattern, text, re.IGNORECASE):
            return True

    # If it's short (less than 50 chars) and ends with colon, likely a header
    if len(text) < 50 and text.endswith(':'):
        # But not if it looks like a complex instruction
        if not re.search(r'(змішуємо|варимо|додаємо|випікаємо)', text, re.IGNORECASE):
            return True

    return False


def is_description(text: str) -> bool:
    """
    Check if text is a description paragraph.

    Descriptions are longer sentences that describe the dish
    but are not cooking instructions.

    Args:
        text: Line of text to classify

    Returns:
        True if the text is a description
    """
    text = text.strip()
    if not text:
        return False

    # Descriptions are usually long sentences
    if len(text) < 100:
        return False

    # Description keywords
    description_keywords = [
        'ніжний', 'солодкість', 'аромат', 'атмосфера',
        'ідеальний', 'легкий', 'поживний', 'об\'єднаний',
        'штрих', 'затишку', 'свіжістю', 'домашнього',
    ]

    check_text = text.lower()
    keyword_count = sum(1 for kw in description_keywords if kw in check_text)

    return keyword_count >= 2


def is_decoration_section_header(text: str) -> bool:
    """
    Check if text is a decoration/garnish section header.

    These headers introduce ingredient lists that should stay in how_to_cook
    because they are decoration/garnish ingredients, not main ingredients.

    Args:
        text: Line of text to classify

    Returns:
        True if the text is a decoration section header
    """
    text = text.strip().lower()

    decoration_headers = [
        'прикрашаємо:',
        'прикрашаєм:',
        'соус:',
        'начинка:',
        'намазка:',
    ]

    for header in decoration_headers:
        if text.endswith(header) or text == header:
            return True

    # Match patterns like "50г Соус:"
    if re.match(r'^\d+г\s+соус:$', text, re.IGNORECASE):
        return True

    return False


def is_cooking_section_header(text: str) -> bool:
    """
    Check if text is a cooking instruction section header.

    These headers introduce cooking instructions, not ingredient lists.

    Args:
        text: Line of text to classify

    Returns:
        True if the text is a cooking section header
    """
    text = text.strip().lower()

    cooking_headers = [
        'приготування:',
        'спосіб приготування:',
        'приготування є:',
        'опис:',
        'приготування граноли:',
    ]

    for header in cooking_headers:
        if text.endswith(header) or text == header:
            return True

    return False


def is_ingredients_section_header(text: str) -> bool:
    """
    Check if text is an ingredients section header.

    These headers introduce ingredient lists (reset to main ingredients).

    Args:
        text: Line of text to classify

    Returns:
        True if the text is an ingredients section header
    """
    text = text.strip().lower()

    ingredients_headers = [
        'інгредієнти:',
    ]

    for header in ingredients_headers:
        if text.endswith(header) or text == header:
            return True

    return False


def parse_recipe_from_text(lines: List[str], start_idx: int) -> Tuple[Dict, int]:
    """
    Parse a single recipe from the text file starting at the given index.

    Args:
        lines: All lines from the text file
        start_idx: Index of the recipe title line

    Returns:
        Tuple of (recipe_data dict, next_recipe_start_index)
    """
    recipe = {
        'title': '',
        'ingredients': [],
        'how_to_cook': [],
        'nutrition': None
    }

    # Extract title
    title_line = lines[start_idx].strip()
    title_match = re.match(r'^\s*\d+\.\s+(.+)$', title_line)
    if title_match:
        recipe['title'] = title_match.group(1).strip()

    i = start_idx + 1
    current_section = 'ingredients'  # Start with ingredients
    in_decoration_section = False  # Track if we're in a decoration/garnish section

    while i < len(lines):
        line = lines[i].strip()

        # Check if we hit the next recipe
        if re.match(r'^\s*\d+\.\s+', line):
            break

        # Check for category headers (Сніданки, Обід/вечеря, etc.)
        if line in ['Сніданки', 'Обід/вечеря', 'Смаколики, з якими ти забудеш про відчуття провини']:
            i += 1
            continue

        # Skip empty lines and special characters
        if not line or line == '￼':
            i += 1
            continue

        # Check for nutrition data
        if 'Харчова цінність' in line:
            serving_type = "per_100g" if "100г" in line else "per_serving"

            # Get calories and macros from next lines
            i += 1
            calories = 0
            protein = 0
            fat = 0
            carbs = 0

            if i < len(lines):
                cal_line = lines[i].strip()
                cal_match = re.search(r'(\d+)ккал', cal_line)
                if cal_match:
                    calories = int(cal_match.group(1))

                i += 1
                if i < len(lines):
                    macros_line = lines[i].strip()
                    protein_match = re.search(r'Б\s*(\d+)', macros_line)
                    fat_match = re.search(r'Ж\s*(\d+)', macros_line)
                    carbs_match = re.search(r'В\s*(\d+)', macros_line)

                    protein = int(protein_match.group(1)) if protein_match else 0
                    fat = int(fat_match.group(1)) if fat_match else 0
                    carbs = int(carbs_match.group(1)) if carbs_match else 0

            recipe['nutrition'] = {
                'serving_type': serving_type,
                'calories': calories,
                'protein': protein,
                'fat': fat,
                'carbs': carbs
            }
            i += 1
            continue

        # Clean the line using the dedicated function
        clean_line = clean_ingredient_text(line)

        # Check if it's a variant separator (single digit like "1", "2")
        # Convert to a section header like "Варіант 1:"
        if is_variant_separator(line):
            variant_num = line.strip()
            clean_line = f"Варіант {variant_num}:"
            recipe['how_to_cook'].append(clean_line)
            current_section = 'how_to_cook'
            in_decoration_section = True  # Following items are ingredients for this variant
            i += 1
            continue

        # Check if it's an ingredients section header (Інгредієнти:)
        # This resets us back to collecting main ingredients
        if is_ingredients_section_header(line):
            current_section = 'ingredients'
            in_decoration_section = False
            # Don't add the header to output, just skip it
            i += 1
            continue

        # Check if it's a decoration section header (Прикрашаємо:, Соус:, etc.)
        if is_decoration_section_header(line):
            current_section = 'how_to_cook'
            in_decoration_section = True
            recipe['how_to_cook'].append(clean_line)
            i += 1
            continue

        # Check if it's a cooking section header (Приготування:, etc.)
        if is_cooking_section_header(line):
            current_section = 'how_to_cook'
            in_decoration_section = False
            recipe['how_to_cook'].append(clean_line)
            i += 1
            continue

        # Check if it's a general section header
        if is_section_header(line):
            current_section = 'how_to_cook'
            # Check if this looks like it introduces decoration ingredients
            if any(word in line.lower() for word in ['прикраша', 'соус', 'начинка', 'намазка']):
                in_decoration_section = True
            else:
                in_decoration_section = False
            recipe['how_to_cook'].append(clean_line)
            i += 1
            continue

        # Check if it's a description (goes to how_to_cook)
        if is_description(line):
            recipe['how_to_cook'].append(clean_line)
            i += 1
            continue

        # Check if it's an instruction - always goes to how_to_cook
        if is_instruction(line):
            current_section = 'how_to_cook'
            in_decoration_section = False  # Instructions end decoration section
            recipe['how_to_cook'].append(clean_line)
            i += 1
            continue

        # Check if it's an ingredient
        if is_ingredient(line):
            # If we're in a decoration section, ingredient-like items go to how_to_cook
            if in_decoration_section:
                recipe['how_to_cook'].append(clean_line)
            else:
                recipe['ingredients'].append(clean_line)
            i += 1
            continue

        # Default: if in ingredients section and not classified, add to ingredients
        # If in how_to_cook section, add to how_to_cook
        if current_section == 'ingredients':
            # Check if it looks more like an ingredient than instruction
            if not any(verb in line.lower() for verb in ['змішуємо', 'варимо', 'готуємо', 'додаємо']):
                recipe['ingredients'].append(clean_line)
            else:
                recipe['how_to_cook'].append(clean_line)
        else:
            recipe['how_to_cook'].append(clean_line)

        i += 1

    return recipe, i


def parse_text_file(text_content: str) -> Dict[str, Dict]:
    """
    Parse the entire text file and extract all recipe data.

    Args:
        text_content: Full content of the text file

    Returns:
        Dictionary mapping recipe titles to their data
    """
    recipes = {}
    lines = text_content.split('\n')

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Match recipe titles (start with tab and number)
        title_match = re.match(r'^\s*\d+\.\s+(.+)$', line)
        if title_match:
            recipe, next_idx = parse_recipe_from_text(lines, i)
            if recipe['title']:
                recipes[recipe['title']] = recipe
            i = next_idx
        else:
            i += 1

    return recipes


def match_recipe_title(json_title: str, text_titles: List[str]) -> Optional[str]:
    """
    Find the best matching title from text file for a JSON recipe title.

    Args:
        json_title: Title from JSON file
        text_titles: List of titles from text file

    Returns:
        Matching title from text file, or None if no match found
    """
    # First try exact match
    if json_title in text_titles:
        return json_title

    # Try case-insensitive match
    json_lower = json_title.lower()
    for text_title in text_titles:
        if text_title.lower() == json_lower:
            return text_title

    # Try matching with stripped spaces and punctuation
    json_cleaned = re.sub(r'\s+', ' ', json_title.strip())
    for text_title in text_titles:
        text_cleaned = re.sub(r'\s+', ' ', text_title.strip())
        if json_cleaned == text_cleaned:
            return text_title

    # Try matching without special quotes
    json_normalized = json_title.replace('"', '"').replace('"', '"').replace('«', '"').replace('»', '"')
    for text_title in text_titles:
        text_normalized = text_title.replace('"', '"').replace('"', '"').replace('«', '"').replace('»', '"')
        if json_normalized == text_normalized:
            return text_title

    # Try partial match for very similar titles
    json_words = set(json_title.lower().split())
    best_match = None
    best_score = 0

    for text_title in text_titles:
        text_words = set(text_title.lower().split())
        common = len(json_words & text_words)
        total = len(json_words | text_words)
        score = common / total if total > 0 else 0

        if score > 0.7 and score > best_score:
            best_score = score
            best_match = text_title

    return best_match


def reclassify_recipe_data(
    json_ingredients: List[str],
    json_how_to_cook: List[str],
    txt_recipe: Dict
) -> Tuple[List[str], List[str]]:
    """
    Reclassify ingredients and how_to_cook based on text file data.

    This function uses the parsed text file data as the source of truth
    and reclassifies any misplaced items.

    Args:
        json_ingredients: Current ingredients from JSON
        json_how_to_cook: Current how_to_cook from JSON
        txt_recipe: Parsed recipe from text file

    Returns:
        Tuple of (new_ingredients, new_how_to_cook)
    """
    # Use text file data as the primary source
    new_ingredients = txt_recipe.get('ingredients', []).copy()
    new_how_to_cook = txt_recipe.get('how_to_cook', []).copy()

    return new_ingredients, new_how_to_cook


def update_recipes(
    json_data: Dict,
    parsed_recipes: Dict[str, Dict]
) -> Tuple[int, int, List[str], List[str]]:
    """
    Update recipes.json with data from the parsed text file.

    Args:
        json_data: Loaded JSON data
        parsed_recipes: Parsed recipes from text file

    Returns:
        Tuple of (matched_count, total_count, unmatched_titles, updated_titles)
    """
    matched_count = 0
    total_count = 0
    unmatched_titles = []
    updated_titles = []
    text_titles = list(parsed_recipes.keys())

    for category in json_data['categories']:
        for recipe in category['recipes']:
            total_count += 1
            json_title = recipe['title']

            # Try to match with text file
            matched_title = match_recipe_title(json_title, text_titles)

            if matched_title and matched_title in parsed_recipes:
                txt_recipe = parsed_recipes[matched_title]

                # Reclassify ingredients and how_to_cook
                new_ingredients, new_how_to_cook = reclassify_recipe_data(
                    recipe.get('ingredients', []),
                    recipe.get('how_to_cook', []),
                    txt_recipe
                )

                # Update recipe
                old_ingredients = recipe.get('ingredients', [])
                old_how_to_cook = recipe.get('how_to_cook', [])

                recipe['ingredients'] = new_ingredients
                recipe['how_to_cook'] = new_how_to_cook

                # Update nutrition if available
                if txt_recipe.get('nutrition'):
                    recipe['nutrition'] = txt_recipe['nutrition']

                matched_count += 1

                # Track if anything changed
                if (old_ingredients != new_ingredients or
                    old_how_to_cook != new_how_to_cook):
                    updated_titles.append(f"{category['name_uk']} - {json_title}")
            else:
                unmatched_titles.append(f"{category['name_uk']} - {json_title}")

    return matched_count, total_count, unmatched_titles, updated_titles


def main():
    """Main execution function."""
    # Define paths
    base_dir = Path(__file__).parent.parent
    text_file = base_dir / 'data' / 'КнигаРецептівUpdated.txt'
    json_file = base_dir / 'data' / 'recipes.json'
    backup_file = base_dir / 'data' / 'recipes.backup.json'

    print("=" * 60)
    print("Recipe Data Cleanup and Nutrition Sync")
    print("=" * 60)

    # Step 1: Create backup
    print("\n[1/5] Creating backup of recipes.json...")
    if not json_file.exists():
        print(f"   ERROR: JSON file not found: {json_file}")
        return

    shutil.copy(json_file, backup_file)
    print(f"   ✓ Backup saved to: {backup_file}")

    # Step 2: Parse text file
    print("\n[2/5] Parsing КнигаРецептівUpdated.txt...")
    if not text_file.exists():
        print(f"   ERROR: Text file not found: {text_file}")
        return

    with open(text_file, 'r', encoding='utf-8') as f:
        text_content = f.read()

    parsed_recipes = parse_text_file(text_content)
    print(f"   ✓ Extracted {len(parsed_recipes)} recipes from text file")

    # Step 3: Load JSON
    print("\n[3/5] Loading recipes.json...")
    with open(json_file, 'r', encoding='utf-8') as f:
        json_data = json.load(f)

    total_json_recipes = sum(len(cat['recipes']) for cat in json_data['categories'])
    print(f"   ✓ Loaded {total_json_recipes} recipes from JSON")

    # Step 4: Update recipes
    print("\n[4/5] Processing and updating recipes...")
    matched, total, unmatched, updated = update_recipes(json_data, parsed_recipes)

    # Process by category
    for category in json_data['categories']:
        cat_name = category['name_uk']
        cat_count = len(category['recipes'])
        print(f"   ✓ Processed category: {cat_name} ({cat_count} recipes)")

    # Step 5: Save updated JSON
    print("\n[5/5] Saving updated recipes.json...")
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    print(f"   ✓ Saved to: {json_file}")

    # Summary
    print("\n" + "=" * 60)
    print("Summary:")
    print(f"   • Total recipes: {total}")
    print(f"   • Successfully matched: {matched}")
    print(f"   • Updated: {len(updated)}")
    print(f"   • Unmatched: {len(unmatched)}")
    print(f"   • Backup saved: {backup_file}")
    print(f"   • Updated file: {json_file}")

    if unmatched:
        print("\n   Warning - Unmatched recipes:")
        for title in unmatched:
            print(f"      - {title}")

    if updated:
        print("\n   Updated recipes:")
        for title in updated[:10]:  # Show first 10
            print(f"      - {title}")
        if len(updated) > 10:
            print(f"      ... and {len(updated) - 10} more")

    print("=" * 60)


if __name__ == '__main__':
    main()
