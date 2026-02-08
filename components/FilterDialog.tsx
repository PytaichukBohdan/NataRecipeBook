'use client'

import { useState, useMemo, useEffect } from 'react'
import { X, Heart } from 'lucide-react'
import type { Category } from '@/types/recipe'
import { filterRecipes, DEFAULT_FILTERS, type FilterCriteria } from '@/lib/filter-utils'

interface FilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  favorites: Set<string>
  pageIndexMap: Map<string, number>
  onSelectRecipe: (pageIndex: number) => void
}

/**
 * Calorie range preset options.
 * Each entry has a label for display and a tuple [min, max] for filtering.
 */
const CALORIE_PRESETS: { label: string; range: [number, number] }[] = [
  { label: 'до 200', range: [0, 200] },
  { label: '200-400', range: [200, 400] },
  { label: '400+', range: [400, 9999] },
]

/**
 * Protein range preset options (grams).
 */
const PROTEIN_PRESETS: { label: string; range: [number, number] }[] = [
  { label: 'до 15г', range: [0, 15] },
  { label: '15-30г', range: [15, 30] },
  { label: '30+', range: [30, 9999] },
]

/**
 * Ingredient count preset options.
 * maxIngredients stores the upper bound; the label describes the range.
 */
const INGREDIENT_PRESETS: { label: string; max: number }[] = [
  { label: 'до 5 (прості)', max: 5 },
  { label: '5-10', max: 10 },
  { label: '10+', max: 9999 },
]

/**
 * Returns the correct Ukrainian plural form for "recipe" counts.
 * Ukrainian has three plural forms:
 *   1 -> рецепт
 *   2-4 -> рецепти
 *   5+ -> рецептів (also 11-14)
 */
function recipeCountLabel(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod100 >= 11 && mod100 <= 14) return 'рецептів'
  if (mod10 === 1) return 'рецепт'
  if (mod10 >= 2 && mod10 <= 4) return 'рецепти'
  return 'рецептів'
}

/**
 * Checks if two range tuples are equal (both null, or same [min, max]).
 */
function rangesEqual(
  a: [number, number] | null,
  b: [number, number] | null
): boolean {
  if (a === null && b === null) return true
  if (a === null || b === null) return false
  return a[0] === b[0] && a[1] === b[1]
}

export function FilterDialog({
  open,
  onOpenChange,
  categories,
  favorites,
  pageIndexMap,
  onSelectRecipe,
}: FilterDialogProps) {
  const [filters, setFilters] = useState<FilterCriteria>(DEFAULT_FILTERS)

  // Compute filtered results reactively
  const results = useMemo(
    () => filterRecipes(categories, filters, favorites),
    [categories, filters, favorites]
  )

  // Reset filters when dialog closes
  useEffect(() => {
    if (!open) {
      setFilters(DEFAULT_FILTERS)
    }
  }, [open])

  // Early return after hooks (avoids conditional hook calls)
  if (!open) return null

  // ---------- Filter toggle helpers ----------

  const toggleCategory = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId],
    }))
  }

  const toggleCalorieRange = (range: [number, number]) => {
    setFilters(prev => ({
      ...prev,
      calorieRange: rangesEqual(prev.calorieRange, range) ? null : range,
    }))
  }

  const toggleProteinRange = (range: [number, number]) => {
    setFilters(prev => ({
      ...prev,
      proteinRange: rangesEqual(prev.proteinRange, range) ? null : range,
    }))
  }

  const toggleMaxIngredients = (max: number) => {
    setFilters(prev => ({
      ...prev,
      maxIngredients: prev.maxIngredients === max ? null : max,
    }))
  }

  const toggleOnlyFavorites = () => {
    setFilters(prev => ({
      ...prev,
      onlyFavorites: !prev.onlyFavorites,
    }))
  }

  // ---------- Render ----------

  return (
    <div className="search-dialog-overlay" onClick={() => onOpenChange(false)}>
      <div
        className="search-dialog filter-dialog"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="search-input-wrapper">
          <h2 className="toc-title" style={{ flex: 1 }}>Фільтри</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="search-close"
            aria-label="Закрити фільтри"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable filter content */}
        <div className="toc-content">
          {/* ---- Category selection ---- */}
          <div className="filter-section">
            <h3 className="filter-section-title">Категорія</h3>
            <div className="filter-chips">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`filter-chip ${filters.categories.includes(cat.id) ? 'active' : ''}`}
                >
                  {cat.name_uk}
                </button>
              ))}
            </div>
          </div>

          {/* ---- Calorie range chips ---- */}
          <div className="filter-section">
            <h3 className="filter-section-title">Калорії</h3>
            <div className="filter-chips">
              {CALORIE_PRESETS.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => toggleCalorieRange(preset.range)}
                  className={`filter-chip ${rangesEqual(filters.calorieRange, preset.range) ? 'active' : ''}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* ---- Protein range chips ---- */}
          <div className="filter-section">
            <h3 className="filter-section-title">Білки</h3>
            <div className="filter-chips">
              {PROTEIN_PRESETS.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => toggleProteinRange(preset.range)}
                  className={`filter-chip ${rangesEqual(filters.proteinRange, preset.range) ? 'active' : ''}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* ---- Ingredient count chips ---- */}
          <div className="filter-section">
            <h3 className="filter-section-title">Кількість інгредієнтів</h3>
            <div className="filter-chips">
              {INGREDIENT_PRESETS.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => toggleMaxIngredients(preset.max)}
                  className={`filter-chip ${filters.maxIngredients === preset.max ? 'active' : ''}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* ---- Favorites toggle ---- */}
          <div className="filter-section">
            <button
              onClick={toggleOnlyFavorites}
              className={`filter-chip filter-chip-favorites ${filters.onlyFavorites ? 'active' : ''}`}
            >
              <Heart
                className="w-4 h-4"
                fill={filters.onlyFavorites ? 'currentColor' : 'none'}
              />
              Тільки обране
            </button>
          </div>

          {/* ---- Results ---- */}
          <div className="filter-results">
            <p className="filter-results-count">
              Знайдено: {results.length} {recipeCountLabel(results.length)}
            </p>

            {results.length === 0 && (
              <p className="filter-empty">
                Жоден рецепт не відповідає обраним фільтрам
              </p>
            )}

            <ul className="toc-recipe-list">
              {results.map(result => {
                const pageIndex = pageIndexMap.get(result.recipeKey) ?? 0
                return (
                  <li key={result.recipeKey}>
                    <button
                      onClick={() => {
                        onSelectRecipe(pageIndex)
                        onOpenChange(false)
                      }}
                      className="toc-recipe-item"
                    >
                      <span className="toc-recipe-title">
                        {result.recipe.title}
                      </span>
                      <span className="toc-recipe-calories">
                        {result.recipe.nutrition?.calories || '\u2014'} ккал
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
