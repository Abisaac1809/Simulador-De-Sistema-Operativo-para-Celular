import type { CSSProperties } from 'react'
import { GlassButton, colors, font } from '../../../design'

type KeyVariant = 'digit' | 'operator' | 'action' | 'equals'

interface CalcKeyProps {
  label: string
  onPress: () => void
  variant: KeyVariant
  wide?: boolean
  active?: boolean
}

const KEY_STYLES: Record<KeyVariant, CSSProperties> = {
  digit: {
    background: colors.glassBg,
    border: `0.5px solid ${colors.glassBorder}`,
    color: colors.textPrimary,
  },
  operator: {
    background: 'rgba(96, 144, 255, 0.22)',
    border: '0.5px solid rgba(96, 144, 255, 0.4)',
    color: colors.accentBlue,
  },
  action: {
    background: colors.glassBgElevated,
    border: `0.5px solid ${colors.glassBorder}`,
    color: colors.textPrimary,
  },
  equals: {
    background: 'linear-gradient(135deg, rgba(94,106,210,0.55) 0%, rgba(96,144,255,0.45) 100%)',
    border: '0.5px solid rgba(94,106,210,0.5)',
    color: colors.textPrimary,
    boxShadow: '0 0 20px rgba(94, 106, 210, 0.30), 0 2px 10px rgba(0,0,0,0.40)',
  },
}

const ACTIVE_OPERATOR_STYLE: CSSProperties = {
  background: 'rgba(96, 144, 255, 0.40)',
}

const LABEL_STYLE: CSSProperties = {
  fontSize: 22,
  fontWeight: font.weight.regular,
  lineHeight: 1,
}

export default function CalcKey({ label, onPress, variant, wide, active }: CalcKeyProps) {
  const variantStyle = KEY_STYLES[variant]
  const activeStyle = active && variant === 'operator' ? ACTIVE_OPERATOR_STYLE : {}
  const wideStyle: CSSProperties = wide
    ? { gridColumn: 'span 2', width: '100%' }
    : {}

  return (
    <GlassButton
      variant="ghost"
      onClick={onPress}
      fullWidth={wide}
      style={{
        ...variantStyle,
        ...activeStyle,
        ...wideStyle,
        padding: '18px 10px',
        borderRadius: 16,
        minHeight: 64,
      }}
    >
      <span style={LABEL_STYLE}>{label}</span>
    </GlassButton>
  )
}
