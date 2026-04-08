import { colors, glass, radius, spacing } from '../../../design'
import TabBarItem from '../atoms/TabBarItem'

export type TabId = 'clock' | 'alarms' | 'timer' | 'stopwatch'

interface TabBarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const TABS = [
  { id: 'clock',     icon: 'fi fi-rr-clock-three', label: 'Clock'     },
  { id: 'alarms',    icon: 'fi fi-rr-bell',         label: 'Alarms'    },
  { id: 'timer',     icon: 'fi fi-rr-hourglass',    label: 'Timer'     },
  { id: 'stopwatch', icon: 'fi fi-rr-stopwatch',    label: 'Stopwatch' },
] as const

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: spacing[4],
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'row',
        gap: spacing[2],
        padding: `${spacing[2]}px ${spacing[4]}px`,
        background: colors.glassBg,
        backdropFilter: glass.backdropFilter,
        WebkitBackdropFilter: glass.backdropFilter,
        borderRadius: radius.pill,
        border: `1px solid ${colors.glassBorder}`,
        zIndex: 10,
      }}
    >
      {TABS.map(t => (
        <TabBarItem
          key={t.id}
          icon={t.icon}
          label={t.label}
          active={activeTab === t.id}
          onClick={() => onTabChange(t.id as TabId)}
        />
      ))}
    </div>
  )
}
