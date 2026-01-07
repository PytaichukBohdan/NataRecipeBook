'use client'

import { ChevronDown } from 'lucide-react'

interface ScrollIndicatorProps {
  visible: boolean
}

export function ScrollIndicator({ visible }: ScrollIndicatorProps) {
  if (!visible) return null

  return (
    <div className="scroll-indicator">
      <div className="scroll-indicator-content">
        <ChevronDown className="w-6 h-6 text-foreground" />
        <span className="scroll-indicator-text">Прокрутіть вниз для деталей</span>
      </div>
    </div>
  )
}
