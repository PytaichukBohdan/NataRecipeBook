import type { Category, Recipe } from '@/types/recipe'

/**
 * Criteria used to filter recipes across all categories.
 * All active filters are combined with AND logic -- a recipe must
 * satisfy every non-null / non-empty criterion to be included.
 */
export interface FilterCriteria {
  /** Selected category IDs. Empty array means "all categories". */
  categories: string[]
  /** [min, max] calorie range, or null for no calorie filter. */
  calorieRange: [number, number] | null
  /** [min, max] protein range (grams), or null for no protein filter. */
  proteinRange: [number, number] | null
  /** Maximum number of ingredients, or null for no limit. */
  maxIngredients: number | null
  /** When true, only recipes in the favorites set are returned. */
  onlyFavorites: boolean
}

/** Default filter state with every filter disabled. */
export const DEFAULT_FILTERS: FilterCriteria = {
  categories: [],
  calorieRange: null,
  proteinRange: null,
  maxIngredients: null,
  onlyFavorites: false,
}

/**
 * A recipe that passed all active filters, enriched with its
 * category context and a compound key for identification.
 */
export interface FilteredRecipe {
  recipe: Recipe
  categoryId: string
  categoryNameUk: string
  /** Compound key in the format `${categoryId}-${recipeId}` */
  recipeKey: string
}

/**
 * Filter recipes from all categories based on the provided criteria.
 *
 * Every active filter is applied with AND logic -- a recipe must match
 * all non-null / non-empty filters to appear in the results.
 *
 * @param categories  - Full list of recipe categories from the data source
 * @param filters     - Active filter criteria to apply
 * @param favorites   - Set of compound recipe keys the user has favorited
 * @returns Array of recipes that satisfy all active filters
 */
export function filterRecipes(
  categories: Category[],
  filters: FilterCriteria,
  favorites: Set<string>
): FilteredRecipe[] {
  const results: FilteredRecipe[] = []

  categories.forEach(category => {
    // Skip entire category if the category filter is active and this one is not selected
    if (filters.categories.length > 0 && !filters.categories.includes(category.id)) return

    category.recipes.forEach(recipe => {
      const recipeKey = `${category.id}-${recipe.id}`

      // Favorites filter
      if (filters.onlyFavorites && !favorites.has(recipeKey)) return

      // Calorie range filter (skip recipes without nutrition data)
      if (filters.calorieRange && recipe.nutrition) {
        const cal = recipe.nutrition.calories
        if (cal < filters.calorieRange[0] || cal > filters.calorieRange[1]) return
      }

      // Protein range filter (skip recipes without nutrition data)
      if (filters.proteinRange && recipe.nutrition) {
        const protein = recipe.nutrition.protein
        if (protein < filters.proteinRange[0] || protein > filters.proteinRange[1]) return
      }

      // Ingredient count filter
      if (filters.maxIngredients !== null) {
        if (recipe.ingredients.length > filters.maxIngredients) return
      }

      results.push({
        recipe,
        categoryId: category.id,
        categoryNameUk: category.name_uk,
        recipeKey,
      })
    })
  })

  return results
}
