import type { Page, RecipeData } from '@/types/recipe'
import { loadRecipes } from './recipe-loader'

/**
 * Builds the complete page array for the recipe book
 * Structure:
 * - 1 intro page
 * - 20 breakfast recipe pages
 * - 1 section divider ("Обід/вечеря")
 * - 25 lunch/dinner recipe pages
 * - 1 section divider ("Десерти")
 * - 20 dessert recipe pages
 * Total: ~67 pages
 *
 * @returns Array of Page objects in the correct order
 */
export function buildPageArray(): Page[] {
  const recipeData = loadRecipes()
  const pages: Page[] = []

  // Add intro page as the first page
  pages.push({
    type: 'intro'
  })

  // Process each category in order
  recipeData.categories.forEach((category, categoryIndex) => {
    // Add section divider before lunch/dinner and desserts categories
    // (Skip divider for breakfast as it comes right after intro)
    if (categoryIndex > 0) {
      pages.push({
        type: 'section-divider',
        categoryName: category.name_uk,
        categoryId: category.id
      })
    }

    // Add all recipes from this category
    category.recipes.forEach((recipe) => {
      pages.push({
        type: 'recipe',
        recipe: recipe,
        categoryId: category.id,
        categoryNameUk: category.name_uk
      })
    })
  })

  return pages
}

/**
 * Gets statistics about the page array
 * Useful for validation and debugging
 */
/**
 * Gets the page index for the start of a category
 * For breakfast, returns page 1 (first recipe after intro)
 * For others, returns the first recipe after the section divider
 */
export function getCategoryStartPage(pages: Page[], categoryId: string): number {
  // For breakfast, return page 1 (first recipe after intro)
  if (categoryId === 'breakfast') return 1

  // For others, find the section divider
  const dividerIndex = pages.findIndex(
    page => page.type === 'section-divider' && page.categoryId === categoryId
  )

  // Return the page after the divider (first recipe in category)
  return dividerIndex !== -1 ? dividerIndex + 1 : 1
}

/**
 * Builds a map from recipe ID to page index
 * Useful for direct navigation to specific recipes
 */
export function buildRecipePageIndexMap(pages: Page[]): Map<number, number> {
  const map = new Map<number, number>()

  pages.forEach((page, index) => {
    if (page.type === 'recipe') {
      map.set(page.recipe.id, index)
    }
  })

  return map
}

export function getPageStats(pages: Page[]): {
  totalPages: number
  introPages: number
  recipePages: number
  dividerPages: number
  breakfastRecipes: number
  lunchDinnerRecipes: number
  dessertRecipes: number
} {
  const stats = {
    totalPages: pages.length,
    introPages: 0,
    recipePages: 0,
    dividerPages: 0,
    breakfastRecipes: 0,
    lunchDinnerRecipes: 0,
    dessertRecipes: 0
  }

  pages.forEach(page => {
    switch (page.type) {
      case 'intro':
        stats.introPages++
        break
      case 'recipe':
        stats.recipePages++
        if (page.categoryId === 'breakfast') stats.breakfastRecipes++
        else if (page.categoryId === 'lunch_dinner') stats.lunchDinnerRecipes++
        else if (page.categoryId === 'desserts') stats.dessertRecipes++
        break
      case 'section-divider':
        stats.dividerPages++
        break
    }
  })

  return stats
}
