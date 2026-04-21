import type { CSSProperties } from 'react'
import { colors, font, spacing } from '../../../design'
import ShutterButton from '../atoms/ShutterButton'
import type { CameraMode } from './ModeNavBar'
import type { FlashMode } from '../hooks/useFlash'

interface ControlRowProps {
  mode: CameraMode
  isRecording: boolean
  flashMode: FlashMode
  onShutter: () => void
  onFlip: () => void
  onCycleFlash: () => void
}

const ROW_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: spacing[8],
  paddingRight: spacing[8],
  width: '100%',
}

const ICON_BTN_STYLE: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.15)',
  border: 'none',
  cursor: 'pointer',
  outline: 'none',
  color: colors.textPrimary,
  fontSize: 18,
}

const FLASH_ICONS: Record<FlashMode, string> = {
  off: 'fi fi-rr-bolt-slash',
  on: 'fi fi-rr-bolt',
  auto: 'fi fi-rr-bolt',
}

const FLASH_LABEL: Record<FlashMode, string> = {
  off: 'Flash off',
  on: 'Flash on',
  auto: 'Flash auto',
}

const FLASH_LABEL_STYLE: CSSProperties = {
  fontFamily: font.sans,
  fontSize: 9,
  fontWeight: font.weight.semibold,
  color: colors.textSecondary,
  textAlign: 'center',
  marginTop: spacing[1],
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
}

export default function ControlRow({
  mode,
  isRecording,
  flashMode,
  onShutter,
  onFlip,
  onCycleFlash,
}: ControlRowProps) {
  return (
    <div style={ROW_STYLE}>
      <button
        type="button"
        style={ICON_BTN_STYLE}
        onClick={onFlip}
        aria-label="Voltear cámara"
      >
        <i className="fi fi-rr-camera-rotate" />
      </button>

      <ShutterButton mode={mode} isRecording={isRecording} onPress={onShutter} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          type="button"
          style={{
            ...ICON_BTN_STYLE,
            color: flashMode === 'off' ? colors.textSecondary : '#FFD60A',
          }}
          onClick={onCycleFlash}
          aria-label={FLASH_LABEL[flashMode]}
        >
          <i className={FLASH_ICONS[flashMode]} />
        </button>
        <span style={FLASH_LABEL_STYLE}>{flashMode}</span>
      </div>
    </div>
  )
}
