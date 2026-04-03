/**
 * NOVA OS — Phase 1 Design System Test Page
 *
 * This page verifies that all shared components render correctly
 * with the Dark Glass design system. Replace with the OS shell in Phase 2+.
 */

import { useState } from 'react'
import { GlassCard, GlassButton, GlassPill, IconWrapper, Typography, colors } from './design'

const APPS = [
  { icon: '📱', color: '#6090FF', label: 'Phone' },
  { icon: '💬', color: '#A060FF', label: 'Messages' },
  { icon: '📷', color: '#FF60A0', label: 'Camera' },
  { icon: '🎵', color: '#60D0FF', label: 'Music' },
  { icon: '⚙️', color: '#FFB060', label: 'Settings' },
  { icon: '🌐', color: '#5E6AD2', label: 'Browser' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('All')
  const tabs = ['All', 'Apps', 'System', 'Media']

  return (
    <div style={{
      position: 'relative',
      minHeight: '100%',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      overflowY: 'auto',
    }}>

      {/* Ambient blobs */}
      <div
        className="ambient-blob"
        style={{
          width: 320,
          height: 320,
          background: colors.accent,
          top: -60,
          right: -80,
          // @ts-expect-error CSS custom property
          '--blob-duration': '20s',
          '--blob-tx': '24px',
          '--blob-ty': '18px',
        }}
      />
      <div
        className="ambient-blob"
        style={{
          width: 260,
          height: 260,
          background: colors.accentPurple,
          bottom: 40,
          left: -60,
          // @ts-expect-error CSS custom property
          '--blob-duration': '26s',
          '--blob-tx': '-18px',
          '--blob-ty': '22px',
        }}
      />

      {/* Header */}
      <div style={{ textAlign: 'center', paddingTop: 16, position: 'relative' }}>
        <Typography variant="time" style={{ fontSize: 48, letterSpacing: '-1px' }}>
          NOVA OS
        </Typography>
        <Typography variant="label" style={{ marginTop: 8, display: 'block' }}>
          Design System — Phase 1
        </Typography>
      </div>

      {/* Typography */}
      <GlassCard>
        <Typography variant="title" style={{ marginBottom: 16 }}>Typography</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Typography variant="time" style={{ fontSize: 40 }}>12:41</Typography>
          <Typography variant="title">Title — Inter 600</Typography>
          <Typography variant="body">Body — Regular text at 16px for reading content</Typography>
          <Typography variant="label">Label — Medium 14px for UI labels</Typography>
          <Typography variant="caption">Caption — 12px for secondary info</Typography>
          <Typography variant="muted">Muted — 12px for hints and disabled states</Typography>
        </div>
      </GlassCard>

      {/* Buttons */}
      <GlassCard>
        <Typography variant="title" style={{ marginBottom: 16 }}>Buttons</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <GlassButton variant="primary">Primary</GlassButton>
          <GlassButton variant="ghost">Ghost</GlassButton>
          <GlassButton variant="danger">Danger</GlassButton>
          <GlassButton variant="ghost" disabled>Disabled</GlassButton>
        </div>
      </GlassCard>

      {/* Pills */}
      <GlassCard>
        <Typography variant="title" style={{ marginBottom: 16 }}>Pills / Tabs</Typography>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <GlassPill
              key={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </GlassPill>
          ))}
        </div>
      </GlassCard>

      {/* Icon Wrappers */}
      <GlassCard>
        <Typography variant="title" style={{ marginBottom: 16 }}>Icon Wrappers</Typography>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {APPS.map(app => (
            <div
              key={app.label}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
            >
              <IconWrapper color={app.color}>
                {app.icon}
              </IconWrapper>
              <Typography variant="muted">{app.label}</Typography>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Nested cards */}
      <GlassCard>
        <Typography variant="title" style={{ marginBottom: 16 }}>Nested Glass Cards</Typography>
        <div style={{ display: 'flex', gap: 12 }}>
          <GlassCard elevated style={{ flex: 1 }} padding={12}>
            <Typography variant="label">Alarm</Typography>
            <Typography variant="muted" style={{ display: 'block', marginTop: 4 }}>07:00 AM</Typography>
          </GlassCard>
          <GlassCard elevated style={{ flex: 1 }} padding={12}>
            <Typography variant="label">Flight</Typography>
            <Typography variant="muted" style={{ display: 'block', marginTop: 4 }}>On time</Typography>
          </GlassCard>
        </div>
      </GlassCard>

      {/* Status */}
      <div style={{ textAlign: 'center', paddingBottom: 24 }}>
        <Typography variant="muted">
          All tokens, variants, and components are working.
          Phase 1 complete.
        </Typography>
      </div>
    </div>
  )
}
