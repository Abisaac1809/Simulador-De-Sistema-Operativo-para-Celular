import { useState, useEffect, useCallback } from 'react'
import { notes, type NoteRecord } from '../../../kernel/storage'

export function useNoteEditor(initial: NoteRecord) {
  const [title, setTitle] = useState(initial.title)
  const [body, setBody] = useState(initial.body)

  useEffect(() => {
    setTitle(initial.title)
    setBody(initial.body)
  }, [initial.id])

  const save = useCallback(async () => {
    await notes.put({ ...initial, title, body, updatedAt: Date.now() })
  }, [initial, title, body])

  return { title, body, setTitle, setBody, save }
}
