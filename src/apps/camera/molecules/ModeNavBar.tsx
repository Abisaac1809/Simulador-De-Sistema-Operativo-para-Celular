import type { CSSProperties } from 'react'
import { colors, glass, radius, spacing } from '../../../design'
import ModeLabel from '../atoms/ModeLabel'

export type CameraMode = 'photo' | 'video'

interface ModeNavBarProps {
  mode: CameraMode
  onChange: (mode: CameraMode) => void
}

const WRAPPER_STYLE: CSSProperties = {
  display: 'inline-flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: spacing[1],
  gap: spacing[1],
  borderRadius: radius.pill,
  background: colors.glassBgActive,
  backdropFilter: glass.backdropFilter,
  WebkitBackdropFilter: glass.backdropFilter,
  border: `0.5px solid ${colors.glassBorderActive}`,
}

export default function ModeNavBar({ mode, onChange }: ModeNavBarProps) {
  return (
    <div style={WRAPPER_STYLE}>
      <ModeLabel
        label="Foto"
        active={mode === 'photo'}
        onClick={() => onChange('photo')}
      />
      <ModeLabel
        label="Video"
        active={mode === 'video'}
        onClick={() => onChange('video')}
      />
    </div>
  )
}
