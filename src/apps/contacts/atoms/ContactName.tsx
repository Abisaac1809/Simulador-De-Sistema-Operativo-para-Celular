import type { CSSProperties } from 'react'
import { Typography } from '../../../design'

const ELLIPSIS_STYLE: CSSProperties = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}

interface ContactNameProps {
  name: string
  style?: CSSProperties
}

export default function ContactName({ name, style }: ContactNameProps) {
  return (
    <Typography variant="body" style={{ ...ELLIPSIS_STYLE, ...style }}>
      {name}
    </Typography>
  )
}
