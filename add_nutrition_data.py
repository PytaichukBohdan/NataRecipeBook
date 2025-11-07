#!/usr/bin/env python3
"""
Script to extract nutritional information from the Ukrainian recipe text file
and add it to recipes.json
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Optional, Tuple


def parse_nutrition_from_text(text_content: str) -> Dict[str, Dict]:
    """
    Parse nutritional information from the text file.

    Returns:
        Dictionary mapping recipe titles to their nutrition data
    """
    nutrition_data = {}

    # Split content by recipe sections
    lines = text_content.split('\n')

    current_title = None
    i = 0

    while i < len(lines):
        line = lines[i].strip()

        # Match recipe titles (start with tab and number)
        title_match = re.match(r'^\s*\d+\.\s+(.+)$', line)
        if title_match:
            current_title = title_match.group(1).strip()
            i += 1
            continue

        # Match nutrition header
        if 'Харчова цінність' in line:
            if current_title:
                # Determine serving type
                serving_type = "per_100g" if "100г" in line else "per_serving"

                # Get next lines for calories and macros
                i += 1
                if i < len(lines):
                    calories_line = lines[i].strip()
                    # Extract calories
                    cal_match = re.search(r'(\d+)ккал', calories_line)
                    calories = int(cal_match.group(1)) if cal_match else 0

                    i += 1
                    if i < len(lines):
                        macros_line = lines[i].strip()
                        # Extract protein, fat, carbs
                        protein_match = re.search(r'Б\s*(\d+)г?', macros_line)
                        fat_match = re.search(r'Ж\s*(\d+)г?', macros_line)
                        carbs_match = re.search(r'В\s*(\d+)г?', macros_line)

                        protein = int(protein_match.group(1)) if protein_match else 0
                        fat = int(fat_match.group(1)) if fat_match else 0
                        carbs = int(carbs_match.group(1)) if carbs_match else 0

                        nutrition_data[current_title] = {
                            "serving_type": serving_type,
                            "calories": calories,
                            "protein": protein,
                            "fat": fat,
                            "carbs": carbs
                        }

        i += 1

    return nutrition_data


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

    return None


def update_recipes_json(
    json_path: Path,
    nutrition_data: Dict[str, Dict],
    output_path: Path
) -> Tuple[int, int, List[str]]:
    """
    Update recipes.json with nutrition data.

    Returns:
        Tuple of (matched_count, total_count, unmatched_titles)
    """
    # Read existing JSON
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    matched_count = 0
    total_count = 0
    unmatched_titles = []
    text_titles = list(nutrition_data.keys())

    # Update each category
    for category in data['categories']:
        for recipe in category['recipes']:
            total_count += 1
            json_title = recipe['title']

            # Try to match with text file
            matched_title = match_recipe_title(json_title, text_titles)

            if matched_title and matched_title in nutrition_data:
                recipe['nutrition'] = nutrition_data[matched_title]
                matched_count += 1
            else:
                unmatched_titles.append(f"{category['name_uk']} - {json_title}")

    # Write updated JSON
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return matched_count, total_count, unmatched_titles


def main():
    """Main execution function."""
    # Define paths
    base_dir = Path(__file__).parent
    text_file = base_dir / 'data' / 'Книга рецептів.txt'
    json_file = base_dir / 'data' / 'recipes.json'
    output_file = base_dir / 'data' / 'recipes.json'

    print("=" * 60)
    print("Adding Nutritional Information to recipes.json")
    print("=" * 60)

    # Step 1: Parse text file
    print("\n[1/4] Parsing nutritional data from text file...")
    with open(text_file, 'r', encoding='utf-8') as f:
        text_content = f.read()

    nutrition_data = parse_nutrition_from_text(text_content)
    print(f"   ✓ Extracted nutrition data for {len(nutrition_data)} recipes")

    # Step 2: Update JSON
    print("\n[2/4] Matching and updating recipes.json...")
    matched, total, unmatched = update_recipes_json(
        json_file,
        nutrition_data,
        output_file
    )

    print(f"   ✓ Matched {matched}/{total} recipes")

    # Step 3: Report results
    print("\n[3/4] Validation Results:")
    print(f"   • Total recipes: {total}")
    print(f"   • Successfully matched: {matched}")
    print(f"   • Unmatched: {len(unmatched)}")

    if unmatched:
        print("\n   ⚠ Unmatched recipes:")
        for title in unmatched:
            print(f"      - {title}")

    # Step 4: Generate summary
    print("\n[4/4] Summary:")
    if matched == total:
        print("   ✓ SUCCESS! All recipes now have nutritional information.")
    else:
        print(f"   ⚠ WARNING: {len(unmatched)} recipes still need nutrition data.")

    print(f"\n   Updated file saved to: {output_file}")
    print("\n" + "=" * 60)


if __name__ == '__main__':
    main()
