import { app } from "./app.js"
import { database } from "./config/database.js"
import { environment } from "./config/environment.js"

const server = app.listen(environment.PORT, () => {
  console.log(`API listening on http://localhost:${environment.PORT}`)
})

async function shutdown(signal: string) {
  console.log(`Received ${signal}; shutting down server...`)

  server.close(async () => {
    await database.end()
    process.exit(0)
  })
}

process.on("SIGINT", () => void shutdown("SIGINT"))
process.on("SIGTERM", () => void shutdown("SIGTERM"))