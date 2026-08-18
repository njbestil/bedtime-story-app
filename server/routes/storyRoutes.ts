import { Router } from "express"
import {
  deleteStory,
  getStory,
  listStories,
  updateProgress,
  updateSaved,
} from "../controllers/storyController.ts"
import { sessionMiddleware } from "../middleware/sessionMiddleware.ts"
import { validateRequest } from "../middleware/validateRequest.ts"
import {
  storyIdSchema,
  updateProgressSchema,
  updateSavedSchema,
} from "../validators/storyValidators.ts"

export const storyRouter = Router()

storyRouter.use(sessionMiddleware)
storyRouter.get("/stories", listStories)
storyRouter.get("/stories/:id", validateRequest(storyIdSchema), getStory)
storyRouter.patch("/stories/:id/progress", validateRequest(updateProgressSchema), updateProgress)
storyRouter.patch("/stories/:id/saved", validateRequest(updateSavedSchema), updateSaved)
storyRouter.delete("/stories/:id", validateRequest(storyIdSchema), deleteStory)
