import { randomUUID } from "node:crypto"
import type { NextFunction, Request, Response } from "express"

export function requestId(
  _request: Request,
  response: Response,
  next: NextFunction
) {
  const id = randomUUID();

  response.locals.requestId = id
  response.setHeader("X-Request-Id", id)

  next()
}