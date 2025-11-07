# Feature: Add Visually Appealing Nutrition Display

## Metadata
issue_number: `unknown`
adw_id: `unknown`
issue_json: `{"title": "Add Nutrition Visual Display", "body": "@data/recipes.json now include nutrition. I NEED YOU TO add visual showing that nutrition on the page. MAKE IT VERY VISUALLY APPEALING"}`

## Feature Description
Enhance the recipe card display by adding a visually stunning nutrition information section that presents macronutrient data (calories, protein, fat, carbs) from the existing nutrition field in recipes.json. The display should be elegant, informative, and consistent with the current design aesthetic (khaki base with subtle cherry red accents, serif typography for headers).

The nutrition data already exists in recipes.json with the following structure:
```json
"nutrition": {
  "serving_type": "per_100g" | "per_serving",
  "calories": number,
  "protein": number,
  "fat": number,
  "carbs": number
}
```

This feature will transform this data into an engaging visual component that helps users quickly understand the nutritional profile of each recipe.

## User Story
As a recipe book user
I want to see visually appealing nutrition information for each recipe
So that I can make informed dietary decisions and understand the macronutrient breakdown at a glance

## Problem Statement
The recipes.json file contains valuable nutrition data (calories, protein, fat, carbs, serving type) for each recipe, but this information is not currently displayed in the UI. Users cannot see the nutritional content of recipes, making it difficult for them to:
- Plan meals according to dietary goals
- Compare recipes based on nutritional content
- Understand portion sizes (per 100g vs per serving)
- Track macronutrient intake

The absence of this information reduces the practical value of the recipe book for health-conscious users.

## Solution Statement
Create a visually elegant nutrition display component that:

1. **Visual Hierarchy**: Design a card-based layout with distinct sections for calories and macronutrients
2. **Data Visualization**: Use circular progress indicators for macronutrients showing percentages or amounts
3. **Color Coding**: Apply distinct, appealing colors for each macronutrient (protein, carbs, fats)
4. **Serving Context**: Clearly indicate whether values are per 100g or per serving
5. **Typography**: Use the existing serif font for headers and mono font for numbers to maintain design consistency
6. **Positioning**: Place the nutrition section prominently but not intrusively within the recipe details area
7. **Responsive Design**: Ensure the component looks great on all screen sizes
8. **Animation**: Add subtle animations for the progress indicators on page load

The component will integrate seamlessly with the existing RecipeCard component and utilize the khaki/cherry-red color palette already established in the application.

## Relevant Files
Use these files to implement the feature:

- **components/RecipeCard.tsx** - Main recipe display component where nutrition section will be added
  - Currently displays recipe hero, ingredients, and instructions
  - Need to add a new nutrition display section after the recipe title and before ingredients
  - Already uses memo and useMemo for performance optimization

- **types/recipe.ts** - TypeScript type definitions
  - Need to update the Recipe interface to include the nutrition field
  - Add a new Nutrition interface to type the nutrition data structure

- **app/globals.css** - Global styles and CSS variables
  - Contains all custom styling including category indicators and recipe stat badges
  - Already has nutrition-related CSS classes defined (nutrition-bar, nutrition-segment, etc.)
  - Need to add additional styles for the nutrition card and circular progress indicators

- **data/recipes.json** - Recipe data source
  - Already contains nutrition data for all recipes
  - No changes needed to this file

### New Files
- **components/NutritionCard.tsx** - Dedicated component for displaying nutrition information
  - Will be a reusable component that takes nutrition data as props
  - Handles the visual layout, progress circles, and data formatting
  - Includes responsive design and animations

- **lib/nutrition-utils.ts** - Helper utilities for nutrition calculations
  - Calculate percentages for visual representation
  - Format nutrition values (e.g., adding units)
  - Determine color schemes based on macronutrient ratios
  - Helper for calculating total macronutrient grams

## Implementation Plan

### Phase 1: Foundation
Update type definitions to include nutrition data structure and create utility functions for nutrition calculations. This foundational work ensures type safety throughout the implementation and provides reusable calculation logic.

### Phase 2: Core Implementation
Build the NutritionCard component with all visual elements including circular progress indicators, color-coded macronutrient display, and calorie information. Implement responsive design and subtle animations for an engaging user experience.

### Phase 3: Integration
Integrate the NutritionCard component into the RecipeCard component, ensuring proper data flow, visual consistency with the existing design, and optimal positioning within the recipe layout.

## Step by Step Tasks

### 1. Update Type Definitions
- Open `types/recipe.ts`
- Add a new `Nutrition` interface with fields: serving_type, calories, protein, fat, carbs
- Update the `Recipe` interface to include an optional `nutrition` field of type `Nutrition`
- Ensure all types are properly exported

### 2. Create Nutrition Utility Functions
- Create new file `lib/nutrition-utils.ts`
- Implement `calculateTotalMacros(nutrition: Nutrition): number` - sums protein + fat + carbs
- Implement `getMacroPercentage(macro: number, total: number): number` - calculates percentage of each macro
- Implement `formatServingType(servingType: string): string` - formats serving type for display ("per_100g" → "На 100г", "per_serving" → "На порцію")
- Implement `getNutritionColor(macroType: 'protein' | 'carbs' | 'fat'): string` - returns color class for each macro
- Add unit tests or JSDoc comments for each function

### 3. Create Enhanced CSS Styles for Nutrition Display
- Open `app/globals.css`
- Add styles for `.nutrition-card` - main container with elegant card styling, padding, border-radius, shadow
- Add styles for `.nutrition-header` - section header with serif font
- Add styles for `.nutrition-calories` - large, prominent calorie display with accent styling
- Add styles for `.nutrition-macros-grid` - responsive grid layout for macro breakdown
- Add styles for `.nutrition-macro-item` - individual macro display container
- Add styles for `.nutrition-circle-progress` - SVG circular progress indicator styles
- Add styles for `.nutrition-circle-background` - background circle for progress indicator
- Add styles for `.nutrition-circle-fill` - animated fill circle with stroke-dasharray animation
- Add animation keyframes `@keyframes fillProgress` for smooth circle animation on load
- Add styles for `.nutrition-serving-badge` - badge indicating serving type with subtle background
- Ensure all colors match the khaki/cherry-red theme
- Add responsive breakpoints for mobile, tablet, and desktop

### 4. Build NutritionCard Component
- Create new file `components/NutritionCard.tsx`
- Import necessary types: `Nutrition` from `@/types/recipe`
- Import utility functions from `@/lib/nutrition-utils`
- Import React hooks: `useMemo`, `useEffect`, `useState` for animations
- Define component props interface: `NutritionCardProps` with nutrition field
- Create functional component `NutritionCard` that accepts nutrition data
- Implement calorie display section with large, prominent number
- Implement macronutrient grid with three columns (protein, carbs, fat)
- Create circular progress indicator for each macro using SVG:
  - Use `<svg viewBox="0 0 100 100">` for consistent sizing
  - Add background circle with `<circle>` element
  - Add animated progress circle with `stroke-dasharray` and `stroke-dashoffset`
  - Calculate percentages using utility functions
  - Apply color classes for each macro type
- Display macro amounts and percentages below each circle
- Add serving type badge at the top or bottom of the card
- Use `useMemo` to optimize calculations
- Add proper TypeScript types for all variables and return types
- Include conditional rendering if nutrition data is missing
- Add memo wrapper for performance optimization
- Export component

### 5. Create Circular Progress Component (Optional Sub-component)
- Within `components/NutritionCard.tsx` or as separate file
- Create `CircularProgress` component with props: `percentage`, `color`, `size`, `strokeWidth`
- Implement SVG circle with animated stroke-dashoffset
- Calculate circumference: `2 * Math.PI * radius`
- Calculate offset: `circumference - (percentage / 100) * circumference`
- Add CSS transition for smooth animation
- Use `useEffect` to trigger animation on mount
- Make it reusable for different sizes and colors

### 6. Integrate NutritionCard into RecipeCard
- Open `components/RecipeCard.tsx`
- Import `NutritionCard` component
- Locate the recipe hero section (around line 87-135)
- Add nutrition display after the quick stats badges and before the image (around line 112)
- Conditionally render NutritionCard only if `recipe.nutrition` exists:
  ```tsx
  {recipe.nutrition && (
    <div className="mb-8">
      <NutritionCard nutrition={recipe.nutrition} />
    </div>
  )}
  ```
- Ensure proper spacing and responsive behavior
- Test that the component renders correctly with existing recipes

### 7. Add Visual Polish and Animations
- Return to `app/globals.css`
- Add hover effects to `.nutrition-macro-item` (subtle scale transform)
- Add entrance animations using `@keyframes slideInUp` for the entire card
- Apply `animation-delay` to each macro item for staggered appearance
- Add transition effects for smooth color changes on hover
- Ensure animations respect `prefers-reduced-motion` media query
- Test animations on page load and navigation

### 8. Implement Responsive Design Refinements
- Test the nutrition card on mobile (320px - 768px)
- Adjust grid layout for mobile: stack macros vertically or use 2-column grid
- Reduce circular progress size on smaller screens
- Adjust font sizes for readability on mobile
- Ensure calorie display remains prominent but doesn't overwhelm mobile layout
- Test on tablet (768px - 1024px) and ensure proper spacing
- Verify desktop (1024px+) layout maintains elegant proportions

### 9. Add Accessibility Features
- Add proper ARIA labels to all nutrition elements
- Ensure circular progress indicators have `role="progressbar"` and `aria-valuenow` attributes
- Add `aria-label` describing the nutrition information
- Ensure color contrast ratios meet WCAG AA standards (4.5:1 for text)
- Test with screen readers to ensure nutrition data is announced properly
- Add focus styles for keyboard navigation
- Ensure animations can be disabled via `prefers-reduced-motion`

### 10. Validation and Testing
- Run `npm run lint` to check for code quality issues
- Run `npm run build` to verify the feature compiles without errors
- Start development server with `npm run dev`
- Manually test on multiple recipes across different categories
- Verify recipes with "per_100g" serving type display correctly
- Verify recipes with "per_serving" serving type display correctly
- Test responsive behavior on various screen sizes using browser dev tools
- Check that animations trigger correctly on page load
- Verify color consistency with the existing design theme
- Test navigation between recipes to ensure nutrition data updates correctly
- Check for any console errors or warnings
- Validate that recipes without nutrition data don't cause errors
- Verify performance with React DevTools Profiler
- Test accessibility with keyboard navigation and screen reader

## Testing Strategy

### Unit Tests
If implementing unit tests (recommended for production):
- Test `calculateTotalMacros` with various nutrition inputs
- Test `getMacroPercentage` edge cases (zero total, negative values)
- Test `formatServingType` with all possible serving type strings
- Test `getNutritionColor` returns correct CSS classes
- Test NutritionCard renders correctly with valid nutrition data
- Test NutritionCard handles missing nutrition data gracefully
- Test CircularProgress calculates SVG paths correctly

### Integration Tests
- Test RecipeCard renders NutritionCard when nutrition data exists
- Test RecipeCard doesn't render NutritionCard when nutrition data is missing
- Test nutrition data flows correctly from recipes.json through components

### Edge Cases
- Recipe with zero calories or zero macros
- Recipe with very high macro values (e.g., 1000g carbs) - ensure UI doesn't break
- Recipe missing nutrition field entirely - component should not render
- Recipe with partial nutrition data (e.g., missing protein) - handle gracefully
- Very long serving type strings - ensure text truncation or wrapping
- Extremely small screen sizes (< 320px) - ensure readability
- High contrast mode - verify colors remain distinguishable
- Dark mode (if implemented in future) - ensure colors work in both themes

## Acceptance Criteria
- [ ] Type definitions updated to include Nutrition interface and Recipe.nutrition field
- [ ] Utility functions created for nutrition calculations with proper TypeScript types
- [ ] CSS styles added for nutrition card with circular progress indicators
- [ ] NutritionCard component created and displays all nutrition data elegantly
- [ ] Circular progress indicators animate smoothly on page load
- [ ] Macronutrients color-coded with distinct, appealing colors
- [ ] Calorie count displayed prominently and clearly
- [ ] Serving type badge displays "На 100г" or "На порцію" correctly
- [ ] Component integrated into RecipeCard at appropriate location
- [ ] Responsive design works on mobile, tablet, and desktop screens
- [ ] Nutrition card maintains visual consistency with existing design theme
- [ ] Hover effects and animations enhance user experience
- [ ] Accessibility features implemented (ARIA labels, keyboard navigation, screen reader support)
- [ ] All recipes display nutrition information correctly
- [ ] No console errors or warnings in browser console
- [ ] Component handles missing nutrition data gracefully (doesn't render)
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run build` completes successfully with zero errors
- [ ] Manual testing confirms feature works as expected in development mode
- [ ] Performance remains optimal with no noticeable lag or jank

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

```bash
# Run linting to validate code quality
npm run lint

# Run build to validate the feature compiles correctly with zero errors
npm run build

# Manually test the feature in development mode
npm run dev
# Then open http://localhost:3000 and navigate through recipes
# Verify nutrition information displays correctly on each recipe page
# Test responsive behavior by resizing browser window
# Check animations trigger on page navigation
# Verify colors and styling match the design theme
```

## Notes
- The nutrition data structure in recipes.json includes both "per_100g" and "per_serving" types. Ensure the UI clearly distinguishes between these.
- Consider using a library like `recharts` (already in package.json) if more complex visualizations are desired in the future, but for this implementation, custom SVG circles will provide better control and performance.
- The existing CSS already has some nutrition-related classes (nutrition-bar, nutrition-segment, nutrition-protein, etc.). Review these and either extend them or create new classes as appropriate.
- Ensure the nutrition card doesn't overwhelm the recipe page - it should complement the existing content, not dominate it.
- Consider adding a subtle animation delay between each macro circle appearing to create a pleasing staggered effect.
- Future enhancement: Add a tooltip on hover showing detailed breakdown or daily value percentages.
- Future enhancement: Add ability to toggle between different serving sizes or units.
- The component should be memoized to prevent unnecessary re-renders when navigating between pages.
- Ensure proper TypeScript strict mode compliance for all new code.
