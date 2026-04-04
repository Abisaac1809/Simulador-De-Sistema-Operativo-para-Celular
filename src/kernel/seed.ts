import { contacts, messages, callLog, notes } from './storage'
import type { Contact, Message, CallRecord } from '../types'
import type { NoteRecord } from './storage'

const SEED_KEY = 'nova-os-seeded-v1'

// Fixed IDs so foreign-key references between records stay consistent
const ALICE_ID = 'seed-contact-alice'
const BOB_ID = 'seed-contact-bob'
const CAROL_ID = 'seed-contact-carol'
const DAVID_ID = 'seed-contact-david'

const seedContacts: Contact[] = [
  { id: ALICE_ID, name: 'Alice Johnson', phone: '+1 555-0101', email: 'alice@example.com' },
  { id: BOB_ID,   name: 'Bob Martinez',  phone: '+1 555-0102', email: 'bob@example.com' },
  { id: CAROL_ID, name: 'Carol White',   phone: '+1 555-0103', email: 'carol@example.com' },
  { id: DAVID_ID, name: 'David Kim',     phone: '+1 555-0104', email: 'david@example.com' },
]

const now = Date.now()
const min = 60_000

const seedMessages: Message[] = [
  { id: 'seed-msg-1', contactId: ALICE_ID, text: 'Hey! Are you free tonight?',         timestamp: now - 30 * min, direction: 'received', read: true  },
  { id: 'seed-msg-2', contactId: ALICE_ID, text: 'Yeah, let\'s meet at 7!',             timestamp: now - 28 * min, direction: 'sent',     read: true  },
  { id: 'seed-msg-3', contactId: ALICE_ID, text: 'Great, see you there 😊',             timestamp: now - 27 * min, direction: 'received', read: false },
  { id: 'seed-msg-4', contactId: BOB_ID,   text: 'Did you get the report I sent?',      timestamp: now - 60 * min, direction: 'received', read: true  },
  { id: 'seed-msg-5', contactId: BOB_ID,   text: 'Just reading it now, looks good.',    timestamp: now - 55 * min, direction: 'sent',     read: true  },
  { id: 'seed-msg-6', contactId: CAROL_ID, text: 'Happy birthday!! 🎉',                 timestamp: now - 2 * 60 * min, direction: 'sent', read: true  },
  { id: 'seed-msg-7', contactId: CAROL_ID, text: 'Thank you so much! ❤️',              timestamp: now - 90 * min, direction: 'received', read: true  },
]

const seedCallLog: CallRecord[] = [
  { id: 'seed-call-1', contactId: ALICE_ID, type: 'incoming',  duration: 312, timestamp: now - 2 * 60 * min },
  { id: 'seed-call-2', contactId: BOB_ID,   type: 'outgoing',  duration: 87,  timestamp: now - 5 * 60 * min },
  { id: 'seed-call-3', contactId: DAVID_ID, type: 'missed',    duration: 0,   timestamp: now - 8 * 60 * min },
  { id: 'seed-call-4', contactId: CAROL_ID, type: 'outgoing',  duration: 540, timestamp: now - 24 * 60 * min },
]

const seedNotes: NoteRecord[] = [
  {
    id: 'seed-note-1',
    title: 'Grocery List',
    body: '- Milk\n- Eggs\n- Bread\n- Coffee\n- Bananas',
    createdAt: now - 3 * 24 * 60 * min,
    updatedAt: now - 1 * 24 * 60 * min,
  },
  {
    id: 'seed-note-2',
    title: 'Project Ideas',
    body: '1. Build a habit tracker\n2. Weather dashboard\n3. Recipe organiser',
    createdAt: now - 7 * 24 * 60 * min,
    updatedAt: now - 7 * 24 * 60 * min,
  },
  {
    id: 'seed-note-3',
    title: 'Meeting Notes',
    body: 'Q2 planning:\n- Review OKRs\n- Headcount decisions by Friday\n- Design review Monday 10am',
    createdAt: now - 1 * 24 * 60 * min,
    updatedAt: now - 1 * 24 * 60 * min,
  },
]

export async function runSeed(): Promise<void> {
  if (typeof localStorage === 'undefined') return
  if (localStorage.getItem(SEED_KEY)) return

  try {
    await Promise.all([
      ...seedContacts.map(c => contacts.put(c)),
      ...seedMessages.map(m => messages.put(m)),
      ...seedCallLog.map(r => callLog.put(r)),
      ...seedNotes.map(n => notes.put(n)),
    ])
    localStorage.setItem(SEED_KEY, '1')
  } catch (err) {
    console.error('[seed] Failed to seed database:', err)
  }
}
