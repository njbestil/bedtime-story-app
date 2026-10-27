type ApiErrorPayload = {
  error?: {
    code?: string
    message?: string
    requestId?: string
  }
}

type ApiSuccessPayload<T> = {
  data: T
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export class ApiClientError extends Error {
  readonly code?: string
  readonly requestId?: string
  readonly status: number

  constructor({
    status,
    code,
    message,
    requestId,
  }: {
    status: number
    code?: string
    message: string
    requestId?: string
  }) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.code = code
    this.requestId = requestId
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isApiSuccessPayload<T>(value: unknown): value is ApiSuccessPayload<T> {
  return isRecord(value) && 'data' in value
}

async function parseJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type')

  if (!contentType?.includes('application/json')) {
    return undefined
  }

  try {
    return await response.json()
  } catch {
    return undefined
  }
}

/**
 * Makes a same-origin request to the Express API and unwraps its `{ data }`
 * response envelope. Feature API modules should use this instead of `fetch`.
 */
export async function apiClient<T>(
  path: string,
  { body, headers, ...options }: ApiRequestOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers)

  requestHeaders.set('Accept', 'application/json')

  if (body !== undefined && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  const response = await fetch(`/api${path}`, {
    ...options,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: 'include',
    headers: requestHeaders,
  })
  const payload = await parseJson(response)

  if (!response.ok) {
    const error = isRecord(payload) ? (payload as ApiErrorPayload).error : undefined

    throw new ApiClientError({
      status: response.status,
      code: error?.code,
      message: error?.message ?? 'The server could not complete the request.',
      requestId: error?.requestId,
    })
  }

  if (response.status === 204) {
    return undefined as T
  }

  if (!isApiSuccessPayload<T>(payload)) {
    throw new ApiClientError({
      status: response.status,
      message: 'The server returned an unexpected response.',
    })
  }

  return payload.data
}
