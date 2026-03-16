'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ChefHat } from 'lucide-react'
import type { Recipe } from '@/types/recipe'
import { normalizeImagePath } from '@/lib/recipe-loader'

interface CookingModeProps {
  recipe: Recipe
  categoryId: string
  onClose: () => void
}

// Step data types for internal step array
type IngredientStep = { type: 'ingredients'; content: string[] }
type InstructionStep = { type: 'instruction'; content: string; index: number }
type DoneStep = { type: 'done'; content: string }
type Step = IngredientStep | InstructionStep | DoneStep

// Helper: parse ingredient sections (reuses logic from RecipeCard)
interface IngredientSection {
  header?: string
  items: string[]
}

function parseIngredientSections(ingredients: string[]): IngredientSection[] {
  const sections: IngredientSection[] = []
  let currentSection: IngredientSection = { items: [] }

  for (const ingredient of ingredients) {
    if (ingredient.trim().endsWith(':')) {
      if (currentSection.items.length > 0) {
        sections.push(currentSection)
      }
      currentSection = { header: ingredient, items: [] }
    } else {
      currentSection.items.push(ingredient)
    }
  }

  if (currentSection.items.length > 0 || currentSection.header) {
    sections.push(currentSection)
  }

  return sections
}

export function CookingMode({ recipe, categoryId, onClose }: CookingModeProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Filter out header-only entries from how_to_cook (e.g. "Приготування:", "Спосіб приготування:")
  const filteredInstructions = recipe.how_to_cook.filter((step) => {
    const trimmed = step.trim()
    if (trimmed.endsWith(':') && trimmed.length < 30) return false
    return true
  })

  // Build the steps array:
  // Step 0 = ingredients, steps 1..N = cooking instructions, final step = done
  const steps: Step[] = [
    { type: 'ingredients', content: recipe.ingredients },
    ...filteredInstructions.map((instruction, idx) => ({
      type: 'instruction' as const,
      content: instruction,
      index: idx + 1,
    })),
    { type: 'done', content: 'Готово!' },
  ]

  const totalSteps = steps.length

  // Parsed ingredient sections for rich display
  const ingredientSections = parseIngredientSections(recipe.ingredients)

  // Image path for the done step
  const imagePath = normalizeImagePath(recipe.image_path)

  // --- Wake Lock API ---
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null
    let isActive = true

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen')
        }
      } catch {
        // Wake Lock request can fail (e.g., low battery, tab not visible)
      }
    }

    // Re-acquire wake lock when page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive) {
        requestWakeLock()
      }
    }

    requestWakeLock()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      isActive = false
      wakeLock?.release()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // --- Lock body scroll while cooking mode is open ---
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  // --- Navigation callbacks ---
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }, [currentStep, totalSteps])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  // --- Keyboard navigation ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          prevStep()
          break
        case 'ArrowRight':
          e.preventDefault()
          nextStep()
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prevStep, nextStep, onClose])

  // --- Touch swipe handlers ---
  const minSwipeDistance = 50

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
    if (distance > minSwipeDistance) {
      nextStep() // Swipe left = next step
    } else if (distance < -minSwipeDistance) {
      prevStep() // Swipe right = previous step
    }
  }

  // --- Step rendering ---
  const currentStepData = steps[currentStep]
  const progressPercent = ((currentStep + 1) / totalSteps) * 100

  const renderStepContent = () => {
    switch (currentStepData.type) {
      case 'ingredients':
        return (
          <div className="cooking-step-ingredients">
            <div className="cooking-step-icon">
              <ChefHat className="w-10 h-10" />
            </div>
            <h2 className="cooking-step-title">Інгредієнти</h2>
            <div className="cooking-step-subtitle">{recipe.title}</div>
            <div className="cooking-ingredients-list">
              {ingredientSections.map((section, sectionIndex) => {
                const startNumber = ingredientSections
                  .slice(0, sectionIndex)
                  .reduce((sum, s) => sum + s.items.length, 0) + 1

                return (
                  <div key={sectionIndex} className="cooking-ingredient-section">
                    {section.header && (
                      <div className="cooking-ingredient-header">
                        {section.header}
                      </div>
                    )}
                    {section.items.map((ingredient, itemIndex) => (
                      <div key={itemIndex} className="cooking-ingredient-item">
                        <span className="cooking-ingredient-number">
                          {startNumber + itemIndex}
                        </span>
                        <span className="cooking-ingredient-text">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'instruction':
        return (
          <div className="cooking-step-instruction">
            <div className="cooking-step-number-badge">
              {currentStepData.index}
            </div>
            <h2 className="cooking-step-title">
              Крок {currentStepData.index}
            </h2>
            <p className="cooking-instruction-text">
              {currentStepData.content}
            </p>
          </div>
        )

      case 'done':
        return (
          <div className="cooking-step-done">
            <div className="cooking-done-image-container">
              <img
                src={imagePath}
                alt={recipe.title}
                className="cooking-done-image"
              />
            </div>
            <h2 className="cooking-done-title">Готово!</h2>
            <p className="cooking-done-subtitle">{recipe.title}</p>
            <button onClick={onClose} className="cooking-done-button">
              Закрити
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className="cooking-mode-overlay"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="cooking-close-button"
        aria-label="Закрити режим готування"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Progress bar */}
      <div className="cooking-progress-container">
        <span className="cooking-progress-label">
          Крок {currentStep + 1} з {totalSteps}
        </span>
        <div className="cooking-progress-track">
          <div
            className="cooking-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="cooking-step-content">
        {renderStepContent()}
      </div>

      {/* Navigation buttons */}
      <div className="cooking-nav-buttons">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="cooking-nav-button"
          aria-label="Попередній крок"
        >
          <ChevronLeft className="w-6 h-6" />
          <span>Назад</span>
        </button>

        {currentStep < totalSteps - 1 ? (
          <button
            onClick={nextStep}
            className="cooking-nav-button cooking-nav-button-primary"
            aria-label="Наступний крок"
          >
            <span>Далі</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={onClose}
            className="cooking-nav-button cooking-nav-button-primary"
            aria-label="Завершити"
          >
            <span>Готово</span>
          </button>
        )}
      </div>
    </div>
  )
}
