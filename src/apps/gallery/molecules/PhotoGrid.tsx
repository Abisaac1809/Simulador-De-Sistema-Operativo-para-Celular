import type { CSSProperties } from 'react'
import DateHeader from '../atoms/DateHeader'
import MediaThumbnail from '../atoms/MediaThumbnail'
import type { GallerySection } from '../hooks/useGallery'
import type { StorageFile } from '../../../types'

interface PhotoGridProps {
  sections: GallerySection[]
  urls: Map<string, string>
  onOpen: (globalIndex: number) => void
}

const SCROLL_STYLE: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingBottom: 24,
}

const GRID_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 2,
}

export default function PhotoGrid({ sections, urls, onOpen }: PhotoGridProps) {
  const sectionStarts = sections.reduce<number[]>((acc, _section, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + sections[i - 1].items.length)
    return acc
  }, [])

  return (
    <div style={SCROLL_STYLE}>
      {sections.map((section, secIdx) => {
        const sectionStart = sectionStarts[secIdx]
        return (
          <div key={`${section.label}-${sectionStart}`}>
            <DateHeader label={section.label} />
            <div style={GRID_STYLE}>
              {section.items.map((item: StorageFile, idx) => {
                const globalIdx = sectionStart + idx
                const url = urls.get(item.path) ?? ''
                return (
                  <MediaThumbnail
                    key={item.path}
                    item={item}
                    url={url}
                    onPress={() => onOpen(globalIdx)}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
