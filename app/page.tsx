"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Recipe data
const recipes = [
  {
    id: "brownie",
    name: "Брауні",
    subtitle: "без цукру з яблуками",
    description: "Натуральний десерт з високим вмістом білка та клітковини. Простий рецепт для щоденного задоволення.",
    image: "/healthy-chocolate-brownie-with-apples-and-protein-.jpg",
    time: 15,
    servings: 4,
    protein: "41.5г",
    category: "daily",
    totalCalories: 711,
    caloriesPer100g: 134,
    totalWeight: 531,
    whyThisDish:
      "Ідеальний десерт для тих, хто хоче насолоджуватися смачним без шкоди для фігури. Яблука додають природну солодкість та клітковину, а протеїн забезпечує довге відчуття ситості.",
    ingredients: [
      { name: "Шоколад чорний 60% зі стевією", amount: "96г" },
      { name: "Яблуко зелене", amount: "255г" },
      { name: "Яєчний білок", amount: "140г" },
      { name: "Яєчний жовток", amount: "10г" },
      { name: "Какао порошок", amount: "15г" },
      { name: "Протеїновий порошок", amount: "15г" },
    ],
    substitutions: [
      "Шоколад зі стевією → звичайний чорний шоколад + 1 ч.л. стевії",
      "Протеїн → 2 ст.л. борошна + 1 ст.л. какао",
    ],
    instructions: [
      "Розтопіть шоколад на водяній бані. Яблука натріть на крупній тертці.",
      "Змішайте білки з жовтком, додайте какао та протеїн. Перемішайте до однорідності.",
      "Додайте розтоплений шоколад та яблука. Випікайте при 180°C протягом 25-30 хвилин.",
    ],
    tips: [
      "Зберігайте в холодильнику до 5 днів",
      "Можна заморозити порції на місяць",
      "Додайте горіхи для більше текстури",
    ],
    nutrition: {
      proteins: { value: 41.5, percentage: 28 },
      carbohydrates: { value: 61, percentage: 42 },
      fats: { value: 43.4, percentage: 30 },
      fiber: { value: 25.6, percentage: 85 },
    },
  },
  {
    id: "banana-pie",
    name: "Банановий пиріг",
    subtitle: "з протеїном та вишнею",
    description: "Поживний десерт з натуральною солодкістю бананів, збагачений протеїном та антиоксидантами з вишні.",
    image: "/healthy-banana-pie-with-cherries-and-protein-powde.jpg",
    time: 20,
    servings: 3,
    protein: "66.3г",
    category: "daily",
    totalCalories: 940,
    caloriesPer100g: 165.2,
    totalWeight: 569,
    whyThisDish:
      "Ідеальний варіант для сніданку або перекусу. Банани забезпечують природну енергію, протеїн підтримує м'язи, а вишня додає яскравий смак та корисні антиоксиданти.",
    ingredients: [
      { name: "Мука рисова", amount: "100г" },
      { name: "Яйцо куряче сире", amount: "54г" },
      { name: "Протеїн шоколадний", amount: "59г" },
      { name: "Йогурт 3% білий густий", amount: "31г" },
      { name: "Банан", amount: "173г" },
      { name: "Напиток вівсяний 2.5%", amount: "70мл" },
      { name: "Вишня заморожена", amount: "76г" },
      { name: "Гарбузове насіння", amount: "6г" },
    ],
    substitutions: [
      "Рисова мука → вівсяна мука або мука з полби",
      "Протеїн → 3 ст.л. какао + 2 ст.л. борошна",
      "Вівсяний напиток → звичайне молоко",
    ],
    instructions: [
      "Змішайте рисову муку з протеїном та какао. Додайте яйце та йогурт.",
      "Банани розімніть виделкою та додайте до тіста разом з вівсяним напитком.",
      "Обережно вмішайте вишню та гарбузове насіння. Випікайте при 180°C 35-40 хвилин.",
    ],
    tips: [
      "Використовуйте стиглі банани для кращої солодкості",
      "Можна замінити вишню на чорницю або малину",
      "Зберігається в холодильнику до 4 днів",
    ],
    nutrition: {
      proteins: { value: 66.3, percentage: 31 },
      carbohydrates: { value: 131, percentage: 62 },
      fats: { value: 15.4, percentage: 7 },
      fiber: { value: 6.7, percentage: 22 },
    },
  },
]

export default function RecipePage() {
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const currentRecipe = recipes[currentRecipeIndex]

  const nextRecipe = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentRecipeIndex((prev) => (prev + 1) % recipes.length)
      setTimeout(() => setIsAnimating(false), 50)
    }, 300)
  }

  const prevRecipe = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentRecipeIndex((prev) => (prev - 1 + recipes.length) % recipes.length)
      setTimeout(() => setIsAnimating(false), 50)
    }, 300)
  }

  const goToRecipe = (index: number) => {
    if (isAnimating || index === currentRecipeIndex) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentRecipeIndex(index)
      setTimeout(() => setIsAnimating(false), 50)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed top-1/2 left-4 z-50 transform -translate-y-1/2">
        <button onClick={prevRecipe} className="recipe-nav-button group" aria-label="Попередній рецепт">
          <ChevronLeft className="w-6 h-6" />
          <span className="recipe-nav-tooltip">Попередній рецепт</span>
        </button>
      </div>

      <div className="fixed top-1/2 right-4 z-50 transform -translate-y-1/2">
        <button onClick={nextRecipe} className="recipe-nav-button group" aria-label="Наступний рецепт">
          <ChevronRight className="w-6 h-6" />
          <span className="recipe-nav-tooltip">Наступний рецепт</span>
        </button>
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex gap-3">
          {recipes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToRecipe(index)}
              className={`recipe-indicator ${index === currentRecipeIndex ? "active" : ""}`}
              aria-label={`Рецепт ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className={`recipe-content ${isAnimating ? "fade-out" : "fade-in"}`}>
        <div className="recipe-hero min-h-screen flex flex-col justify-center items-center px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <p className="text-sm tracking-widest text-muted-foreground uppercase font-mono">• БЕЗ ВИНИ, З СИЛОЮ •</p>
            </div>

            <div className="mb-12">
              <h1 className="text-6xl md:text-7xl font-serif text-foreground mb-4 text-balance">
                {currentRecipe.name}
              </h1>
              <h2 className="text-3xl md:text-4xl font-light text-primary italic mb-6">{currentRecipe.subtitle}</h2>
              <div className="recipe-divider w-24 mx-auto mb-6"></div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
                {currentRecipe.description}
              </p>
            </div>

            <div className="mb-12">
              <img
                src={currentRecipe.image || "/placeholder.svg"}
                alt={`${currentRecipe.name} ${currentRecipe.subtitle}`}
                className="w-full max-w-2xl mx-auto h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto text-center">
              <div>
                <div className="text-3xl font-serif text-foreground mb-2">{currentRecipe.time}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">хвилин</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-foreground mb-2">{currentRecipe.servings}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">порції</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-foreground mb-2">{currentRecipe.protein}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">білка</div>
              </div>
            </div>

            <div className="mt-8">
              <div className="category-indicator">
                <div className={`category-dot category-${currentRecipe.category}`}></div>
                <span>Щоденна їжа</span>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-screen bg-background px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-serif text-foreground mb-4">Рецепт приготування</h3>
              <div className="recipe-divider w-16 mx-auto"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              <div className="space-y-12">
                <section>
                  <h4 className="text-2xl font-serif text-foreground mb-6">Чому ця страва</h4>
                  <p className="text-muted-foreground leading-relaxed text-lg">{currentRecipe.whyThisDish}</p>
                </section>

                <section>
                  <h4 className="text-2xl font-serif text-foreground mb-8">Інгредієнти</h4>

                  <div className="space-y-4">
                    {currentRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-border">
                        <span className="text-foreground">{ingredient.name}</span>
                        <span className="font-mono text-primary">{ingredient.amount}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-muted rounded-lg">
                    <h5 className="font-serif text-lg text-foreground mb-4">Заміни</h5>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {currentRecipe.substitutions.map((substitution, index) => (
                        <p key={index}>• {substitution}</p>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-12">
                <section>
                  <h4 className="text-2xl font-serif text-foreground mb-8">Спосіб приготування</h4>

                  <div className="space-y-8">
                    {currentRecipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-6">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground font-mono text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed pt-1">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="text-2xl font-serif text-foreground mb-6">Корисні поради</h4>
                  <div className="space-y-3 text-muted-foreground">
                    {currentRecipe.tips.map((tip, index) => (
                      <p key={index}>• {tip}</p>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="text-2xl font-serif text-foreground mb-6">Харчова цінність</h4>
                  <p className="text-sm text-muted-foreground mb-6">на всю порцію ({currentRecipe.totalWeight}г)</p>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-4xl font-serif text-foreground mb-2">{currentRecipe.totalCalories}</div>
                      <div className="text-sm text-muted-foreground uppercase tracking-wide">ккал загалом</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-serif text-foreground mb-2">{currentRecipe.caloriesPer100g}</div>
                      <div className="text-sm text-muted-foreground uppercase tracking-wide">ккал/100г</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-foreground">Білки</span>
                        <span className="font-mono text-primary">{currentRecipe.nutrition.proteins.value}г</span>
                      </div>
                      <div className="nutrition-bar">
                        <div
                          className="nutrition-segment nutrition-protein"
                          style={{ width: `${currentRecipe.nutrition.proteins.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {currentRecipe.nutrition.proteins.percentage}%
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-foreground">Вуглеводи</span>
                        <span className="font-mono text-primary">{currentRecipe.nutrition.carbohydrates.value}г</span>
                      </div>
                      <div className="nutrition-bar">
                        <div
                          className="nutrition-segment nutrition-carbs"
                          style={{ width: `${currentRecipe.nutrition.carbohydrates.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {currentRecipe.nutrition.carbohydrates.percentage}%
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-foreground">Жири</span>
                        <span className="font-mono text-primary">{currentRecipe.nutrition.fats.value}г</span>
                      </div>
                      <div className="nutrition-bar">
                        <div
                          className="nutrition-segment nutrition-fats"
                          style={{ width: `${currentRecipe.nutrition.fats.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {currentRecipe.nutrition.fats.percentage}%
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-foreground">Клітковина</span>
                        <span className="font-mono text-primary">{currentRecipe.nutrition.fiber.value}г</span>
                      </div>
                      <div className="nutrition-bar">
                        <div
                          className="nutrition-segment nutrition-fiber"
                          style={{ width: `${currentRecipe.nutrition.fiber.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {currentRecipe.nutrition.fiber.percentage}% від денної норми
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
