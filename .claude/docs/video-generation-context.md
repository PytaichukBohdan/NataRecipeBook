# Video Generation Context for NataRecipeBook
# NOTE: Main skill is at .claude/skills/recipe-video-gen/SKILL.md — use that for workflow

## Pipeline
- **Model:** Kling 2.5 Turbo + Nano Banana Pro
- **Style:** Food-based ads, perfect for recipe book visuals

## Image Prompt Template (Session 1 - Ingredients Layout)
Overhead, top-down food photography of a vibrant, healthy [DISH NAME] on a light beige stone surface. A shallow ceramic bowl filled with [BASE INGREDIENT] as the base. [MAIN PROTEIN/INGREDIENT] arranged neatly across the center. [ADDITIONAL INGREDIENTS described with colors, textures, placement]. Natural soft daylight from above, minimal shadows, clean editorial food styling. Sharp focus, high detail, realistic textures, fresh and appetizing. Modern cookbook / Instagram food photography aesthetic. No hands, no text, no branding, no clutter.

## Image Prompt Template (Session 2 - Exploded View)
Using the original [DISH] image as the sole ingredient reference, create a clean, vertically stacked exploded-view visualization of the same dish. The ingredients are arranged in a strict bottom-to-top order, evenly spaced along a single centered vertical axis, with symmetry, alignment, and visual balance.

Bottom layer (base): [BASE INGREDIENT], forming a soft, natural pile that anchors the composition.
Middle layers (core ingredients), stacked upward in order:
- [INGREDIENT 1], evenly distributed
- [INGREDIENT 2], centered and proportionally scaled
- [MAIN INGREDIENT], laid flat and neatly arranged
- [INGREDIENT 3], evenly cut and symmetrically placed

Top layer (finishing elements): [GARNISH/FINISHING], placed delicately at the top.

All ingredient layers are parallel, evenly spaced, and centered, with no rotation, tilt, or perspective distortion. Ingredients appear to float gently while maintaining realistic proportions, textures, and color accuracy.

Add short, minimal annotations with thin leader lines. Alternate caption placement left-to-right moving up the stack.

Background is pure white or very light neutral, matte and distraction-free. Lighting is soft, even, shadow-minimized with clean editorial food-photography feel. Style is premium food photography combined with technical exploded diagram. No hands, no bowl, no clutter, no branding, no dramatic shadows.

## Video Generation (Kling 2.5 Turbo)
Use the two generated images (ingredients layout → exploded view OR ingredients → final dish) as start/end frames for Kling video generation. This creates smooth animated transitions showing the cooking/assembly process.

## Example (Steak Salad)

### Image 1:
Overhead, top-down food photography of a vibrant, healthy steak salad bowl on a light beige stone surface. A shallow ceramic bowl filled with finely chopped curly kale as the base. Medium-rare sliced steak arranged neatly across the center, pink interior with seared edges and visible seasoning. On one side, fanned avocado slices with cracked black pepper. Bright red diced bell peppers, crumbled white cheese (feta-style), and finely chopped greens distributed evenly around the bowl. A lemon wedge tucked against the edge of the bowl. A blue-handled fork resting inside the bowl, angled slightly toward the center. Natural soft daylight from above, minimal shadows, clean editorial food styling. Sharp focus, high detail, realistic textures, fresh and appetizing. Modern cookbook / Instagram food photography aesthetic. No hands, no text, no branding, no clutter.

### Image 2:
Using the original steak salad image as the sole ingredient reference, create a clean, vertically stacked exploded-view visualization of the same salad. The ingredients are arranged in a strict bottom-to-top order, evenly spaced along a single centered vertical axis, with symmetry, alignment, and visual balance. Bottom layer (base of the salad): Finely chopped curly kale and mixed leafy greens, forming a soft, natural pile that anchors the composition. Middle layers (core ingredients), stacked upward in this order: Diced red bell peppers and chopped greens, evenly distributed. Crumbled white cheese (feta-style), centered and proportionally scaled. Medium-rare sliced steak, laid flat and neatly fanned, pink interior visible. Avocado slices, evenly cut and symmetrically fanned. Top layer (finishing elements): Lemon wedge and light vinaigrette droplets, placed delicately at the top of the image to signal freshness and completion. All ingredient layers are parallel, evenly spaced, and centered, with no rotation, tilt, or perspective distortion. Background is pure white or very light neutral. No hands, no bowl, no clutter, no branding.

## Kling 2.5 Turbo Video Prompt (Full Example - Steak Salad):
A high-angle, cinematic studio shot of a fresh steak salad in a white ceramic bowl, centered on a clean white background. The salad is fully assembled: finely chopped curly kale and leafy greens, medium-rare sliced steak, avocado slices, diced red bell peppers, crumbled white cheese, and a lemon wedge. After a brief moment of stillness, the salad bursts upward in a controlled, elegant explosion, with each ingredient separating cleanly and moving upward along a vertical axis. The motion is smooth, slow, and weightless—no chaos, no spinning—creating a precise, visually satisfying deconstruction. The ingredients settle into a perfectly aligned exploded-view composition, hovering in mid-air in distinct horizontal layers, evenly spaced and centered: – Leafy greens at the bottom – Red bell peppers and crumbled cheese above – Medium-rare sliced steak laid flat and neatly fanned – Avocado slices symmetrically arranged – Lemon wedge and light vinaigrette droplets at the top. Once the ingredients are fully separated and stable, minimal technical annotation lines and labels fade in, alternating left and right for balance. Text is clean, modern, and readable, connected with thin leader lines, never overlapping the ingredients. Lighting is soft and diffuse, studio-style, with minimal shadows. Motion is slow-motion and cinematic, emphasizing clarity and elegance. Ultra-realistic food textures, high detail, premium editorial aesthetic. Camera remains locked and steady throughout. No hands, no people, no clutter, no branding, no background movement. End on the fully exploded, clearly labeled ingredient view.
