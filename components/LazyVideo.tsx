'use client'

import { useEffect, useRef, useState, memo } from 'react'

interface LazyVideoProps {
  src: string
  poster?: string
  alt: string
  className?: string
  fadeTransition?: boolean // Enable fade out/in on loop
  startDelay?: number // Milliseconds to hold poster before starting video playback
}

function LazyVideoComponent({ src, poster, alt, className = '', fadeTransition = true, startDelay = 0 }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [videoOpacity, setVideoOpacity] = useState(1)
  const [isDelayComplete, setIsDelayComplete] = useState(startDelay === 0)
  const animationFrameRef = useRef<number | null>(null)

  const FADE_DURATION = 0.8 // seconds for fade in/out

  // Start delay: hold poster image visible before beginning video playback
  useEffect(() => {
    if (startDelay === 0) {
      setIsDelayComplete(true)
      return
    }

    const timer = setTimeout(() => {
      setIsDelayComplete(true)
    }, startDelay)

    return () => clearTimeout(timer)
  }, [startDelay])

  // Smooth opacity animation loop
  useEffect(() => {
    if (!fadeTransition || !isLoaded) return

    const updateOpacity = () => {
      const video = videoRef.current
      if (!video || !video.duration) {
        animationFrameRef.current = requestAnimationFrame(updateOpacity)
        return
      }

      const currentTime = video.currentTime
      const duration = video.duration
      const timeRemaining = duration - currentTime

      let opacity = 1

      // Fade in at the start
      if (currentTime < FADE_DURATION) {
        opacity = currentTime / FADE_DURATION
      }
      // Fade out at the end
      else if (timeRemaining < FADE_DURATION) {
        opacity = timeRemaining / FADE_DURATION
      }

      // Clamp and apply
      opacity = Math.max(0, Math.min(1, opacity))
      setVideoOpacity(opacity)

      animationFrameRef.current = requestAnimationFrame(updateOpacity)
    }

    animationFrameRef.current = requestAnimationFrame(updateOpacity)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [fadeTransition, isLoaded])

  // Auto-play video when component mounts and delay is complete
  useEffect(() => {
    const video = videoRef.current
    if (video && src && isDelayComplete) {
      video.play().catch(() => {})
    }
  }, [src, isDelayComplete])

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
      {/* Always show poster as background - visible during fade transitions */}
      {poster && (
        <img
          src={poster}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Video with dynamic opacity for smooth fade in/out */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={handleLoadedData}
        onError={handleError}
        style={{ opacity: videoOpacity }}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  )
}

export const LazyVideo = memo(LazyVideoComponent)
