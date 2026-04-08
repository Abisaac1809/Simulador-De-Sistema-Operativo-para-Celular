import { useState, useEffect, useRef } from 'react'
import { alarms, type AlarmRecord } from '../../../kernel/storage'
import { kernelBus } from '../../../kernel/events'
import { useOSStore } from '../../../kernel/store'

const POLL_INTERVAL_MS = 1000
const SNOOZE_MINUTES = 5

function getCurrentMinute(): string {
  const date = useOSStore.getState().time as Date
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

function addMinutes(hhmm: string, mins: number): string {
  const [hStr, mStr] = hhmm.split(':')
  const totalMins = parseInt(hStr) * 60 + parseInt(mStr) + mins
  const newH = Math.floor(totalMins / 60) % 24
  const newM = totalMins % 60
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`
}

export function useAlarms() {
  const [alarmList, setAlarmList] = useState<AlarmRecord[]>([])
  const [firingAlarm, setFiringAlarm] = useState<AlarmRecord | null>(null)
  const [snoozedUntil, setSnoozedUntil] = useState<string | null>(null)
  const firedMinuteRef = useRef<string>('')
  const snoozedAlarmRef = useRef<AlarmRecord | null>(null)

  async function refresh() {
    const list = await alarms.getAll()
    setAlarmList(list)
  }

  useEffect(() => {
    refresh()

    const interval = setInterval(() => {
      const currentMinute = getCurrentMinute()

      // Check snooze re-fire
      if (snoozedUntil && snoozedAlarmRef.current && snoozedUntil === currentMinute) {
        setFiringAlarm(snoozedAlarmRef.current)
        setSnoozedUntil(null)
        snoozedAlarmRef.current = null
        kernelBus.emit('system:sound', { type: 'notification' })
        return
      }

      // Already fired this minute
      if (firedMinuteRef.current === currentMinute) return

      setAlarmList(current => {
        for (const alarm of current) {
          if (alarm.enabled && alarm.time === currentMinute) {
            firedMinuteRef.current = currentMinute
            setFiringAlarm(alarm)
            kernelBus.emit('system:sound', { type: 'notification' })
            break
          }
        }
        return current
      })
    }, POLL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [snoozedUntil])

  function dismiss() {
    firedMinuteRef.current = getCurrentMinute()
    setFiringAlarm(null)
  }

  function snooze() {
    const snoozeTime = addMinutes(getCurrentMinute(), SNOOZE_MINUTES)
    snoozedAlarmRef.current = firingAlarm
    setSnoozedUntil(snoozeTime)
    setFiringAlarm(null)
  }

  async function addAlarm(alarm: AlarmRecord) {
    await alarms.put(alarm)
    await refresh()
  }

  async function updateAlarm(alarm: AlarmRecord) {
    await alarms.put(alarm)
    await refresh()
  }

  async function deleteAlarm(id: string) {
    await alarms.delete(id)
    await refresh()
  }

  async function toggleAlarm(id: string) {
    const alarm = await alarms.get(id)
    if (alarm) {
      await alarms.put({ ...alarm, enabled: !alarm.enabled })
      await refresh()
    }
  }

  return { alarmList, firingAlarm, addAlarm, updateAlarm, deleteAlarm, toggleAlarm, dismiss, snooze }
}
