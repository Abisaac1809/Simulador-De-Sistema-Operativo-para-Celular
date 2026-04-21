import type { CSSProperties } from 'react'
import { GlassCard, Typography, colors, spacing } from '../../../design'
import type { StorageStats } from '../../../kernel/storage'
import { useOSStore } from '../../../kernel/store'
import SettingsRow from '../atoms/SettingsRow'
import StatBar from '../atoms/StatBar'

const STAT_BAR_WRAP: CSSProperties = {
  paddingLeft: 32,
  paddingBottom: spacing[2],
}

const GRID_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: spacing[2],
  padding: `${spacing[2]}px 0`,
}

const GRID_ITEM: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
}

function strengthLabel(v: number): string {
  if (v >= 4) return 'Excelente'
  if (v === 3) return 'Bueno'
  if (v === 2) return 'Regular'
  if (v === 1) return 'Débil'
  return 'Apagado'
}

function batteryColor(v: number): string {
  if (v > 50) return '#32D74B'
  if (v > 20) return '#FF9500'
  return '#FF453A'
}

function TimeRow() {
  const time = useOSStore(s => s.time) as Date
  const formatted = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return <SettingsRow icon="fi fi-rr-clock" label="Hora del Sistema" value={formatted} />
}

interface DeviceDataSectionProps {
  battery: number
  isCharging: boolean
  wifiStrength: number
  signalStrength: number
  totalRamUsed: number
  totalRamMb: number
  ramPercent: number
  activeProcesses: number
  totalProcesses: number
  storageStats: StorageStats | null
}

export default function DeviceDataSection(props: DeviceDataSectionProps) {
  const {
    battery, isCharging, wifiStrength, signalStrength,
    totalRamUsed, totalRamMb, ramPercent,
    activeProcesses, totalProcesses, storageStats,
  } = props

  const batteryText = `${battery}%${isCharging ? ' (Cargando)' : ''}`
  const ramText = `${Math.round(totalRamUsed)} / ${totalRamMb} MB`

  return (
    <GlassCard padding={spacing[4]}>
      <SettingsRow icon="fi fi-rr-battery-full" label="Batería" value={batteryText} />
      <div style={STAT_BAR_WRAP}>
        <StatBar value={battery} color={batteryColor(battery)} />
      </div>

      <SettingsRow icon="fi fi-rr-microchip" label="RAM" value={ramText} />
      <div style={STAT_BAR_WRAP}>
        <StatBar value={ramPercent} color={ramPercent > 80 ? '#FF453A' : colors.accent} />
      </div>

      <SettingsRow icon="fi fi-rr-wifi" label="WiFi" value={strengthLabel(wifiStrength)} />
      <SettingsRow icon="fi fi-rr-signal-alt" label="Señal" value={strengthLabel(signalStrength)} />
      <TimeRow />
      <SettingsRow icon="fi fi-rr-apps" label="Procesos" value={`${activeProcesses} activos / ${totalProcesses} total`} />

      {storageStats && (
        <>
          <div style={{ padding: `${spacing[3]}px 0 ${spacing[1]}px` }}>
            <Typography variant="label" style={{ color: colors.textSecondary, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>
              Almacenamiento
            </Typography>
          </div>
          <div style={GRID_STYLE}>
            <StorageStat label="Contactos" count={storageStats.contacts} />
            <StorageStat label="Mensajes" count={storageStats.messages} />
            <StorageStat label="Llamadas" count={storageStats.callLog} />
            <StorageStat label="Notas" count={storageStats.notes} />
            <StorageStat label="Archivos" count={storageStats.files} />
            <StorageStat label="Marcadores" count={storageStats.bookmarks} />
            <StorageStat label="Pistas" count={storageStats.audioTracks} />
            <StorageStat label="Alarmas" count={storageStats.alarms} />
          </div>
        </>
      )}
    </GlassCard>
  )
}

function StorageStat({ label, count }: { label: string; count: number }) {
  return (
    <div style={GRID_ITEM}>
      <Typography variant="body" style={{ fontSize: 18, fontWeight: 600 }}>{count}</Typography>
      <Typography variant="caption" style={{ color: colors.textMuted, fontSize: 11 }}>{label}</Typography>
    </div>
  )
}
