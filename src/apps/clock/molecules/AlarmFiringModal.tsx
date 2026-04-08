import { motion } from 'framer-motion'
import { GlassCard, GlassButton, Typography, fadeIn } from '../../../design'
import type { AlarmRecord } from '../../../kernel/storage'

interface AlarmFiringModalProps {
  alarm: AlarmRecord
  onDismiss: () => void
  onSnooze: () => void
}

export default function AlarmFiringModal({ alarm, onDismiss, onSnooze }: AlarmFiringModalProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <GlassCard style={{ textAlign: 'center', width: '100%' }}>
        <Typography variant="title" style={{ marginBottom: 8, display: 'block' }}>
          {alarm.label || 'Alarm'}
        </Typography>
        <Typography variant="time" style={{ fontSize: 48, display: 'block', marginBottom: 24 }}>
          {alarm.time}
        </Typography>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <GlassButton onClick={onSnooze}>
            <i className="fi fi-rr-snooze" /> Snooze
          </GlassButton>
          <GlassButton variant="primary" onClick={onDismiss}>
            <i className="fi fi-rr-check" /> Dismiss
          </GlassButton>
        </div>
      </GlassCard>
    </motion.div>
  )
}
