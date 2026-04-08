import { useState, useRef, useEffect, useMemo, useCallback, type CSSProperties } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useDrag } from '@use-gesture/react'
import { getAllApps, getApp } from '../kernel/registry'
import { kernelBus } from '../kernel/events'
import { useOSStore } from '../kernel/store'
import { colors, spacing } from '../design/tokens'
import AppIcon from './AppIcon'
import AnalogClock from '../widgets/AnalogClock'
import CalendarWidget from '../widgets/CalendarWidget'
import DotIndicator from './DotIndicator'
import StatusBar from './StatusBar'
import Dock from './Dock'

export interface HomeScreenProps {
  wallpaper?: string
}

const WIDGET_GRID_COL_SPAN = 2
const WIDGET_GRID_ROW_SPAN = 2

const WIDGET_SLOT_STYLE: CSSProperties = {
  gridColumn: `span ${WIDGET_GRID_COL_SPAN}`,
  gridRow: `span ${WIDGET_GRID_ROW_SPAN}`,
}

const CALENDAR_SLOT_STYLE: CSSProperties = {
  gridColumn: '3 / span 2',
  gridRow: '1 / span 2',
}

const ICONS_PER_PAGE = 16
const COLUMNS = 4
const SWIPE_THRESHOLD = 50
const TOTAL_PAGES = 3
const LONG_PRESS_MS = 450
const LAYOUT_KEY = 'nova-os-home-layout'
const EDGE_ZONE = 0.18  // 18% of container width triggers page auto-switch

// ─── Layout persistence ────────────────────────────────────────────────────────

function buildDefaultLayout(): string[][] {
  const allApps = getAllApps()
  return Array.from({ length: TOTAL_PAGES }, (_, i) =>
    allApps.slice(i * ICONS_PER_PAGE, (i + 1) * ICONS_PER_PAGE).map(a => a.id),
  )
}

function loadLayout(): string[][] {
  try {
    const raw = localStorage.getItem(LAYOUT_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.every(p => Array.isArray(p))) {
        return parsed as string[][]
      }
    }
  } catch { /* ignore */ }
  return buildDefaultLayout()
}

function persistLayout(layout: string[][]) {
  try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout)) } catch { /* ignore */ }
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DragState {
  appId: string
  fromPage: number
  fromIndex: number  // index in the ORIGINAL layout[fromPage] at drag start
  clientX: number
  clientY: number
}

interface DropTarget {
  page: number
  index: number  // insertion index into the page's reduced-items array
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function HomeScreen({ wallpaper }: HomeScreenProps = {}) {
  const openApp = useOSStore(s => s.openApp)
  const [currentPage, setCurrentPage] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // pageX holds committed page position; dragX holds live finger offset.
  // stripX = pageX + dragX so the strip tracks the finger in real time.
  const pageX = useMotionValue(0)
  const dragX = useMotionValue(0)
  const stripX = useTransform([pageX, dragX], ([p, d]) => (p as number) + (d as number))

  const [layout, setLayout] = useState<string[][]>(loadLayout)
  const [isEditMode, setIsEditMode] = useState(false)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null)
  const [isDraggingIcon, setIsDraggingIcon] = useState(false)

  // Refs for latest values — prevent stale closures inside document-level listeners
  const currentPageRef = useRef(0)
  const dragStateRef = useRef<DragState | null>(null)
  const dropTargetRef = useRef<DropTarget | null>(null)
  const layoutRef = useRef<string[][]>(layout)
  const pageSwitchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressStart = useRef({ x: 0, y: 0 })

  useEffect(() => { currentPageRef.current = currentPage }, [currentPage])
  useEffect(() => { dragStateRef.current = dragState }, [dragState])
  useEffect(() => { dropTargetRef.current = dropTarget }, [dropTarget])
  useEffect(() => { layoutRef.current = layout }, [layout])

  // ── Page navigation ──────────────────────────────────────────────────────────

  const goToPage = useCallback((next: number, fromDrag = 0) => {
    if (next < 0 || next >= TOTAL_PAGES) return
    const width = containerRef.current?.offsetWidth ?? 390
    // Merge current drag offset so there is no position jump
    pageX.set(pageX.get() + fromDrag)
    dragX.set(0)
    animate(pageX, -(next * width), { type: 'spring', stiffness: 280, damping: 32, mass: 0.9 })
    currentPageRef.current = next
    setCurrentPage(next)
  }, [pageX, dragX])

  // ── Page swipe gesture (suppressed while dragging an icon) ───────────────────

  const bind = useDrag(
    ({ movement: [mx], last, velocity: [vx] }) => {
      if (isDraggingIcon) return

      // Cancel pending long-press if user starts swiping
      if (Math.abs(mx) > 8 && longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }

      const cp = currentPageRef.current
      const atStart = cp === 0 && mx > 0
      const atEnd = cp >= TOTAL_PAGES - 1 && mx < 0
      const bounded = atStart || atEnd

      if (!last) {
        dragX.set(bounded ? mx * 0.15 : mx)
        return
      }

      const fast = Math.abs(vx) > 0.3
      const far = Math.abs(mx) > SWIPE_THRESHOLD

      if ((fast || far) && !bounded) {
        goToPage(mx < 0 ? cp + 1 : cp - 1, mx)
      } else {
        animate(dragX, 0, { type: 'spring', stiffness: 500, damping: 45 })
      }
    },
    { axis: 'x', filterTaps: true, threshold: 10, enabled: !isDraggingIcon },
  )

  // ── Document-level pointer tracking during icon drag ─────────────────────────

  useEffect(() => {
    if (!dragState) return

    function onMove(e: PointerEvent) {
      // Update ghost position
      setDragState(prev => prev ? { ...prev, clientX: e.clientX, clientY: e.clientY } : null)

      // Find drop target from elements under pointer (ghost has pointer-events:none)
      const els = document.elementsFromPoint(e.clientX, e.clientY)
      for (const el of els) {
        const html = el as HTMLElement
        const page = html.dataset?.page
        const slot = html.dataset?.slot
        if (page !== undefined && slot !== undefined) {
          const dt: DropTarget = { page: parseInt(page), index: parseInt(slot) }
          setDropTarget(dt)
          dropTargetRef.current = dt
          break
        }
      }

      // Auto page-switch when dragging near the left/right edge
      const container = containerRef.current
      if (container) {
        const rect = container.getBoundingClientRect()
        const relX = e.clientX - rect.left
        const w = rect.width
        const wantL = relX < w * EDGE_ZONE && currentPageRef.current > 0
        const wantR = relX > w * (1 - EDGE_ZONE) && currentPageRef.current < TOTAL_PAGES - 1

        if ((wantL || wantR) && !pageSwitchTimer.current) {
          const nextPage = wantL ? currentPageRef.current - 1 : currentPageRef.current + 1
          pageSwitchTimer.current = setTimeout(() => {
            pageSwitchTimer.current = null
            goToPage(nextPage)
          }, 650)
        } else if (!wantL && !wantR && pageSwitchTimer.current) {
          clearTimeout(pageSwitchTimer.current)
          pageSwitchTimer.current = null
        }
      }
    }

    function commitDrop() {
      if (pageSwitchTimer.current) {
        clearTimeout(pageSwitchTimer.current)
        pageSwitchTimer.current = null
      }

      const ds = dragStateRef.current
      const dt = dropTargetRef.current

      if (ds && dt) {
        const next = layoutRef.current.map(p => [...p])

        // Remove from source page
        const srcPage = next[ds.fromPage]
        const srcIdx = srcPage.indexOf(ds.appId)
        if (srcIdx !== -1) srcPage.splice(srcIdx, 1)

        // Insert at drop target (clamp in case page shrank after removal)
        const tgt = next[dt.page]
        tgt.splice(Math.min(dt.index, tgt.length), 0, ds.appId)

        setLayout(next)
        persistLayout(next)
      }

      setDragState(null)
      setDropTarget(null)
      setIsDraggingIcon(false)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', commitDrop)
    document.addEventListener('pointercancel', commitDrop)

    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', commitDrop)
      document.removeEventListener('pointercancel', commitDrop)
      if (pageSwitchTimer.current) {
        clearTimeout(pageSwitchTimer.current)
        pageSwitchTimer.current = null
      }
    }
  }, [dragState, goToPage])

  // ── Start icon drag ──────────────────────────────────────────────────────────

  function startIconDrag(appId: string, fromPage: number, fromIndex: number, clientX: number, clientY: number) {
    const ds: DragState = { appId, fromPage, fromIndex, clientX, clientY }
    const dt: DropTarget = { page: fromPage, index: fromIndex }
    setIsDraggingIcon(true)
    setDragState(ds); dragStateRef.current = ds
    setDropTarget(dt); dropTargetRef.current = dt
  }

  // ── Icon pointer handlers ────────────────────────────────────────────────────

  function handleIconPointerDown(appId: string, pageIdx: number, slotIdx: number, e: React.PointerEvent) {
    if (isEditMode) {
      e.stopPropagation()
      startIconDrag(appId, pageIdx, slotIdx, e.clientX, e.clientY)
      return
    }
    // Normal mode: long-press to enter edit mode (don't stopPropagation — swipe must still work)
    longPressStart.current = { x: e.clientX, y: e.clientY }
    longPressTimer.current = setTimeout(() => {
      longPressTimer.current = null
      setIsEditMode(true)
      startIconDrag(appId, pageIdx, slotIdx, e.clientX, e.clientY)
    }, LONG_PRESS_MS)
  }

  function handleIconPointerMove(e: React.PointerEvent) {
    if (!longPressTimer.current) return
    const dx = Math.abs(e.clientX - longPressStart.current.x)
    const dy = Math.abs(e.clientY - longPressStart.current.y)
    if (dx > 6 || dy > 6) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  function handleIconPointerUp() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  function handleAppTap(id: string) {
    if (isEditMode) return
    const app = getAllApps().find(a => a.id === id)
    if (app) kernelBus.emit('app:open', app)
    openApp(id)
  }

  function exitEditMode() {
    if (dragState) return
    setIsEditMode(false)
    persistLayout(layout)
  }

  // ── Compute per-page display items ───────────────────────────────────────────
  //
  // For the dragged icon's source page: remove it from the list (it appears as a ghost).
  // For the drop-target page: insert a visual placeholder at dropTarget.index.
  // data-slot on each real item = its index in the reduced array.
  // When elementsFromPoint picks up that value, it becomes the new dropTarget.index,
  // so the placeholder shifts to be in front of whatever item the user hovers over.

  const displayPages = useMemo(() => {
    type Cell =
      | { type: 'item'; id: string; dataSlot: number }
      | { type: 'placeholder' }
      | { type: 'end-zone'; dataSlot: number }

    return Array.from({ length: TOTAL_PAGES }, (_, pageIdx): Cell[] => {
      const original = layout[pageIdx] ?? []

      if (!dragState) {
        const cells: Cell[] = original.map((id, i) => ({ type: 'item', id, dataSlot: i }))
        cells.push({ type: 'end-zone', dataSlot: original.length })
        return cells
      }

      // Reduce: remove dragged icon from its source page
      const reduced = dragState.fromPage === pageIdx
        ? original.filter((_, i) => i !== dragState.fromIndex)
        : [...original]

      const insertAt = dropTarget?.page === pageIdx
        ? Math.min(dropTarget.index, reduced.length)
        : -1

      const cells: Cell[] = []

      reduced.forEach((id, ri) => {
        if (ri === insertAt) cells.push({ type: 'placeholder' })
        cells.push({ type: 'item', id, dataSlot: ri })
      })

      if (insertAt === reduced.length) cells.push({ type: 'placeholder' })

      // Invisible end-zone so the user can drop after all items on the page
      cells.push({ type: 'end-zone', dataSlot: reduced.length })

      return cells
    })
  }, [layout, dragState, dropTarget])

  const draggedApp = dragState ? getApp(dragState.appId) : null

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* Blurred Background Layer */}
      <div
        style={{
          position: 'absolute',
          inset: wallpaper ? -50 : 0,
          background: wallpaper ? `url(${wallpaper}) center/cover no-repeat` : colors.bgGradient,
          filter: wallpaper ? 'blur(13px)' : 'none',
          zIndex: -1,
        }}
      />

      {/* Ambient blobs */}
      {!wallpaper && (
        <>
          <div
            className="ambient-blob"
            style={{
              width: 500, height: 500,
              background: colors.accentBlue,
              top: -100, left: -100,
              // @ts-expect-error CSS custom property
              '--blob-duration': '25s', '--blob-tx': '40px', '--blob-ty': '20px',
            }}
          />
          <div
            className="ambient-blob"
            style={{
              width: 450, height: 450,
              background: colors.accentPurple,
              bottom: 0, right: -100,
              // @ts-expect-error CSS custom property
              '--blob-duration': '30s', '--blob-tx': '-25px', '--blob-ty': '35px',
            }}
          />
        </>
      )}

      <StatusBar transparent />

      {/* Done button — visible in edit mode */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingInline: spacing[4],
            paddingBottom: spacing[1],
          }}
        >
          <button
            onClick={exitEditMode}
            style={{
              color: '#fff',
              background: 'rgba(255,255,255,0.14)',
              border: '0.5px solid rgba(255,255,255,0.22)',
              borderRadius: 20,
              padding: '5px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </motion.div>
      )}

      {/* Swipeable strip — all pages rendered side-by-side */}
      <div
        ref={containerRef}
        style={{ flex: 1, overflow: 'hidden', position: 'relative', touchAction: 'pan-y' }}
        {...bind()}
        onClick={isEditMode && !dragState ? exitEditMode : undefined}
      >
        <motion.div
          style={{
            position: 'absolute',
            top: 0, bottom: 0, left: 0,
            width: `${TOTAL_PAGES * 100}%`,
            display: 'flex',
            x: stripX,
          }}
        >
          {displayPages.map((pageItems, pageIdx) => (
            <div
              key={pageIdx}
              style={{
                width: `${100 / TOTAL_PAGES}%`,
                height: '100%',
                display: 'grid',
                gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
                gridAutoRows: 'min-content',
                gap: spacing[5],
                padding: spacing[4],
                alignContent: 'start',
                flexShrink: 0,
                overflowX: 'hidden',
              }}
              role="grid"
              aria-label={`App grid, page ${pageIdx + 1} of ${TOTAL_PAGES}`}
            >
              {pageIdx === 0 && (
                <div style={WIDGET_SLOT_STYLE}>
                  <AnalogClock />
                </div>
              )}
              {pageIdx === 0 && (
                <div style={CALENDAR_SLOT_STYLE}>
                  <CalendarWidget />
                </div>
              )}
              {pageItems.map((cell, di) => {
                // ── Placeholder slot ──
                if (cell.type === 'placeholder') {
                  return (
                    <div
                      key={`ph-${pageIdx}-${di}`}
                      style={{
                        height: 80,
                        border: '2px dashed rgba(255,255,255,0.30)',
                        borderRadius: 16,
                        background: 'rgba(255,255,255,0.04)',
                      }}
                    />
                  )
                }

                // ── Invisible end-zone drop target ──
                if (cell.type === 'end-zone') {
                  return (
                    <div
                      key={`ez-${pageIdx}`}
                      data-page={pageIdx}
                      data-slot={cell.dataSlot}
                      style={{ height: 40, opacity: 0, pointerEvents: 'all' }}
                    />
                  )
                }

                // ── App icon ──
                const app = getApp(cell.id)
                if (!app) return null

                return (
                  <div
                    key={cell.id}
                    data-page={pageIdx}
                    data-slot={cell.dataSlot}
                    style={{ display: 'flex', justifyContent: 'center' }}
                    onPointerDown={e => handleIconPointerDown(cell.id, pageIdx, cell.dataSlot, e)}
                    onPointerMove={handleIconPointerMove}
                    onPointerUp={handleIconPointerUp}
                    onClick={e => e.stopPropagation()}
                  >
                    <AppIcon
                      manifest={app}
                      onTap={handleAppTap}
                      isEditing={isEditMode && !dragState}
                    />
                  </div>
                )
              })}
            </div>
          ))}
        </motion.div>

        {/* Ghost — the icon that follows the pointer during drag */}
        {draggedApp && dragState && (
          <div
            style={{
              position: 'fixed',
              left: dragState.clientX,
              top: dragState.clientY,
              transform: 'translate(-50%, -50%) scale(1.18)',
              pointerEvents: 'none',
              zIndex: 9999,
              filter: 'drop-shadow(0 10px 28px rgba(0,0,0,0.75))',
              willChange: 'left, top',
            }}
          >
            <AppIcon manifest={draggedApp} onTap={() => { }} size={60} />
          </div>
        )}
      </div>

      {/* Page dot indicators */}
      <div style={{ paddingBlock: spacing[2], flexShrink: 0 }}>
        <DotIndicator total={TOTAL_PAGES} active={currentPage} />
      </div>

      <Dock />
    </div>
  )
}
