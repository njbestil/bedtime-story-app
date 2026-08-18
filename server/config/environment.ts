import { existsSync } from 'node:fs'
import { z } from 'zod'

if (existsSync('.env.local')) {
  process.loadEnvFile('.env.local')
}

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  POSTGRES_HOST: z.string().trim().min(1),
  POSTGRES_PORT: z.coerce.number().int().min(1).max(65_535),
  POSTGRES_DB: z.string().trim().min(1),
  POSTGRES_USER: z.string().trim().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  OPENAI_API_KEY: z.string().trim().min(1),
})

const parsedEnvironment = environmentSchema.safeParse(process.env)

if (!parsedEnvironment.success) {
  const invalidVariables = parsedEnvironment.error.issues
    .map((issue) => issue.path.join('.'))
    .join(', ')

  throw new Error(`Invalid server environment variables: ${invalidVariables}`)
}

export const environment = parsedEnvironment.data
