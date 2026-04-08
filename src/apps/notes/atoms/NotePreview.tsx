import type { CSSProperties } from 'react'
import { Typography } from '../../../design'

const CLAMP_STYLE: CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}

interface NotePreviewProps {
  body: string
  style?: CSSProperties
}

export default function NotePreview({ body, style }: NotePreviewProps) {
  return (
    <Typography variant="caption" style={{ ...CLAMP_STYLE, ...style }}>
      {body}
    </Typography>
  )
}
