import { memo, useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import { Printer } from 'lucide-react'
import type { Recipe } from '@/types/recipe'
import { normalizeImagePath } from '@/lib/recipe-loader'
import { NutritionCard } from '@/components/NutritionCard'
import { ScrollIndicator } from '@/components/ScrollIndicator'

interface RecipeCardProps {
  recipe: Recipe
  categoryNameUk: string
  categoryId: string
}

// Helper interface for ingredient sections
interface IngredientSection {
  header?: string
  items: string[]
}

// Helper function to parse ingredient sections
function parseIngredientSections(ingredients: string[]): IngredientSection[] {
  const sections: IngredientSection[] = []
  let currentSection: IngredientSection = { items: [] }

  for (const ingredient of ingredients) {
    // Check if this is a section header (ends with ":")
    if (ingredient.trim().endsWith(':')) {
      // Save the current section if it has items
      if (currentSection.items.length > 0) {
        sections.push(currentSection)
      }
      // Start a new section with this header
      currentSection = { header: ingredient, items: [] }
    } else {
      // Add to current section
      currentSection.items.push(ingredient)
    }
  }

  // Add the final section if it has items
  if (currentSection.items.length > 0) {
    sections.push(currentSection)
  }

  return sections
}

// Helper function to get recipe stats
function getRecipeStats(recipe: Recipe) {
  const ingredientCount = recipe.ingredients.length
  const hasInstructions = recipe.how_to_cook.length > 0

  return {
    ingredientCount,
    hasInstructions,
    ingredientLabel: `${ingredientCount} ${ingredientCount === 1 ? 'інгредієнт' : ingredientCount < 5 ? 'інгредієнти' : 'інгредієнтів'}`,
    instructionLabel: hasInstructions ? 'Покрокова інструкція' : 'Швидкий рецепт'
  }
}

function RecipeCardComponent({ recipe, categoryNameUk, categoryId }: RecipeCardProps) {
  const imagePath = normalizeImagePath(recipe.image_path)

  // Scroll indicator visibility state
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Determine category display name and color
  const getCategoryInfo = () => {
    switch (categoryId) {
      case 'breakfast':
        return { name: 'Сніданки', class: 'category-daily' }
      case 'lunch_dinner':
        return { name: 'Обід/Вечеря', class: 'category-occasional' }
      case 'desserts':
        return { name: 'Десерти', class: 'category-special' }
      default:
        return { name: categoryNameUk, class: 'category-daily' }
    }
  }

  const categoryInfo = getCategoryInfo()

  // Parse ingredient sections (memoized for performance)
  const ingredientSections = useMemo(() => parseIngredientSections(recipe.ingredients), [recipe.ingredients])

  // Get recipe stats
  const stats = getRecipeStats(recipe)

  return (
    <>
      {/* Hero Section */}
      <div className="recipe-hero min-h-screen flex flex-col justify-center items-center px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <p className="text-sm tracking-widest text-muted-foreground uppercase font-mono">
              • {categoryInfo.name} •
            </p>
          </div>

          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-serif text-foreground mb-4 text-balance">
              {recipe.title}
            </h1>
            <div className="recipe-divider w-24 mx-auto mb-6"></div>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <div className="recipe-stat-badge">
                <span className="stat-icon">🥘</span>
                <span>{stats.ingredientLabel}</span>
              </div>
              <div className={`recipe-stat-badge ${stats.hasInstructions ? 'stat-badge-success' : 'stat-badge-info'}`}>
                <span className="stat-icon">{stats.hasInstructions ? '📖' : '⚡'}</span>
                <span>{stats.instructionLabel}</span>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <div className="relative w-full max-w-2xl mx-auto h-96 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={imagePath}
                alt={recipe.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                loading="lazy"
                quality={85}
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="category-indicator">
              <div className={`category-dot ${categoryInfo.class}`}></div>
              <span>{categoryInfo.name}</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <ScrollIndicator visible={showScrollIndicator} />
      </div>

      {/* Details Section */}
      <div className="bg-background px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-serif text-foreground mb-4">Рецепт приготування</h3>
            <div className="recipe-divider w-16 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left Column - Ingredients */}
            <div>
              <section>
                <h4 className="text-2xl font-serif text-foreground mb-8">Інгредієнти</h4>

                {recipe.ingredients.length > 0 ? (
                  <div className="space-y-6">
                    {ingredientSections.map((section, sectionIndex) => {
                      // Calculate starting number for this section
                      const startNumber = ingredientSections
                        .slice(0, sectionIndex)
                        .reduce((sum, s) => sum + s.items.length, 0) + 1

                      return (
                        <div key={sectionIndex}>
                          {/* Section Header */}
                          {section.header && (
                            <div className="ingredient-section-header mb-3">
                              {section.header}
                            </div>
                          )}

                          {/* Section Items */}
                          <div className="space-y-3">
                            {section.items.map((ingredient, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="flex items-start py-3 border-b border-border"
                              >
                                <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs mr-3 mt-0.5">
                                  {startNumber + itemIndex}
                                </span>
                                <span className="text-foreground flex-1">{ingredient}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">Інгредієнти не вказані</p>
                )}
              </section>
            </div>

            {/* Right Column - Instructions */}
            <div>
              <section>
                <h4 className="text-2xl font-serif text-foreground mb-8">Спосіб приготування</h4>

                {recipe.how_to_cook.length > 0 ? (
                  <div className="space-y-6">
                    {recipe.how_to_cook.map((instruction, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground font-mono text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed pt-1">{instruction}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-instructions-message">
                    <div className="empty-message-icon">⚡</div>
                    <h5 className="empty-message-title">Швидкий рецепт</h5>
                    <p className="empty-message-text">
                      Це швидкий рецепт без покрокової інструкції. Насолоджуйтесь творчим процесом приготування!
                    </p>
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* Nutrition Information */}
          {recipe.nutrition && (
            <div className="mt-16">
              <NutritionCard nutrition={recipe.nutrition} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const RecipeCard = memo(RecipeCardComponent)
