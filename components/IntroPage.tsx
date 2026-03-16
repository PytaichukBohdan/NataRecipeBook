'use client'

import { useState, useRef, useCallback } from 'react'
import { LazyVideo } from './LazyVideo'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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

function VideoCarousel({ videos, onCategoryClick, categoryId }: {
  videos: typeof categories[0]['videos']
  onCategoryClick?: (id: string) => void
  categoryId: string
}) {
  const [activeSlide, setActiveSlide] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation()
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = null
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const dist = touchStartX.current - touchEndX.current
    if (Math.abs(dist) > 50) {
      if (dist > 0 && activeSlide < videos.length - 1) {
        setActiveSlide(prev => prev + 1)
      } else if (dist < 0 && activeSlide > 0) {
        setActiveSlide(prev => prev - 1)
      }
    }
    touchStartX.current = null
    touchEndX.current = null
  }, [activeSlide, videos.length])

  return (
    <div className="relative">
      <div
        className="overflow-hidden rounded-xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => onCategoryClick?.(categoryId)}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {videos.map((video, index) => (
            <div key={index} className="w-full flex-shrink-0" style={{ minWidth: '100%' }}>
              <div className="intro-video-item aspect-video">
                <LazyVideo
                  src={video.src}
                  poster={video.poster}
                  alt={video.alt}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {videos.length > 1 && (
        <>
          {activeSlide > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setActiveSlide(prev => prev - 1) }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center border border-border/50 hover:bg-background/90 transition-colors z-10"
              aria-label="Попереднє відео"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {activeSlide < videos.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setActiveSlide(prev => prev + 1) }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center border border-border/50 hover:bg-background/90 transition-colors z-10"
              aria-label="Наступне відео"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </>
      )}

      {/* Dots */}
      {videos.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); setActiveSlide(index) }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeSlide
                  ? 'bg-accent scale-125'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Відео ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function IntroPage({ onCategoryClick }: IntroPageProps) {
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

        {/* Category Sections - all visible, videos swipe inside each */}
        <div className="flex flex-col gap-10 max-w-3xl mx-auto mb-12">
          {categories.map((cat) => (
            <div key={cat.id} className="intro-category-section group cursor-pointer">
              <h2
                className="text-2xl md:text-3xl font-serif text-foreground mb-4 group-hover:text-accent transition-colors duration-300"
                onClick={() => onCategoryClick?.(cat.id)}
              >
                {cat.name}
              </h2>
              <VideoCarousel
                videos={cat.videos}
                onCategoryClick={onCategoryClick}
                categoryId={cat.id}
              />
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
