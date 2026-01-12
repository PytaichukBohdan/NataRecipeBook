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
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Auto-play video when component mounts
  useEffect(() => {
    const video = videoRef.current
    if (video && src) {
      video.play().catch(() => {})
    }
  }, [src])

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

      {/* Always render video - load immediately */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={handleLoadedData}
        onError={handleError}
        className={`absolute inset-0 w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      />
    </div>
  )
}

export const LazyVideo = memo(LazyVideoComponent)
