# Bedtime Story App Architecture

This is the implementation reference for the Bedtime Story App. It translates the approved architecture and UI/UX document into a format that coding agents can read quickly during every task.

The complete human-readable source is:

`D:\Developer\Docs\bedtime story app\Bedtime Story App - Architecture and UI UX Design.docx`

## How to use this document

- Read this file before planning or implementing project changes.
- Treat it as the approved target architecture, not proof that every described component already exists.
- Inspect the repository before implementation and introduce only the parts required by the current task.
- Keep changes small and preserve the standard root-level Vite structure.
- For visual implementation, use this file for behavior and architecture and the Figma Make file for visual intent.
- If a requested change conflicts with this architecture, identify the conflict and obtain approval before making a material deviation.
- Update this file and the source DOCX when an approved architectural decision changes.

## Sources of truth

| Concern | Primary reference |
| --- | --- |
| Application architecture and responsibility boundaries | `ARCHITECTURE.md` |
| Complete human-readable architecture guide | `D:\Developer\Docs\bedtime story app\Bedtime Story App - Architecture and UI UX Design.docx` |
| Visual intent, screen hierarchy, layout, and pirate theme | [Figma Make wireframe](https://www.figma.com/make/r6SjnjTUpNEkkAOIQ1lPJq/AI-Bedtime-Story-App-Wireframe?p=f&t=gRIM3F4ybUAgOqcz-0) |
| Current implementation and installed dependencies | Repository source and configuration |
| Task-specific requirements | The current user request |

When sources conflict, protect security, accessibility, and functional correctness first. Then follow the current user request and make the smallest reasonable deviation from the approved architecture or visual design. Report intentional deviations.

## Product scope and flow

The application is a mobile-first, pirate-themed bedtime-story experience with four main screens:

1. **Loading:** initialize the application and establish the pirate-adventure tone.
2. **Home / Library:** discover stories and reopen saved stories from a two-column mobile inventory.
3. **Find a Story:** collect a genre, required story description, and optional child or story preferences.
4. **Story Reader:** display story imagery, title, paginated content, saving state, and reading progress.

Primary navigation:

```text
Loading -> Home / Library -> Find a Story -> Generating -> Story Reader
                         \-> Saved story card -----------> Story Reader
Story Reader -> Library
Story Reader <-> Previous / Next page
```

### Required UI states

| Screen | States to support |
| --- | --- |
| Loading | Loading, slow initialization, recoverable startup error |
| Home / Library | Loading, populated, empty, fetch error, retry |
| Find a Story | Pristine, validation error, submitting, generation error, retry, disabled |
| Story Reader | Loading, ready, missing or unauthorized story, first/final page boundaries, progress or save failure |

Saved story cards must deep-link directly to the reader. Browser navigation must remain predictable, and user-facing routes must be safe to reload.

## Architecture decisions

- Keep one repository and one root dependency lifecycle. Do not introduce `apps/`, `apps/web`, workspaces, or a monorepo until independent deployment needs justify them.
- Preserve the existing Vite application in the root `src/` directory.
- Keep `src/App.tsx`, `src/App.css`, `src/index.css`, and `src/main.tsx`.
- Add `server/` beside `src/` only when backend implementation begins.
- React routes own screens and browser navigation.
- Express routes own `/api` HTTP endpoints. React routing does not replace API routing.
- PostgreSQL is the durable source of truth. Browser storage may only be a temporary progress fallback.
- Keep the OpenAI API key, prompts, raw responses, validation, and provider diagnostics on the server.
- Use one focused OpenAI service instead of a broad generic service layer.

## System boundary

```text
React + Vite UI
    |
    | HTTPS / JSON
    v
Express API routes -> validation middleware -> story controller
                                            |-> story model -> PostgreSQL
                                            \-> OpenAI service -> OpenAI Responses API
```

React owns presentation, interaction, navigation, and local UI state. Express owns the API contract and server-only concerns. Models own PostgreSQL access. The OpenAI service owns prompt construction, provider calls, generated-output validation, and safe error classification.

## React and Vite frontend

Use feature folders for the four product areas while retaining the familiar Vite entry files:

```text
src/
|-- assets/
|-- styles/
|   `-- theme.css
|-- components/
|   |-- AppHeader.tsx
|   |-- Button.tsx
|   |-- ErrorMessage.tsx
|   `-- LoadingIndicator.tsx
|-- features/
|   |-- loading/
|   |-- library/
|   |-- story-generator/
|   `-- story-reader/
|-- services/
|   `-- api.ts
|-- types/
|   `-- story.ts
|-- App.tsx
|-- App.css
|-- index.css
`-- main.tsx
```

Do not create every proposed file in advance. Add files when the feature being implemented requires them.

### Core Vite file responsibilities

| File | Responsibility |
| --- | --- |
| `main.tsx` | Mount React and configure top-level providers such as browser routing and server-state management. |
| `App.tsx` | Define application routes and the root layout. Do not place complete page implementations here. |
| `App.css` | Own the application shell, responsive content width, safe-area behavior, and route-level spacing. |
| `index.css` | Own the reset, fonts, CSS variables, default typography, focus treatment, and reduced-motion rules. |

### Frontend styling strategy

- Use Tailwind CSS utilities as the default for component layout, spacing, typography, responsive behavior, and visual states.
- Keep `src/index.css` responsible for the Tailwind import, global stylesheet composition, focus treatment, and reduced-motion rules.
- Keep reusable Tailwind theme variables such as colors and font families in `src/styles/theme.css`, and prefer semantic token names over repeated literal values in components.
- Keep `src/App.css` for application-shell styles when colocated utility classes would make the shell harder to understand.
- Keep feature CSS files for complex animations, pseudo-elements, and specialized design effects that are clearer in authored CSS.
- Extract repeated UI patterns into focused React components instead of creating large collections of custom utilities or overusing `@apply`.

### Proposed browser routes

| Route | Purpose |
| --- | --- |
| `/` | Application boot state and initialization |
| `/library` | Discovery hero and saved-story inventory |
| `/stories/new` | Story-generation form |
| `/stories/:id/generating` | Generation progress and retry behavior |
| `/stories/:id` | Paginated story reader with restored progress |

These routes are target architecture. Confirm the router currently installed before implementation; do not add a routing dependency silently.

### Frontend state ownership

- **URL state:** active screen, story identifier, and reload-safe navigation.
- **Server state:** story inventory, story content, saved state, and stored reading progress.
- **Local form state:** incomplete generation inputs and optional-section disclosure.
- **Ephemeral UI state:** focus, temporary status messages, and animation state.

### Feature responsibilities

#### Loading

- Display application identity, pirate-themed imagery, and a concise status message during real initialization.
- Avoid arbitrary loading delays.
- Announce failures safely and provide Retry when recovery is possible.

#### Library

- Show the discovery hero and a prominent, full-width **Search a Story** action.
- Render saved stories as selectable cover cards in a two-column mobile grid.
- Distinguish initial loading, refresh loading, empty inventory, fetch error, and retry states.
- Give each card an accessible name combining its title and category.

#### Story generator

- Use a labelled single-select genre control and a required story-description field.
- Put optional child name, age range, length, characters, and lesson fields in a clear disclosure section.
- Prevent duplicate submissions while generation is active.
- Preserve form values after validation or generation failure.
- Move focus to the error summary after a failed submission.
- Announce generation status through an `aria-live` region.

#### Story reader

- Display the image, category, title, and one readable story page at a time.
- Disable Previous on the first page and Next on the final page.
- Display `Page X of Y` and restore the latest stored page.
- Save progress without blocking navigation and debounce repeated writes.
- Allow users to return to the library and toggle whether the story appears in saved inventory.

## Express server

The server is narrowly responsible for story CRUD, reading progress, PostgreSQL persistence, and OpenAI story generation. Use clear, plural folder names for layers that will contain multiple files while keeping the implementation idiomatic TypeScript.

```text
server/
|-- config/
|   |-- database.ts
|   `-- environment.ts
|-- controllers/
|   `-- storyController.ts
|-- middleware/
|   |-- errorHandler.ts
|   |-- notFoundHandler.ts
|   `-- validateRequest.ts
|-- models/
|   |-- storyModel.ts
|   `-- readingProgressModel.ts
|-- routes/
|   |-- storyRoutes.ts
|   `-- index.ts
|-- services/
|   `-- openaiService.ts
|-- validators/
|   |-- storyValidator.ts
|   `-- openaiResponseValidator.ts
|-- app.ts
`-- index.ts
```

### Server responsibility rules

| Layer | Owns | Must not contain |
| --- | --- | --- |
| Routes | HTTP methods, `/api` paths, and composition of validators, middleware, and controllers | SQL, prompt text, or response formatting logic |
| Validators | Reusable runtime rules for client requests and generated OpenAI output | Express response handling or database access |
| Middleware | Applying validation and consistent error/not-found handling | Story-generation business logic |
| Controller | Orchestrating requests, services, models, and HTTP status codes | Raw SQL, API keys, or large prompts |
| Model | Parameterized PostgreSQL operations and database-record mapping | Express request/response objects or OpenAI calls |
| OpenAI service | Prompt construction, OpenAI calls, output validation, and provider-failure classification | HTTP response objects or browser concerns |

Validators define the rules; middleware executes reusable validation within the Express request lifecycle. Keeping both prevents middleware from becoming a collection of duplicated schemas.

## API contract

The initial API should remain small:

| Method | Endpoint | Purpose | Important responses |
| --- | --- | --- | --- |
| `GET` | `/api/stories` | Return saved stories for the current session or user | `200`, empty list, safe `500` |
| `POST` | `/api/stories` | Validate input, generate a story, persist its pages, and return it | `201`, `400`, `409`, `422`, `503` |
| `GET` | `/api/stories/:id` | Return one authorized story with ordered pages and progress | `200`, `404`, `403` when ownership applies |
| `PATCH` | `/api/stories/:id/progress` | Persist the current reader page | `200` or `204`, `400`, `404` |
| `PATCH` | `/api/stories/:id/saved` | Add or remove a story from saved inventory | `200`, `400`, `404` |
| `POST` | `/api/stories/:id/retry` | Retry a failed generation without duplicate active work | `202` or `201`, `409`, `404`, `503` |
| `DELETE` | `/api/stories/:id` | Delete a story only when product requirements authorize deletion | `204`, `404`, `403` |

### Validation boundaries

- Validate client input before the controller executes.
- Parse and validate path parameters before they reach SQL.
- Require reading progress to be an integer within the stored page range.
- Validate generated OpenAI output independently before any transaction writes it.
- Keep PostgreSQL constraints as the final integrity layer even when application validation succeeds.
- Return field-safe, non-sensitive client errors.

## PostgreSQL design

| Table | Important fields | Purpose and constraints |
| --- | --- | --- |
| `sessions` | `id`, `created_at`, `last_seen_at` | Own anonymous data until authentication exists; use an opaque server-issued identifier. |
| `stories` | `id`, `session_id`, `title`, `genre`, `status`, `saved`, `cover_image_url`, `cover_image_alt_text`, request fields, `created_at` | Parent record for generation and inventory; cover fields are optional hosted/static assets with accessible descriptions, and `status` is `generating`, `completed`, or `failed`. |
| `story_pages` | `story_id`, `page_number`, `content`, `image_url`, `image_alt_text` | Ordered reader content and optional page artwork; unique on `(story_id, page_number)`. |
| `reading_progress` | `session_id`, `story_id`, `current_page`, `updated_at` | One progress row per owner and story; enforce a composite unique key. |
| `idempotency_keys` | `session_id`, `key`, `story_id`, `expires_at` | Prevent double taps and request retries from creating duplicate stories. |

### Transaction and integrity rules

- Create a story and its ordered pages in one transaction after OpenAI output passes validation.
- Use parameterized queries for every value. Never concatenate user input into SQL.
- Reject progress writes outside the stored page range.
- Define explicit foreign-key deletion behavior rather than relying on implicit cascading.
- Keep provider diagnostics out of user-facing database fields and API responses.
- Roll back the complete transaction when persistence fails.
- Keep the existing `completed` database status; do not introduce a competing `ready` status. A reader screen may be visually ready when its story status is `completed`.

## OpenAI story generation

OpenAI integration stays behind Express. The browser must never receive the API key, internal prompt, raw provider response, or sensitive diagnostics.

Use the Responses API with Structured Outputs and request a predictable result containing the title, genre, summary, and ordered pages. Each page should include `pageNumber`, `content`, `imagePrompt`, and `imageAltText`. Select the exact text model and validation technology during implementation using current official guidance and the project's installed dependencies.

The text model should return image instructions, not a hosted image URL. The server may send each validated `imagePrompt` to a separate image-generation step, upload the resulting asset to approved storage, and persist the returned URL in `story_pages.image_url`. Persist the accessibility description in `story_pages.image_alt_text`. If image generation is skipped or fails, both image fields may remain null and the reader uses a safe genre-based placeholder.

Example validated model output:

```json
{
  "title": "The Little Star Sailor",
  "genre": "adventure",
  "summary": "A young sailor follows a fallen star across the night sea.",
  "pages": [
    {
      "pageNumber": 1,
      "content": "Milo looked across the moonlit ocean...",
      "imagePrompt": "A gentle bedtime-story illustration of a young sailor on a small wooden boat under a glowing moon.",
      "imageAltText": "A young sailor gazing across the moonlit ocean"
    }
  ]
}
```

The server adds database-owned fields such as `id`, `session_id`, `status`, `saved`, timestamps, and `prompt_version`; these must not be requested from or trusted as model output. The raw provider response, prompt, and base64 image data are not stored in PostgreSQL.

Server-side TypeScript example (illustrative; keep the model name and schema in validated server configuration):

```ts
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const response = await openai.responses.create({
  model: process.env.OPENAI_TEXT_MODEL ?? "gpt-5",
  input: [
    { role: "system", content: "Create a gentle, age-appropriate bedtime story." },
    { role: "user", content: JSON.stringify(storyRequest) },
  ],
  text: {
    format: {
      type: "json_schema",
      name: "bedtime_story",
      strict: true,
      schema: bedtimeStorySchema,
    },
  },
})

const generated = JSON.parse(response.output_text) as GeneratedStory
// Validate generated before inserting stories or story_pages rows.
```

This is a server-only example. The browser must call Express and must never receive `OPENAI_API_KEY`.

### Generation lifecycle

1. Validate and normalize the genre, description, optional child information, story length, characters, and lesson.
2. Create a privacy-preserving safety identifier and build the versioned server-side prompt.
3. Call the configured OpenAI model with a timeout and intentional output limits.
4. Validate the returned title, genre, summary, ordered pages, image prompts, and accessibility descriptions.
5. Reject empty pages, malformed structures, refusals or unsafe content, and content exceeding application limits.
6. Persist the story and text pages transactionally. Treat page-image generation as an optional follow-up; update `image_url` only after an asset is successfully generated and stored.
7. Return a stable client contract with nullable `imageUrl` and `imageAltText` when artwork is unavailable.

### Failure behavior

| Failure | Server behavior | User experience |
| --- | --- | --- |
| Invalid request | Return field-safe `400` details without calling OpenAI | Keep values, focus the summary, and identify each invalid field |
| Timeout or transient provider error | Return a safe retryable error and use only a bounded retry policy | Show supportive pirate-themed copy and a literal Retry action |
| Refusal or unsafe content | Do not persist partial output; return a safe non-retryable or reformulation response | Explain that the request needs adjustment without provider internals |
| Malformed or empty output | Fail output validation and write nothing | Preserve the form and offer Retry |
| Database failure | Roll back the transaction and log a correlation identifier | Show a generic save failure and never claim success |

Treat page-image generation as optional and separate from the text-critical path. A genre-based local placeholder must allow the story reader to open when image generation is slow, unavailable, or deferred. Use a hosted asset URL in the API/database, never a base64 image payload in PostgreSQL.

## Security and privacy

- Keep `OPENAI_API_KEY` and database credentials in validated server environment variables. Commit placeholders only in `.env.example`.
- Use secure, HTTP-only session cookies when anonymous ownership is required.
- Minimize child-identifying information sent to OpenAI.
- Do not log child names, story descriptions, API keys, credentials, prompts, raw provider payloads, or SQL values by default.
- Apply request-size limits, basic rate limiting, CORS restrictions, and secure response headers.
- Authorize story reads and mutations against the current session or user.
- Return correlation identifiers for support without exposing stack traces or provider details.
- Protect duplicate generation with disabled UI, idempotency keys, and server-side active-work checks.

## UI, accessibility, and responsive rules

- Validate mobile widths around 360-430 px before tablet and desktop layouts.
- Keep important actions reachable for one-handed use and respect `env(safe-area-inset-bottom)` for sticky controls.
- Use interactive targets of at least 44 by 44 CSS pixels.
- Preserve the mobile two-column story inventory.
- Use decorative pirate typography only for short headings; keep body and story text highly readable.
- Use explicit labels, fieldsets and legends, programmatic error associations, and visible required states.
- Preserve logical focus order, visible focus, and intentional focus movement after navigation and failed submissions.
- Announce loading, generation, retry, success, and error states without repeatedly interrupting screen-reader users.
- Constrain story line length and maintain comfortable type size and leading.
- Honor `prefers-reduced-motion`; animation must never be the only indication of progress.
- Keep functional labels such as Back, Previous, Next, Save, and Retry explicit even when supporting copy uses pirate language.

## Testing and validation

Test changes in proportion to risk and use the tools already present in the repository.

| Level | Primary coverage |
| --- | --- |
| Unit | Request schemas, OpenAI output schema, pagination boundaries, progress normalization, and error mapping |
| Component | Empty inventory, story cards, form validation, disabled submission, retry UI, page controls, and accessible announcements |
| API integration | CRUD, ownership, duplicate prevention, transactions, malformed IDs, out-of-range progress, and mocked OpenAI outcomes |
| End-to-end | Loading to library, generation to reader, saved-story reopening, progress restoration, failure, and retry flows |
| Accessibility | Keyboard-only operation, labels, focus order, live regions, touch targets, contrast, and reduced motion |
| Visual | Compare mobile screens with Figma first, then verify wider breakpoints and intentional deviations |

Required negative and regression scenarios include:

- Null, empty, whitespace-only, malformed, and oversized request fields.
- Duplicate submission, rapid double tap, refresh during generation, and retry during active work.
- OpenAI timeout, refusal, empty response, incomplete pages, invalid structure, and unexpected fields.
- Missing, unauthorized, or deleted stories; stale progress; first-page Previous and final-page Next.
- PostgreSQL connection loss, transaction rollback, and persistence failure after generation.
- Loading, empty, validation, disabled, error, retry, and success UI states.

Run and report applicable tests, linting, type checks, production builds, accessibility checks, and visual comparisons. Never report a check as passing unless it was executed and observed.

## Delivery phases

1. **Foundation:** replace the starter screen with routing, shared design tokens, and the mobile application shell.
2. **Figma screens:** implement Loading, Library, Generator, and Reader using typed mock data and all required visible states.
3. **Express API:** add the agreed server structure, error middleware, validators, and story endpoints.
4. **PostgreSQL:** add migrations, models, ownership, story pages, saved state, and progress.
5. **OpenAI:** add server-only generation, output validation, safe errors, timeout behavior, and duplicate protection.
6. **Hardening:** add focused automated tests, mobile visual QA, accessibility review, linting, type checks, and production-build verification.

## Architecture acceptance criteria

- The root Vite structure remains recognizable and `App.tsx` and `App.css` remain in `src/`.
- All four product flows and their loading, empty, validation, error, retry, success, and disabled states are represented.
- OpenAI credentials and calls remain server-side, and generated output is validated before persistence.
- Saved inventory and reading progress persist through PostgreSQL and respect ownership.
- Relevant automated checks, accessibility review, and mobile visual comparison are executed and reported.

## Assumptions and deferred decisions

- Authentication is not shown in the wireframe. An anonymous server-issued session may own MVP stories.
- Direct request/response generation is acceptable initially. Add background jobs or streaming only when measured latency or hosting constraints justify them.
- The Figma file is a low-fidelity wireframe. Final brand assets, exact production typography, and illustration licensing require later design decisions.
- Tailwind CSS is the approved primary styling system. Adapt Figma intent into maintainable utilities and focused components rather than copying generated Figma code verbatim.
- Runtime schema validation is valuable, but this architecture does not assume a specific library is installed.
- Do not add dependencies, deployment topology, queues, authentication, or other infrastructure speculatively.

## Maintaining this reference

When architecture changes are approved:

1. Update this file in the same change as the implementation.
2. Update the source DOCX when the decision is substantial or user-facing.
3. Record intentional Figma deviations for UI changes.
4. Keep proposed architecture clearly distinguished from verified implementation.
