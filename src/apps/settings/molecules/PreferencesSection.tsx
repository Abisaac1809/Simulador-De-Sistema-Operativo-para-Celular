import type { CSSProperties } from 'react'
import { GlassCard, colors, spacing } from '../../../design'
import { useOSStore } from '../../../kernel/store'
import SettingsRow from '../atoms/SettingsRow'

const SLIDER_STYLE: CSSProperties = {
  width: 100,
  accentColor: colors.accent,
  cursor: 'pointer',
  height: 4,
  flexShrink: 0,
}

export default function PreferencesSection() {
  const brightness = useOSStore(s => s.brightness)
  const volume = useOSStore(s => s.volume)

  const setBrightness = useOSStore(s => s.setBrightness)
  const setVolume = useOSStore(s => s.setVolume)

  return (
    <GlassCard padding={spacing[4]}>
      <SettingsRow icon="fi fi-rr-brightness" label="Brillo">
        <input
          type="range"
          min={0}
          max={100}
          value={brightness}
          onChange={e => setBrightness(Number(e.target.value))}
          style={SLIDER_STYLE}
        />
      </SettingsRow>

      <SettingsRow icon="fi fi-rr-volume" label="Volumen">
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          style={SLIDER_STYLE}
        />
      </SettingsRow>
    </GlassCard>
  )
}
