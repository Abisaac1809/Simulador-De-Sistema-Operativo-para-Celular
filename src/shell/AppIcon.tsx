import { motion } from 'framer-motion'
import { IconWrapper, Typography } from '../design'
import type { AppManifest } from '../types'
import { spacing } from '../design/tokens'

interface AppIconProps {
  manifest: AppManifest
  onTap: (id: string) => void
  size?: number
  isEditing?: boolean
  hideLabel?: boolean
}

export default function AppIcon({ manifest, onTap, size = 56, isEditing = false, hideLabel = false }: AppIconProps) {
  return (
    <motion.div
      animate={isEditing ? {
        rotate: [-1.5, 1.5, -1.5, 1.5, -1.5],
        transition: { duration: 0.45, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
      } : { rotate: 0 }}
      whileTap={isEditing ? undefined : { scale: 0.88, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
      onClick={() => { if (!isEditing) onTap(manifest.id) }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing[1],
        cursor: isEditing ? 'grab' : 'pointer',
        userSelect: 'none',
        minWidth: 44,
        minHeight: 44,
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'none',
      }}
      role="button"
      aria-label={`Open ${manifest.name}`}
    >
      <IconWrapper color={manifest.color} size={size}>
        {manifest.icon}
      </IconWrapper>
      {!hideLabel && (
        <Typography
          variant="muted"
          style={{
            fontSize: 11,
            textAlign: 'center',
            maxWidth: size + 8,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {manifest.name}
        </Typography>
      )}
    </motion.div>
  )
}
