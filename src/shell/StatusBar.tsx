import type { CSSProperties } from 'react'
import { useOSStore } from '../kernel/store'
import { colors, font, spacing } from '../design/tokens'
import BatteryIcon from './icons/BatteryIcon'
import SignalBars from './icons/SignalBars'
import WifiIcon from './icons/WifiIcon'

interface StatusBarProps {
  transparent?: boolean
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

const barStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: 44,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: spacing[4],
  paddingRight: spacing[4],
  paddingTop: 'env(safe-area-inset-top, 0px)',
  zIndex: 100,
  flexShrink: 0,
}

const timeStyle: CSSProperties = {
  fontFamily: font.sans,
  fontSize: 15,
  fontWeight: font.weight.semibold,
  color: colors.textPrimary,
  letterSpacing: '-0.3px',
  minWidth: 48,
}

const rightGroupStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing[2],
}

const dynamicIslandStyle: CSSProperties = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  top: 8,
  width: 120,
  height: 32,
  background: '#000',
  borderRadius: 100,
  flexShrink: 0,
}

export default function StatusBar({ transparent = false }: StatusBarProps) {
  const time = useOSStore(s => s.time)
  const battery = useOSStore(s => s.battery)
  const isCharging = useOSStore(s => s.isCharging)
  const wifiStrength = useOSStore(s => s.wifiStrength)
  const signalStrength = useOSStore(s => s.signalStrength)

  return (
    <div
      style={{
        ...barStyle,
        background: transparent ? 'transparent' : 'rgba(0,0,0,0.4)',
      }}
      role="banner"
      aria-label="Status bar"
    >
      <span style={timeStyle} aria-live="polite" aria-atomic="true">
        {formatTime(time)}
      </span>

      <div style={dynamicIslandStyle} aria-hidden="true" />

      <div style={rightGroupStyle}>
        <SignalBars strength={signalStrength} size={16} />
        <WifiIcon strength={wifiStrength} size={17} />
        <BatteryIcon level={battery} charging={isCharging} size={14} />
      </div>
    </div>
  )
}
