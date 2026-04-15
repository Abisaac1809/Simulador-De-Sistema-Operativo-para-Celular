import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { colors, glass, radius, shadow, font } from '../../design/tokens'
import { pressScale } from '../../design/animations'

// ── Constants ────────────────────────────────────────────────────────────────

const BUTTON_HEIGHT = 44

// ── Inline spinner — small rotating ring for use inside buttons ───────────────

function InlineSpinner() {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 16,
        height: 16,
        border: `2px solid ${colors.accent}`,
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
      aria-hidden="true"
    />
  )
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface SetupSubmitButtonProps {
  loading: boolean
  disabled: boolean
  onClick: () => void
  labelIdle: string
  labelLoading: string
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SetupSubmitButton({
  loading,
  disabled,
  onClick,
  labelIdle,
  labelLoading,
}: SetupSubmitButtonProps) {
  const isDisabled = loading || disabled

  const buttonStyle: CSSProperties = {
    width: '100%',
    height: BUTTON_HEIGHT,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    background: colors.btnPrimaryBg,
    border: `0.5px solid ${colors.btnPrimaryBorder}`,
    color: colors.accent,
    boxShadow: `0 0 16px ${colors.accentGlow}, ${shadow.button}`,
    backdropFilter: glass.backdropFilter,
    WebkitBackdropFilter: glass.backdropFilter,
    borderRadius: radius.button,
    fontFamily: font.sans,
    fontWeight: font.weight.medium,
    fontSize: 15,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    outline: 'none',
    opacity: isDisabled ? 0.4 : 1,
    transition: 'opacity 0.15s ease',
  }

  return (
    <motion.button
      style={buttonStyle}
      variants={pressScale}
      initial="rest"
      whileTap={isDisabled ? undefined : 'pressed'}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      aria-busy={loading}
    >
      {loading && <InlineSpinner />}
      {loading ? labelLoading : labelIdle}
    </motion.button>
  )
}
