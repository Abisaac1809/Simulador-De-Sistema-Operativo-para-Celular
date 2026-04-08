import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard, GlassButton, Typography, colors, spacing, radius, slideUp } from '../../../design'
import type { AlarmRecord } from '../../../kernel/storage'

interface AlarmEditorProps {
  initial?: AlarmRecord
  onSave: (alarm: AlarmRecord) => void
  onCancel: () => void
}

const DAYS = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
  { id: 'sat', label: 'Sat' },
  { id: 'sun', label: 'Sun' },
]

export default function AlarmEditor({ initial, onSave, onCancel }: AlarmEditorProps) {
  const [label, setLabel] = useState(initial?.label ?? '')
  const [hours, setHours] = useState(() => {
    if (initial?.time) return parseInt(initial.time.split(':')[0])
    return 7
  })
  const [mins, setMins] = useState(() => {
    if (initial?.time) return parseInt(initial.time.split(':')[1])
    return 0
  })
  const [repeat, setRepeat] = useState<string[]>(initial?.repeat ?? [])

  function toggleDay(id: string) {
    setRepeat(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id])
  }

  function handleSave() {
    const time = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      label,
      time,
      enabled: initial?.enabled ?? true,
      repeat,
    })
  }

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
      }}
    >
      <GlassCard
        style={{
          borderRadius: `${radius.card}px ${radius.card}px 0 0`,
          padding: spacing[4],
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[4],
        }}
      >
        {/* Time picker */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: spacing[6] }}>
          {/* Hours */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[2] }}>
            <GlassButton onClick={() => setHours(h => (h + 1) % 24)}>
              <i className="fi fi-rr-angle-up" />
            </GlassButton>
            <Typography variant="title" style={{ fontSize: 40, minWidth: 50, textAlign: 'center' }}>
              {String(hours).padStart(2, '0')}
            </Typography>
            <GlassButton onClick={() => setHours(h => (h - 1 + 24) % 24)}>
              <i className="fi fi-rr-angle-down" />
            </GlassButton>
          </div>

          <Typography variant="title" style={{ fontSize: 40, lineHeight: '80px' }}>:</Typography>

          {/* Minutes */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[2] }}>
            <GlassButton onClick={() => setMins(m => (m + 1) % 60)}>
              <i className="fi fi-rr-angle-up" />
            </GlassButton>
            <Typography variant="title" style={{ fontSize: 40, minWidth: 50, textAlign: 'center' }}>
              {String(mins).padStart(2, '0')}
            </Typography>
            <GlassButton onClick={() => setMins(m => (m - 1 + 60) % 60)}>
              <i className="fi fi-rr-angle-down" />
            </GlassButton>
          </div>
        </div>

        {/* Label input */}
        <input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="Label"
          style={{
            background: 'transparent',
            color: colors.textPrimary,
            border: `1px solid ${colors.glassBorder}`,
            borderRadius: radius.small,
            padding: `${spacing[2]}px ${spacing[3]}px`,
            fontSize: 15,
            fontFamily: 'inherit',
            outline: 'none',
          }}
        />

        {/* Repeat days */}
        <div style={{ display: 'flex', gap: spacing[1], flexWrap: 'wrap' }}>
          {DAYS.map(day => (
            <motion.button
              key={day.id}
              onClick={() => toggleDay(day.id)}
              whileTap={{ scale: 0.9 }}
              style={{
                background: repeat.includes(day.id) ? colors.glassBgActive : colors.glassBg,
                border: `1px solid ${repeat.includes(day.id) ? colors.accentBlue : colors.glassBorder}`,
                borderRadius: radius.pill,
                padding: `${spacing[1]}px ${spacing[2]}px`,
                color: repeat.includes(day.id) ? colors.accentBlue : colors.textSecondary,
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {day.label}
            </motion.button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: spacing[3] }}>
          <GlassButton fullWidth onClick={onCancel}>Cancel</GlassButton>
          <GlassButton fullWidth variant="primary" onClick={handleSave}>Save</GlassButton>
        </div>
      </GlassCard>
    </motion.div>
  )
}
