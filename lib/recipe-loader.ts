import type { RecipeData } from "@/types/recipe"
import recipesData from "@/data/recipes.json"

// Cache-busting version - increment when updating images/videos
const ASSET_VERSION = "v16"

/**
 * Loads and validates recipe data from recipes.json
 * @returns Typed recipe data with all categories and recipes
 * @throws Error if data is malformed or missing required fields
 */
export function loadRecipes(): RecipeData {
  try {
    // Validate that we have the expected structure
    if (!recipesData || !recipesData.categories || !Array.isArray(recipesData.categories)) {
      throw new Error("Invalid recipes.json structure: missing categories array")
    }

    // Validate each category
    recipesData.categories.forEach((category, index) => {
      if (!category.id || !category.name_uk || !Array.isArray(category.recipes)) {
        throw new Error(`Invalid category at index ${index}: missing required fields`)
      }
    })

    return recipesData as RecipeData
  } catch (error) {
    console.error("Error loading recipes:", error)
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
  if (!imagePath) return "/placeholder.svg"

  // Remove 'public/' prefix if present
  if (imagePath.startsWith("public/")) {
    return "/" + imagePath.substring(7)
  }

  // If already starts with '/', return as is
  if (imagePath.startsWith("/")) {
    return imagePath
  }

  // Otherwise add '/' prefix
  return "/" + imagePath
}

/**
 * Derives the "cooked" (last-frame) image path from the normalized image path
 * Converts "/recipe_images/breakfast_1.jpeg" to "/recipe_images/cooked/breakfast_1.jpeg"
 */
export function deriveCookedImagePath(imagePath: string): string {
  if (!imagePath || imagePath === "/placeholder.svg") return imagePath

  const lastSlash = imagePath.lastIndexOf('/')
  const directory = imagePath.substring(0, lastSlash)
  const filename = imagePath.substring(lastSlash + 1)

  return `${directory}/cooked/${filename}?${ASSET_VERSION}`
}

/**
 * Derives video path from image path
 * Converts "/recipe_images/breakfast_1.jpeg" to "/recipe_images/videos/breakfast_1.mp4"
 * @param imagePath - The normalized image path (already processed by normalizeImagePath)
 * @returns Video path for the recipe
 */
export function deriveVideoPath(imagePath: string): string {
  if (!imagePath || imagePath === "/placeholder.svg") return ""

  // Insert /videos before the filename and change extension to .mp4
  const lastSlash = imagePath.lastIndexOf('/')
  const directory = imagePath.substring(0, lastSlash)
  const filename = imagePath.substring(lastSlash + 1)

  // Change extension to .mp4
  const videoFilename = filename.replace(/\.(jpeg|jpg|png|webp)$/i, '.mp4')

  return `${directory}/videos/${videoFilename}?${ASSET_VERSION}`
}
