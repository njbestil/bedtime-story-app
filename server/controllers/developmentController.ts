import type { NextFunction, Request, Response } from 'express'
import { getOrCreateDevelopmentSeedStory } from '../models/storyModel.ts'

export async function seedStory(_request: Request, response: Response, next: NextFunction) {
  try {
    const story = await getOrCreateDevelopmentSeedStory(response.locals.sessionId)

    response.status(story.created ? 201 : 200).json({ data: story })
  } catch (error) {
    next(error)
  }
}
