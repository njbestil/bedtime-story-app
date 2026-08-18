import type { Request, Response } from "express"

export function notFoundHandler(_request: Request, response: Response) {
  response.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "The requested endpoint was not found.",
      requestId: response.locals.requestId
    }
  })
}
