import type { CSSProperties } from 'react'
import { useState } from 'react'
import { colors, spacing, radius, font } from '../../design/tokens'

// ── Constants ────────────────────────────────────────────────────────────────

const FIELD_HEIGHT = 44
const LABEL_FONT_SIZE = 14
const ERROR_FONT_SIZE = 12

// ── Types ────────────────────────────────────────────────────────────────────

export interface SetupFieldProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  error?: string
  autoComplete?: string
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SetupField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
}: SetupFieldProps) {
  const [isFocused, setIsFocused] = useState(false)

  const errorId = `${id}-error`
  const hasError = Boolean(error)

  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: LABEL_FONT_SIZE,
    fontWeight: font.weight.regular,
    color: colors.textSecondary,
    marginBottom: spacing[1],
    fontFamily: font.sans,
  }

  const inputStyle: CSSProperties = {
    width: '100%',
    height: FIELD_HEIGHT,
    background: colors.glassBg,
    border: `1px solid ${hasError ? colors.danger : isFocused ? colors.glassBorderActive : colors.glassBorder}`,
    borderRadius: radius.button,
    padding: `${spacing[2]}px ${spacing[3]}px`,
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: font.sans,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const errorStyle: CSSProperties = {
    display: 'block',
    fontSize: ERROR_FONT_SIZE,
    color: colors.danger,
    marginTop: spacing[1],
    fontFamily: font.sans,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={inputStyle}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? errorId : undefined}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {hasError && (
        <span id={errorId} role="alert" style={errorStyle}>
          {error}
        </span>
      )}
    </div>
  )
}
