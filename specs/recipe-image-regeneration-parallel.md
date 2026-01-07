# Plan: Regenerate All Recipe Images with Nano Banana Pro

## Task Description
Replace all 65 existing recipe images with newly generated ones using the image-generator-nano-banana-pro skill. Each image should:
- Use wide aspect ratio (4:3 - wider than square but not ultra-wide)
- Use Michelin-style dish presentation with minimalistic recipe book aesthetics
- Use existing images as reference for visual consistency
- Feature all ingredients beautifully plated on the dish
- Maintain consistent visual style across the entire recipe book
- Be generated in parallel using subagents for efficiency
- Original images backed up before replacement

## Objective
Generate 65 new, visually consistent, high-quality recipe images that show completed dishes with all ingredients beautifully presented on plates, replacing the existing images while maintaining the Ukrainian recipe book theme.

## Problem Statement
The current recipe images need to be replaced with AI-generated images that:
1. Show the final plated dish with all ingredients visible in Michelin-style presentation
2. Have consistent visual style (minimalistic professional food photography aesthetic)
3. Use wide 4:3 aspect ratio for uniform display across all pages
4. Maintain connection to original images through reference-based generation
5. Preserve original images as backup

## Solution Approach
1. Backup all existing images to public/recipe_images_backup/
2. Create a batch image generation system using parallel subagents
3. Each subagent handles one category (breakfast, lunch_dinner, desserts)
4. Use existing images as reference + recipe data (title, ingredients) to craft prompts
5. Generate 4:3 aspect ratio images with Michelin-style minimalistic presentation
6. Save directly to public/recipe_images/ replacing existing files

## Relevant Files

### Existing Files
- `data/recipes.json` - Contains all recipe data (titles, ingredients, image paths)
- `public/recipe_images/` - Contains 65 current images to be replaced
- `.claude/skills/image-generator-nano-banana-pro/SKILL.md` - Image generation skill documentation

### Recipe Image Inventory
| Category | Count | Files |
|----------|-------|-------|
| Breakfast | 20 | breakfast_1.jpeg to breakfast_20.jpeg |
| Lunch/Dinner | 25 | lunch_dinner_1.jpeg to lunch_dinner_25.jpeg |
| Desserts | 20 | desserts_1.jpeg to desserts_20.jpeg |

## Implementation Phases

### Phase 1: Backup
- Create backup directory: public/recipe_images_backup/
- Copy all existing images to backup directory

### Phase 2: Preparation
- Read recipe data to extract titles and ingredients
- Verify existing images can be used as references
- Define consistent prompt template for visual consistency

### Phase 3: Parallel Generation
- Launch 3 parallel subagents (one per category)
- Each subagent generates all images for its category
- Use reference images + structured prompts with Michelin-style aesthetic

### Phase 4: Verification
- Verify all 65 images were generated
- Check file sizes and formats
- Confirm images saved to correct paths
- Verify 4:3 aspect ratio

## Prompt Template

For visual consistency, use this structured prompt format for each recipe:

```
Michelin-star restaurant food photography of [RECIPE_TITLE]. A minimalist, beautifully plated dish featuring [INGREDIENTS_LIST], artfully arranged on [an elegant white ceramic plate / a modern minimalist plate].

Style: Michelin-guide minimalistic food photography aesthetic. Clean composition with negative space, warm natural lighting from the side, shallow depth of field (f/2.8), neutral background (light wood or white marble surface). Simple yet sophisticated plating with attention to geometry and balance.

Mood: Refined, appetizing, professional yet approachable. Colors should be natural and vibrant with emphasis on the fresh quality of ingredients. Minimalist presentation with focus on the dish itself.

The dish should look ready to serve in a high-end restaurant, with all ingredients visible and identifiable on the plate. Clean, uncluttered composition.
```

## Step by Step Tasks

### 1. Launch Parallel Subagents for Each Category
Execute three parallel build-agents, each handling one category:

**Breakfast Agent (20 images)**
- Process recipes 1-20 from breakfast category
- Use prompt template with each recipe's title and ingredients
- Reference: `/Users/bohdanpytaichuk/Documents/NataBook/NataRecipeBook/public/recipe_images/breakfast_{n}.jpeg`
- Output: Same path to replace existing images

**Lunch/Dinner Agent (25 images)**
- Process recipes 1-25 from lunch_dinner category
- Use prompt template with each recipe's title and ingredients
- Reference: `/Users/bohdanpytaichuk/Documents/NataBook/NataRecipeBook/public/recipe_images/lunch_dinner_{n}.jpeg`
- Output: Same path to replace existing images

**Desserts Agent (20 images)**
- Process recipes 1-20 from desserts category
- Use prompt template with each recipe's title and ingredients
- Reference: `/Users/bohdanpytaichuk/Documents/NataBook/NataRecipeBook/public/recipe_images/desserts_{n}.jpeg`
- Output: Same path to replace existing images

### 2. Image Generation Command Format
Each image generated with:
```bash
cd /Users/bohdanpytaichuk/Documents/NataBook/NataRecipeBook/.claude/skills/image-generator-nano-banana-pro && \
uv run python generate_image.py "[STRUCTURED_MICHELIN_PROMPT]" \
  --aspect 4:3 \
  --resolution 2K \
  --output "/Users/bohdanpytaichuk/Documents/NataBook/NataRecipeBook/public/recipe_images"
```

Then rename the timestamped generated file to match the original filename.

### 3. Recipe Data for Prompts

**Breakfast Recipes (20):**
1. Творожні панкейки з фруктами - яйце, банан, лохина, рисове борошно, сир
2. Ліниві вареники - сир, яйце, манка, рисова мука, йогурт, мигдаль, інжир
3. Тости твого настрою - хліб, Philadelphia, омлет, креветки, шампіньйони
4. Барвиста вівсянка - вівсянка, песто, яйце пашот, інжир, авокадо, черрі
5. Протеїнова вівсянка - вівсянка, протеїн, йогурт, запечені яблука
6. Збалансований сніданок - вівсянка, білок яйця, рукола, цвітна капуста, хліб, Philadelphia, тунець
7. Зелений баланс - варені яєчка, тофу, шпинат, горох, огірки, рисові хлібці
8. Омлет з «Мунг» - боби Мунг, шпинат, лохина, огірки, омлет, хлібці
9. Білкові млинці з полуницею - яєчний білок, вівсяне борошно, стевія, полуниця
10. Твій ідеальний сніданок - хліб, сир, йогурт, огірок, ікра, чіа пудинг
11. Білкові тости з фруктами - тости, Philadelphia, огірки, білок яйця, лохина, креветки
12. Післятренувальний білковий сніданок - сир, яєчний білок, протеїн, хліб, Philadelphia, креветки, картопля
13. Зелені оладки з креветками - яєчний білок, вівсяне борошно, шпинат, броколі, креветки
14. Не забувай літнього вайбу - салат маш, помідор, персик, лохина, кіноа, хлібець
15. Те що смачно - шпинат, хліб, сир, куряче філе, білок яйця, буряк, соя, малина
16. Вишневий вівсяномлинець - яйце, вівсянка, протеїн, молоко, буррата, авокадо, вишня
17. Барвисті тости - гречаний хлібчік, тофу, чеддер, фета, груша, салат, йогурт, черрі
18. Протеінова вівсянка - вівсянка, протеїн, йогурт, вишня, ожина, гарбузове насіння
19. Мммм, а смачно як!!!! - хліб, едамаме, креветки, ікра, черрі, лохина, Філадельфія
20. Зелена каша з омлетом - вівсянка, шпинат, білок яйця, яйце, тунець

**Lunch/Dinner Recipes (25):**
1. Поєднання класики - куряче філе, макарони, броколі
2. Легкість в простому - гречка, креветки, горошок, салат
3. Салат з булгуром - булгур, квасоля, груша, огірок, горошок, салат, лохина
4. Різото з трюфелем "Cordero" - різото, креветки, трюфельний соус, буряк
5. Бататовн пюре з цвітною капустою - батат, перець, цвітна капуста, спаржа, креветки
6. Просто та зі смаком - куряче філе, помідори, батат, моцарелла
7. Твій найкращий ПП хачапурі - сир, яйце, рисове борошно, Gran Biraghi
8. Зелена тарілка - макарони, ікра, рукола, авокадо, огірки, креветки, ківі
9. Снековий баланс - лосось, цвітна капуста, картопля, огірки, рукола, черрі
10. ПП ЛАЗАНЬЯ - куряче філе, lasagne, моцарелла, броколі, перець, цвітна капуста
11. Яскравий витвір - куряче філе, картопля, шпинат, кукурудза, черрі, лохина
12. Літня паста - лосось, макарони, брюссельська капуста, моцарелла, морква
13. Тортильї - лаваш, курятина, черрі, салат, абрикос, Philadelphia, креветки
14. Руда паста - паста, томатна паста, шпинат, креветки
15. Білява паста - паста, заморожені овочі, філе хека, йогурт, маракуя
16. Збірна боульна історія - рукола, черрі, полуниця, огірки, тунець, буряк, тофу
17. Щось на особливому - черрі, спаржа, боби маш, хліб, авокадо, тунець, паштет
18. Білковий фул - лосось, груша, помідори, картопля, сир, йогурт, лохина
19. Сезонна паста - паста орзо, квасоля, брюссельська капуста, тунець, кукурудза
20. Зелена паста - макарони мушлі, стейк тунця, броколі, горошок, огірки
21. Паста з трюфелем та стейком тунця - трюфельна паста, тунець, шпинат, рукола, моцарелла
22. Збалансований баланс - картопля, куряче філе, зелена гречка, горошок, черрі
23. Вечеря з білковим смаколиком - черрі, морква, картопля, яблуко, ківі, запіканка
24. Медальйони з тунця - стейк тунця, картопля, огірки, шпинат, горошок, черрі
25. Булгур з овочами та курочкою - булгур, куряче філе, квасоля, буряк, перець, слива

**Desserts Recipes (20):**
1. Протеїнове печиво - сир, какао, кокосова стружка, протеїн, білок яйця, банан, мигдаль
2. Протеїнове морозиво - сир, банан, протеїнова паста, ягоди
3. Галетна творожна піцца - сир, яйце, рисове борошно, моцарелла, брі, інжир
4. Пахне осінню - сир, яйця, протеїн, яблуко, рисове борошно, вишня, фініки
5. Шоколадний десерт без випікання - яйце, хурма, какао, сир, протеїн, соєве молоко
6. Морозильний фруктовий десерт - ягоди, вівсяна крупа, гречане борошно, фініки
7. Швидкий білковий десерт - сир, йогурт, яблуко, какао, протеїн, арахісова паста
8. Млинці з фруктово-сирною начинкою - яєчний білок, вівсяне борошно, творог, ягоди
9. Кавуновий сендвіч - кавун, моцарелла, помідорчики, рукола, горішки, йогурт
10. Протеїнова запіканка з вишнею - сир, яєчний білок, рисове борошно, протеїн, вишня
11. Банановий хлібчик з ягодами - банан, яйця, вівсяне борошно, протеїн, лохина, чорниця
12. Матча-брауні з білим шоколадом - вівсяне борошно, яйця, йогурт, матча, протеїн, білий шоколад
13. Білкові млинці з пудингом - яєчний білок, вівсяне борошно, стевія, протеїновий пудинг
14. Осінній банановий хлібчик - банани, яйця, вівсяне борошно, рисове борошно, кориця
15. Йогуртовий десерт - грецький йогурт, чіа, молоко, ягоди, гранола
16. Хрусткі шоколадні хлібці - рисові хлібці, протеїновий пудинг, какао, протеїн
17. Фруктова гранолка - гранола, арахісова паста, протеїновий пудинг, вишня, сир
18. Вафлі з вишнею - яєчні білки, вівсяне борошно, протеїн, вишня
19. Сирнички - яйце, сир, рисове борошно, стевія, цедра лимона
20. Кекси з ягодами - яєчний білок, вівсяне борошно, стевія, ягоди

### 4. Verify Generated Images
After all agents complete:
- Check all 65 images exist in `/public/recipe_images/`
- Verify file sizes are reasonable (> 100KB each)
- Confirm 16:9 aspect ratio

## Testing Strategy
1. Run a single test image generation first to verify prompt quality
2. Check that reference image feature works correctly
3. Verify output path and file naming works
4. Then proceed with parallel batch generation

## Acceptance Criteria
- [ ] Original images backed up to public/recipe_images_backup/
- [ ] All 65 recipe images replaced with new AI-generated images
- [ ] All images use 4:3 wide aspect ratio
- [ ] Images show Michelin-style plated dishes with visible ingredients
- [ ] Visual style is consistent minimalistic aesthetic across all categories
- [ ] No broken image paths in the application
- [ ] Images have Michelin-level professional food photography aesthetic

## Validation Commands
```bash
# Count generated images
ls -la public/recipe_images/*.jpeg public/recipe_images/*.png 2>/dev/null | wc -l

# Check file sizes (should be > 100KB each)
find public/recipe_images -type f \( -name "*.jpeg" -o -name "*.png" \) -size +100k | wc -l

# Verify backup exists
ls -la public/recipe_images_backup/*.jpeg public/recipe_images_backup/*.png 2>/dev/null | wc -l

# Verify all expected files exist
for i in {1..20}; do test -f "public/recipe_images/breakfast_$i.jpeg" || test -f "public/recipe_images/breakfast_$i.png" || echo "Missing breakfast_$i"; done
for i in {1..25}; do test -f "public/recipe_images/lunch_dinner_$i.jpeg" || test -f "public/recipe_images/lunch_dinner_$i.png" || echo "Missing lunch_dinner_$i"; done
for i in {1..20}; do test -f "public/recipe_images/desserts_$i.jpeg" || test -f "public/recipe_images/desserts_$i.png" || echo "Missing desserts_$i"; done

# Run Next.js dev server to visually verify
npm run dev
```

## Notes
- The GEMINI_API_KEY must be set for the nano-banana-pro skill to work
- CCSKILL_NANOBANANA_DIR environment variable must point to the skill repository
- Generating 65 images will incur API costs
- Images may need manual review for quality after generation
- Some images might need regeneration if quality is not satisfactory
- Consider backing up original images before replacement: `cp -r public/recipe_images public/recipe_images_backup`
