import type { Nutrition } from '@/types/recipe'

// Daily baseline values (standard 2000 kcal diet)
const DAILY_BASELINE = {
  calories: 2000,
  protein: 50,    // grams
  carbs: 300,     // grams
  fat: 65         // grams
}

/**
 * Calculate the total macronutrients (protein + fat + carbs) in grams
 * @param nutrition - The nutrition data object
 * @returns Total macronutrients in grams
 */
export function calculateTotalMacros(nutrition: Nutrition): number {
  return nutrition.protein + nutrition.fat + nutrition.carbs
}

/**
 * Calculate the percentage of a specific macro relative to total macros
 * @param macro - The macro value in grams
 * @param total - Total macronutrients in grams
 * @returns Percentage (0-100)
 */
export function getMacroPercentage(macro: number, total: number): number {
  if (total === 0) return 0
  return Math.round((macro / total) * 100)
}

/**
 * Calculate the percentage of daily intake for calories
 * @param calories - The calorie value
 * @returns Percentage of daily baseline (0-100)
 */
export function getCaloriesDailyPercentage(calories: number): number {
  return Math.round((calories / DAILY_BASELINE.calories) * 100)
}

/**
 * Calculate the percentage of daily intake for a specific macro
 * @param macroType - The type of macronutrient
 * @param amount - The amount in grams
 * @returns Percentage of daily baseline (0-100)
 */
export function getMacroDailyPercentage(macroType: 'protein' | 'carbs' | 'fat', amount: number): number {
  const baseline = DAILY_BASELINE[macroType]
  return Math.round((amount / baseline) * 100)
}

/**
 * Format serving type for display in Ukrainian
 * @param servingType - The serving type string from the data
 * @returns Formatted serving type in Ukrainian
 */
export function formatServingType(servingType: string): string {
  switch (servingType) {
    case 'per_100g':
      return 'На 100г'
    case 'per_serving':
      return 'На порцію'
    default:
      return servingType
  }
}

/**
 * Get the CSS color class for a specific macronutrient type
 * @param macroType - The type of macronutrient
 * @returns CSS class name for coloring
 */
export function getNutritionColor(macroType: 'protein' | 'carbs' | 'fat'): string {
  switch (macroType) {
    case 'protein':
      return 'nutrition-protein'
    case 'carbs':
      return 'nutrition-carbs'
    case 'fat':
      return 'nutrition-fats'
  }
}

/**
 * Get the display label for a macronutrient in Ukrainian
 * @param macroType - The type of macronutrient
 * @returns Ukrainian label
 */
export function getMacroLabel(macroType: 'protein' | 'carbs' | 'fat'): string {
  switch (macroType) {
    case 'protein':
      return 'Білки'
    case 'carbs':
      return 'Вуглеводи'
    case 'fat':
      return 'Жири'
  }
}

/**
 * Get the icon emoji for a macronutrient
 * @param macroType - The type of macronutrient
 * @returns Emoji icon
 */
export function getMacroIcon(macroType: 'protein' | 'carbs' | 'fat'): string {
  switch (macroType) {
    case 'protein':
      return '🥩'
    case 'carbs':
      return '🌾'
    case 'fat':
      return '🥑'
  }
}
