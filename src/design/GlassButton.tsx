import type { CSSProperties, ReactNode, MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { colors, glass, radius, shadow, font } from './tokens'
import { pressScale } from './animations'

type Variant = 'primary' | 'ghost' | 'danger'

interface GlassButtonProps {
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  variant?: Variant
  disabled?: boolean
  className?: string
  style?: CSSProperties
  fullWidth?: boolean
}

const variantStyles: Record<Variant, CSSProperties> = {
  primary: {
    background: colors.btnPrimaryBg,
    border: `0.5px solid ${colors.btnPrimaryBorder}`,
    color: colors.accent,
    boxShadow: `0 0 16px ${colors.accentGlow}, 0 2px 10px rgba(0,0,0,0.35)`,
  },
  ghost: {
    background: colors.glassBg,
    border: `0.5px solid ${colors.glassBorder}`,
    color: colors.textPrimary,
  },
  danger: {
    background: 'rgba(255, 80, 80, 0.10)',
    border: '0.5px solid rgba(255, 80, 80, 0.30)',
    color: colors.danger,
  },
}

const baseStyle: CSSProperties = {
  backdropFilter: glass.backdropFilter,
  WebkitBackdropFilter: glass.backdropFilter,
  borderRadius: radius.button,
  boxShadow: shadow.button,
  fontFamily: font.sans,
  fontWeight: font.weight.medium,
  fontSize: 15,
  padding: '10px 20px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  cursor: 'pointer',
  userSelect: 'none',
  outline: 'none',
  transition: 'opacity 0.15s ease',
}

export default function GlassButton({
  children,
  onClick,
  variant = 'ghost',
  disabled = false,
  className,
  style,
  fullWidth = false,
}: GlassButtonProps) {
  return (
    <motion.button
      className={className}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.4 : 1,
        ...style,
      }}
      variants={pressScale}
      initial="rest"
      whileTap={disabled ? undefined : 'pressed'}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}
