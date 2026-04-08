import { useEffect } from 'react'
import { GlassCard, GlassButton, Typography, colors, spacing } from '../../../design'
import { kernelBus } from '../../../kernel/events'
import type { useTimer } from '../hooks/useTimer'

type TimerProps = ReturnType<typeof useTimer>

const RING_RADIUS = 100
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

export default function TimerDisplay({
  minutes,
  seconds,
  remaining,
  running,
  done,
  setMinutes,
  setSeconds,
  start,
  pause,
  reset,
  dismissDone,
  formatRemaining,
}: TimerProps) {
  const totalMs = minutes * 60000 + seconds * 1000
  const progress = totalMs > 0 ? remaining / totalMs : 0
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress)

  useEffect(() => {
    if (done) {
      kernelBus.emit('system:sound', { type: 'notification' })
    }
  }, [done])

  const isInput = !running && remaining === 0 && !done

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: spacing[4],
        position: 'relative',
      }}
    >
      {/* Input state */}
      {isInput && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: spacing[6], marginBottom: spacing[6] }}>
            {/* Minutes */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[2] }}>
              <GlassButton onClick={() => setMinutes(minutes + 1)}>
                <i className="fi fi-rr-angle-up" />
              </GlassButton>
              <Typography variant="title" style={{ fontSize: 48, minWidth: 60, textAlign: 'center' }}>
                {String(minutes).padStart(2, '0')}
              </Typography>
              <GlassButton onClick={() => setMinutes(minutes - 1)}>
                <i className="fi fi-rr-angle-down" />
              </GlassButton>
              <Typography variant="muted">min</Typography>
            </div>

            <Typography variant="title" style={{ fontSize: 48, lineHeight: '100px' }}>:</Typography>

            {/* Seconds */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[2] }}>
              <GlassButton onClick={() => setSeconds(seconds + 1)}>
                <i className="fi fi-rr-angle-up" />
              </GlassButton>
              <Typography variant="title" style={{ fontSize: 48, minWidth: 60, textAlign: 'center' }}>
                {String(seconds).padStart(2, '0')}
              </Typography>
              <GlassButton onClick={() => setSeconds(seconds - 1)}>
                <i className="fi fi-rr-angle-down" />
              </GlassButton>
              <Typography variant="muted">sec</Typography>
            </div>
          </div>

          <GlassButton variant="primary" onClick={start} disabled={minutes === 0 && seconds === 0}>
            <i className="fi fi-rr-play" /> Start
          </GlassButton>
        </>
      )}

      {/* Running / paused state */}
      {!isInput && !done && (
        <>
          <div style={{ position: 'relative', marginBottom: spacing[6] }}>
            <svg width={240} height={240} style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx={120}
                cy={120}
                r={RING_RADIUS}
                fill="none"
                stroke={colors.glassBorder}
                strokeWidth={8}
              />
              <circle
                cx={120}
                cy={120}
                r={RING_RADIUS}
                fill="none"
                stroke={colors.accentBlue}
                strokeWidth={8}
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="time" style={{ fontSize: 48 }}>
                {formatRemaining(remaining)}
              </Typography>
            </div>
          </div>

          <div style={{ display: 'flex', gap: spacing[3] }}>
            {running ? (
              <GlassButton onClick={pause}>
                <i className="fi fi-rr-pause" /> Pause
              </GlassButton>
            ) : (
              <GlassButton variant="primary" onClick={start}>
                <i className="fi fi-rr-play" /> Resume
              </GlassButton>
            )}
            <GlassButton onClick={reset}>
              <i className="fi fi-rr-rotate-left" /> Reset
            </GlassButton>
          </div>
        </>
      )}

      {/* Done overlay */}
      {done && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing[4],
          }}
        >
          <GlassCard style={{ textAlign: 'center', padding: spacing[6] }}>
            <Typography variant="title" style={{ display: 'block', marginBottom: spacing[4] }}>
              Time&apos;s up!
            </Typography>
            <GlassButton variant="primary" onClick={dismissDone}>
              <i className="fi fi-rr-check" /> Done
            </GlassButton>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
