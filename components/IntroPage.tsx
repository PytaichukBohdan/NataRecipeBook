export function IntroPage() {
  return (
    <div className="recipe-hero min-h-screen flex flex-col justify-center items-center px-8 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <p className="text-sm tracking-widest text-muted-foreground uppercase font-mono">
            • КНИГА РЕЦЕПТІВ •
          </p>
        </div>

        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-serif text-foreground mb-6 text-balance leading-tight">
            Без вини, з силою
          </h1>
          <div className="recipe-divider w-32 mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty mb-8">
            Ласкаво просимо до світу смачних та здорових страв. Ця книга – ваш провідник до збалансованого харчування без відчуття вини.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            Кожен рецепт створений з любов'ю та увагою до деталей, щоб ви могли насолоджуватися їжею, яка живить тіло і душу.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
          <div className="p-6 rounded-lg bg-background/50 border border-border">
            <div className="text-4xl font-serif text-foreground mb-3">20</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Сніданки</div>
            <p className="text-xs text-muted-foreground">
              Енергійний старт дня
            </p>
          </div>
          <div className="p-6 rounded-lg bg-background/50 border border-border">
            <div className="text-4xl font-serif text-foreground mb-3">25</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Обід/Вечеря</div>
            <p className="text-xs text-muted-foreground">
              Ситні та збалансовані
            </p>
          </div>
          <div className="p-6 rounded-lg bg-background/50 border border-border">
            <div className="text-4xl font-serif text-foreground mb-3">20</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Десерти</div>
            <p className="text-xs text-muted-foreground">
              Солодкі без провини
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground italic mb-4">
            Використовуйте стрілки або індикатори внизу для навігації
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <span className="text-xs text-accent-foreground font-medium">Гортайте для відкриття рецептів</span>
          </div>
        </div>
      </div>
    </div>
  )
}
