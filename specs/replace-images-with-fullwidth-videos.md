# Plan: Replace Recipe Images with Full-Width Videos

## Task Description

Replace static recipe images with animated videos on each recipe page. The videos should be full-width (edge-to-edge) instead of the current constrained image size. Additionally, remove the "Спосіб приготування" (cooking instructions) section, keeping only the ingredients section. Implement smart lazy loading to prevent memory issues as users scroll through recipes.

## Objective

When this plan is complete:
1. Each recipe displays its corresponding video (full-width, edge-to-edge) instead of a static image
2. Videos lazy-load as the user scrolls to prevent memory issues
3. The "Спосіб приготування" section is removed; only ingredients remain
4. The layout is adjusted for a single-column ingredients display

## Problem Statement

Currently, recipe pages display static images constrained to `max-w-2xl` (448px) with centered layout. The application has 65 generated video files in `/public/recipe_images/videos/` that are not being used. Users would benefit from animated recipe content, but loading all videos at once would cause memory issues. Additionally, the cooking instructions section is not needed and should be removed.

## Solution Approach

1. **Create a LazyVideo component** that uses IntersectionObserver to only load videos when they enter the viewport
2. **Add video path derivation utility** to map image paths to video paths (same naming convention, different directory)
3. **Modify RecipeCard** to display full-width video instead of constrained image
4. **Remove instructions section** and adjust grid layout to single column
5. **Add CSS for full-width video breakout** using the viewport width technique

## Relevant Files

Use these files to complete the task:

- **`/components/RecipeCard.tsx`** (lines 99-254) - Main component displaying recipe hero image and content sections. Replace Image with video, remove instructions section at lines 210-238
- **`/lib/recipe-loader.ts`** (lines 36-51) - Contains `normalizeImagePath()` utility. Add `deriveVideoPath()` function here
- **`/types/recipe.ts`** (lines 11-18) - Recipe interface definition. No changes needed (video path derived from image path)
- **`/app/globals.css`** (lines 98-184) - Custom recipe layout styles. Add full-width video container styles
- **`/public/recipe_images/videos/`** - Contains all 65 video files (breakfast_1-20.mp4, lunch_dinner_1-25.mp4, desserts_1-20.mp4)

### New Files

- **`/components/LazyVideo.tsx`** - New component for lazy-loaded video with IntersectionObserver

## Implementation Phases

### Phase 1: Foundation
- Create the `deriveVideoPath()` utility function
- Create the `LazyVideo` component with IntersectionObserver
- Add full-width video CSS styles

### Phase 2: Core Implementation
- Modify RecipeCard to replace Image with LazyVideo
- Remove the instructions section (lines 210-238)
- Change grid layout from 2-column to single-column

### Phase 3: Integration & Polish
- Test video lazy loading behavior
- Verify memory usage with browser DevTools
- Test on mobile devices for autoplay compatibility
- Ensure fallback to image if video fails to load

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### 1. Add deriveVideoPath Utility Function

In `/lib/recipe-loader.ts` after line 51, add:

```typescript
/**
 * Derives video path from image path
 * Converts "/recipe_images/breakfast_1.jpeg" to "/recipe_images/videos/breakfast_1.mp4"
 * @param imagePath - The normalized image path (already processed by normalizeImagePath)
 * @returns Video path for the recipe
 */
export function deriveVideoPath(imagePath: string): string {
  if (!imagePath || imagePath === "/placeholder.svg") return ""

  // Insert /videos before the filename and change extension to .mp4
  const lastSlash = imagePath.lastIndexOf('/')
  const directory = imagePath.substring(0, lastSlash)
  const filename = imagePath.substring(lastSlash + 1)

  // Change extension to .mp4
  const videoFilename = filename.replace(/\.(jpeg|jpg|png|webp)$/i, '.mp4')

  return `${directory}/videos/${videoFilename}`
}
```

### 2. Create LazyVideo Component

Create new file `/components/LazyVideo.tsx`:

```typescript
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
      <div ref={containerRef} className={className}>
        {poster && (
          <img
            src={poster}
            alt={alt}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={className}>
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
          className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        />
      )}
    </div>
  )
}

export const LazyVideo = memo(LazyVideoComponent)
```

### 3. Add Full-Width Video CSS Styles

In `/app/globals.css` after line 184 (after `.nutrition-fiber`), add:

```css
/* Full-width video container - breaks out of parent constraints */
.recipe-video-container {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: oklch(0.15 0 0);
}

.recipe-video-container video,
.recipe-video-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Loading placeholder for video */
.recipe-video-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: oklch(0.95 0 0);
}

.recipe-video-loading::after {
  content: '';
  width: 40px;
  height: 40px;
  border: 3px solid oklch(0.8 0 0);
  border-top-color: oklch(0.4 0 0);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 4. Update RecipeCard to Use LazyVideo

In `/components/RecipeCard.tsx`:

**4.1. Add imports at top of file (after line 7):**
```typescript
import { LazyVideo } from '@/components/LazyVideo'
import { deriveVideoPath } from '@/lib/recipe-loader'
```

**4.2. Add video path derivation (after line 63):**
```typescript
const videoPath = deriveVideoPath(imagePath)
```

**4.3. Replace the image section (lines 129-141) with:**
```tsx
<div className="recipe-video-container">
  <LazyVideo
    src={videoPath}
    poster={imagePath}
    alt={recipe.title}
    className="absolute inset-0"
  />
</div>
```

### 5. Remove Instructions Section

In `/components/RecipeCard.tsx`:

**5.1. Delete lines 210-238** (the entire instructions column including the `{/* Right Column - Instructions */}` comment)

**5.2. Change grid layout on line 163 from:**
```tsx
<div className="grid lg:grid-cols-2 gap-16">
```
To:
```tsx
<div className="max-w-2xl mx-auto">
```

**5.3. Remove the closing `</div>` that paired with the removed instructions column** (the one after line 207's `</div>`)

### 6. Remove Instruction-Related Stats Badge

In `/components/RecipeCard.tsx`:

**6.1. Remove lines 122-125** (the instruction stats badge):
```tsx
<div className={`recipe-stat-badge ${stats.hasInstructions ? 'stat-badge-success' : 'stat-badge-info'}`}>
  <span className="stat-icon">{stats.hasInstructions ? '📖' : '⚡'}</span>
  <span>{stats.instructionLabel}</span>
</div>
```

**6.2. Simplify the `getRecipeStats` function** (lines 49-60) - remove instruction-related logic:
```typescript
function getRecipeStats(recipe: Recipe) {
  const ingredientCount = recipe.ingredients.length
  return {
    ingredientCount,
    ingredientLabel: `${ingredientCount} ${ingredientCount === 1 ? 'інгредієнт' : ingredientCount < 5 ? 'інгредієнти' : 'інгредієнтів'}`
  }
}
```

### 7. Update Section Title

In `/components/RecipeCard.tsx`, line 159:

Change from:
```tsx
<h3 className="text-4xl font-serif text-foreground mb-4">Рецепт приготування</h3>
```
To:
```tsx
<h3 className="text-4xl font-serif text-foreground mb-4">Інгредієнти</h3>
```

### 8. Clean Up Unused CSS

In `/app/globals.css`, the `.empty-instructions-message` styles (lines 331-363) can optionally be removed since instructions are no longer displayed.

### 9. Validate the Implementation

- Run `npm run dev` to start the development server
- Navigate through multiple recipes to verify:
  - Videos load lazily (check Network tab in DevTools)
  - Videos are full-width (edge-to-edge)
  - Only ingredients are displayed (no instructions section)
  - Memory usage is stable (check Performance tab)
- Test on mobile viewport sizes
- Verify fallback to image when video fails

## Testing Strategy

1. **Lazy Loading Test**:
   - Open DevTools Network tab
   - Navigate to recipe book
   - Verify videos only load when scrolling near them
   - Check that videos pause when scrolled out of view

2. **Memory Test**:
   - Open DevTools Performance tab
   - Navigate through 10+ recipes
   - Verify memory doesn't grow unbounded

3. **Mobile Test**:
   - Test on iOS Safari and Android Chrome
   - Verify videos autoplay (requires muted attribute)
   - Verify full-width display on various screen sizes

4. **Fallback Test**:
   - Temporarily rename a video file
   - Verify poster image displays as fallback
   - Check console for error handling

## Acceptance Criteria

- [ ] All 65 recipes display their corresponding videos
- [ ] Videos are full-width (100vw, edge-to-edge)
- [ ] Videos lazy-load when entering viewport (not on initial page load)
- [ ] Videos pause when scrolled out of view (memory optimization)
- [ ] "Спосіб приготування" section is completely removed
- [ ] Only ingredients section remains, centered layout
- [ ] Fallback to image works when video fails to load
- [ ] No memory leaks when navigating through multiple recipes
- [ ] Videos autoplay with muted, loop, and playsInline attributes
- [ ] Works on both desktop and mobile browsers

## Validation Commands

Execute these commands to validate the task is complete:

- `npm run dev` - Start development server and manually test
- `npm run build` - Ensure build completes without errors
- `npm run lint` - Check for any linting issues
- Open browser DevTools → Network → Disable cache → Navigate recipes → Verify lazy loading
- Open browser DevTools → Performance → Record → Navigate 10+ recipes → Check memory graph

## Notes

- Video files average 8-13MB each. Lazy loading is critical to prevent loading all 65 videos (~600MB) at once
- The IntersectionObserver API has excellent browser support (96%+)
- iOS Safari requires `playsInline` attribute for inline video playback
- All videos are 5-second loops showing ingredient explosion animation
- Consider adding `prefers-reduced-motion` media query to disable autoplay for users who prefer reduced motion
- Future enhancement: Add a toggle button to switch between video and static image view
