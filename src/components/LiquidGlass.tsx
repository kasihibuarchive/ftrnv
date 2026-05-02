'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LiquidGlassProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'strong' | 'subtle' | 'glow'
  hover?: boolean
  onClick?: () => void
}

const variantClasses = {
  default: 'liquid-glass',
  strong: 'liquid-glass-strong',
  subtle: 'liquid-glass-subtle',
  glow: 'liquid-glass-glow',
}

export default function LiquidGlass({
  children,
  className,
  variant = 'default',
  hover = false,
  onClick,
}: LiquidGlassProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        variantClasses[variant],
        hover && 'transition-all duration-500 hover:bg-white/15 hover:border-white/30 hover:shadow-lg hover:shadow-forest-500/10 hover:scale-[1.02]',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
