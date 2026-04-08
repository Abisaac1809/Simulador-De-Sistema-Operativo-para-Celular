import { useState, useMemo } from 'react'
import { useOSStore } from '../../../kernel/store'

// ── Types ─────────────────────────────────────────────────

export interface ActionConfig {
  id: string
  label: string
  icon: string
  disabled: boolean
  isDanger: boolean
  onPress: () => void
}

interface UseAssistiveTouchMenuOptions {
  onOpenSwitcher: () => void
  onOpenNotifCenter: () => void
}

interface UseAssistiveTouchMenuReturn {
  isMenuOpen: boolean
  toggleMenu: () => void
  closeMenu: () => void
  actions: ActionConfig[]
}

// ── Hook ──────────────────────────────────────────────────

/**
 * useAssistiveTouchMenu — HOOK
 *
 * Manages the AssistiveTouch menu open/close state and builds
 * the five OS action configs.
 */
export function useAssistiveTouchMenu({
  onOpenSwitcher,
  onOpenNotifCenter,
}: UseAssistiveTouchMenuOptions): UseAssistiveTouchMenuReturn {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const focusedAppId = useOSStore(s => s.focusedAppId)
  const closeApp = useOSStore(s => s.closeApp)
  const lock = useOSStore(s => s.lock)

  function closeMenu() { setIsMenuOpen(false) }
  function toggleMenu() { setIsMenuOpen(prev => !prev) }

  const actions = useMemo<ActionConfig[]>(() => [
    {
      id: 'home',
      label: 'Home',
      icon: 'fi fi-rr-home',
      disabled: false,
      isDanger: false,
      onPress: () => {
        if (focusedAppId) closeApp(focusedAppId)
        closeMenu()
      },
    },
    {
      id: 'recents',
      label: 'Recents',
      icon: 'fi fi-rr-apps',
      disabled: false,
      isDanger: false,
      onPress: () => {
        onOpenSwitcher()
        closeMenu()
      },
    },
    {
      id: 'notifications',
      label: 'Alerts',
      icon: 'fi fi-rr-bell',
      disabled: false,
      isDanger: false,
      onPress: () => {
        onOpenNotifCenter()
        closeMenu()
      },
    },
    {
      id: 'lock',
      label: 'Lock',
      icon: 'fi fi-rr-lock',
      disabled: false,
      isDanger: false,
      onPress: () => {
        lock()
        closeMenu()
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [focusedAppId])

  return { isMenuOpen, toggleMenu, closeMenu, actions }
}
