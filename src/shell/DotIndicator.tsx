import { motion } from 'framer-motion'
import { colors } from '../design/tokens'

interface DotIndicatorProps {
  total: number
  active: number
}

export default function DotIndicator({ total, active }: DotIndicatorProps) {
  if (total <= 1) return null

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 8,
      }}
      role="tablist"
      aria-label="Pages"
    >
      {Array.from({ length: total }, (_, i) => {
        const isActive = i === active
        return (
          <motion.div
            key={i}
            role="tab"
            aria-selected={isActive}
            aria-label={`Page ${i + 1}`}
            animate={{
              width: isActive ? 14 : 6,
              opacity: isActive ? 1 : 0.4,
              backgroundColor: isActive ? colors.textPrimary : colors.textMuted,
            }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: 6,
              borderRadius: 100,
            }}
          />
        )
      })}
    </div>
  )
}
