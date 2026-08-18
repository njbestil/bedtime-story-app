import { randomUUID } from 'node:crypto'
import { database } from '../config/database.ts'

export async function getOrCreateSession(existingSessionId?: string) {
  if (existingSessionId) {
    const existingSession = await database.query<{ id: string }>(
      'SELECT id FROM sessions WHERE id = $1',
      [existingSessionId],
    )

    if (existingSession.rowCount) {
      await database.query('UPDATE sessions SET last_seen_at = NOW() WHERE id = $1', [
        existingSessionId,
      ])
      return existingSessionId
    }
  }

  const sessionId = randomUUID()
  await database.query('INSERT INTO sessions (id) VALUES ($1)', [sessionId])

  return sessionId
}
