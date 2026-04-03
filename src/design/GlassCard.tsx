import type { CSSProperties, ReactNode, MouseEvent } from 'react'
import { colors, glass, radius, shadow } from './tokens'

interface GlassCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
  padding?: number | string
  /** Use elevated glass (slightly more opaque) for nested cards */
  elevated?: boolean
}

export default function GlassCard({
  children,
  className,
  style,
  onClick,
  padding = 16,
  elevated = false,
}: GlassCardProps) {
  const baseStyle: CSSProperties = {
    background: elevated ? colors.glassBgElevated : colors.glassBg,
    backdropFilter: glass.backdropFilter,
    WebkitBackdropFilter: glass.backdropFilter,
    border: `0.5px solid ${colors.glassBorder}`,
    borderRadius: radius.card,
    boxShadow: shadow.card,
  }

  return (
    <div
      className={className}
      style={{
        ...baseStyle,
        padding,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
