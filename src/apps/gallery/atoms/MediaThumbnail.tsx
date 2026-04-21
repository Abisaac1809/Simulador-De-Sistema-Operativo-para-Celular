import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { pressScale, colors } from '../../../design'
import type { StorageFile } from '../../../types'

interface MediaThumbnailProps {
  item: StorageFile
  url: string
  onPress: () => void
}

const TILE_STYLE: CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '1 / 1',
  background: colors.glassBg,
  cursor: 'pointer',
  overflow: 'hidden',
  border: 'none',
  outline: 'none',
  padding: 0,
  margin: 0,
  display: 'block',
}

const MEDIA_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
}

const PLAY_BADGE_STYLE: CSSProperties = {
  position: 'absolute',
  left: 6,
  bottom: 6,
  width: 22,
  height: 22,
  borderRadius: 999,
  background: 'rgba(0, 0, 0, 0.55)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: 10,
  pointerEvents: 'none',
}

export default function MediaThumbnail({ item, url, onPress }: MediaThumbnailProps) {
  const isVideo = item.type === 'video'
  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={item.name}
      variants={pressScale}
      initial="rest"
      whileTap="pressed"
      onTap={onPress}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onPress()
        }
      }}
      style={TILE_STYLE}
    >
      {url ? (
        isVideo ? (
          <video
            src={url}
            muted
            playsInline
            preload="metadata"
            style={MEDIA_STYLE}
          />
        ) : (
          <img
            src={url}
            alt={item.name}
            loading="lazy"
            decoding="async"
            style={MEDIA_STYLE}
          />
        )
      ) : null}
      {isVideo && (
        <span style={PLAY_BADGE_STYLE} aria-hidden>
          <i className="fi fi-sr-play" style={{ transform: 'translateX(1px)' }} />
        </span>
      )}
    </motion.div>
  )
}
