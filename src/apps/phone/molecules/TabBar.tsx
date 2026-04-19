import type { CSSProperties } from 'react'
import { Typography, colors } from '../../../design'

type Tab = 'recents' | 'dialer'

interface Props {
  activeTab: Tab
  onChange: (tab: Tab) => void
}

const tabBarStyle: CSSProperties = {
  height: 52,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  borderTop: `1px solid ${colors.glassBorder}`,
  background: colors.glassBg,
  flexShrink: 0,
}

function tabBtnStyle(active: boolean): CSSProperties {
  return {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    borderBottom: active ? `2px solid ${colors.accent}` : '2px solid transparent',
    color: active ? colors.accent : colors.textMuted,
    padding: 0,
  }
}

export default function TabBar({ activeTab, onChange }: Props) {
  return (
    <div style={tabBarStyle} role="tablist">
      <button
        style={tabBtnStyle(activeTab === 'recents')}
        role="tab"
        aria-selected={activeTab === 'recents'}
        onClick={() => onChange('recents')}
      >
        <i className="fi fi-rr-clock" style={{ fontSize: 18, color: activeTab === 'recents' ? colors.accent : colors.textMuted }} />
        <Typography variant="caption" style={{ color: activeTab === 'recents' ? colors.accent : colors.textMuted }}>
          Recents
        </Typography>
      </button>

      <button
        style={tabBtnStyle(activeTab === 'dialer')}
        role="tab"
        aria-selected={activeTab === 'dialer'}
        onClick={() => onChange('dialer')}
      >
        <i className="fi fi-rr-dial-pad" style={{ fontSize: 18, color: activeTab === 'dialer' ? colors.accent : colors.textMuted }} />
        <Typography variant="caption" style={{ color: activeTab === 'dialer' ? colors.accent : colors.textMuted }}>
          Dialer
        </Typography>
      </button>
    </div>
  )
}
