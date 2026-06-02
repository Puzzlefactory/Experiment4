export type PrototypeHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface PrototypeApiRequest {
  method: PrototypeHttpMethod
  path: string
  headers: Record<string, string>
  body?: unknown
}

export interface PrototypeApiResponse<T = unknown> {
  status: number
  body: T
}

export type PrototypeApiHandler = (
  request: PrototypeApiRequest,
) => Promise<PrototypeApiResponse>

export interface PrototypeApiClientOptions {
  baseUrl?: string
  getAccessToken?: () => string | null
  handler?: PrototypeApiHandler
}

export interface PrototypeApiClient {
  get<T>(path: string): Promise<T>
  post<T>(path: string, body?: unknown): Promise<T>
  put<T>(path: string, body?: unknown): Promise<T>
  patch<T>(path: string, body?: unknown): Promise<T>
  delete<T>(path: string): Promise<T>
}

export function createPrototypeApiClient(
  options: PrototypeApiClientOptions = {},
): PrototypeApiClient {
  const baseUrl = options.baseUrl ?? '/api'
  const getAccessToken = options.getAccessToken ?? (() => null)

  async function request<T>(
    method: PrototypeHttpMethod,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const token = getAccessToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    if (options.handler) {
      const response = await options.handler({ method, path, headers, body })
      if (response.status >= 400) {
        throw new PrototypeApiError(response.status, response.body)
      }

      return response.body as T
    }

    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })

    const responseBody = await response.json()
    if (!response.ok) {
      throw new PrototypeApiError(response.status, responseBody)
    }

    return responseBody as T
  }

  return {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
    put: (path, body) => request('PUT', path, body),
    patch: (path, body) => request('PATCH', path, body),
    delete: (path) => request('DELETE', path),
  }
}

export class PrototypeApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(`Prototype API request failed with status ${status}`)
    this.name = 'PrototypeApiError'
  }
}
