import { getPinnedApps } from '../kernel/registry'
import { kernelBus } from '../kernel/events'
import { useOSStore } from '../kernel/store'
import { colors, glass, spacing } from '../design/tokens'
import AppIcon from './AppIcon'

export default function Dock() {
  const openApp = useOSStore(s => s.openApp)
  const pinnedApps = getPinnedApps()

  function handleTap(id: string) {
    const app = pinnedApps.find(a => a.id === id)
    if (app) kernelBus.emit('app:open', app)
    openApp(id)
  }

  return (
    <div
      style={{
        paddingInline: spacing[4],
        paddingTop: spacing[3],
        paddingBottom: `calc(${spacing[4]}px + env(safe-area-inset-bottom, 0px))`,
        flexShrink: 0,
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      role="navigation"
      aria-label="Dock"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          background: colors.glassBg,
          backdropFilter: glass.backdropFilter,
          WebkitBackdropFilter: glass.backdropFilter,
          border: `0.5px solid ${colors.glassBorder}`,
          borderRadius: "40px",
          paddingInline: spacing[5],
          paddingBlock: spacing[3],
        }}
      >
        {pinnedApps.map(app => (
          <AppIcon key={app.id} manifest={app} onTap={handleTap} size={52} />
        ))}
      </div>
    </div>
  )
}
