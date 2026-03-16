'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
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
  const [activeSlide, setActiveSlide] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < categories.length) {
      setActiveSlide(index)
    }
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchStartY.current = e.targetTouches[0].clientY
    touchEndX.current = null
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (touchStartX.current === null || touchEndX.current === null || touchStartY.current === null) return

    const distX = touchStartX.current - touchEndX.current
    const minSwipe = 50

    if (Math.abs(distX) > minSwipe) {
      if (distX > 0 && activeSlide < categories.length - 1) {
        setActiveSlide(prev => prev + 1)
      } else if (distX < 0 && activeSlide > 0) {
        setActiveSlide(prev => prev - 1)
      }
    }

    touchStartX.current = null
    touchEndX.current = null
  }, [activeSlide])

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && activeSlide > 0) {
        e.stopPropagation()
        setActiveSlide(prev => prev - 1)
      } else if (e.key === 'ArrowRight' && activeSlide < categories.length - 1) {
        e.stopPropagation()
        setActiveSlide(prev => prev + 1)
      }
    }
    // Use capture phase so carousel handles arrows before page nav
    // Not needed since intro page doesn't need page nav arrows
    return () => {}
  }, [activeSlide])

  return (
    <div className="recipe-hero min-h-screen flex flex-col justify-center items-center px-8 py-16">
      <div className="max-w-4xl mx-auto text-center w-full">
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

        {/* Category Carousel */}
        <div
          ref={carouselRef}
          className="relative w-full max-w-3xl mx-auto mb-8 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="w-full flex-shrink-0 px-4"
                style={{ minWidth: '100%' }}
              >
                <div
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
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-3 mb-8">
          {categories.map((cat, index) => (
            <button
              key={cat.id}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeSlide
                  ? 'bg-accent scale-125'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={cat.name}
            />
          ))}
        </div>

        {/* Category name label */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground font-medium tracking-wide">
            {categories[activeSlide].name}
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground italic mb-4">
            Гортай слайди або натисни на розділ для навігації
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
