"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight, Search, List, Filter, Home } from "lucide-react"
import { buildPageArray, getCategoryStartPage, buildRecipePageIndexMap } from "@/lib/page-builder"
import { loadRecipes } from "@/lib/recipe-loader"
import { IntroPage } from "@/components/IntroPage"
import { SectionDivider } from "@/components/SectionDivider"
import { RecipeCard } from "@/components/RecipeCard"
import { SearchDialog } from "@/components/SearchDialog"
import { TableOfContents } from "@/components/TableOfContents"
import { FilterDialog } from "@/components/FilterDialog"
import { CookingMode } from "@/components/CookingMode"
import { useFavorites } from "@/hooks/useFavorites"
import type { Recipe } from "@/types/recipe"

export default function RecipePage() {
  // Build the page array once using useMemo
  const pages = useMemo(() => buildPageArray(), [])

  // Memoized recipe data and page index map
  const recipeData = useMemo(() => loadRecipes(), [])
  const pageIndexMap = useMemo(() => buildRecipePageIndexMap(pages), [pages])

  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const hasInitializedFromHash = useRef(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const currentPage = pages[currentPageIndex]
  const totalPages = pages.length

  // Dialog/overlay state
  const [searchOpen, setSearchOpen] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [cookingRecipe, setCookingRecipe] = useState<{recipe: Recipe, categoryId: string} | null>(null)

  // Favorites hook
  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  // Touch swipe gesture state
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const minSwipeDistance = 50

  const nextPage = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentPageIndex((prev) => (prev + 1) % totalPages)
      setTimeout(() => setIsAnimating(false), 50)
    }, 300)
  }, [isAnimating, totalPages])

  const prevPage = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentPageIndex((prev) => (prev - 1 + totalPages) % totalPages)
      setTimeout(() => setIsAnimating(false), 50)
    }, 300)
  }, [isAnimating, totalPages])

  const goToPage = useCallback((index: number) => {
    if (isAnimating || index === currentPageIndex) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentPageIndex(index)
      setTimeout(() => setIsAnimating(false), 50)
    }, 300)
  }, [isAnimating, currentPageIndex])

  // Deep link helpers
  const getHashForPage = useCallback((pageIndex: number) => {
    const page = pages[pageIndex]
    if (!page) return '#intro'
    if (page.type === 'intro') return '#intro'
    if (page.type === 'section-divider') return `#${page.categoryId}`
    if (page.type === 'recipe') return `#${page.categoryId}-${page.recipe.id}`
    return '#intro'
  }, [pages])

  const getPageIndexForHash = useCallback((hash: string) => {
    const h = hash.replace('#', '')
    if (!h || h === 'intro') return 0

    // Check if it's a category name (section divider)
    const categoryPage = getCategoryStartPage(pages, h)
    if (categoryPage > 1 || h === 'breakfast') return categoryPage

    // Check if it's a recipe key (categoryId-recipeId)
    const pageIndex = pageIndexMap.get(h as `${string}-${number}`)
    if (pageIndex !== undefined) return pageIndex

    return 0
  }, [pages, pageIndexMap])

  // Deep link: sync URL -> page (initial load + hashchange)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash
      if (hash) {
        const targetPage = getPageIndexForHash(hash)
        setCurrentPageIndex(targetPage)
      }
      hasInitializedFromHash.current = true
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Deep link: sync page -> URL (skip first render to avoid overwriting initial hash)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!hasInitializedFromHash.current) return
    const hash = getHashForPage(currentPageIndex)
    if (window.location.hash !== hash) {
      history.replaceState(null, '', hash)
    }
  }, [currentPageIndex, getHashForPage])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }

      // Ignore if dialog is open
      if (document.querySelector('[role="dialog"]')) {
        return
      }

      // Handle arrow keys
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          prevPage()
          break
        case 'ArrowRight':
          e.preventDefault()
          nextPage()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prevPage, nextPage])

  // Touch swipe gesture handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextPage() // Swipe left = next page
    } else if (isRightSwipe) {
      prevPage() // Swipe right = previous page
    }
  }

  // Render the current page based on its type
  const renderPage = () => {
    switch (currentPage.type) {
      case 'intro':
        return <IntroPage onCategoryClick={(categoryId) => goToPage(getCategoryStartPage(pages, categoryId))} />
      case 'section-divider':
        return (
          <SectionDivider
            categoryName={currentPage.categoryName}
            categoryId={currentPage.categoryId}
          />
        )
      case 'recipe': {
        const recipeKey = `${currentPage.categoryId}-${currentPage.recipe.id}`
        return (
          <RecipeCard
            recipe={currentPage.recipe}
            categoryNameUk={currentPage.categoryNameUk}
            categoryId={currentPage.categoryId}
            isFavorite={isFavorite(recipeKey)}
            onToggleFavorite={() => toggleFavorite(recipeKey)}
            onStartCooking={() => setCookingRecipe({ recipe: currentPage.recipe, categoryId: currentPage.categoryId })}
          />
        )
      }
      default:
        return <div>Unknown page type</div>
    }
  }

  return (
    <div
      className="min-h-screen bg-background relative"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Home button - top left */}
      {currentPageIndex !== 0 && (
        <button
          onClick={() => goToPage(0)}
          className="nav-action-button fixed top-6 left-6 z-50"
          aria-label="На головну"
        >
          <Home className="w-5 h-5" />
        </button>
      )}

      {/* Fixed toolbar - above page content */}
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        <button onClick={() => setFilterOpen(true)} className="nav-action-button" aria-label="Фільтри">
          <Filter className="w-5 h-5" />
        </button>
        <button onClick={() => setTocOpen(true)} className="nav-action-button" aria-label="Зміст">
          <List className="w-5 h-5" />
        </button>
        <button onClick={() => setSearchOpen(true)} className="nav-action-button" aria-label="Пошук">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed top-1/2 left-4 z-50 transform -translate-y-1/2">
        <button onClick={prevPage} className="recipe-nav-button group" aria-label="Попередня сторінка">
          <ChevronLeft className="w-6 h-6" />
          <span className="recipe-nav-tooltip">Попередня сторінка</span>
        </button>
      </div>

      <div className="fixed top-1/2 right-4 z-50 transform -translate-y-1/2">
        <button onClick={nextPage} className="recipe-nav-button group" aria-label="Наступна сторінка">
          <ChevronRight className="w-6 h-6" />
          <span className="recipe-nav-tooltip">Наступна сторінка</span>
        </button>
      </div>

      {/* Page Indicators - Enhanced for 67 pages */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex flex-col items-center gap-3">
          {/* Page counter */}
          <div className="px-4 py-2 bg-background/80 backdrop-blur-sm border border-border rounded-full">
            <span className="text-sm font-mono text-foreground">
              Сторінка {currentPageIndex + 1} / {totalPages}
            </span>
          </div>

          {/* Dot indicators - show subset around current page */}
          <div className="flex gap-2">
            {/* Show first page indicator */}
            {currentPageIndex > 3 && (
              <>
                <button
                  onClick={() => goToPage(0)}
                  className={`recipe-indicator ${currentPageIndex === 0 ? "active" : ""}`}
                  aria-label="Сторінка 1"
                />
                {currentPageIndex > 4 && (
                  <span className="text-muted-foreground text-xs self-center">...</span>
                )}
              </>
            )}

            {/* Show pages around current page */}
            {Array.from({ length: totalPages }, (_, index) => {
              // Show pages within range of current page
              const distance = Math.abs(index - currentPageIndex)
              if (distance <= 3 || index === 0 || index === totalPages - 1) {
                // Don't show first/last if already shown above
                if ((index === 0 && currentPageIndex > 3) || (index === totalPages - 1 && currentPageIndex < totalPages - 4)) {
                  return null
                }
                return (
                  <button
                    key={index}
                    onClick={() => goToPage(index)}
                    className={`recipe-indicator ${index === currentPageIndex ? "active" : ""}`}
                    aria-label={`Сторінка ${index + 1}`}
                  />
                )
              }
              return null
            })}

            {/* Show last page indicator */}
            {currentPageIndex < totalPages - 4 && (
              <>
                {currentPageIndex < totalPages - 5 && (
                  <span className="text-muted-foreground text-xs self-center">...</span>
                )}
                <button
                  onClick={() => goToPage(totalPages - 1)}
                  className={`recipe-indicator ${currentPageIndex === totalPages - 1 ? "active" : ""}`}
                  aria-label={`Сторінка ${totalPages}`}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className={`recipe-content ${isAnimating ? "fade-out" : "fade-in"}`}>
        {renderPage()}
      </div>

      {/* Dialogs */}
      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        categories={recipeData.categories}
        pageIndexMap={pageIndexMap}
        onSelectRecipe={goToPage}
      />

      <TableOfContents
        open={tocOpen}
        onOpenChange={setTocOpen}
        categories={recipeData.categories}
        pageIndexMap={pageIndexMap}
        onSelectRecipe={goToPage}
        currentPageIndex={currentPageIndex}
        favorites={favorites}
      />

      <FilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        categories={recipeData.categories}
        favorites={favorites}
        pageIndexMap={pageIndexMap}
        onSelectRecipe={goToPage}
      />

      {cookingRecipe && (
        <CookingMode
          recipe={cookingRecipe.recipe}
          categoryId={cookingRecipe.categoryId}
          onClose={() => setCookingRecipe(null)}
        />
      )}
    </div>
  )
}
