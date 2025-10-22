"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { buildPageArray } from "@/lib/page-builder"
import { IntroPage } from "@/components/IntroPage"
import { SectionDivider } from "@/components/SectionDivider"
import { RecipeCard } from "@/components/RecipeCard"

export default function RecipePage() {
  // Build the page array once using useMemo
  const pages = useMemo(() => buildPageArray(), [])

  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const currentPage = pages[currentPageIndex]
  const totalPages = pages.length

  const nextPage = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentPageIndex((prev) => (prev + 1) % totalPages)
      setTimeout(() => setIsAnimating(false), 50)
    }, 300)
  }

  const prevPage = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentPageIndex((prev) => (prev - 1 + totalPages) % totalPages)
      setTimeout(() => setIsAnimating(false), 50)
    }, 300)
  }

  const goToPage = (index: number) => {
    if (isAnimating || index === currentPageIndex) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentPageIndex(index)
      setTimeout(() => setIsAnimating(false), 50)
    }, 300)
  }

  // Render the current page based on its type
  const renderPage = () => {
    switch (currentPage.type) {
      case 'intro':
        return <IntroPage />
      case 'section-divider':
        return (
          <SectionDivider
            categoryName={currentPage.categoryName}
            categoryId={currentPage.categoryId}
          />
        )
      case 'recipe':
        return (
          <RecipeCard
            recipe={currentPage.recipe}
            categoryNameUk={currentPage.categoryNameUk}
            categoryId={currentPage.categoryId}
          />
        )
      default:
        return <div>Unknown page type</div>
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
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
    </div>
  )
}
