import { Router } from 'express'
import { seedStory } from '../controllers/developmentController.ts'
import { sessionMiddleware } from '../middleware/sessionMiddleware.ts'

export const developmentRouter = Router()

developmentRouter.use(sessionMiddleware)
developmentRouter.post('/seed-story', seedStory)
