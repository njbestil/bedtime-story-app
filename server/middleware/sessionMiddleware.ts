import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { environment } from '../config/environment.ts'
import { getOrCreateSession } from '../models/sessionModel.ts'

const SESSION_COOKIE_NAME = 'bedtime_story_session'
const sessionIdSchema = z.uuid()

export async function sessionMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const parsedSessionId = sessionIdSchema.safeParse(request.cookies[SESSION_COOKIE_NAME])
    const sessionId = await getOrCreateSession(
      parsedSessionId.success ? parsedSessionId.data : undefined,
    )

    response.cookie(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: environment.NODE_ENV === 'production',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    })
    response.locals.sessionId = sessionId

    next()
  } catch (error) {
    next(error)
  }
}
