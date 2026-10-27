import { z } from "zod"

const optionalText = (maximumLength: number) =>
  z.string().trim().max(maximumLength).transform((value) => value || undefined)

export const createStorySchema = z.object({
  body: z.object({
    category: z.string().trim().min(1).max(64),
    description: z.string().trim().min(1).max(2_000),
    childName: optionalText(100),
    ageRange: optionalText(32),
    length: z.enum(["Short", "Medium", "Long"]),
    lesson: optionalText(300),
  }),
})

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
