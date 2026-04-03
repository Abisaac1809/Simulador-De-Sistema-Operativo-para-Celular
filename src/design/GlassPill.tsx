import type { CSSProperties, ReactNode, MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { colors, glass, radius, font } from './tokens'
import { pressScale } from './animations'

interface GlassPillProps {
  children: ReactNode
  active?: boolean
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  className?: string
  style?: CSSProperties
}

const baseStyle: CSSProperties = {
  borderRadius: radius.pill,
  fontFamily: font.sans,
  fontWeight: font.weight.medium,
  fontSize: 14,
  padding: '6px 16px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  outline: 'none',
  transition: 'color 0.15s ease',
  whiteSpace: 'nowrap',
}

const activeStyle: CSSProperties = {
  background: colors.glassBgActive,
  backdropFilter: glass.backdropFilter,
  WebkitBackdropFilter: glass.backdropFilter,
  border: `0.5px solid ${colors.glassBorderActive}`,
  color: colors.textPrimary,
}

const inactiveStyle: CSSProperties = {
  background: 'transparent',
  border: '0.5px solid transparent',
  color: colors.textMuted,
}

export default function GlassPill({
  children,
  active = false,
  onClick,
  className,
  style,
}: GlassPillProps) {
  return (
    <motion.button
      className={className}
      style={{
        ...baseStyle,
        ...(active ? activeStyle : inactiveStyle),
        ...style,
      }}
      variants={pressScale}
      initial="rest"
      whileTap="pressed"
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}
