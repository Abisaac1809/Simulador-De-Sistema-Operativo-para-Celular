import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOSStore } from '../../kernel/store'
import { useAlarms } from './hooks/useAlarms'
import { useStopwatch } from './hooks/useStopwatch'
import { useTimer } from './hooks/useTimer'
import TabBar, { type TabId } from './molecules/TabBar'
import AlarmList from './molecules/AlarmList'
import AlarmEditor from './molecules/AlarmEditor'
import AlarmFiringModal from './molecules/AlarmFiringModal'
import StopwatchDisplay from './molecules/StopwatchDisplay'
import TimerDisplay from './molecules/TimerDisplay'
import { Typography, colors, spacing, fadeIn } from '../../design'
import type { AlarmRecord } from '../../kernel/storage'

const TAB_BAR_HEIGHT = 72
const CONTENT_BOTTOM_PAD = TAB_BAR_HEIGHT + spacing[4]

function formatClockTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
}

export default function ClockApp() {
  const [activeTab, setActiveTab] = useState<TabId>('clock')
  const [alarmEditor, setAlarmEditor] = useState<null | 'new' | AlarmRecord>(null)

  const time = useOSStore(s => s.time) as Date
  const alarmHook = useAlarms()
  const stopwatch = useStopwatch()
  const timer = useTimer()

  const { alarmList, firingAlarm, addAlarm, updateAlarm, deleteAlarm, toggleAlarm, dismiss, snooze } = alarmHook

  function handleSaveAlarm(alarm: AlarmRecord) {
    if (alarmEditor === 'new') {
      addAlarm(alarm)
    } else {
      updateAlarm(alarm)
    }
    setAlarmEditor(null)
  }

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: colors.bg,
      }}
    >
      {/* Tab content area */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          paddingBottom: CONTENT_BOTTOM_PAD,
        }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'clock' && (
            <motion.div
              key="clock"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <Typography variant="time" style={{ fontSize: 64, letterSpacing: '-2px' }}>
                {formatClockTime(time)}
              </Typography>
              <Typography variant="label" style={{ marginTop: spacing[3] }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Typography>
            </motion.div>
          )}

          {activeTab === 'alarms' && (
            <motion.div
              key="alarms"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ height: '100%', position: 'relative' }}
            >
              <AlarmList
                alarmList={alarmList}
                onToggle={toggleAlarm}
                onDelete={deleteAlarm}
                onAdd={() => setAlarmEditor('new')}
                onEdit={alarm => setAlarmEditor(alarm)}
              />
              <AnimatePresence>
                {alarmEditor !== null && (
                  <AlarmEditor
                    key="editor"
                    initial={alarmEditor === 'new' ? undefined : alarmEditor}
                    onSave={handleSaveAlarm}
                    onCancel={() => setAlarmEditor(null)}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {firingAlarm && (
                  <AlarmFiringModal
                    key="firing"
                    alarm={firingAlarm}
                    onDismiss={dismiss}
                    onSnooze={snooze}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'timer' && (
            <motion.div
              key="timer"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ height: '100%' }}
            >
              <TimerDisplay {...timer} />
            </motion.div>
          )}

          {activeTab === 'stopwatch' && (
            <motion.div
              key="stopwatch"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ height: '100%' }}
            >
              <StopwatchDisplay {...stopwatch} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tab bar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
