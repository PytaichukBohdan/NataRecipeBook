// Recipe data structure types based on recipes.json

export interface Nutrition {
  serving_type: 'per_100g' | 'per_serving'
  calories: number
  protein: number
  fat: number
  carbs: number
}

export interface Recipe {
  id: number
  title: string
  ingredients: string[]
  how_to_cook: string[]
  image_path: string
  nutrition?: Nutrition
}

export interface Category {
  id: string
  name_en: string
  name_uk: string
  start_marker: string
  end_marker: string | null
  recipes: Recipe[]
}

export interface RecipeData {
  categories: Category[]
}

// Page types for the recipe book
export type PageType = 'intro' | 'recipe' | 'section-divider'

export interface IntroPageData {
  type: 'intro'
}

export interface RecipePageData {
  type: 'recipe'
  recipe: Recipe
  categoryId: string
  categoryNameUk: string
}

export interface SectionDividerPageData {
  type: 'section-divider'
  categoryName: string
  categoryId: string
}

export type Page = IntroPageData | RecipePageData | SectionDividerPageData
