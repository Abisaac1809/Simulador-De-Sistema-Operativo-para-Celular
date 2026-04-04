import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import {
  contacts, messages, notes, bookmarks, callLog, audioTracks,
  getStorageStats, _resetDbForTesting,
} from '../storage'
import type { Contact, Message, CallRecord } from '../../types'
import type { NoteRecord, BookmarkRecord, AudioTrackRecord } from '../storage'

// Use a fresh in-memory IDB for every test
beforeEach(() => {
  ;(globalThis as unknown as Record<string, unknown>).indexedDB = new IDBFactory()
  _resetDbForTesting()
})

const sampleContact: Contact = {
  id: 'c1',
  name: 'Alice',
  phone: '+1 555-0100',
  email: 'alice@example.com',
}

const sampleMessage: Message = {
  id: 'm1',
  contactId: 'c1',
  text: 'Hello!',
  timestamp: Date.now(),
  direction: 'received',
  read: false,
}

const sampleCall: CallRecord = {
  id: 'call1',
  contactId: 'c1',
  type: 'incoming',
  duration: 120,
  timestamp: Date.now(),
}

const sampleNote: NoteRecord = {
  id: 'note1',
  title: 'Todo',
  body: '- buy milk',
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

const sampleBookmark: BookmarkRecord = {
  id: 'bm1',
  title: 'Wikipedia',
  url: 'https://wikipedia.org',
  favicon: '',
}

const sampleTrack: AudioTrackRecord = {
  id: 'track1',
  title: 'Test Song',
  artist: 'Test Artist',
  duration: 180,
  blob: new Blob(['audio'], { type: 'audio/mpeg' }),
}

describe('contacts CRUD', () => {
  it('put and get a contact', async () => {
    await contacts.put(sampleContact)
    const result = await contacts.get('c1')
    expect(result?.name).toBe('Alice')
  })

  it('getAll returns all contacts', async () => {
    await contacts.put(sampleContact)
    const all = await contacts.getAll()
    expect(all).toHaveLength(1)
  })

  it('delete removes the contact', async () => {
    await contacts.put(sampleContact)
    await contacts.delete('c1')
    const result = await contacts.get('c1')
    expect(result).toBeUndefined()
  })
})

describe('messages CRUD', () => {
  it('put and get a message', async () => {
    await messages.put(sampleMessage)
    const result = await messages.get('m1')
    expect(result?.text).toBe('Hello!')
  })

  it('getByContact returns messages for a contact', async () => {
    await messages.put(sampleMessage)
    const result = await messages.getByContact('c1')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('m1')
  })

  it('delete removes the message', async () => {
    await messages.put(sampleMessage)
    await messages.delete('m1')
    expect(await messages.get('m1')).toBeUndefined()
  })
})

describe('callLog CRUD', () => {
  it('put and get a call record', async () => {
    await callLog.put(sampleCall)
    const result = await callLog.get('call1')
    expect(result?.type).toBe('incoming')
  })

  it('delete removes the call record', async () => {
    await callLog.put(sampleCall)
    await callLog.delete('call1')
    expect(await callLog.get('call1')).toBeUndefined()
  })
})

describe('notes CRUD', () => {
  it('put and get a note', async () => {
    await notes.put(sampleNote)
    const result = await notes.get('note1')
    expect(result?.title).toBe('Todo')
  })

  it('delete removes the note', async () => {
    await notes.put(sampleNote)
    await notes.delete('note1')
    expect(await notes.get('note1')).toBeUndefined()
  })
})

describe('bookmarks CRUD', () => {
  it('put and get a bookmark', async () => {
    await bookmarks.put(sampleBookmark)
    const result = await bookmarks.get('bm1')
    expect(result?.title).toBe('Wikipedia')
  })

  it('delete removes the bookmark', async () => {
    await bookmarks.put(sampleBookmark)
    await bookmarks.delete('bm1')
    expect(await bookmarks.get('bm1')).toBeUndefined()
  })
})

describe('audioTracks CRUD', () => {
  it('put and get a track', async () => {
    await audioTracks.put(sampleTrack)
    const result = await audioTracks.get('track1')
    expect(result?.title).toBe('Test Song')
  })

  it('delete removes the track', async () => {
    await audioTracks.put(sampleTrack)
    await audioTracks.delete('track1')
    expect(await audioTracks.get('track1')).toBeUndefined()
  })
})

describe('getStorageStats', () => {
  it('returns accurate counts per store', async () => {
    await contacts.put(sampleContact)
    await messages.put(sampleMessage)
    await notes.put(sampleNote)
    const stats = await getStorageStats()
    expect(stats.contacts).toBe(1)
    expect(stats.messages).toBe(1)
    expect(stats.notes).toBe(1)
    expect(stats.bookmarks).toBe(0)
  })
})
