import { useState, useEffect, useCallback } from 'react'
import { notes, type NoteRecord } from '../../../kernel/storage'

export function useNotes() {
  const [noteList, setNoteList] = useState<NoteRecord[]>([])

  const refresh = useCallback(async () => {
    const all = await notes.getAll()
    const sorted = [...all].sort((a, b) => b.updatedAt - a.updatedAt)
    setNoteList(sorted)
  }, [])

  const createNote = useCallback(async (): Promise<NoteRecord> => {
    const newNote: NoteRecord = {
      id: crypto.randomUUID(),
      title: '',
      body: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    await notes.put(newNote)
    await refresh()
    return newNote
  }, [refresh])

  const deleteNote = useCallback(async (id: string) => {
    await notes.delete(id)
    await refresh()
  }, [refresh])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { noteList, createNote, deleteNote, refresh }
}
