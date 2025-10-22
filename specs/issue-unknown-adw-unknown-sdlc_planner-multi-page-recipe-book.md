# Feature: Multi-Page Recipe Book with Pagination and Section Dividers

## Metadata
issue_number: `N/A`
adw_id: `N/A`
issue_json: `{"title": "Multi-page recipe book with 60+ pages", "body": "Transform the current 2-recipe display into a comprehensive 60+ page recipe book with proper pagination, lazy loading, section dividers, and intro pages. All text must be in Ukrainian, following existing recipe styling. Implement parallel loading to avoid a single large messy file."}`

## Feature Description
Transform the current simple 2-recipe pagination system into a comprehensive digital recipe book containing 60+ pages. The book will include all recipes from `recipes.json` (20 breakfast, 25 lunch/dinner, 20 desserts), with additional pages for:
- Introduction/welcome page at the beginning
- Section divider pages between categories (Breakfast, Lunch/Dinner, Desserts)
- Smooth page transitions with elegant animations
- Optimized loading using code splitting and lazy loading
- All text preserved exactly in Ukrainian language
- Existing visual styling and layout patterns maintained

## User Story
As a user browsing the recipe book
I want to flip through pages like a real book with smooth transitions
So that I can discover recipes across breakfast, lunch, dinner, and dessert categories with an elegant reading experience

## Problem Statement
The current implementation only displays 2 hardcoded recipes with basic pagination. To create a complete recipe book experience, we need to:
1. Load and display 65 recipes from `recipes.json` (20+25+20)
2. Add introductory and section divider pages
3. Implement efficient loading to avoid performance issues
4. Maintain the elegant styling and smooth page transitions
5. Preserve all Ukrainian text exactly as provided

## Solution Statement
We will refactor the application to dynamically load recipes from `recipes.json` and construct a page array that includes:
- 1 intro page
- 20 breakfast recipe pages
- 1 section divider (Обід/вечеря)
- 25 lunch/dinner recipe pages
- 1 section divider (Десерти)
- 20 dessert recipe pages
Total: ~67 pages

Implementation approach:
1. Create modular recipe components for reusability
2. Implement lazy loading for recipe images
3. Use React.memo for recipe cards to prevent unnecessary re-renders
4. Create page type system (intro, recipe, section-divider)
5. Build page array dynamically from recipes.json
6. Optimize with dynamic imports for large components

## Relevant Files
Use these files to implement the feature:

- `app/page.tsx` - Main page component containing recipe display logic and pagination. Will be refactored to load from JSON and handle multiple page types.
- `app/globals.css` - Contains all styling for recipe display, animations, and navigation. Existing styles will be preserved and extended for new page types.
- `public/recipes.json` - Contains all 65 recipes in Ukrainian with categories (breakfast: 20, lunch_dinner: 25, desserts: 20). Source of truth for recipe data.
- `app/layout.tsx` - Root layout, may need metadata updates for recipe book title.
- `package.json` - May need additional dependencies for image optimization or lazy loading utilities.
- `next.config.mjs` - May need configuration for image optimization.

### New Files
- `components/RecipeCard.tsx` - Reusable component for displaying individual recipe pages with all details (ingredients, instructions, nutrition).
- `components/IntroPage.tsx` - Component for the book introduction/welcome page.
- `components/SectionDivider.tsx` - Component for section divider pages between recipe categories.
- `lib/recipe-loader.ts` - Utility to load and parse recipes.json, construct page array with proper ordering.
- `types/recipe.ts` - TypeScript types for Recipe, Page, Category structures.
- `lib/page-builder.ts` - Logic to build the full page array from recipes (intro + recipes + dividers).

## Implementation Plan

### Phase 1: Foundation
Set up TypeScript types, data loading utilities, and component architecture. Create the page builder system that will construct the full 67-page array from recipes.json including intro, recipes, and section dividers.

### Phase 2: Core Implementation
Build React components for each page type (IntroPage, RecipeCard, SectionDivider). Implement lazy loading for images and optimize rendering performance with React.memo. Ensure all Ukrainian text is preserved exactly.

### Phase 3: Integration
Integrate all components into `app/page.tsx`, replace hardcoded recipe data with dynamic loading, test pagination across all 67 pages, and ensure smooth animations and performance with the larger dataset.

## Step by Step Tasks

### 1. Create TypeScript types for recipe data structures
- Read `public/recipes.json` structure carefully
- Create `types/recipe.ts` with interfaces for:
  - `Recipe` (id, title, ingredients array, how_to_cook array, image_path)
  - `Category` (id, name_en, name_uk, recipes array)
  - `RecipeData` (categories array)
  - `PageType` enum ('intro' | 'recipe' | 'section-divider')
  - `Page` union type for different page content

### 2. Build recipe data loader utility
- Create `lib/recipe-loader.ts`
- Implement `loadRecipes()` function to import and parse recipes.json
- Add error handling for missing or malformed data
- Export typed recipe data

### 3. Build page construction system
- Create `lib/page-builder.ts`
- Implement `buildPageArray()` function that:
  - Starts with intro page
  - Adds breakfast section recipes (20)
  - Adds "Обід/вечеря" section divider
  - Adds lunch/dinner recipes (25)
  - Adds "Десерти" section divider
  - Adds dessert recipes (20)
  - Returns array of ~67 pages
- Ensure proper ordering and indexing

### 4. Create IntroPage component
- Create `components/IntroPage.tsx`
- Design welcome page with:
  - Book title in Ukrainian: "Книга рецептів: Без вини, з силою"
  - Elegant introduction text
  - Visual design matching existing recipe hero style
  - Brief overview of book contents
- Use existing CSS classes from globals.css

### 5. Create SectionDivider component
- Create `components/SectionDivider.tsx`
- Accept props: `categoryName` (Ukrainian), `categoryId`
- Design minimalist divider page with:
  - Large centered category name
  - Decorative divider line
  - Subtle background gradient
- Match existing visual style from globals.css

### 6. Create RecipeCard component
- Create `components/RecipeCard.tsx`
- Extract all recipe display logic from current `app/page.tsx`
- Props: `recipe` object with all data
- Implement both hero and details sections:
  - Hero: title, image, time/servings/protein stats
  - Details: ingredients, how_to_cook, image
- Add lazy loading for recipe images using Next.js Image component
- Use React.memo for performance optimization
- Preserve all existing styling and layout

### 7. Update main page to use dynamic page system
- Refactor `app/page.tsx` to:
  - Import page builder and recipe loader
  - Call `buildPageArray()` on component mount/load
  - Update state to track current page index (0 to ~66)
  - Render appropriate component based on page type:
    - IntroPage for page 0
    - SectionDivider for divider pages
    - RecipeCard for recipe pages
  - Update navigation logic for larger page count
  - Update page indicators for 67 pages (may need pagination or grouping)

### 8. Optimize image loading
- Configure `next.config.mjs` for image optimization
- Update recipe image paths (remove 'public/' prefix)
- Implement lazy loading strategy for off-screen images
- Add loading skeletons or placeholders

### 9. Enhance page indicators for 67 pages
- Modify bottom page indicators to handle large page count
- Options:
  - Show current page number as text (e.g., "Page 5 / 67")
  - Show dots for nearby pages with current page highlighted
  - Show category progress indicator
- Maintain elegant minimal design

### 10. Test pagination and performance
- Navigate through all 67 pages
- Verify smooth transitions and animations
- Check image loading performance
- Test on mobile and desktop viewports
- Ensure no memory leaks with large page count

### 11. Verify Ukrainian text preservation
- Audit all pages to ensure Ukrainian text matches recipes.json exactly
- Check intro page, section dividers, and all recipe content
- Verify special characters and formatting

### 12. Run validation commands
- Execute all validation commands listed below
- Fix any TypeScript errors
- Ensure build completes successfully
- Document any issues or warnings

## Testing Strategy

### Unit Tests
- Test `loadRecipes()` correctly parses recipes.json
- Test `buildPageArray()` creates correct page sequence
- Verify page count equals 67 (1 intro + 20 breakfast + 1 divider + 25 lunch/dinner + 1 divider + 20 desserts)
- Test pagination boundary conditions (first page, last page)
- Verify each category has correct recipe count

### Edge Cases
- Missing recipe images (should show placeholder)
- Empty ingredients or instructions arrays
- Very long recipe titles or ingredient names
- Navigation from last page (should wrap to first)
- Navigation from first page (should wrap to last)
- Rapid pagination clicking (animation handling)
- Recipes with missing optional fields

## Acceptance Criteria
- [ ] Application displays 67 total pages (intro + recipes + dividers)
- [ ] All 65 recipes from recipes.json are displayed correctly
- [ ] Intro page appears as page 1
- [ ] Section dividers appear between categories
- [ ] All Ukrainian text is preserved exactly as in recipes.json
- [ ] Existing visual styling and animations are maintained
- [ ] Images load efficiently with lazy loading
- [ ] Pagination works smoothly across all pages
- [ ] Page indicators show current position clearly
- [ ] No performance degradation with 67 pages
- [ ] Application builds without errors
- [ ] Mobile and desktop layouts work correctly

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

```bash
# Validate TypeScript compilation
npx tsc --noEmit

# Build the application
npm run build

# Verify recipes.json structure
cat public/recipes.json | jq '.categories | length'  # Should output 3
cat public/recipes.json | jq '.categories[0].recipes | length'  # Should output 20 (breakfast)
cat public/recipes.json | jq '.categories[1].recipes | length'  # Should output 25 (lunch_dinner)
cat public/recipes.json | jq '.categories[2].recipes | length'  # Should output 20 (desserts)

# Start dev server and manually test
npm run dev
# Then navigate to http://localhost:3000
# Test: Click through all pages (should be 67 total)
# Test: Verify intro page appears first
# Test: Verify section dividers between categories
# Test: Verify all recipe images load
# Test: Verify smooth animations
# Test: Test navigation boundaries (first/last page wrapping)
# Test: Verify Ukrainian text appears correctly throughout
```

## Notes

### Performance Considerations
- With 67 pages and 65 recipe images, implement aggressive lazy loading
- Consider using Next.js `Image` component for automatic optimization
- Use React.memo on RecipeCard to prevent unnecessary re-renders
- Consider virtualizing page indicators if performance becomes an issue

### Future Enhancements
- Add search/filter functionality by category or ingredient
- Add bookmarking/favorites system
- Add print-friendly CSS for recipe printing
- Add recipe rating system
- Add serving size calculator
- Add metric/imperial unit converter
- Add shopping list generator

### Image Path Handling
- recipes.json contains paths like "public/recipe_images/breakfast_1.jpeg"
- Next.js public directory is served from root, so paths should be "/recipe_images/breakfast_1.jpeg"
- Create utility function to normalize image paths from recipes.json

### Ukrainian Text Preservation
- All text from recipes.json must be copied EXACTLY
- Do not translate, modify, or reformat any Ukrainian text
- Preserve formatting, punctuation, and special characters
- Section names: "Сніданки", "Обід/вечеря", "Десерти"

### Styling Consistency
- Reuse all existing CSS classes from globals.css
- Maintain khaki color scheme with cherry red accents
- Preserve elegant serif typography for headings
- Keep smooth fade animations for page transitions
- Maintain fixed navigation buttons and page indicators

### Development Approach
- Build incrementally: types → loaders → components → integration
- Test each component in isolation before integration
- Keep existing working code until new system is validated
- Create backup of current app/page.tsx before major refactoring
