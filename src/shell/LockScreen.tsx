import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useDrag } from '@use-gesture/react'
import { useOSStore } from '../kernel/store'
import { GlassCard, GlassPill, Typography } from '../design'
import { colors, spacing, glass } from '../design/tokens'
import { slideUpFull } from '../design/animations'
import StatusBar from './StatusBar'

export interface LockScreenProps {
  wallpaper?: string
}

const UNLOCK_THRESHOLD = 60

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

export default function LockScreen({ wallpaper }: LockScreenProps = {}) {
  const time = useOSStore(s => s.time)
  const unlock = useOSStore(s => s.unlock)

  const y = useMotionValue(0)
  const springY = useSpring(y, { damping: 20, stiffness: 150 })
  const dismissed = useRef(false)

  const bind = useDrag(
    ({ movement: [, my], last, velocity: [, vy] }) => {
      if (dismissed.current) return

      const clampedY = Math.min(0, my)
      y.set(clampedY)

      if (last) {
        const fastEnough = vy < -0.5
        const farEnough = clampedY < -UNLOCK_THRESHOLD

        if (fastEnough || farEnough) {
          dismissed.current = true
          unlock()
        } else {
          springY.set(0)
          y.set(0)
        }
      }
    },
    { axis: 'y', filterTaps: true }
  )

  return (
    <div
      {...bind()}
      style={{ position: 'absolute', inset: 0, touchAction: 'none'}}
    >
    <motion.div
      variants={slideUpFull}
      initial="initial"
      animate="initial"
      exit="exit"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        background: wallpaper ? `url(${wallpaper}) center/cover no-repeat` : colors.bgGradient,
        overflow: 'hidden',
        y: springY,
      }}
    >
      {!wallpaper && (
        <>
          <div
        className="ambient-blob"
        style={{
          width: 300,
          height: 300,
          background: colors.accent,
          top: -80,
          right: -60,
          // @ts-expect-error CSS custom property
          '--blob-duration': '22s',
          '--blob-tx': '20px',
          '--blob-ty': '15px',
        }}
      />
      <div
        className="ambient-blob"
        style={{
          width: 220,
          height: 220,
          background: colors.accentPurple,
          bottom: 120,
          left: -50,
          // @ts-expect-error CSS custom property
          '--blob-duration': '28s',
          '--blob-tx': '-15px',
          '--blob-ty': '20px',
        }}
      />
        </>
      )}

      {/* Status bar */}
      <StatusBar transparent />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[2],
          paddingBottom: spacing[8],
          position: 'relative',
        }}
      >
        <Typography variant="time">
          {formatTime(time)}
        </Typography>
        <Typography variant="label" style={{ opacity: 0.7, fontSize:"18px" }}>
          {formatDate(time)}
        </Typography>

        {/* Info cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: spacing[3],
            marginTop: spacing[6],
            width: '100%',
            maxWidth: 320,
            paddingInline: spacing[4],
          }}
        >
          <GlassCard
            style={{ flex: 1 }}
            padding={spacing[3]}
          >
            <Typography variant="muted" style={{ display: 'block', marginBottom: 2 }}>
              Alarm
            </Typography>
            <Typography variant="label">
              No alarm
            </Typography>
          </GlassCard>

          <GlassCard
            style={{ flex: 1 }}
            padding={spacing[3]}
          >
            <Typography variant="muted" style={{ display: 'block', marginBottom: 2 }}>
              Weather
            </Typography>
            <Typography variant="label">
              — °C
            </Typography>
          </GlassCard>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing[3],
          paddingBottom: `calc(${spacing[8]}px + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 100,
            backgroundColor: colors.glassBorderActive,
          }}
          aria-hidden="true"
        />

        <GlassPill
          style={{
            paddingInline: spacing[6],
            paddingBlock: spacing[3],
            backdropFilter: glass.backdropFilter,
            WebkitBackdropFilter: glass.backdropFilter,
          }}
        >
          Desliza para desbloquear
        </GlassPill>
      </div>
    </motion.div>
    </div>
  )
}
