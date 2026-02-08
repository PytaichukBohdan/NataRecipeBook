import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'natabook-favorites'

/**
 * Custom hook for managing localStorage-based recipe favorites.
 *
 * Favorites are stored as compound keys in the format `${categoryId}-${recipeId}`
 * matching the RecipeKey type from types/recipe.ts.
 *
 * The hook initializes from localStorage on mount and syncs back on every change.
 * SSR-safe: returns an empty set when running on the server.
 *
 * @returns Object with:
 *   - favorites: Set of currently favorited recipe keys
 *   - toggleFavorite: Function to add/remove a recipe key from favorites
 *   - isFavorite: Function to check if a recipe key is currently favorited
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    // Guard against SSR where window/localStorage is not available
    if (typeof window === 'undefined') return new Set()
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })

  // Persist favorites to localStorage whenever the set changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]))
    } catch {
      // Silently handle quota exceeded or other localStorage errors
    }
  }, [favorites])

  /**
   * Toggle a recipe in/out of favorites.
   * @param recipeKey - Compound key in format `${categoryId}-${recipeId}`
   */
  const toggleFavorite = useCallback((recipeKey: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(recipeKey)) {
        next.delete(recipeKey)
      } else {
        next.add(recipeKey)
      }
      return next
    })
  }, [])

  /**
   * Check whether a recipe is currently favorited.
   * @param recipeKey - Compound key in format `${categoryId}-${recipeId}`
   */
  const isFavorite = useCallback(
    (recipeKey: string) => favorites.has(recipeKey),
    [favorites]
  )

  return { favorites, toggleFavorite, isFavorite }
}
