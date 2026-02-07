const fs = require('fs')
const path = require('path')

const recipesPath = path.join(__dirname, '..', 'data', 'recipes.json')
const data = JSON.parse(fs.readFileSync(recipesPath, 'utf8'))

// Patterns to identify ingredients (items with amounts)
const ingredientPatterns = [
  /^\d+г\s/,         // "15г щось"
  /^\d+мл\s/,        // "50мл води"
  /^\d+ г\s/,        // "15 г щось"
  /^\d+ мл\s/,       // "50 мл води"
  /^\d+г$/,          // "15г" at end
  /^\d+-\d+г\s/,     // "5-10г щось"
  /^\d+,\d+г\s/,     // "1,5г щось"
  /^\d+ ч\.л/,       // "1 ч.л"
  /^\d+ ст\./,       // "1 ст."
  /^Яйце/,           // "Яйце"
  /^Яєчний білок/,   // "Яєчний білок"
  /^Білок/,          // "Білок"
  /^Щіпка/,          // "Щіпка"
  /^Трошки/,         // "Трошки"
  /^Мікрогрін$/,     // "Мікрогрін"
  /^Інжир$/,         // "Інжир"
  /^кефір/i,         // "кефір"
]

// Patterns for section headers that should be moved with ingredients
const sectionHeaderPatterns = [
  /^Варіант \d+:/,
  /^Прикрашаємо?:/,
  /^Начинка:/,
  /^Соус:/,
  /^Гранола/i,
  /^\d+г\s+\w+:/,   // "30г намазки:", "220г оладок:"
]

// Patterns for cooking instructions (should stay in how_to_cook)
const instructionPatterns = [
  /варимо|варити|готується|готуємо|кидаємо|випікаємо|випікати|змішуємо|змішати|збиваємо|збити|перемішуємо|перемішати|тушимо|смажимо|нарізаємо|викладаємо|формуємо|подати|полити|посипаємо|накриваємо|маринувати/i,
  /^Спосіб приготування:/,
  /^Приготування:?$/,
  /^Приготування є?:/,
  /^Опис:/,
  /духовк[уаи]/i,
  /сковор[іо]д/i,
  /блендер/i,
  /мікрохвильов/i,
  /градус/i,
  /хвилин/i,
  /\d+хв\b/,
  /пергамент/i,
]

function isIngredient(item) {
  // Check if it matches ingredient patterns
  for (const pattern of ingredientPatterns) {
    if (pattern.test(item)) return true
  }

  // Check for weight/measurement patterns anywhere in the string
  if (/\d+г\b/.test(item) && !isInstruction(item)) return true
  if (/\d+мл\b/.test(item) && !isInstruction(item)) return true

  return false
}

function isSectionHeader(item) {
  if (!item.trim().endsWith(':')) return false

  for (const pattern of sectionHeaderPatterns) {
    if (pattern.test(item)) return true
  }

  // Headers ending with ":" that precede ingredient-like items
  return item.trim().endsWith(':') && item.length < 50
}

function isInstruction(item) {
  for (const pattern of instructionPatterns) {
    if (pattern.test(item)) return true
  }
  return false
}

function migrateRecipe(recipe, categoryId, recipeId) {
  if (!recipe.how_to_cook || recipe.how_to_cook.length === 0) {
    return recipe
  }

  const newIngredients = [...recipe.ingredients]
  const newHowToCook = []

  let inIngredientSection = false
  let currentSectionHeader = null

  for (let i = 0; i < recipe.how_to_cook.length; i++) {
    const item = recipe.how_to_cook[i]

    // Check if this is a section header
    if (isSectionHeader(item)) {
      // Look ahead to see if next items are ingredients
      const nextItems = recipe.how_to_cook.slice(i + 1, i + 4)
      const hasIngredientAfter = nextItems.some(next => isIngredient(next))

      if (hasIngredientAfter) {
        // This is an ingredient section header
        newIngredients.push(item)
        inIngredientSection = true
        currentSectionHeader = item
        continue
      }
    }

    // Check if this is an ingredient
    if (isIngredient(item)) {
      newIngredients.push(item)
      inIngredientSection = true
      continue
    }

    // Check if this is an instruction
    if (isInstruction(item)) {
      // If we have an orphan header that wasn't added, add it to how_to_cook
      newHowToCook.push(item)
      inIngredientSection = false
      continue
    }

    // For items that don't clearly match either pattern:
    // If we're in an ingredient section and it's short, treat as ingredient
    if (inIngredientSection && item.length < 40 && !item.includes('.')) {
      newIngredients.push(item)
    } else {
      newHowToCook.push(item)
      inIngredientSection = false
    }
  }

  return {
    ...recipe,
    ingredients: newIngredients,
    how_to_cook: newHowToCook
  }
}

// Process all recipes
let migratedCount = 0
for (const category of data.categories) {
  for (let i = 0; i < category.recipes.length; i++) {
    const recipe = category.recipes[i]
    const originalHowToCookLength = recipe.how_to_cook?.length || 0
    const originalIngredientsLength = recipe.ingredients?.length || 0

    const migrated = migrateRecipe(recipe, category.id, recipe.id)

    if (migrated.ingredients.length !== originalIngredientsLength) {
      console.log(`\n[${category.id}] ${recipe.title}:`)
      console.log(`  Ingredients: ${originalIngredientsLength} -> ${migrated.ingredients.length}`)
      console.log(`  How to cook: ${originalHowToCookLength} -> ${migrated.how_to_cook.length}`)

      // Show what was moved
      const movedItems = migrated.ingredients.slice(originalIngredientsLength)
      if (movedItems.length > 0) {
        console.log(`  Moved to ingredients:`)
        movedItems.forEach(item => console.log(`    + ${item}`))
      }

      migratedCount++
    }

    category.recipes[i] = migrated
  }
}

console.log(`\n\nMigrated ${migratedCount} recipes`)

// Write the updated data
fs.writeFileSync(recipesPath, JSON.stringify(data, null, 2), 'utf8')
console.log('Written to recipes.json')
