import type { CSSProperties } from 'react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Typography, colors, spacing, fadeIn } from '../../design'
import { useGallery } from './hooks/useGallery'
import EmptyState from './atoms/EmptyState'
import PhotoGrid from './molecules/PhotoGrid'
import MediaViewer from './molecules/MediaViewer'
import type { StorageFile } from '../../types'

const ROOT_STYLE: CSSProperties = {
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: colors.bg,
}

const HEADER_STYLE: CSSProperties = {
  padding: `${spacing[4]}px ${spacing[4]}px ${spacing[2]}px`,
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  flexShrink: 0,
}

const LOADING_STYLE: CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export default function GalleryApp() {
  const { items, grouped, urls, loading, remove, download } = useGallery()
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  const closeViewer = () => setViewerIndex(null)

  const handleDelete = async (item: StorageFile) => {
    const remaining = items.length - 1
    if (remaining <= 0) {
      setViewerIndex(null)
    } else if (viewerIndex !== null && viewerIndex >= remaining) {
      setViewerIndex(remaining - 1)
    }
    await remove(item.path)
  }

  return (
    <div style={ROOT_STYLE}>
      <div style={HEADER_STYLE}>
        <Typography variant="title">Photos</Typography>
        {items.length > 0 && (
          <Typography variant="caption" style={{ color: colors.textSecondary }}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Typography>
        )}
      </div>

      {loading ? (
        <div style={LOADING_STYLE}>
          <span className="app-spinner" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          <PhotoGrid
            sections={grouped}
            urls={urls}
            onOpen={(idx) => setViewerIndex(idx)}
          />
        </motion.div>
      )}

      <AnimatePresence>
        {viewerIndex !== null && items[viewerIndex] && (
          <MediaViewer
            key="viewer"
            items={items}
            urls={urls}
            index={viewerIndex}
            onClose={closeViewer}
            onIndexChange={setViewerIndex}
            onDelete={handleDelete}
            onDownload={download}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
