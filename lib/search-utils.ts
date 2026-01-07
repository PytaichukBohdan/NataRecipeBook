import type { Category } from '@/types/recipe'

export interface SearchResult {
  recipe: {
    id: number
    title: string
    ingredients: string[]
  }
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
          recipe: {
            id: recipe.id,
            title: recipe.title,
            ingredients: recipe.ingredients
          },
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
          recipe: {
            id: recipe.id,
            title: recipe.title,
            ingredients: recipe.ingredients
          },
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
