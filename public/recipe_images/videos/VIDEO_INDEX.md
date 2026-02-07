# Recipe Videos Index

## Master Prompts (Reference for Future Sessions)

### Image Prompt 1: Overhead View (Nano Banana Pro)
```
[Overhead, top-down food photography of a vibrant, healthy {RECIPE_TITLE} on a light beige stone surface. A shallow ceramic bowl filled with ingredients. Natural soft daylight from above, minimal shadows, clean editorial food styling. Sharp focus, high detail, realistic textures, fresh and appetizing. Modern cookbook / Instagram food photography aesthetic. No hands, no text, no branding, no clutter.]
```

### Image Prompt 2: Exploded View (Nano Banana Pro)
```
Create a clean, vertically stacked exploded-view visualization of recipe ingredients.
Ingredients arranged in strict bottom-to-top order, evenly spaced along a single centered vertical axis.
All ingredient layers are parallel, evenly spaced, and centered - no rotation, tilt, or perspective distortion.
Ingredients appear to float gently while maintaining realistic proportions, textures, and color accuracy.
Add short Ukrainian labels with thin leader lines.
Alternate label placement from left to right as you move up the stack.
Background is pure white or very light neutral gray, matte and distraction-free.
Lighting is soft, even, and shadow-minimized with clean editorial food-photography feel.
Style is premium food photography combined with technical exploded diagram.
No hands, no bowl, no clutter, no branding, no dramatic shadows.

Ingredients (bottom to top):
{LIST_INGREDIENTS_HERE}
```

### Kling 2.5 Turbo Video Prompt (Exploded → Overhead)
```
A high-angle, cinematic studio shot of a {RECIPE_TITLE} in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field.
```

### Full Kling Video Prompt (Detailed Version)
```
A high-angle, cinematic studio shot of a fresh {RECIPE_TITLE} in a white ceramic bowl, centered on a clean white background.
After a brief moment of stillness, the dish bursts upward in a controlled, elegant explosion, with each ingredient separating cleanly and moving upward along a vertical axis. The motion is smooth, slow, and weightless—no chaos, no spinning—creating a precise, visually satisfying deconstruction.
The ingredients settle into a perfectly aligned exploded-view composition, hovering in mid-air in distinct horizontal layers, evenly spaced and centered.
Once the ingredients are fully separated and stable, minimal technical annotation lines and labels fade in, alternating left and right for balance. Text is clean, modern, and readable, connected with thin leader lines, never overlapping the ingredients.
Lighting is soft and diffuse, studio-style, with minimal shadows.
Motion is slow-motion and cinematic, emphasizing clarity and elegance.
Ultra-realistic food textures, high detail, premium editorial aesthetic.
Camera remains locked and steady throughout.
No hands, no people, no clutter, no branding, no background movement.
End on the fully exploded, clearly labeled ingredient view.
```

---

## Video Generation Directions

Videos were generated in two different sessions with opposite animation directions:

### Session 1 (Earlier) - Overhead → Exploded
**Direction**: Finished dish transforms INTO exploded ingredients view
**Start frame**: `overhead/{recipe}.jpeg` (finished dish)
**End frame**: `{recipe}.jpeg` (exploded ingredients)

Videos:
- `breakfast_1.mp4`
- `breakfast_2.mp4`
- `breakfast_3.mp4`
- `breakfast_4.mp4`
- `breakfast_5.mp4`
- `breakfast_11.mp4`
- `breakfast_12.mp4`
- `breakfast_13.mp4`
- `breakfast_14.mp4`
- `desserts_1.mp4`
- `desserts_2.mp4`
- `desserts_3.mp4`
- `desserts_11.mp4`
- `desserts_12.mp4`
- `desserts_13.mp4`
- `desserts_14.mp4`
- `desserts_15.mp4`
- `lunch_dinner_1.mp4`
- `lunch_dinner_2.mp4`
- `lunch_dinner_3.mp4`
- `lunch_dinner_4.mp4`
- `lunch_dinner_14.mp4`
- `lunch_dinner_15.mp4`
- `lunch_dinner_16.mp4`
- `lunch_dinner_17.mp4`

### Session 2 (Jan 8, 2026) - Exploded → Overhead
**Direction**: Exploded ingredients transform INTO finished dish
**Start frame**: `{recipe}.jpeg` (exploded ingredients)
**End frame**: `overhead/{recipe}.jpeg` (finished dish)

Videos:
- `breakfast_15.mp4`
- `desserts_4.mp4`
- `lunch_dinner_5.mp4`
- `lunch_dinner_11.mp4`
- `lunch_dinner_12.mp4`
- `lunch_dinner_18.mp4`
- `lunch_dinner_19.mp4`

### Special
- `breakfast_1_explode.mp4` - Test/alternate version of breakfast_1

## Missing Videos (API credits exhausted)

**IMPORTANT: Generate these using Exploded → Overhead direction (same as Session 2)**

**Total missing: 33 videos** (requires Kling API credit recharge)

---

### Breakfast (10 videos missing)

**breakfast_6** - Збалансований сніданок
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/breakfast_6.jpeg \
  --end-image public/recipe_images/overhead/breakfast_6.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Збалансований сніданок in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/breakfast_6.mp4
```

**breakfast_7** - Зелений баланс
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/breakfast_7.jpeg \
  --end-image public/recipe_images/overhead/breakfast_7.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Зелений баланс in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/breakfast_7.mp4
```

**breakfast_8** - Омлет з «Мунг»
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/breakfast_8.jpeg \
  --end-image public/recipe_images/overhead/breakfast_8.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Омлет з Мунг in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/breakfast_8.mp4
```

**breakfast_9** - Білкові млинці з полуницею
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/breakfast_9.jpeg \
  --end-image public/recipe_images/overhead/breakfast_9.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Білкові млинці з полуницею in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/breakfast_9.mp4
```

**breakfast_10** - Твій ідеальний сніданок
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/breakfast_10.jpeg \
  --end-image public/recipe_images/overhead/breakfast_10.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Твій ідеальний сніданок in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/breakfast_10.mp4
```

**breakfast_16** - Вишневий вівсяномлинець
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/breakfast_16.jpeg \
  --end-image public/recipe_images/overhead/breakfast_16.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Вишневий вівсяномлинець in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/breakfast_16.mp4
```

**breakfast_17** - Барвисті тости
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/breakfast_17.jpeg \
  --end-image public/recipe_images/overhead/breakfast_17.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Барвисті тости in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/breakfast_17.mp4
```

**breakfast_18** - Протеінова вівсянка
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/breakfast_18.jpeg \
  --end-image public/recipe_images/overhead/breakfast_18.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Протеінова вівсянка in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/breakfast_18.mp4
```

**breakfast_19** - Мммм, а смачно як!!!!
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/breakfast_19.jpeg \
  --end-image public/recipe_images/overhead/breakfast_19.jpeg \
  --prompt "A high-angle, cinematic studio shot of a delicious breakfast plate in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/breakfast_19.mp4
```

**breakfast_20** - Зелена каша з омлетом
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/breakfast_20.jpeg \
  --end-image public/recipe_images/overhead/breakfast_20.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Зелена каша з омлетом in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/breakfast_20.mp4
```

---

### Desserts (11 videos missing)

**desserts_5** - Шоколадний десерт без випікання
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/desserts_5.jpeg \
  --end-image public/recipe_images/overhead/desserts_5.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Шоколадний десерт без випікання in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/desserts_5.mp4
```

**desserts_6** - Морозильний фруктовий десерт
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/desserts_6.jpeg \
  --end-image public/recipe_images/overhead/desserts_6.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Морозильний фруктовий десерт in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/desserts_6.mp4
```

**desserts_7** - Швидкий білковий десерт
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/desserts_7.jpeg \
  --end-image public/recipe_images/overhead/desserts_7.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Швидкий білковий десерт in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/desserts_7.mp4
```

**desserts_8** - Млинці з фруктово-сирною начинкою
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/desserts_8.jpeg \
  --end-image public/recipe_images/overhead/desserts_8.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Млинці з фруктово-сирною начинкою in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/desserts_8.mp4
```

**desserts_9** - Кавуновий сендвіч
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/desserts_9.jpeg \
  --end-image public/recipe_images/overhead/desserts_9.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Кавуновий сендвіч in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/desserts_9.mp4
```

**desserts_10** - Протеїнова запіканка з вишнею
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/desserts_10.jpeg \
  --end-image public/recipe_images/overhead/desserts_10.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Протеїнова запіканка з вишнею in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/desserts_10.mp4
```

**desserts_16** - Хрусткі шоколадні хлібці з протеїновим пудингом
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/desserts_16.jpeg \
  --end-image public/recipe_images/overhead/desserts_16.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Хрусткі шоколадні хлібці з протеїновим пудингом in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/desserts_16.mp4
```

**desserts_17** - Фруктова гранолка
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/desserts_17.jpeg \
  --end-image public/recipe_images/overhead/desserts_17.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Фруктова гранолка in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/desserts_17.mp4
```

**desserts_18** - Вафлі з вишнею
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/desserts_18.jpeg \
  --end-image public/recipe_images/overhead/desserts_18.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Вафлі з вишнею in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/desserts_18.mp4
```

**desserts_19** - Сирнички
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/desserts_19.jpeg \
  --end-image public/recipe_images/overhead/desserts_19.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Сирнички in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/desserts_19.mp4
```

**desserts_20** - Кекси з ягодами
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/desserts_20.jpeg \
  --end-image public/recipe_images/overhead/desserts_20.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Кекси з ягодами in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/desserts_20.mp4
```

---

### Lunch/Dinner (12 videos missing)

**lunch_dinner_6** - Просто та зі смаком
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/lunch_dinner_6.jpeg \
  --end-image public/recipe_images/overhead/lunch_dinner_6.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Просто та зі смаком in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/lunch_dinner_6.mp4
```

**lunch_dinner_7** - Твій найкращий ПП хачапурі
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/lunch_dinner_7.jpeg \
  --end-image public/recipe_images/overhead/lunch_dinner_7.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Твій найкращий ПП хачапурі in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/lunch_dinner_7.mp4
```

**lunch_dinner_8** - Зелена тарілка
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/lunch_dinner_8.jpeg \
  --end-image public/recipe_images/overhead/lunch_dinner_8.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Зелена тарілка in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/lunch_dinner_8.mp4
```

**lunch_dinner_9** - Снековий баланс
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/lunch_dinner_9.jpeg \
  --end-image public/recipe_images/overhead/lunch_dinner_9.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Снековий баланс in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/lunch_dinner_9.mp4
```

**lunch_dinner_10** - ПП ЛАЗАНЬЯ
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/lunch_dinner_10.jpeg \
  --end-image public/recipe_images/overhead/lunch_dinner_10.jpeg \
  --prompt "A high-angle, cinematic studio shot of a ПП Лазанья in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/lunch_dinner_10.mp4
```

**lunch_dinner_13** - Тортильї які ти полюбиш одразу
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/lunch_dinner_13.jpeg \
  --end-image public/recipe_images/overhead/lunch_dinner_13.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Тортильї які ти полюбиш одразу in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/lunch_dinner_13.mp4
```

**lunch_dinner_20** - Зелена паста
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/lunch_dinner_20.jpeg \
  --end-image public/recipe_images/overhead/lunch_dinner_20.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Зелена паста in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/lunch_dinner_20.mp4
```

**lunch_dinner_21** - Паста з трюфелем та стейком тунця
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/lunch_dinner_21.jpeg \
  --end-image public/recipe_images/overhead/lunch_dinner_21.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Паста з трюфелем та стейком тунця in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/lunch_dinner_21.mp4
```

**lunch_dinner_22** - Збалансований баланс
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/lunch_dinner_22.jpeg \
  --end-image public/recipe_images/overhead/lunch_dinner_22.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Збалансований баланс in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/lunch_dinner_22.mp4
```

**lunch_dinner_23** - Вечеря з білковим смаколиком
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/lunch_dinner_23.jpeg \
  --end-image public/recipe_images/overhead/lunch_dinner_23.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Вечеря з білковим смаколиком in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/lunch_dinner_23.mp4
```

**lunch_dinner_24** - Медальйони з тунця салатний мікс та картопля
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/lunch_dinner_24.jpeg \
  --end-image public/recipe_images/overhead/lunch_dinner_24.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Медальйони з тунця салатний мікс та картопля in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/lunch_dinner_24.mp4
```

**lunch_dinner_25** - Булгур з овочами та курочкою
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/lunch_dinner_25.jpeg \
  --end-image public/recipe_images/overhead/lunch_dinner_25.jpeg \
  --prompt "A high-angle, cinematic studio shot of a Булгур з овочами та курочкою in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 --output public/recipe_images/videos && mv public/recipe_images/videos/kling_*.mp4 public/recipe_images/videos/lunch_dinner_25.mp4
```

---

## File Paths

All videos located at: `public/recipe_images/videos/`
Exploded images: `public/recipe_images/{category}_{n}.jpeg`
Overhead images: `public/recipe_images/overhead/{category}_{n}.jpeg`
