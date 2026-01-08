# Recipe Videos Index

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

Command template:
```bash
cd .claude/skills/kling-video-generator && uv run python generate_video.py \
  --start-image public/recipe_images/{recipe}.jpeg \
  --end-image public/recipe_images/overhead/{recipe}.jpeg \
  --prompt "A high-angle, cinematic studio shot of a {RECIPE_TITLE} in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field." \
  --duration 5 \
  --output public/recipe_images/videos
```

### Breakfast (10 videos missing)
| File | Start Frame | End Frame |
|------|-------------|-----------|
| `breakfast_6.mp4` | `breakfast_6.jpeg` | `overhead/breakfast_6.jpeg` |
| `breakfast_7.mp4` | `breakfast_7.jpeg` | `overhead/breakfast_7.jpeg` |
| `breakfast_8.mp4` | `breakfast_8.jpeg` | `overhead/breakfast_8.jpeg` |
| `breakfast_9.mp4` | `breakfast_9.jpeg` | `overhead/breakfast_9.jpeg` |
| `breakfast_10.mp4` | `breakfast_10.jpeg` | `overhead/breakfast_10.jpeg` |
| `breakfast_16.mp4` | `breakfast_16.jpeg` | `overhead/breakfast_16.jpeg` |
| `breakfast_17.mp4` | `breakfast_17.jpeg` | `overhead/breakfast_17.jpeg` |
| `breakfast_18.mp4` | `breakfast_18.jpeg` | `overhead/breakfast_18.jpeg` |
| `breakfast_19.mp4` | `breakfast_19.jpeg` | `overhead/breakfast_19.jpeg` |
| `breakfast_20.mp4` | `breakfast_20.jpeg` | `overhead/breakfast_20.jpeg` |

### Desserts (11 videos missing)
| File | Start Frame | End Frame |
|------|-------------|-----------|
| `desserts_5.mp4` | `desserts_5.jpeg` | `overhead/desserts_5.jpeg` |
| `desserts_6.mp4` | `desserts_6.jpeg` | `overhead/desserts_6.jpeg` |
| `desserts_7.mp4` | `desserts_7.jpeg` | `overhead/desserts_7.jpeg` |
| `desserts_8.mp4` | `desserts_8.jpeg` | `overhead/desserts_8.jpeg` |
| `desserts_9.mp4` | `desserts_9.jpeg` | `overhead/desserts_9.jpeg` |
| `desserts_10.mp4` | `desserts_10.jpeg` | `overhead/desserts_10.jpeg` |
| `desserts_16.mp4` | `desserts_16.jpeg` | `overhead/desserts_16.jpeg` |
| `desserts_17.mp4` | `desserts_17.jpeg` | `overhead/desserts_17.jpeg` |
| `desserts_18.mp4` | `desserts_18.jpeg` | `overhead/desserts_18.jpeg` |
| `desserts_19.mp4` | `desserts_19.jpeg` | `overhead/desserts_19.jpeg` |
| `desserts_20.mp4` | `desserts_20.jpeg` | `overhead/desserts_20.jpeg` |

### Lunch/Dinner (12 videos missing)
| File | Start Frame | End Frame |
|------|-------------|-----------|
| `lunch_dinner_6.mp4` | `lunch_dinner_6.jpeg` | `overhead/lunch_dinner_6.jpeg` |
| `lunch_dinner_7.mp4` | `lunch_dinner_7.jpeg` | `overhead/lunch_dinner_7.jpeg` |
| `lunch_dinner_8.mp4` | `lunch_dinner_8.jpeg` | `overhead/lunch_dinner_8.jpeg` |
| `lunch_dinner_9.mp4` | `lunch_dinner_9.jpeg` | `overhead/lunch_dinner_9.jpeg` |
| `lunch_dinner_10.mp4` | `lunch_dinner_10.jpeg` | `overhead/lunch_dinner_10.jpeg` |
| `lunch_dinner_13.mp4` | `lunch_dinner_13.jpeg` | `overhead/lunch_dinner_13.jpeg` |
| `lunch_dinner_20.mp4` | `lunch_dinner_20.jpeg` | `overhead/lunch_dinner_20.jpeg` |
| `lunch_dinner_21.mp4` | `lunch_dinner_21.jpeg` | `overhead/lunch_dinner_21.jpeg` |
| `lunch_dinner_22.mp4` | `lunch_dinner_22.jpeg` | `overhead/lunch_dinner_22.jpeg` |
| `lunch_dinner_23.mp4` | `lunch_dinner_23.jpeg` | `overhead/lunch_dinner_23.jpeg` |
| `lunch_dinner_24.mp4` | `lunch_dinner_24.jpeg` | `overhead/lunch_dinner_24.jpeg` |
| `lunch_dinner_25.mp4` | `lunch_dinner_25.jpeg` | `overhead/lunch_dinner_25.jpeg` |

**Total missing: 33 videos** (requires Kling API credit recharge)

## File Paths

All videos located at: `public/recipe_images/videos/`
Exploded images: `public/recipe_images/{category}_{n}.jpeg`
Overhead images: `public/recipe_images/overhead/{category}_{n}.jpeg`
