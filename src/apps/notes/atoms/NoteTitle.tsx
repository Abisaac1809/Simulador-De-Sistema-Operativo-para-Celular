import type { CSSProperties } from 'react'
import { Typography } from '../../../design'

const TITLE_STYLE: CSSProperties = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}

interface NoteTitleProps {
  title: string
  style?: CSSProperties
}

export default function NoteTitle({ title, style }: NoteTitleProps) {
  return (
    <Typography variant="title" style={{ ...TITLE_STYLE, ...style }}>
      {title}
    </Typography>
  )
}
