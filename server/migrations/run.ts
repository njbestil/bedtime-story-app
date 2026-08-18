import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { database } from '../config/database.ts'

// import.meta.url - points to the current file path. ../server/migrations/run.ts
// new URL('.', import.meta.url) - direct the file one stepped back to ../server/migrations
const migrationsDirectory = fileURLToPath(new URL('.', import.meta.url))

async function runMigrations() {
  const client = await database.connect()

  try {
    await client.query('BEGIN')
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    const appliedMigrations = await client.query<{ name: string }>(
      'SELECT name FROM schema_migrations',
    )
    const appliedMigrationNames = new Set(
      appliedMigrations.rows.map((migration) => migration.name),
    )
    const migrationNames = (await readdir(migrationsDirectory))
      .filter((name) => name.endsWith('.sql'))
      .sort()

    for (const name of migrationNames) {
      // skips schema that already created
      if (appliedMigrationNames.has(name)) {
        continue
      }

      const sql = await readFile(new URL(name, import.meta.url), 'utf8')
      await client.query(sql)
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name])
      console.log(`Applied migration ${name}`)
    }

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

try {
  await runMigrations()
} finally {
  await database.end()
}
