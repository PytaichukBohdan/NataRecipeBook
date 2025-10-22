import { memo } from 'react'
import Image from 'next/image'
import type { Recipe } from '@/types/recipe'
import { normalizeImagePath } from '@/lib/recipe-loader'

interface RecipeCardProps {
  recipe: Recipe
  categoryNameUk: string
  categoryId: string
}

function RecipeCardComponent({ recipe, categoryNameUk, categoryId }: RecipeCardProps) {
  const imagePath = normalizeImagePath(recipe.image_path)

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
      </div>

      {/* Details Section */}
      <div className="min-h-screen bg-background px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-serif text-foreground mb-4">Рецепт приготування</h3>
            <div className="recipe-divider w-16 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left Column - Ingredients */}
            <div className="space-y-12">
              <section>
                <h4 className="text-2xl font-serif text-foreground mb-8">Інгредієнти</h4>

                {recipe.ingredients.length > 0 ? (
                  <div className="space-y-4">
                    {recipe.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-start py-3 border-b border-border"
                      >
                        <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-foreground flex-1">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">Інгредієнти не вказані</p>
                )}
              </section>

              {/* Image in details section */}
              <section>
                <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={imagePath}
                    alt={`${recipe.title} - деталі`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                    quality={85}
                  />
                </div>
              </section>
            </div>

            {/* Right Column - Instructions */}
            <div className="space-y-12">
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
                  <div className="p-6 bg-muted rounded-lg">
                    <p className="text-muted-foreground italic text-center">
                      Інструкції з приготування не вказані. Насолоджуйтесь створенням цієї страви на свій розсуд!
                    </p>
                  </div>
                )}
              </section>

              {/* Tips section - only show for recipes with instructions */}
              {recipe.how_to_cook.length > 0 && (
                <section>
                  <div className="p-6 bg-muted rounded-lg">
                    <h5 className="font-serif text-lg text-foreground mb-4">Поради</h5>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Використовуйте свіжі інгредієнти для кращого смаку</p>
                      <p>• Можна адаптувати рецепт під свої уподобання</p>
                      <p>• Зберігайте приготовану страву належним чином</p>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const RecipeCard = memo(RecipeCardComponent)
