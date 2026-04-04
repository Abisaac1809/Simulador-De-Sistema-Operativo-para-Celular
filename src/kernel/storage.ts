import { openDB, type IDBPDatabase } from 'idb'
import type { Contact, Message, CallRecord, StorageFile } from '../types'

export const DB_NAME = 'nova-os'
export const DB_VERSION = 1

export interface NoteRecord {
  id: string
  title: string
  body: string
  createdAt: number
  updatedAt: number
}

export interface BookmarkRecord {
  id: string
  title: string
  url: string
  favicon: string
}

export interface AudioTrackRecord {
  id: string
  title: string
  artist: string
  duration: number
  blob: Blob
}

interface NovaDB {
  files: {
    key: string
    value: StorageFile
    indexes: { byMimeType: string }
  }
  contacts: {
    key: string
    value: Contact
    indexes: { byName: string }
  }
  messages: {
    key: string
    value: Message
    indexes: { byContactId: string; byTimestamp: number }
  }
  callLog: {
    key: string
    value: CallRecord
    indexes: { byContactId: string; byTimestamp: number }
  }
  notes: {
    key: string
    value: NoteRecord
    indexes: { byUpdatedAt: number }
  }
  bookmarks: {
    key: string
    value: BookmarkRecord
  }
  audioTracks: {
    key: string
    value: AudioTrackRecord
    indexes: { byTitle: string }
  }
}

let dbPromise: Promise<IDBPDatabase<NovaDB>> | null = null

export function _resetDbForTesting() {
  dbPromise = null
}

export function getDB(): Promise<IDBPDatabase<NovaDB>> {
  if (!dbPromise) {
    dbPromise = openDB<NovaDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const files = db.createObjectStore('files', { keyPath: 'path' })
          files.createIndex('byMimeType', 'mimeType')

          const contacts = db.createObjectStore('contacts', { keyPath: 'id' })
          contacts.createIndex('byName', 'name')

          const messages = db.createObjectStore('messages', { keyPath: 'id' })
          messages.createIndex('byContactId', 'contactId')
          messages.createIndex('byTimestamp', 'timestamp')

          const callLog = db.createObjectStore('callLog', { keyPath: 'id' })
          callLog.createIndex('byContactId', 'contactId')
          callLog.createIndex('byTimestamp', 'timestamp')

          const notes = db.createObjectStore('notes', { keyPath: 'id' })
          notes.createIndex('byUpdatedAt', 'updatedAt')

          db.createObjectStore('bookmarks', { keyPath: 'id' })

          const audioTracks = db.createObjectStore('audioTracks', { keyPath: 'id' })
          audioTracks.createIndex('byTitle', 'title')
        }
      },
    })
  }
  return dbPromise
}

type StoreName = keyof NovaDB

async function getAll<S extends StoreName>(store: S): Promise<NovaDB[S]['value'][]> {
  try {
    const db = await getDB()
    return db.getAll(store) as Promise<NovaDB[S]['value'][]>
  } catch (err) {
    console.error(`[storage] getAll(${store}) failed:`, err)
    throw err
  }
}

async function get<S extends StoreName>(store: S, key: string): Promise<NovaDB[S]['value'] | undefined> {
  try {
    const db = await getDB()
    return db.get(store, key) as Promise<NovaDB[S]['value'] | undefined>
  } catch (err) {
    console.error(`[storage] get(${store}, ${key}) failed:`, err)
    throw err
  }
}

async function put<S extends StoreName>(store: S, value: NovaDB[S]['value']): Promise<void> {
  try {
    const db = await getDB()
    await db.put(store, value as never)
  } catch (err) {
    console.error(`[storage] put(${store}) failed:`, err)
    throw err
  }
}

async function remove(store: StoreName, key: string): Promise<void> {
  try {
    const db = await getDB()
    await db.delete(store, key)
  } catch (err) {
    console.error(`[storage] remove(${store}, ${key}) failed:`, err)
    throw err
  }
}

export const files = {
  getAll: () => getAll('files'),
  get: (path: string) => get('files', path),
  put: (file: StorageFile) => put('files', file),
  delete: (path: string) => remove('files', path),
}

export const contacts = {
  getAll: () => getAll('contacts'),
  get: (id: string) => get('contacts', id),
  put: (contact: Contact) => put('contacts', contact),
  delete: (id: string) => remove('contacts', id),
}

export const messages = {
  getAll: () => getAll('messages'),
  get: (id: string) => get('messages', id),
  put: (message: Message) => put('messages', message),
  delete: (id: string) => remove('messages', id),
  async getByContact(contactId: string): Promise<Message[]> {
    const db = await getDB()
    return db.getAllFromIndex('messages', 'byContactId', contactId)
  },
}

export const callLog = {
  getAll: () => getAll('callLog'),
  get: (id: string) => get('callLog', id),
  put: (record: CallRecord) => put('callLog', record),
  delete: (id: string) => remove('callLog', id),
  async getByContact(contactId: string): Promise<CallRecord[]> {
    const db = await getDB()
    return db.getAllFromIndex('callLog', 'byContactId', contactId)
  },
}

export const notes = {
  getAll: () => getAll('notes'),
  get: (id: string) => get('notes', id),
  put: (note: NoteRecord) => put('notes', note),
  delete: (id: string) => remove('notes', id),
}

export const bookmarks = {
  getAll: () => getAll('bookmarks'),
  get: (id: string) => get('bookmarks', id),
  put: (bookmark: BookmarkRecord) => put('bookmarks', bookmark),
  delete: (id: string) => remove('bookmarks', id),
}

export const audioTracks = {
  getAll: () => getAll('audioTracks'),
  get: (id: string) => get('audioTracks', id),
  put: (track: AudioTrackRecord) => put('audioTracks', track),
  delete: (id: string) => remove('audioTracks', id),
}

export interface StorageStats {
  files: number
  contacts: number
  messages: number
  callLog: number
  notes: number
  bookmarks: number
  audioTracks: number
}

export async function getStorageStats(): Promise<StorageStats> {
  const db = await getDB()
  const [f, c, m, cl, n, b, at] = await Promise.all([
    db.count('files'),
    db.count('contacts'),
    db.count('messages'),
    db.count('callLog'),
    db.count('notes'),
    db.count('bookmarks'),
    db.count('audioTracks'),
  ])
  return { files: f, contacts: c, messages: m, callLog: cl, notes: n, bookmarks: b, audioTracks: at }
}
