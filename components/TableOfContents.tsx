'use client'

import { X, Heart } from 'lucide-react'
import type { Category, Recipe } from '@/types/recipe'

interface TableOfContentsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  pageIndexMap: Map<string, number>
  onSelectRecipe: (pageIndex: number) => void
  currentPageIndex: number
  favorites?: Set<string>
}

export function TableOfContents({
  open,
  onOpenChange,
  categories,
  pageIndexMap,
  onSelectRecipe,
  currentPageIndex,
  favorites
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

  // Build favorites list from all categories
  const favoriteRecipes = favorites && favorites.size > 0 ? (() => {
    const favList: Array<{ recipe: Recipe; categoryId: string; categoryNameUk: string; recipeKey: string }> = []
    categories.forEach(category => {
      category.recipes.forEach(recipe => {
        const recipeKey = `${category.id}-${recipe.id}`
        if (favorites.has(recipeKey)) {
          favList.push({ recipe, categoryId: category.id, categoryNameUk: category.name_uk, recipeKey })
        }
      })
    })
    return favList
  })() : []

  // Ukrainian pluralization for recipe count
  const getRecipeCountLabel = (count: number) => {
    if (count === 1) return 'рецепт'
    if (count >= 2 && count <= 4) return 'рецепти'
    return 'рецептів'
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
          {/* Favorites section - shown only when there are favorited recipes */}
          {favoriteRecipes.length > 0 && (
            <div className="toc-category">
              <h3 className="toc-category-title">
                <span><Heart className="w-5 h-5 fill-red-500 text-red-500" /></span>
                <span>Обране</span>
                <span className="toc-category-count">
                  {favoriteRecipes.length} {getRecipeCountLabel(favoriteRecipes.length)}
                </span>
              </h3>

              <ul className="toc-recipe-list">
                {favoriteRecipes.map(({ recipe, recipeKey }) => {
                  const pageIndex = pageIndexMap.get(recipeKey) ?? 0
                  const isActive = pageIndex === currentPageIndex

                  return (
                    <li key={recipeKey}>
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
          )}

          {/* Regular category sections */}
          {categories.map(category => (
            <div key={category.id} className="toc-category">
              <h3 className="toc-category-title">
                <span>{getCategoryIcon(category.id)}</span>
                <span>{category.name_uk}</span>
                <span className="toc-category-count">
                  {category.recipes.length} {getRecipeCountLabel(category.recipes.length)}
                </span>
              </h3>

              <ul className="toc-recipe-list">
                {category.recipes.map(recipe => {
                  const recipeKey = `${category.id}-${recipe.id}`
                  const pageIndex = pageIndexMap.get(recipeKey) ?? 0
                  const isActive = pageIndex === currentPageIndex
                  const isFavorited = favorites?.has(recipeKey) ?? false

                  return (
                    <li key={recipe.id}>
                      <button
                        onClick={() => {
                          onSelectRecipe(pageIndex)
                          onOpenChange(false)
                        }}
                        className={`toc-recipe-item ${isActive ? 'active' : ''}`}
                      >
                        <span className="toc-recipe-title">
                          {isFavorited && <Heart className="w-3 h-3 fill-red-500 text-red-500 inline mr-1" />}
                          {recipe.title}
                        </span>
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
