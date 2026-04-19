import type { CSSProperties } from 'react'
import { GlassButton, Spinner, Typography, colors, spacing, font } from '../../../design'
import { useCallHistory } from '../hooks/useCallHistory'
import CallEntry from './CallEntry'
import * as callsService from '../../../kernel/services/calls'

// ── Styles ────────────────────────────────────────────────────

const headerStyle: CSSProperties = {
  padding: `${spacing[4]}px ${spacing[4]}px ${spacing[2]}px`,
  flexShrink: 0,
}

const bodyStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  overflowX: 'hidden',
}

const centerStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing[2],
  padding: spacing[8],
}

const listStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
  padding: `0 ${spacing[4]}px ${spacing[4]}px`,
}

// ── Component ─────────────────────────────────────────────────

export default function RecentsTab() {
  const { history, loading, error, refetch } = useCallHistory()

  const handleCallback = (peer: { id: string; name: string }) => {
    callsService.startCall(peer.id, peer.name)
  }

  return (
    <>
      <div style={headerStyle}>
        <Typography variant="body" style={{ fontWeight: font.weight.semibold }}>
          Recents
        </Typography>
      </div>

      <div style={bodyStyle}>
        {loading && (
          <div style={centerStyle}>
            <Spinner />
          </div>
        )}

        {!loading && error && (
          <div style={centerStyle}>
            <i className="fi fi-rr-exclamation" style={{ fontSize: 40, color: colors.danger }} />
            <Typography variant="label">Could not load call history</Typography>
            <Typography variant="caption" style={{ color: colors.textSecondary, textAlign: 'center' }}>
              Check your connection and try again
            </Typography>
            <GlassButton variant="primary" onClick={refetch}>
              Retry
            </GlassButton>
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div style={centerStyle}>
            <i className="fi fi-rr-phone" style={{ fontSize: 40, color: colors.textMuted }} />
            <Typography variant="label">No recent calls</Typography>
            <Typography variant="caption" style={{ color: colors.textSecondary, textAlign: 'center' }}>
              Calls you make or receive will appear here
            </Typography>
          </div>
        )}

        {!loading && !error && history.length > 0 && (
          <div style={listStyle}>
            {history.map(item => (
              <CallEntry key={item.id} item={item} onCallback={handleCallback} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
