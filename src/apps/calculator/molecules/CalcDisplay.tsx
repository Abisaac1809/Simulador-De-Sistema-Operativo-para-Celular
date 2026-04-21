import type { CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { colors, font } from '../../../design'

interface CalcDisplayProps {
  expression: string
  display: string
}

const ROOT_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  padding: '0 24px 16px',
  minHeight: 140,
  gap: 4,
}

const EXPRESSION_STYLE: CSSProperties = {
  fontFamily: font.sans,
  fontSize: 16,
  fontWeight: font.weight.regular,
  color: colors.textSecondary,
  minHeight: 20,
  letterSpacing: 0.5,
}

const DISPLAY_STYLE: CSSProperties = {
  fontFamily: font.sans,
  fontWeight: font.weight.thin,
  color: colors.textPrimary,
  lineHeight: 1,
  letterSpacing: -2,
}

function resolveDisplayFontSize(value: string): number {
  if (value.length <= 6) return 72
  if (value.length <= 9) return 52
  if (value.length <= 12) return 40
  return 30
}

export default function CalcDisplay({ expression, display }: CalcDisplayProps) {
  const fontSize = resolveDisplayFontSize(display)

  return (
    <div style={ROOT_STYLE}>
      <AnimatePresence mode="popLayout">
        {expression.length > 0 && (
          <motion.span
            key="expression"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={EXPRESSION_STYLE}
          >
            {expression}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.span
        key={display}
        initial={{ scale: 0.92, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={{ ...DISPLAY_STYLE, fontSize }}
      >
        {display}
      </motion.span>
    </div>
  )
}
