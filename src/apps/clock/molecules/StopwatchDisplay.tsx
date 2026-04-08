import { GlassButton, Typography, colors, spacing } from '../../../design'
import type { useStopwatch } from '../hooks/useStopwatch'

type StopwatchProps = ReturnType<typeof useStopwatch>

export default function StopwatchDisplay({
  elapsed,
  running,
  laps,
  start,
  stop,
  lap,
  reset,
  formatElapsed,
}: StopwatchProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: spacing[4] }}>
      {/* Counter */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="time" style={{ fontSize: 56 }}>
          {formatElapsed(elapsed)}
        </Typography>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'center', marginBottom: spacing[4] }}>
        {!running && elapsed === 0 && (
          <GlassButton variant="primary" onClick={start}>
            <i className="fi fi-rr-play" /> Start
          </GlassButton>
        )}
        {running && (
          <>
            <GlassButton onClick={stop}>
              <i className="fi fi-rr-pause" /> Stop
            </GlassButton>
            <GlassButton onClick={lap}>
              <i className="fi fi-rr-flag" /> Lap
            </GlassButton>
          </>
        )}
        {!running && elapsed > 0 && (
          <>
            <GlassButton onClick={reset}>
              <i className="fi fi-rr-rotate-left" /> Reset
            </GlassButton>
            <GlassButton variant="primary" onClick={start}>
              <i className="fi fi-rr-play" /> Resume
            </GlassButton>
          </>
        )}
      </div>

      {/* Lap list */}
      {laps.length > 0 && (
        <div style={{ maxHeight: '40%', overflowY: 'auto' }}>
          {laps.map((lapTime, i) => {
            const prev = laps[i - 1] ?? 0
            const split = lapTime - prev
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: `${spacing[2]}px 0`,
                  borderBottom: `1px solid ${colors.glassBorder}`,
                }}
              >
                <Typography variant="body">Lap {i + 1}</Typography>
                <div style={{ display: 'flex', gap: spacing[4] }}>
                  <Typography variant="muted">{formatElapsed(split)}</Typography>
                  <Typography variant="body">{formatElapsed(lapTime)}</Typography>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
