import { useState, useCallback, useRef } from 'react'

const DEFAULT_URL = 'https://ujap.edu.ve/'

export interface BrowserControls {
  currentUrl: string
  inputUrl: string
  isLoading: boolean
  canGoBack: boolean
  canGoForward: boolean
  setInputUrl: (url: string) => void
  navigate: (url: string) => void
  goBack: () => void
  goForward: () => void
  reload: () => void
  onIframeLoad: () => void
  iframeRef: React.RefObject<HTMLIFrameElement | null>
}

export default function useBrowser(): BrowserControls {
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_URL)
  const [inputUrl, setInputUrl] = useState(DEFAULT_URL)
  const [isLoading, setIsLoading] = useState(true)
  const [history, setHistory] = useState<string[]>([DEFAULT_URL])
  const [historyIndex, setHistoryIndex] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const normalizeUrl = (raw: string): string => {
    const trimmed = raw.trim()
    if (!trimmed) return DEFAULT_URL
    if (/^https?:\/\//i.test(trimmed)) return trimmed
    if (trimmed.includes('.') && !trimmed.includes(' ')) return `https://${trimmed}`
    return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`
  }

  const navigate = useCallback((raw: string) => {
    const url = normalizeUrl(raw)
    setIsLoading(true)
    setCurrentUrl(url)
    setInputUrl(url)
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1)
      return [...trimmed, url]
    })
    setHistoryIndex(prev => prev + 1)
  }, [historyIndex])

  const goBack = useCallback(() => {
    if (historyIndex <= 0) return
    const newIndex = historyIndex - 1
    const url = history[newIndex]
    setHistoryIndex(newIndex)
    setCurrentUrl(url)
    setInputUrl(url)
    setIsLoading(true)
  }, [history, historyIndex])

  const goForward = useCallback(() => {
    if (historyIndex >= history.length - 1) return
    const newIndex = historyIndex + 1
    const url = history[newIndex]
    setHistoryIndex(newIndex)
    setCurrentUrl(url)
    setInputUrl(url)
    setIsLoading(true)
  }, [history, historyIndex])

  const reload = useCallback(() => {
    setIsLoading(true)
    if (iframeRef.current) {
      iframeRef.current.src = currentUrl
    }
  }, [currentUrl])

  const onIframeLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  return {
    currentUrl,
    inputUrl,
    isLoading,
    canGoBack: historyIndex > 0,
    canGoForward: historyIndex < history.length - 1,
    setInputUrl,
    navigate,
    goBack,
    goForward,
    reload,
    onIframeLoad,
    iframeRef,
  }
}
