import { Pool } from "pg"
import { environment } from "./environment.ts"

export const database = new Pool({
  host: environment.POSTGRES_HOST,
  port: environment.POSTGRES_PORT,
  database: environment.POSTGRES_DB,
  user: environment.POSTGRES_USER,
  password: environment.POSTGRES_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})