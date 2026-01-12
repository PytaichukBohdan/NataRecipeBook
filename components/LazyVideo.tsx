'use client'

import { useEffect, useRef, useState, memo } from 'react'

interface LazyVideoProps {
  src: string
  poster?: string
  alt: string
  className?: string
}

function LazyVideoComponent({ src, poster, alt, className = '' }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.1
      }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // Pause video when not visible (memory optimization)
  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container || !isLoaded) return

    const pauseObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.1 }
    )

    pauseObserver.observe(container)
    return () => pauseObserver.disconnect()
  }, [isLoaded])

  const handleLoadedData = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
  }

  // Fallback to poster image if video fails or hasn't loaded yet
  if (hasError || !src) {
    return (
      <div ref={containerRef} className={`${className} w-full h-full`}>
        {poster && (
          <img
            src={poster}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`${className} w-full h-full`}>
      {/* Show poster while video loads */}
      {!isLoaded && poster && (
        <img
          src={poster}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Only render video element when visible */}
      {isVisible && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={handleLoadedData}
          onError={handleError}
          className={`absolute inset-0 w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        />
      )}
    </div>
  )
}

export const LazyVideo = memo(LazyVideoComponent)
