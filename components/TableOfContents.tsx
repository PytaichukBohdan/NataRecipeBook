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
