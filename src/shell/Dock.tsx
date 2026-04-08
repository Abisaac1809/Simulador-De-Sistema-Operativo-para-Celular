import { getPinnedApps } from '../kernel/registry'
import { kernelBus } from '../kernel/events'
import { useOSStore } from '../kernel/store'
import { spacing } from '../design/tokens'
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
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '0.5px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 40,
          paddingInline: spacing[5],
          paddingBlock: spacing[3],
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.35)',
        }}
      >
        {pinnedApps.map(app => (
          <AppIcon key={app.id} manifest={app} onTap={handleTap} size={52} hideLabel={true} />
        ))}
      </div>
    </div>
  )
}
