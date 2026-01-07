# Plan: Recipe Book UX Enhancements

## Task Description
Implement 5 key UX improvements for the Ukrainian recipe book application "Без вини, з силою" (Without Guilt, With Strength):
1. **Search functionality** - Allow users to search recipes by name, ingredient, or category
2. **Clickable category cards** - Make the homepage category cards navigate directly to that section
3. **Larger food photos** - Increase recipe image sizes for better visual impact
4. **Table of contents** - Add a browsable index of all 65 recipes
5. **Print-friendly version** - Enable printing recipes with optimized layout

## Objective
Transform the recipe book from a linear page-by-page experience into a more navigable, searchable, and shareable product that increases user engagement and perceived value.

## Problem Statement
Currently, users must navigate through 68 pages sequentially to find recipes. The homepage category cards are informational only. Food images are relatively small. There's no way to quickly browse all recipes or print them for offline use.

## Solution Approach
1. Add a search dialog using the existing `cmdk` library (already installed) for fast, fuzzy recipe search
2. Pass a navigation callback to IntroPage to enable category card clicks
3. Increase image container sizes in RecipeCard from `h-96` to `h-[500px]`
4. Create a Table of Contents modal showing all recipes grouped by category
5. Add CSS print media queries and a print button for clean recipe printing

## Relevant Files
Use these files to complete the task:

**Core Files to Modify:**
- `app/page.tsx` - Add search, TOC state management, and navigation handlers
- `components/IntroPage.tsx` - Make category cards clickable with onClick handlers
- `components/RecipeCard.tsx` - Increase image sizes and add print button
- `app/globals.css` - Add print media query styles
- `lib/page-builder.ts` - Add helper functions to find category start pages

### New Files to Create
- `components/SearchDialog.tsx` - Search modal using cmdk
- `components/TableOfContents.tsx` - Recipe index modal
- `components/PrintButton.tsx` - Print trigger component
- `lib/search-utils.ts` - Search filtering and matching logic

## Implementation Phases

### Phase 1: Foundation
- Create search utility functions
- Add page-builder helpers for category navigation
- Set up print CSS media queries

### Phase 2: Core Implementation
- Implement SearchDialog component
- Implement TableOfContents component
- Make category cards clickable
- Increase image sizes
- Add print button

### Phase 3: Integration & Polish
- Wire up all components in page.tsx
- Add keyboard shortcuts (Ctrl+K for search, Ctrl+P for print)
- Test all interactions and responsive behavior

## Step by Step Tasks

### 1. Create Search Utility Functions
- Create `lib/search-utils.ts` with:
  - `searchRecipes(query: string, recipes: Recipe[]): SearchResult[]` - fuzzy search by title and ingredients
  - `normalizeSearchQuery(query: string): string` - handle Ukrainian text normalization
  - `highlightMatch(text: string, query: string): string` - for highlighting matches in results

```typescript
// lib/search-utils.ts
import type { Recipe, Category } from '@/types/recipe'

export interface SearchResult {
  recipe: Recipe
  categoryId: string
  categoryNameUk: string
  pageIndex: number
  matchType: 'title' | 'ingredient'
  matchedText: string
}

export function searchRecipes(
  query: string,
  categories: Category[],
  pageIndexMap: Map<number, number>
): SearchResult[] {
  const normalizedQuery = query.toLowerCase().trim()
  if (!normalizedQuery) return []

  const results: SearchResult[] = []

  categories.forEach(category => {
    category.recipes.forEach(recipe => {
      // Search in title
      if (recipe.title.toLowerCase().includes(normalizedQuery)) {
        results.push({
          recipe,
          categoryId: category.id,
          categoryNameUk: category.name_uk,
          pageIndex: pageIndexMap.get(recipe.id) ?? 0,
          matchType: 'title',
          matchedText: recipe.title
        })
        return
      }

      // Search in ingredients
      const matchedIngredient = recipe.ingredients.find(
        ing => ing.toLowerCase().includes(normalizedQuery)
      )
      if (matchedIngredient) {
        results.push({
          recipe,
          categoryId: category.id,
          categoryNameUk: category.name_uk,
          pageIndex: pageIndexMap.get(recipe.id) ?? 0,
          matchType: 'ingredient',
          matchedText: matchedIngredient
        })
      }
    })
  })

  return results
}
```

### 2. Add Page Builder Helper Functions
- Modify `lib/page-builder.ts` to add:
  - `getCategoryStartPage(pages: Page[], categoryId: string): number` - returns page index for category
  - `buildRecipePageIndexMap(pages: Page[]): Map<number, number>` - maps recipe ID to page index
  - `getRecipePageIndex(pages: Page[], recipeId: number): number` - find specific recipe page

```typescript
// Add to lib/page-builder.ts

export function getCategoryStartPage(pages: Page[], categoryId: string): number {
  // For breakfast, return page 1 (after intro)
  if (categoryId === 'breakfast') return 1

  // For others, find the section divider
  const dividerIndex = pages.findIndex(
    page => page.type === 'section-divider' && page.categoryId === categoryId
  )

  // Return the page after the divider (first recipe in category)
  return dividerIndex !== -1 ? dividerIndex + 1 : 1
}

export function buildRecipePageIndexMap(pages: Page[]): Map<number, number> {
  const map = new Map<number, number>()

  pages.forEach((page, index) => {
    if (page.type === 'recipe') {
      map.set(page.recipe.id, index)
    }
  })

  return map
}
```

### 3. Create SearchDialog Component
- Create `components/SearchDialog.tsx` using cmdk (already installed)
- Include recipe results grouped by category
- Show ingredient match context
- Handle keyboard navigation

```typescript
// components/SearchDialog.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import { Command } from 'cmdk'
import { Search, X } from 'lucide-react'
import type { Category } from '@/types/recipe'
import { searchRecipes, type SearchResult } from '@/lib/search-utils'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  pageIndexMap: Map<number, number>
  onSelectRecipe: (pageIndex: number) => void
}

export function SearchDialog({
  open,
  onOpenChange,
  categories,
  pageIndexMap,
  onSelectRecipe
}: SearchDialogProps) {
  const [query, setQuery] = useState('')

  const results = useMemo(() =>
    searchRecipes(query, categories, pageIndexMap),
    [query, categories, pageIndexMap]
  )

  // Reset query when closing
  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  // Keyboard shortcut to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="search-dialog-overlay" onClick={() => onOpenChange(false)}>
      <div className="search-dialog" onClick={e => e.stopPropagation()}>
        <Command>
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Пошук рецептів..."
              className="search-input"
              autoFocus
            />
            <button onClick={() => onOpenChange(false)} className="search-close">
              <X className="w-4 h-4" />
            </button>
          </div>

          <Command.List className="search-results">
            {query && results.length === 0 && (
              <Command.Empty className="search-empty">
                Нічого не знайдено
              </Command.Empty>
            )}

            {results.map((result) => (
              <Command.Item
                key={result.recipe.id}
                value={result.recipe.title}
                onSelect={() => {
                  onSelectRecipe(result.pageIndex)
                  onOpenChange(false)
                }}
                className="search-result-item"
              >
                <div className="search-result-content">
                  <span className="search-result-title">{result.recipe.title}</span>
                  <span className="search-result-category">{result.categoryNameUk}</span>
                </div>
                {result.matchType === 'ingredient' && (
                  <span className="search-result-match">
                    Інгредієнт: {result.matchedText}
                  </span>
                )}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
```

### 4. Create TableOfContents Component
- Create `components/TableOfContents.tsx`
- Show all recipes grouped by category
- Include recipe count per category
- Enable click-to-navigate

```typescript
// components/TableOfContents.tsx
'use client'

import { X } from 'lucide-react'
import type { Category } from '@/types/recipe'

interface TableOfContentsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  pageIndexMap: Map<number, number>
  onSelectRecipe: (pageIndex: number) => void
  currentPageIndex: number
}

export function TableOfContents({
  open,
  onOpenChange,
  categories,
  pageIndexMap,
  onSelectRecipe,
  currentPageIndex
}: TableOfContentsProps) {
  if (!open) return null

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'breakfast': return '🌅'
      case 'lunch_dinner': return '🍽️'
      case 'desserts': return '🍰'
      default: return '📖'
    }
  }

  return (
    <div className="toc-overlay" onClick={() => onOpenChange(false)}>
      <div className="toc-dialog" onClick={e => e.stopPropagation()}>
        <div className="toc-header">
          <h2 className="toc-title">Зміст</h2>
          <button onClick={() => onOpenChange(false)} className="toc-close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="toc-content">
          {categories.map(category => (
            <div key={category.id} className="toc-category">
              <h3 className="toc-category-title">
                <span>{getCategoryIcon(category.id)}</span>
                <span>{category.name_uk}</span>
                <span className="toc-category-count">{category.recipes.length} рецептів</span>
              </h3>

              <ul className="toc-recipe-list">
                {category.recipes.map(recipe => {
                  const pageIndex = pageIndexMap.get(recipe.id) ?? 0
                  const isActive = pageIndex === currentPageIndex

                  return (
                    <li key={recipe.id}>
                      <button
                        onClick={() => {
                          onSelectRecipe(pageIndex)
                          onOpenChange(false)
                        }}
                        className={`toc-recipe-item ${isActive ? 'active' : ''}`}
                      >
                        <span className="toc-recipe-title">{recipe.title}</span>
                        <span className="toc-recipe-calories">
                          {recipe.nutrition?.calories || '—'} ккал
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### 5. Make Category Cards Clickable in IntroPage
- Modify `components/IntroPage.tsx` to accept `onCategoryClick` prop
- Add click handlers to category cards
- Add hover states and cursor pointer

```typescript
// Update IntroPage.tsx props interface
interface IntroPageProps {
  onCategoryClick?: (categoryId: string) => void
}

export function IntroPage({ onCategoryClick }: IntroPageProps) {
  const categories = [
    { id: 'breakfast', name: 'Сніданки', count: 20, desc: 'Енергійний старт дня' },
    { id: 'lunch_dinner', name: 'Обід/Вечеря', count: 25, desc: 'Ситні та збалансовані' },
    { id: 'desserts', name: 'Десерти', count: 20, desc: 'Солодкі без провини' },
  ]

  return (
    // ... existing code
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onCategoryClick?.(cat.id)}
          className="p-6 rounded-lg bg-background/50 border border-border hover:border-accent hover:shadow-lg transition-all cursor-pointer text-left group"
        >
          <div className="text-4xl font-serif text-foreground mb-3 group-hover:text-accent transition-colors">
            {cat.count}
          </div>
          <div className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
            {cat.name}
          </div>
          <p className="text-xs text-muted-foreground">{cat.desc}</p>
        </button>
      ))}
    </div>
    // ...
  )
}
```

### 6. Increase Food Photo Sizes in RecipeCard
- Modify `components/RecipeCard.tsx` image container
- Change from `h-96` (384px) to `h-[500px]` on desktop
- Maintain responsive sizing for mobile
- Update max-width for better proportions

```typescript
// In RecipeCard.tsx, update the image container:
<div className="mb-12">
  <div className="relative w-full max-w-3xl mx-auto h-[350px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl">
    <Image
      src={imagePath}
      alt={recipe.title}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 1024px"
      loading="lazy"
      quality={90}
      priority={false}
    />
  </div>
</div>
```

### 7. Add Print Styles to globals.css
- Create print media query styles
- Hide navigation elements when printing
- Optimize recipe layout for paper
- Include page breaks between recipes

```css
/* Add to app/globals.css */

/* Print Styles */
@media print {
  /* Hide navigation and interactive elements */
  .recipe-nav-button,
  .recipe-indicator,
  .fixed,
  .search-dialog,
  .toc-dialog,
  button:not(.print-show) {
    display: none !important;
  }

  /* Reset background */
  body, .min-h-screen {
    background: white !important;
    color: black !important;
  }

  /* Recipe card print optimization */
  .recipe-hero {
    min-height: auto !important;
    page-break-after: avoid;
    padding: 20px !important;
  }

  /* Ensure images print */
  img {
    max-width: 100% !important;
    page-break-inside: avoid;
  }

  /* Recipe details section */
  .bg-background {
    background: white !important;
    page-break-before: avoid;
  }

  /* Grid layout for print */
  .grid.lg\\:grid-cols-2 {
    grid-template-columns: 1fr 1fr !important;
    gap: 20px !important;
  }

  /* Nutrition card */
  .mt-16:last-child {
    page-break-inside: avoid;
  }

  /* Add recipe title to header */
  @page {
    margin: 1.5cm;
    size: A4;
  }

  /* Print button should show text */
  .print-button-text {
    display: inline !important;
  }
}
```

### 8. Add Print Button to RecipeCard
- Create print button component
- Position it on recipe pages
- Trigger window.print()

```typescript
// Add to RecipeCard.tsx
<div className="print-button-container absolute top-4 right-4 print:hidden">
  <button
    onClick={() => window.print()}
    className="print-button flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-accent/20 transition-colors"
    title="Друкувати рецепт"
  >
    <Printer className="w-4 h-4" />
    <span className="hidden md:inline">Друк</span>
  </button>
</div>
```

### 9. Wire Up Components in page.tsx
- Import new components
- Add state for search and TOC dialogs
- Create navigation handlers
- Add keyboard shortcuts
- Pass required props to IntroPage

```typescript
// Update app/page.tsx
import { useState, useMemo, useEffect } from 'react'
import { Search, List } from 'lucide-react'
import { buildPageArray, getCategoryStartPage, buildRecipePageIndexMap } from '@/lib/page-builder'
import { loadRecipes } from '@/lib/recipe-loader'
import { SearchDialog } from '@/components/SearchDialog'
import { TableOfContents } from '@/components/TableOfContents'
// ... other imports

export default function RecipePage() {
  const pages = useMemo(() => buildPageArray(), [])
  const recipeData = useMemo(() => loadRecipes(), [])
  const pageIndexMap = useMemo(() => buildRecipePageIndexMap(pages), [pages])

  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)

  // Navigate to specific page
  const goToPage = (index: number) => {
    if (index >= 0 && index < pages.length) {
      setCurrentPageIndex(index)
    }
  }

  // Navigate to category
  const handleCategoryClick = (categoryId: string) => {
    const pageIndex = getCategoryStartPage(pages, categoryId)
    goToPage(pageIndex)
  }

  // Render with new props
  const renderPage = () => {
    switch (currentPage.type) {
      case 'intro':
        return <IntroPage onCategoryClick={handleCategoryClick} />
      // ... rest
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Search & TOC Buttons */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="nav-action-button"
          title="Пошук (Ctrl+K)"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTocOpen(true)}
          className="nav-action-button"
          title="Зміст"
        >
          <List className="w-5 h-5" />
        </button>
      </div>

      {/* Dialogs */}
      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        categories={recipeData.categories}
        pageIndexMap={pageIndexMap}
        onSelectRecipe={goToPage}
      />

      <TableOfContents
        open={tocOpen}
        onOpenChange={setTocOpen}
        categories={recipeData.categories}
        pageIndexMap={pageIndexMap}
        onSelectRecipe={goToPage}
        currentPageIndex={currentPageIndex}
      />

      {/* ... rest of component */}
    </div>
  )
}
```

### 10. Add Component Styles to globals.css
- Add styles for SearchDialog
- Add styles for TableOfContents
- Add styles for navigation action buttons

```css
/* Add to app/globals.css */

/* Navigation Action Buttons */
.nav-action-button {
  @apply p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border;
  @apply hover:bg-accent/20 hover:border-accent transition-all;
  @apply shadow-lg;
}

/* Search Dialog */
.search-dialog-overlay {
  @apply fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm;
  @apply flex items-start justify-center pt-[20vh];
}

.search-dialog {
  @apply w-full max-w-xl mx-4 bg-background rounded-xl border border-border shadow-2xl overflow-hidden;
}

.search-input-wrapper {
  @apply flex items-center gap-3 px-4 py-3 border-b border-border;
}

.search-icon {
  @apply w-5 h-5 text-muted-foreground;
}

.search-input {
  @apply flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground;
}

.search-close {
  @apply p-1 rounded hover:bg-muted transition-colors;
}

.search-results {
  @apply max-h-[400px] overflow-y-auto p-2;
}

.search-empty {
  @apply py-8 text-center text-muted-foreground;
}

.search-result-item {
  @apply px-3 py-2 rounded-lg cursor-pointer transition-colors;
  @apply hover:bg-accent/20 data-[selected=true]:bg-accent/30;
}

.search-result-content {
  @apply flex items-center justify-between gap-2;
}

.search-result-title {
  @apply font-medium text-foreground;
}

.search-result-category {
  @apply text-xs text-muted-foreground;
}

.search-result-match {
  @apply text-xs text-muted-foreground mt-1 block;
}

/* Table of Contents */
.toc-overlay {
  @apply fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm;
  @apply flex items-center justify-center p-4;
}

.toc-dialog {
  @apply w-full max-w-2xl max-h-[80vh] bg-background rounded-xl border border-border shadow-2xl overflow-hidden;
  @apply flex flex-col;
}

.toc-header {
  @apply flex items-center justify-between px-6 py-4 border-b border-border;
}

.toc-title {
  @apply text-2xl font-serif text-foreground;
}

.toc-close {
  @apply p-2 rounded-lg hover:bg-muted transition-colors;
}

.toc-content {
  @apply flex-1 overflow-y-auto p-6 space-y-8;
}

.toc-category-title {
  @apply flex items-center gap-2 text-lg font-medium text-foreground mb-4;
}

.toc-category-count {
  @apply ml-auto text-sm text-muted-foreground font-normal;
}

.toc-recipe-list {
  @apply space-y-1;
}

.toc-recipe-item {
  @apply w-full flex items-center justify-between px-3 py-2 rounded-lg;
  @apply text-left hover:bg-accent/20 transition-colors;
}

.toc-recipe-item.active {
  @apply bg-accent/30 font-medium;
}

.toc-recipe-title {
  @apply text-foreground;
}

.toc-recipe-calories {
  @apply text-sm text-muted-foreground;
}
```

### 11. Test and Validate All Features
- Test search with various Ukrainian queries
- Test category card navigation
- Verify larger images display correctly
- Test TOC navigation and highlighting
- Test print preview and output
- Test keyboard shortcuts (Ctrl+K)
- Test on mobile viewport sizes

## Testing Strategy

### Unit Tests
- `searchRecipes()` returns correct results for title matches
- `searchRecipes()` returns correct results for ingredient matches
- `getCategoryStartPage()` returns correct page indices
- `buildRecipePageIndexMap()` creates accurate mapping

### Integration Tests
- Search dialog opens with Ctrl+K
- Search results navigate to correct recipe
- Category cards navigate to first recipe in category
- TOC shows current page as active
- Print button triggers print dialog

### Edge Cases
- Empty search query shows no results
- Search with no matches shows "Nothing found" message
- Navigation at page boundaries works correctly
- Very long recipe titles truncate properly in search results

## Acceptance Criteria
- [ ] Users can search recipes by pressing Ctrl+K or clicking search icon
- [ ] Search returns results matching recipe titles (case-insensitive)
- [ ] Search returns results matching ingredients
- [ ] Clicking a search result navigates to that recipe
- [ ] Clicking a category card on homepage navigates to first recipe in that category
- [ ] Recipe images are visibly larger (500px height on desktop)
- [ ] Table of Contents shows all 65 recipes grouped by category
- [ ] Current recipe is highlighted in TOC
- [ ] Clicking a recipe in TOC navigates to it
- [ ] Print button appears on recipe pages
- [ ] Print preview shows clean, paper-optimized layout
- [ ] All features work on mobile viewports

## Validation Commands
Execute these commands to validate the task is complete:

- `npm run build` - Ensure the build completes without errors
- `npm run dev` - Start development server and manually test:
  1. Press Ctrl+K to open search
  2. Search for "панкейки" - should find breakfast recipe
  3. Search for "яйце" - should find multiple recipes
  4. Click a category card - should navigate
  5. Open TOC and click a recipe - should navigate
  6. On recipe page, click print and verify layout
- `npm run lint` - Ensure no linting errors

## Notes

### Dependencies
All required dependencies are already installed:
- `cmdk` (1.0.4) - For search command palette
- `lucide-react` - For icons (Search, List, Printer, X)

### Performance Considerations
- Search is performed client-side for instant results
- `useMemo` is used for expensive computations (page building, search results)
- Images use Next.js Image component with lazy loading

### Accessibility
- Search dialog traps focus
- All buttons have aria-labels
- Keyboard navigation supported throughout
- Print styles maintain content hierarchy

### Future Enhancements (Out of Scope)
- Server-side search for larger recipe collections
- Favorites/bookmarking system
- Recipe filtering by calories/macros
- Multiple print layouts (card, full page)
