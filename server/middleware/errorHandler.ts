import type { NextFunction, Request, Response } from "express"

function isMalformedJsonError(error: unknown): boolean {
  return (
    error instanceof SyntaxError &&
    (error as { status?: number }).status === 400 &&
    (error as { type?: string }).type === "entity.parse.failed"
  )
}

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  void _next

  if (isMalformedJsonError(error)) {
    response.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "The request body must contain valid JSON.",
        requestId: response.locals.requestId,
      },
    })
    return
  }

  console.error("Unhandled server error", {
    error,
    requestId: response.locals.requestId,
  })

  response.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "The server could not complete the request.",
      requestId: response.locals.requestId
    }
  })
}
