import type { CSSProperties } from 'react'
import { colors, font, radius, spacing } from '../../../design'

const WRAPPER_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing[2],
  background: colors.glassBg,
  border: `1px solid ${colors.glassBorder}`,
  borderRadius: radius.button,
  padding: `${spacing[2]}px ${spacing[3]}px`,
}

const SEARCH_ICON_STYLE: CSSProperties = {
  color: colors.textMuted,
  fontSize: 14,
  flexShrink: 0,
}

const INPUT_STYLE: CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: colors.textPrimary,
  fontSize: 14,
  fontFamily: font.sans,
}

interface SearchInputProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export default function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div style={WRAPPER_STYLE}>
      <i className="fi fi-rr-search" style={SEARCH_ICON_STYLE} />
      <input
        style={INPUT_STYLE}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search conversations…'}
      />
    </div>
  )
}
