import type { CSSProperties, ReactNode, ElementType } from 'react'
import { colors, font } from './tokens'

type TypographyVariant =
  | 'time'      // 76px / weight 200 — clock display
  | 'title'     // 22px / weight 600
  | 'body'      // 16px / weight 400
  | 'label'     // 14px / weight 500
  | 'caption'   // 12px / weight 400
  | 'muted'     // 12px / weight 400, muted color

interface TypographyProps {
  variant?: TypographyVariant
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: ElementType
}

type VariantStyle = {
  fontSize: number
  fontWeight: number
  color: string
  lineHeight: number | string
  letterSpacing?: string | number
}

const variantStyles: Record<TypographyVariant, VariantStyle> = {
  time: {
    fontSize: 76,
    fontWeight: font.weight.thin,
    color: colors.textPrimary,
    lineHeight: 1,
    letterSpacing: '-2px',
  },
  title: {
    fontSize: 22,
    fontWeight: font.weight.semibold,
    color: colors.textPrimary,
    lineHeight: 1.2,
    letterSpacing: '-0.3px',
  },
  body: {
    fontSize: 16,
    fontWeight: font.weight.regular,
    color: colors.textPrimary,
    lineHeight: 1.5,
  },
  label: {
    fontSize: 14,
    fontWeight: font.weight.medium,
    color: colors.textSecondary,
    lineHeight: 1.4,
  },
  caption: {
    fontSize: 12,
    fontWeight: font.weight.regular,
    color: colors.textSecondary,
    lineHeight: 1.4,
  },
  muted: {
    fontSize: 12,
    fontWeight: font.weight.regular,
    color: colors.textMuted,
    lineHeight: 1.4,
  },
}

const defaultTags: Record<TypographyVariant, ElementType> = {
  time: 'span',
  title: 'h2',
  body: 'p',
  label: 'span',
  caption: 'span',
  muted: 'span',
}

export default function Typography({
  variant = 'body',
  children,
  className,
  style,
  as,
}: TypographyProps) {
  const Tag = as ?? defaultTags[variant]
  const varStyle = variantStyles[variant]

  return (
    <Tag
      className={className}
      style={{
        fontFamily: font.sans,
        ...varStyle,
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}
