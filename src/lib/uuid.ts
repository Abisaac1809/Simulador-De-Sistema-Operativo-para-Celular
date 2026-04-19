/**
 * generateUUID — UUID v4 compatible with all iOS versions.
 *
 * `crypto.randomUUID()` was added in iOS 15.4 / Safari 15.4.
 * Devices on older iOS versions (iPhone with iOS < 15.4) throw
 * "crypto.randomUUID is not a function". This helper falls back
 * to `crypto.getRandomValues` which has been available since iOS 6.
 */
export function generateUUID(): string {
  if (typeof (crypto as { randomUUID?: () => string }).randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // UUID v4 polyfill via crypto.getRandomValues
  const buf = crypto.getRandomValues(new Uint8Array(16))
  buf[6] = (buf[6] & 0x0f) | 0x40  // version 4
  buf[8] = (buf[8] & 0x3f) | 0x80  // variant 10xx
  const hex = Array.from(buf, b => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
