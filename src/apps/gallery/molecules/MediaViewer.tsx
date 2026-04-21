import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { Typography, colors, glass, spacing, fadeIn } from '../../../design'
import type { StorageFile } from '../../../types'

interface MediaViewerProps {
  items: StorageFile[]
  urls: Map<string, string>
  index: number
  onClose: () => void
  onIndexChange: (next: number) => void
  onDelete: (item: StorageFile) => Promise<void> | void
  onDownload: (item: StorageFile) => void
}

const ROOT_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.96)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 10,
  touchAction: 'pan-y',
}

const TOP_BAR_STYLE: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${spacing[3]}px ${spacing[3]}px`,
  background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)',
}

const BOTTOM_BAR_STYLE: CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  padding: `${spacing[3]}px ${spacing[3]}px ${spacing[4]}px`,
  background: 'linear-gradient(0deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)',
}

const ICON_BUTTON_STYLE: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 999,
  border: `0.5px solid ${colors.glassBorder}`,
  background: colors.glassBg,
  backdropFilter: glass.backdropFilter,
  WebkitBackdropFilter: glass.backdropFilter,
  color: colors.textPrimary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: 0,
  fontSize: 16,
}

const DANGER_ICON_STYLE: CSSProperties = {
  ...ICON_BUTTON_STYLE,
  color: colors.danger,
  background: 'rgba(255, 80, 80, 0.08)',
  border: '0.5px solid rgba(255, 80, 80, 0.28)',
}

const STAGE_STYLE: CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
}

const MEDIA_STYLE: CSSProperties = {
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  display: 'block',
}

function formatMeta(ts: number): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(ts))
}

const SWIPE_THRESHOLD = 60
const DISMISS_THRESHOLD = 90

export default function MediaViewer({
  items,
  urls,
  index,
  onClose,
  onIndexChange,
  onDelete,
  onDownload,
}: MediaViewerProps) {
  const [chromeVisible, setChromeVisible] = useState(true)

  const item = items[index]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && index > 0) onIndexChange(index - 1)
      else if (e.key === 'ArrowRight' && index < items.length - 1) onIndexChange(index + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, items.length, onClose, onIndexChange])

  useEffect(() => {
    if (!chromeVisible) return
    const t = setTimeout(() => setChromeVisible(false), 2800)
    return () => clearTimeout(t)
  }, [chromeVisible, index])

  if (!item) return null
  const url = urls.get(item.path) ?? ''

  const handleDrag = (_: unknown, info: PanInfo) => {
    if (info.offset.y > DISMISS_THRESHOLD && Math.abs(info.offset.y) > Math.abs(info.offset.x)) {
      onClose()
      return
    }
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
      if (info.offset.x < 0 && index < items.length - 1) onIndexChange(index + 1)
      else if (info.offset.x > 0 && index > 0) onIndexChange(index - 1)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this item? This cannot be undone.')
    if (!confirmed) return
    await onDelete(item)
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
      style={ROOT_STYLE}
      onClick={() => setChromeVisible((v) => !v)}
    >
      <AnimatePresence>
        {chromeVisible && (
          <motion.div
            key="top"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            style={TOP_BAR_STYLE}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              style={ICON_BUTTON_STYLE}
              onClick={onClose}
            >
              <i className="fi fi-rr-cross-small" style={{ fontSize: 18 }} />
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="label" style={{ color: colors.textPrimary }}>
                {index + 1} / {items.length}
              </Typography>
              <Typography variant="caption" style={{ color: colors.textSecondary }}>
                {formatMeta(item.createdAt)}
              </Typography>
            </div>
            <div style={{ width: 44 }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={STAGE_STYLE}>
        <motion.div
          key={item.path}
          drag={items.length > 1 ? 'x' : 'y'}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.3}
          onDragEnd={handleDrag}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {item.type === 'video' ? (
            <video src={url} controls playsInline style={MEDIA_STYLE} />
          ) : (
            <img src={url} alt={item.name} style={MEDIA_STYLE} draggable={false} />
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {chromeVisible && (
          <motion.div
            key="bottom"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            style={BOTTOM_BAR_STYLE}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Download"
              style={ICON_BUTTON_STYLE}
              onClick={() => onDownload(item)}
            >
              <i className="fi fi-rr-download" style={{ fontSize: 16 }} />
            </button>
            <button
              type="button"
              aria-label="Delete"
              style={DANGER_ICON_STYLE}
              onClick={handleDelete}
            >
              <i className="fi fi-rr-trash" style={{ fontSize: 16 }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
