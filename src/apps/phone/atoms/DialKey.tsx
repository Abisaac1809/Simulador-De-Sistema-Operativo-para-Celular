import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { GlassCard, Typography, colors, radius, font } from '../../../design'

interface Props {
  digit: string
  subLabel?: string
  onPress: (digit: string) => void
}

const keyStyle: CSSProperties = {
  width: 64,
  height: 64,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
  borderRadius: radius.pill,
  background: colors.glassBg,
  cursor: 'pointer',
  userSelect: 'none',
}

export default function DialKey({ digit, subLabel, onPress }: Props) {
  return (
    <motion.div
      style={keyStyle}
      whileTap={{ scale: 0.92 }}
      onClick={() => onPress(digit)}
    >
      <GlassCard padding={0} style={{ background: 'transparent', boxShadow: 'none', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <Typography variant="body" style={{ fontSize: 16, fontWeight: font.weight.semibold, lineHeight: 1 }}>
          {digit}
        </Typography>
        {subLabel && (
          <Typography variant="caption" style={{ fontSize: 12, color: colors.textMuted, lineHeight: 1 }}>
            {subLabel}
          </Typography>
        )}
      </GlassCard>
    </motion.div>
  )
}
