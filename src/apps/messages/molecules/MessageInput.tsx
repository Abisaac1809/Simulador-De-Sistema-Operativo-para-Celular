import type { CSSProperties } from 'react'
import { GlassButton, colors, font, radius, spacing } from '../../../design'

const WRAPPER_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  gap: spacing[2],
  padding: spacing[3],
  borderTop: `1px solid ${colors.glassBorder}`,
  flexShrink: 0,
}

const TEXTAREA_STYLE: CSSProperties = {
  flex: 1,
  background: colors.glassBg,
  border: `1px solid ${colors.glassBorder}`,
  borderRadius: radius.button,
  padding: `${spacing[2]}px ${spacing[3]}px`,
  color: colors.textPrimary,
  fontSize: 15,
  fontFamily: font.sans,
  outline: 'none',
  resize: 'none',
  lineHeight: 1.5,
  minHeight: 40,
  maxHeight: 120,
  overflowY: 'auto',
}

interface MessageInputProps {
  text: string
  onChange: (v: string) => void
  onSend: () => void
}

export default function MessageInput({ text, onChange, onSend }: MessageInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div style={WRAPPER_STYLE}>
      <textarea
        style={TEXTAREA_STYLE}
        value={text}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message…"
        rows={1}
      />
      <GlassButton
        variant="primary"
        onClick={onSend}
        disabled={text.trim() === ''}
      >
        <i className="fi fi-rr-paper-plane" />
      </GlassButton>
    </div>
  )
}
