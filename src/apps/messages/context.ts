import { createContext, useContext } from 'react'

/**
 * CurrentUserContext — provides the authenticated userId to MessagesApp
 * without the app needing to import the OS store directly.
 *
 * Provider is in src/shell/AppContainer.tsx which IS allowed to read the store.
 */
export const CurrentUserContext = createContext<string | null>(null)

export function useCurrentUser(): string | null {
  return useContext(CurrentUserContext)
}
