import type { CSSProperties, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { colors, radius, font, animation, pressScale } from '../../../design'
import type { BrowserControls } from '../hooks/useBrowser'

interface AddressBarProps {
  controls: BrowserControls
}

const CONTAINER_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  background: 'rgba(255,255,255,0.04)',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
  flexShrink: 0,
}

const NAV_BTN_BASE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: radius.small,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  flexShrink: 0,
  transition: `background ${animation.duration.fast}s`,
  fontSize: 15,
}

const ADDRESS_INPUT_WRAPPER: CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: radius.pill,
  padding: '0 12px',
  height: 34,
  overflow: 'hidden',
}

const ADDRESS_INPUT_STYLE: CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: colors.textPrimary,
  fontFamily: font.sans,
  fontSize: 12,
  fontWeight: font.weight.regular,
}

const GLOBE_ICON_STYLE: CSSProperties = {
  fontSize: 12,
  color: colors.textMuted,
  flexShrink: 0,
}

function NavButton({
  icon,
  disabled,
  onClick,
  title,
}: {
  icon: string
  disabled: boolean
  onClick: () => void
  title: string
}) {
  return (
    <motion.button
      variants={pressScale}
      initial="rest"
      whileTap="pressed"
      style={{
        ...NAV_BTN_BASE,
        color: disabled ? 'rgba(255,255,255,0.2)' : colors.textSecondary,
      }}
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      <i className={icon} />
    </motion.button>
  )
}

export default function AddressBar({ controls }: AddressBarProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') controls.navigate(controls.inputUrl)
  }

  return (
    <div style={CONTAINER_STYLE}>
      <NavButton
        icon="fi fi-rr-angle-left"
        disabled={!controls.canGoBack}
        onClick={controls.goBack}
        title="Atrás"
      />
      <NavButton
        icon="fi fi-rr-angle-right"
        disabled={!controls.canGoForward}
        onClick={controls.goForward}
        title="Adelante"
      />
      <NavButton
        icon={controls.isLoading ? 'fi fi-rr-cross-small' : 'fi fi-rr-rotate-right'}
        disabled={false}
        onClick={controls.isLoading ? () => {} : controls.reload}
        title={controls.isLoading ? 'Detener' : 'Recargar'}
      />

      <div style={ADDRESS_INPUT_WRAPPER}>
        <i className="fi fi-rr-globe" style={GLOBE_ICON_STYLE} />
        <input
          type="text"
          style={ADDRESS_INPUT_STYLE}
          value={controls.inputUrl}
          onChange={e => controls.setInputUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={e => e.target.select()}
          placeholder="Buscar o introducir URL"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  )
}
