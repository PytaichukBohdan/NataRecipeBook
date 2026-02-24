import { LazyVideo } from './LazyVideo'

interface IntroPageProps {
  onCategoryClick?: (categoryId: string) => void
}

const categories = [
  {
    id: 'breakfast',
    name: 'Сніданки',
    videos: [
      { src: '/recipe_images/videos/breakfast_1.mp4', poster: '/recipe_images/breakfast_1.jpeg', alt: 'Творожні панкейки з фруктами' },
      { src: '/recipe_images/videos/breakfast_3.mp4', poster: '/recipe_images/breakfast_3.jpeg', alt: 'Тости твого настрою' },
    ],
  },
  {
    id: 'lunch_dinner',
    name: 'Обід / Вечеря',
    videos: [
      { src: '/recipe_images/videos/lunch_dinner_4.mp4', poster: '/recipe_images/lunch_dinner_4.jpeg', alt: 'Різото з трюфелем' },
      { src: '/recipe_images/videos/lunch_dinner_11.mp4', poster: '/recipe_images/lunch_dinner_11.jpeg', alt: 'Обід' },
    ],
  },
  {
    id: 'desserts',
    name: 'Десерти',
    videos: [
      { src: '/recipe_images/videos/desserts_3.mp4', poster: '/recipe_images/desserts_3.jpeg', alt: 'Галетна творожна піцца' },
      { src: '/recipe_images/videos/desserts_5.mp4', poster: '/recipe_images/desserts_5.jpeg', alt: 'Шоколадний десерт' },
    ],
  },
]

export function IntroPage({ onCategoryClick }: IntroPageProps) {
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

        {/* Category Sections */}
        <div className="flex flex-col gap-10 max-w-3xl mx-auto mb-12">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onCategoryClick?.(cat.id)}
              role="button"
              tabIndex={0}
              className="intro-category-section group cursor-pointer"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4 group-hover:text-accent transition-colors duration-300">
                {cat.name}
              </h2>
              <div className="grid grid-cols-2 gap-4 w-full">
                {cat.videos.map((video, index) => (
                  <div key={index} className="intro-video-item">
                    <LazyVideo
                      src={video.src}
                      poster={video.poster}
                      alt={video.alt}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground italic mb-4">
            Натисни на розділ або використовуй стрілки для навігації
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
