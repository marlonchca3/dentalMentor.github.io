import { Timestamp, serverTimestamp } from '@/lib/firebase'

export function nowTimestamp() {
  return serverTimestamp()
}

export function toDateString(timestamp: unknown): string {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleString('es-PE')
  }

  return '-'
}
