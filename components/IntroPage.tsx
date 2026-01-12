import { LazyVideo } from './LazyVideo'

interface IntroPageProps {
  onCategoryClick?: (categoryId: string) => void
}

export function IntroPage({ onCategoryClick }: IntroPageProps) {
  // Video previews - 6 videos (2 per category), all play from ingredients → dish
  const videoPreviewData = [
    // Сніданки (Session 2: ingredients → dish)
    { src: '/recipe_images/videos/breakfast_15.mp4', poster: '/recipe_images/breakfast_15.jpeg', alt: 'Сніданок' },
    // Обід/Вечеря (Session 2: ingredients → dish)
    { src: '/recipe_images/videos/lunch_dinner_5.mp4', poster: '/recipe_images/lunch_dinner_5.jpeg', alt: 'Обід' },
    { src: '/recipe_images/videos/lunch_dinner_11.mp4', poster: '/recipe_images/lunch_dinner_11.jpeg', alt: 'Обід' },
    { src: '/recipe_images/videos/lunch_dinner_12.mp4', poster: '/recipe_images/lunch_dinner_12.jpeg', alt: 'Обід' },
    // Десерти (Session 2: ingredients → dish)
    { src: '/recipe_images/videos/desserts_4.mp4', poster: '/recipe_images/desserts_4.jpeg', alt: 'Десерт' },
    // Extra lunch/dinner to fill 6
    { src: '/recipe_images/videos/lunch_dinner_18.mp4', poster: '/recipe_images/lunch_dinner_18.jpeg', alt: 'Обід' },
  ]

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
            Ласкаво просимо до світу смачних та здорових страв. Ця книга – твій провідник до збалансованого харчування без відчуття вини.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            Кожен рецепт створений з любов'ю та увагою до деталей, щоб ти міг насолоджуватися їжею, яка живить тіло і душу.
          </p>
        </div>

        {/* Video Grid */}
        <div className="intro-video-grid grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
          {videoPreviewData.map((video, index) => (
            <div key={index} className="intro-video-item">
              <LazyVideo
                src={video.src}
                poster={video.poster}
                alt={video.alt}
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground italic mb-4">
            Використовуй стрілки або індикатори внизу для навігації
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <span className="text-xs text-accent-foreground font-medium">Гортай для відкриття рецептів</span>
          </div>
        </div>
      </div>
    </div>
  )
}
