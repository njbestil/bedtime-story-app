import { database } from '../config/database.ts'

const DEVELOPMENT_SEED_DESCRIPTION = 'Development seed story for API testing.'

const DEVELOPMENT_SEED_STORY = {
  title: 'Milo and the Lantern Island',
  genre: 'Bedtime adventure',
  summary: 'Milo follows a friendly lantern across the moonlit sea and finds a peaceful island of glowing shells.',
  coverImageUrl: '/story-images/milo-lantern-island-cover.svg',
  coverImageAltText: 'Milo sailing toward a glowing lantern island beneath a starry sky',
  pages: [
    {
      pageNumber: 1,
      content: 'Milo was ready for bed when he spotted a tiny golden lantern floating beyond his ship. It bobbed gently across the moonlit water, as if it had a secret to share.',
      imageUrl: '/story-images/milo-lantern-page-1.svg',
      imageAltText: 'A small golden lantern floating above a calm moonlit sea beside Milo\'s little ship',
    },
    {
      pageNumber: 2,
      content: 'He sailed slowly behind the lantern until it led him to a quiet island where thousands of shells glowed like little stars. The island was not hiding treasure. It was keeping a light on for every sailor finding their way home.',
      imageUrl: '/story-images/milo-lantern-page-2.svg',
      imageAltText: 'Milo arriving at a quiet island covered in softly glowing shells',
    },
    {
      pageNumber: 3,
      content: 'Milo thanked the lantern and sailed home before sunrise. Tucked safely in bed, he watched one last warm light sparkle on the horizon and dreamed of gentle adventures to come.',
      imageUrl: '/story-images/milo-lantern-page-3.svg',
      imageAltText: 'Milo sleeping peacefully aboard his ship while a distant lantern glows on the sea',
    },
  ],
} as const

export type StorySummary = {
  id: string
  title: string
  genre: string
  summary: string | null
  coverImageUrl: string | null
  coverImageAltText: string | null
  createdAt: Date
}

export type StoryPage = {
  pageNumber: number
  content: string
  imageUrl: string | null
  imageAltText: string | null
}

export type Story = StorySummary & {
  saved: boolean
  pages: StoryPage[]
  currentPage: number
}

type StoryRow = {
  id: string
  title: string
  genre: string
  summary: string | null
  saved: boolean
  cover_image_url: string | null
  cover_image_alt_text: string | null
  created_at: Date
}

function mapStorySummary(row: StoryRow): StorySummary {
  return {
    id: row.id,
    title: row.title,
    genre: row.genre,
    summary: row.summary,
    coverImageUrl: row.cover_image_url,
    coverImageAltText: row.cover_image_alt_text,
    createdAt: row.created_at,
  }
}

export async function listSavedStories(sessionId: string): Promise<StorySummary[]> {
  const result = await database.query<StoryRow>(
    `SELECT id, title, genre, summary, saved, cover_image_url, cover_image_alt_text, created_at
     FROM stories
     WHERE session_id = $1 AND saved = TRUE AND status = 'completed'
     ORDER BY created_at DESC`,
    [sessionId],
  )

  return result.rows.map(mapStorySummary)
}

async function updateDevelopmentSeedImages(
  client: Pick<typeof database, 'query'>,
  storyId: string,
) {
  await client.query(
    `UPDATE stories
     SET cover_image_url = $2, cover_image_alt_text = $3, updated_at = NOW()
     WHERE id = $1`,
    [
      storyId,
      DEVELOPMENT_SEED_STORY.coverImageUrl,
      DEVELOPMENT_SEED_STORY.coverImageAltText,
    ],
  )

  for (const page of DEVELOPMENT_SEED_STORY.pages) {
    await client.query(
      `UPDATE story_pages
       SET image_url = $3, image_alt_text = $4
       WHERE story_id = $1 AND page_number = $2`,
      [storyId, page.pageNumber, page.imageUrl, page.imageAltText],
    )
  }
}

export async function getOrCreateDevelopmentSeedStory(sessionId: string) {
  const existingStory = await database.query<{ id: string }>(
    `SELECT id
     FROM stories
     WHERE session_id = $1
       AND request_description = $2
       AND status = 'completed'
     LIMIT 1`,
    [sessionId, DEVELOPMENT_SEED_DESCRIPTION],
  )
  const existingStoryId = existingStory.rows[0]?.id

  if (existingStoryId) {
    await updateDevelopmentSeedImages(database, existingStoryId)
    return { id: existingStoryId, created: false }
  }

  const client = await database.connect()

  try {
    await client.query('BEGIN')
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [sessionId])
    const lockedExistingStory = await client.query<{ id: string }>(
      `SELECT id
       FROM stories
       WHERE session_id = $1
         AND request_description = $2
         AND status = 'completed'
       LIMIT 1`,
      [sessionId, DEVELOPMENT_SEED_DESCRIPTION],
    )
    const lockedExistingStoryId = lockedExistingStory.rows[0]?.id

    if (lockedExistingStoryId) {
      await updateDevelopmentSeedImages(client, lockedExistingStoryId)
      await client.query('COMMIT')
      return { id: lockedExistingStoryId, created: false }
    }

    const storyResult = await client.query<{ id: string }>(
      `INSERT INTO stories (
         session_id,
         title,
         genre,
         summary,
         status,
         saved,
         request_description,
         cover_image_url,
         cover_image_alt_text
       )
       VALUES ($1, $2, $3, $4, 'completed', TRUE, $5, $6, $7)
       RETURNING id`,
      [
        sessionId,
        DEVELOPMENT_SEED_STORY.title,
        DEVELOPMENT_SEED_STORY.genre,
        DEVELOPMENT_SEED_STORY.summary,
        DEVELOPMENT_SEED_DESCRIPTION,
        DEVELOPMENT_SEED_STORY.coverImageUrl,
        DEVELOPMENT_SEED_STORY.coverImageAltText,
      ],
    )
    const storyId = storyResult.rows[0]?.id

    if (!storyId) {
      throw new Error('Development seed story was not created')
    }

    for (const page of DEVELOPMENT_SEED_STORY.pages) {
      await client.query(
        `INSERT INTO story_pages (story_id, page_number, content, image_url, image_alt_text)
         VALUES ($1, $2, $3, $4, $5)`,
        [storyId, page.pageNumber, page.content, page.imageUrl, page.imageAltText],
      )
    }

    await client.query('COMMIT')
    return { id: storyId, created: true }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function getStoryForSession(
  storyId: string,
  sessionId: string,
): Promise<Story | null> {
  const storyResult = await database.query<StoryRow>(
    `SELECT id, title, genre, summary, saved, cover_image_url, cover_image_alt_text, created_at
     FROM stories
     WHERE id = $1 AND session_id = $2 AND status = 'completed'`,
    [storyId, sessionId],
  )
  const story = storyResult.rows[0]

  if (!story) {
    return null
  }

  const [pagesResult, progressResult] = await Promise.all([
    database.query<{
      page_number: number
      content: string
      image_url: string | null
      image_alt_text: string | null
    }>(
      `SELECT page_number, content, image_url, image_alt_text
       FROM story_pages
       WHERE story_id = $1
       ORDER BY page_number`,
      [storyId],
    ),
    database.query<{ current_page: number }>(
      'SELECT current_page FROM reading_progress WHERE story_id = $1 AND session_id = $2',
      [storyId, sessionId],
    ),
  ])

  return {
    ...mapStorySummary(story),
    saved: story.saved,
    pages: pagesResult.rows.map((page) => ({
      pageNumber: page.page_number,
      content: page.content,
      imageUrl: page.image_url,
      imageAltText: page.image_alt_text,
    })),
    currentPage: progressResult.rows[0]?.current_page ?? 1,
  }
}

export async function updateStorySaved(
  storyId: string,
  sessionId: string,
  saved: boolean,
): Promise<StorySummary | null> {
  const result = await database.query<StoryRow>(
    `UPDATE stories
     SET saved = $3, updated_at = NOW()
     WHERE id = $1 AND session_id = $2
     RETURNING id, title, genre, summary, saved, cover_image_url, cover_image_alt_text, created_at`,
    [storyId, sessionId, saved],
  )

  const story = result.rows[0]
  return story ? mapStorySummary(story) : null
}

export async function updateStoryProgress(
  storyId: string,
  sessionId: string,
  currentPage: number,
): Promise<'updated' | 'missing' | 'out_of_range'> {
  const pageCountResult = await database.query<{ page_count: number }>(
    `SELECT COUNT(story_pages.id)::INTEGER AS page_count
     FROM stories
     LEFT JOIN story_pages ON story_pages.story_id = stories.id
     WHERE stories.id = $1 AND stories.session_id = $2 AND stories.status = 'completed'
     GROUP BY stories.id`,
    [storyId, sessionId],
  )
  const pageCount = pageCountResult.rows[0]?.page_count

  if (pageCount === undefined) {
    return 'missing'
  }

  if (currentPage > pageCount) {
    return 'out_of_range'
  }

  await database.query(
    `INSERT INTO reading_progress (session_id, story_id, current_page)
     VALUES ($1, $2, $3)
     ON CONFLICT (session_id, story_id)
     DO UPDATE SET current_page = EXCLUDED.current_page, updated_at = NOW()`,
    [sessionId, storyId, currentPage],
  )

  return 'updated'
}

export async function deleteStoryForSession(storyId: string, sessionId: string): Promise<boolean> {
  const result = await database.query(
    'DELETE FROM stories WHERE id = $1 AND session_id = $2',
    [storyId, sessionId],
  )

  return result.rowCount === 1
}
