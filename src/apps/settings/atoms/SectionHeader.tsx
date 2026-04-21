import type { CSSProperties } from 'react'
import { Typography, colors, spacing } from '../../../design'

const STYLE: CSSProperties = {
  padding: `${spacing[4]}px 0 ${spacing[2]}px`,
}

interface SectionHeaderProps {
  title: string
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div style={STYLE}>
      <Typography variant="label" style={{ color: colors.textSecondary, textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 }}>
        {title}
      </Typography>
    </div>
  )
}
