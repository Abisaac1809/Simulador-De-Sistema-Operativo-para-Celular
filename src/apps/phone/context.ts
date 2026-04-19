import { createContext, useContext } from 'react'

/**
 * PhoneCurrentUserContext — provides the authenticated userId to PhoneApp
 * without the app needing to import the OS store directly.
 *
 * Provider is in src/shell/AppContainer.tsx which IS allowed to read the store.
 */
export const PhoneCurrentUserContext = createContext<string | null>(null)

export function usePhoneCurrentUser(): string | null {
  return useContext(PhoneCurrentUserContext)
}
