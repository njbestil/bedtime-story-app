import { Router } from "express"
import {
  createStory,
  deleteStory,
  getStory,
  listStories,
  updateProgress,
  updateSaved,
} from "../controllers/storyController.ts"
import { sessionMiddleware } from "../middleware/sessionMiddleware.ts"
import { validateRequest } from "../middleware/validateRequest.ts"
import {
  createStorySchema,
  storyIdSchema,
  updateProgressSchema,
  updateSavedSchema,
} from "../validators/storyValidators.ts"

export const storyRouter = Router()

storyRouter.use(sessionMiddleware)
storyRouter.get("/stories", listStories)
storyRouter.post("/stories", validateRequest(createStorySchema), createStory)
storyRouter.get("/stories/:id", validateRequest(storyIdSchema), getStory)
storyRouter.patch("/stories/:id/progress", validateRequest(updateProgressSchema), updateProgress)
storyRouter.patch("/stories/:id/saved", validateRequest(updateSavedSchema), updateSaved)
storyRouter.delete("/stories/:id", validateRequest(storyIdSchema), deleteStory)
