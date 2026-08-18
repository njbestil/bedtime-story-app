import { z } from "zod"

export const storyIdSchema = z.object({
  params: z.object({
    id: z.uuid(),
  })
})

export const updateProgressSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    currentPage: z.number().int().positive()
  })
})

export const updateSavedSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    saved: z.boolean()
  })
})
