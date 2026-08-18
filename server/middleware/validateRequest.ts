import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod"
import { z } from "zod"

export function validateRequest(schema: ZodType) {
  return (request: Request, response: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query,
      headers: request.headers,
    })

    if(!result.success) {
      return response.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Please correct the invalid fields.",
          details: z.treeifyError(result.error),
          requestId: response.locals.requestId,
        },
      })
    }

    response.locals.validated = result.data
    next()
  }
}