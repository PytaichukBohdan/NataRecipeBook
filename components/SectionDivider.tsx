interface SectionDividerProps {
  categoryName: string
  categoryId: string
}

export function SectionDivider({ categoryName, categoryId }: SectionDividerProps) {
  // Map category IDs to decorative elements
  const getDecorativeElement = () => {
    switch (categoryId) {
      case 'lunch_dinner':
        return '🍽️'
      case 'desserts':
        return '🍰'
      default:
        return '✨'
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-8 py-16 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <div className="text-6xl mb-8 opacity-40">
            {getDecorativeElement()}
          </div>
        </div>

        <div className="mb-12">
          <div className="recipe-divider w-24 mx-auto mb-12 rotate-180"></div>

          <h2 className="text-7xl md:text-8xl font-serif text-foreground mb-8 text-balance leading-tight">
            {categoryName}
          </h2>

          <div className="recipe-divider w-24 mx-auto"></div>
        </div>

        <div className="mt-16">
          <p className="text-sm text-muted-foreground italic tracking-wide">
            Гортайте далі для перегляду рецептів
          </p>
        </div>
      </div>
    </div>
  )
}
