import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { useOSStore } from './kernel/store'
import { kernelBus } from './kernel/events'
import * as clockService from './kernel/services/clock'
import * as batteryService from './kernel/services/battery'
import * as notificationsService from './kernel/services/notifications'
import * as hapticsService from './kernel/services/haptics'
import * as soundService from './kernel/services/sound'
import * as resourceManager from './kernel/services/resourceManager'
import * as networkService from './kernel/services/network'
import { runSeed } from './kernel/seed'

clockService.start()
batteryService.start()
notificationsService.start()
hapticsService.start()
soundService.start()
resourceManager.start()
networkService.start()

runSeed()

if (import.meta.env.DEV) {
  const w = window as unknown as Record<string, unknown>
  w.useOSStore = useOSStore
  w.kernelBus = kernelBus
  w.resourceManager = resourceManager
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
