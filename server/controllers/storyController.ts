import type { NextFunction, Request, Response } from "express"
import {
  deleteStoryForSession,
  getStoryForSession,
  listSavedStories,
  updateStoryProgress,
  updateStorySaved,
} from "../models/storyModel.ts"

function getStoryId(request: Request): string {
  const storyId = request.params.id

  if (typeof storyId !== "string") {
    throw new Error("Validated story ID was not a string")
  }

  return storyId
}

export async function listStories(
  _request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const stories = await listSavedStories(response.locals.sessionId)

    response.json({
      data: stories,
    })
  } catch (error) {
    next(error)
  }
}

export async function getStory(request: Request, response: Response, next: NextFunction) {
  try {
    const story = await getStoryForSession(getStoryId(request), response.locals.sessionId)

    if (!story) {
      response.status(404).json({
        error: {
          code: "STORY_NOT_FOUND",
          message: "The requested story was not found.",
          requestId: response.locals.requestId,
        },
      })
      return
    }

    response.json({ data: story })
  } catch (error) {
    next(error)
  }
}

export async function updateSaved(request: Request, response: Response, next: NextFunction) {
  try {
    const story = await updateStorySaved(
      getStoryId(request),
      response.locals.sessionId,
      request.body.saved,
    )

    if (!story) {
      response.status(404).json({
        error: {
          code: "STORY_NOT_FOUND",
          message: "The requested story was not found.",
          requestId: response.locals.requestId,
        },
      })
      return
    }

    response.json({ data: { ...story, saved: request.body.saved } })
  } catch (error) {
    next(error)
  }
}

export async function updateProgress(request: Request, response: Response, next: NextFunction) {
  try {
    const outcome = await updateStoryProgress(
      getStoryId(request),
      response.locals.sessionId,
      request.body.currentPage,
    )

    if (outcome === "missing") {
      response.status(404).json({
        error: {
          code: "STORY_NOT_FOUND",
          message: "The requested story was not found.",
          requestId: response.locals.requestId,
        },
      })
      return
    }

    if (outcome === "out_of_range") {
      response.status(400).json({
        error: {
          code: "INVALID_PROGRESS",
          message: "The requested page is outside this story.",
          requestId: response.locals.requestId,
        },
      })
      return
    }

    response.status(204).send()
  } catch (error) {
    next(error)
  }
}

export async function deleteStory(request: Request, response: Response, next: NextFunction) {
  try {
    const deleted = await deleteStoryForSession(getStoryId(request), response.locals.sessionId)

    if (!deleted) {
      response.status(404).json({
        error: {
          code: "STORY_NOT_FOUND",
          message: "The requested story was not found.",
          requestId: response.locals.requestId,
        },
      })
      return
    }

    response.status(204).send()
  } catch (error) {
    next(error)
  }
}
