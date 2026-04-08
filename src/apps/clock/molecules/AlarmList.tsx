import { motion } from 'framer-motion'
import { GlassCard, GlassButton, Typography, colors, spacing } from '../../../design'
import type { AlarmRecord } from '../../../kernel/storage'

interface AlarmListProps {
  alarmList: AlarmRecord[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
  onEdit: (alarm: AlarmRecord) => void
}

export default function AlarmList({ alarmList, onToggle, onDelete, onAdd, onEdit }: AlarmListProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[3],
        overflowY: 'auto',
        height: '100%',
        padding: spacing[3],
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <GlassButton onClick={onAdd}>
          <i className="fi fi-rr-plus" /> New Alarm
        </GlassButton>
      </div>

      {alarmList.length === 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Typography variant="muted">No alarms set</Typography>
        </div>
      )}

      {alarmList.map(alarm => (
        <GlassCard key={alarm.id} style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
          <div
            style={{ flex: 1, cursor: 'pointer' }}
            onClick={() => onEdit(alarm)}
          >
            <Typography variant="title" style={{ display: 'block' }}>{alarm.time}</Typography>
            <Typography variant="caption" style={{ display: 'block' }}>
              {alarm.label || 'Alarm'}
              {alarm.repeat.length > 0 && ` · ${alarm.repeat.join(', ')}`}
            </Typography>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
            <motion.div
              onClick={() => onToggle(alarm.id)}
              style={{
                width: 44,
                height: 26,
                borderRadius: 13,
                background: alarm.enabled ? colors.accentBlue : colors.glassBg,
                border: `1px solid ${alarm.enabled ? colors.accentBlue : colors.glassBorder}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0 3px',
                transition: 'background 0.2s ease',
              }}
            >
              <motion.div
                animate={{ x: alarm.enabled ? 18 : 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  background: colors.textPrimary,
                }}
              />
            </motion.div>
            <motion.button
              onClick={() => onDelete(alarm.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: colors.danger,
                fontSize: 16,
                padding: spacing[1],
                display: 'flex',
                alignItems: 'center',
              }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fi fi-rr-trash" />
            </motion.button>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
