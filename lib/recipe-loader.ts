import type { RecipeData } from '@/types/recipe'
import recipesData from '@/public/recipes.json'

/**
 * Loads and validates recipe data from recipes.json
 * @returns Typed recipe data with all categories and recipes
 * @throws Error if data is malformed or missing required fields
 */
export function loadRecipes(): RecipeData {
  try {
    // Validate that we have the expected structure
    if (!recipesData || !recipesData.categories || !Array.isArray(recipesData.categories)) {
      throw new Error('Invalid recipes.json structure: missing categories array')
    }

    // Validate each category
    recipesData.categories.forEach((category, index) => {
      if (!category.id || !category.name_uk || !Array.isArray(category.recipes)) {
        throw new Error(`Invalid category at index ${index}: missing required fields`)
      }
    })

    return recipesData as RecipeData
  } catch (error) {
    console.error('Error loading recipes:', error)
    throw error
  }
}

/**
 * Normalizes image paths from recipes.json format to Next.js public format
 * Converts "public/recipe_images/breakfast_1.jpeg" to "/recipe_images/breakfast_1.jpeg"
 * @param imagePath - The image path from recipes.json
 * @returns Normalized path for Next.js Image component
 */
export function normalizeImagePath(imagePath: string): string {
  if (!imagePath) return '/placeholder.svg'

  // Remove 'public/' prefix if present
  if (imagePath.startsWith('public/')) {
    return '/' + imagePath.substring(7)
  }

  // If already starts with '/', return as is
  if (imagePath.startsWith('/')) {
    return imagePath
  }

  // Otherwise add '/' prefix
  return '/' + imagePath
}
