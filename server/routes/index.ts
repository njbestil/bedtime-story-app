import { Router } from "express"
import { database } from "../config/database.ts"
import { environment } from '../config/environment.ts'
import { developmentRouter } from './developmentRoutes.ts'
import { storyRouter } from "./storyRoutes.ts"

export const apiRouter = Router()

apiRouter.get("/health", (_request, response) => {
  response.json({
    status: "ok",
  })
})

apiRouter.get("/database-health", async (_request, response, next) => {
  try {
    const result = await database.query<{
      database_name: string
      checked_at: Date
    }>(`SELECT current_database() AS database_name, NOW() AS checked_at`)

    response.json({
      status: "ok",
      database: result.rows[0]?.database_name,
      checkedAt: result.rows[0]?.checked_at,
    })
  } catch (error) {
    next(error)
  }
})

apiRouter.use(storyRouter)

if (environment.NODE_ENV === 'development') {
  apiRouter.use('/development', developmentRouter)
}
