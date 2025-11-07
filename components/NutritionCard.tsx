import { memo, useMemo } from 'react'
import type { Nutrition } from '@/types/recipe'
import { calculateTotalMacros, getMacroLabel } from '@/lib/nutrition-utils'

interface NutritionCardProps {
  nutrition: Nutrition
}

/**
 * NutritionCard component displays nutrition information with horizontal bar charts
 */
function NutritionCardComponent({ nutrition }: NutritionCardProps) {
  // Calculate macro percentages relative to total (for bar widths)
  const macroData = useMemo(() => {
    const total = calculateTotalMacros(nutrition)

    return {
      protein: {
        amount: nutrition.protein,
        percentage: total > 0 ? (nutrition.protein / total) * 100 : 0,
        label: getMacroLabel('protein')
      },
      carbs: {
        amount: nutrition.carbs,
        percentage: total > 0 ? (nutrition.carbs / total) * 100 : 0,
        label: getMacroLabel('carbs')
      },
      fat: {
        amount: nutrition.fat,
        percentage: total > 0 ? (nutrition.fat / total) * 100 : 0,
        label: getMacroLabel('fat')
      }
    }
  }, [nutrition])

  return (
    <div className="nutrition-card" role="region" aria-label="Інформація про харчування">
      {/* Header */}
      <div className="nutrition-header">
        <span>Харчова цінність</span>
      </div>

      {/* Calories Section */}
      <div className="nutrition-calories">
        <div className="nutrition-calories-value" aria-label={`${nutrition.calories} калорій`}>
          {nutrition.calories}
        </div>
        <div className="nutrition-calories-label">Калорії</div>
      </div>

      {/* Macros with Horizontal Bars */}
      <div className="nutrition-macros-list">
        {/* Protein */}
        <div className="nutrition-macro-row">
          <span className="nutrition-macro-label">{macroData.protein.label}</span>
          <div className="nutrition-bar-container">
            <div
              className="nutrition-bar nutrition-bar-protein"
              style={{ width: `${macroData.protein.percentage}%` }}
              role="progressbar"
              aria-valuenow={macroData.protein.amount}
              aria-valuemin={0}
              aria-label={`${macroData.protein.label}: ${macroData.protein.amount} грам`}
            />
          </div>
          <span className="nutrition-macro-amount">{macroData.protein.amount}г</span>
        </div>

        {/* Carbs */}
        <div className="nutrition-macro-row">
          <span className="nutrition-macro-label">{macroData.carbs.label}</span>
          <div className="nutrition-bar-container">
            <div
              className="nutrition-bar nutrition-bar-carbs"
              style={{ width: `${macroData.carbs.percentage}%` }}
              role="progressbar"
              aria-valuenow={macroData.carbs.amount}
              aria-valuemin={0}
              aria-label={`${macroData.carbs.label}: ${macroData.carbs.amount} грам`}
            />
          </div>
          <span className="nutrition-macro-amount">{macroData.carbs.amount}г</span>
        </div>

        {/* Fat */}
        <div className="nutrition-macro-row">
          <span className="nutrition-macro-label">{macroData.fat.label}</span>
          <div className="nutrition-bar-container">
            <div
              className="nutrition-bar nutrition-bar-fat"
              style={{ width: `${macroData.fat.percentage}%` }}
              role="progressbar"
              aria-valuenow={macroData.fat.amount}
              aria-valuemin={0}
              aria-label={`${macroData.fat.label}: ${macroData.fat.amount} грам`}
            />
          </div>
          <span className="nutrition-macro-amount">{macroData.fat.amount}г</span>
        </div>
      </div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const NutritionCard = memo(NutritionCardComponent)
