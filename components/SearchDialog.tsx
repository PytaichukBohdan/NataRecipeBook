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
  pageIndexMap: Map<string, number>
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
        <Command shouldFilter={false}>
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
                key={`${result.categoryId}-${result.recipe.id}`}
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
